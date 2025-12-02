import { NextResponse } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { createCalendarEvent, BookingDetails } from "@/lib/google-calendar";
import { sendBookingConfirmation, sendNotaryNotification } from "@/lib/email";

export const dynamic = "force-dynamic";

// Validation Schema
const bookingSchema = z.object({
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(10),
  appointmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  appointmentTime: z.string().regex(/^\d{2}:\d{2}$/),
  address: z.string().min(5),
  serviceType: z.string(),
  price: z.number().positive(),
  notes: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Validate Input
    const validatedData = bookingSchema.parse(body);

    // 2. Create Google Calendar Event
    let googleEventId = null;
    try {
      // Only attempt if credentials exist, otherwise skip (for dev/demo)
      if (process.env.GOOGLE_CLIENT_EMAIL) {
        googleEventId = await createCalendarEvent(validatedData);
      } else {
        console.warn("Skipping Google Calendar: No credentials");
      }
    } catch (calError) {
      console.error("Google Calendar Error:", calError);
      // Continue even if calendar fails, but log it
    }

    // 3. Save to Supabase
    const { data: booking, error: dbError } = await supabase
      .from("bookings")
      .insert([
        {
          customer_name: validatedData.customerName,
          customer_email: validatedData.customerEmail,
          customer_phone: validatedData.customerPhone,
          appointment_date: validatedData.appointmentDate,
          appointment_time: validatedData.appointmentTime,
          address: validatedData.address,
          service_type: validatedData.serviceType,
          price: validatedData.price,
          notes: validatedData.notes,
          google_event_id: googleEventId,
          status: "confirmed",
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error("Database Error:", dbError);
      // If DB fails, we should probably fail the request
      // But for now, let's return error
      throw new Error("Failed to save booking");
    }

    // 4. Send Emails
    // Fire and forget - don't block response
    if (process.env.RESEND_API_KEY) {
      Promise.all([
        sendBookingConfirmation(validatedData, booking.id),
        sendNotaryNotification(validatedData, booking.id),
      ]).catch((err) => console.error("Email Error:", err));
    }

    return NextResponse.json({
      success: true,
      bookingId: booking.id,
      message: "Booking confirmed successfully",
    });
  } catch (error) {
    console.error("Booking Error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: (error as any).errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

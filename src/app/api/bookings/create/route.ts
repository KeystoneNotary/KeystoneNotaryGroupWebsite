import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin as supabase } from "@/lib/supabase-admin";
import { createCalendarEvent } from "@/lib/google-calendar";
import { sendBookingConfirmation, sendNotaryNotification } from "@/lib/email";
import { rateLimitMiddleware } from "@/middleware/rate-limit";
import { csrfMiddleware } from "@/lib/csrf";

export const dynamic = "force-dynamic";

// Validation Schema
const bookingSchema = z.object({
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(10),
  appointmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  appointmentTime: z.string().regex(/^\d{2}:\d{2}$/),
  address: z.string().min(5),
  city: z.string().min(2),
  state: z.string().refine((val) => val === "Pennsylvania", {
    message: "Services only available in Pennsylvania",
  }),
  serviceType: z.string(),
  price: z.number().positive(),
  notes: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    // Apply CSRF validation
    const csrfError = await csrfMiddleware(request);
    if (csrfError) {
      return csrfError;
    }

    // Apply rate limiting
    const rateLimitResponse = await rateLimitMiddleware(request as NextRequest);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const body = await request.json();

    // 1. Validate Input
    const validatedData = bookingSchema.parse(body);

    // 2. Save to Supabase FIRST (source of truth)
    // This ensures we don't create orphaned calendar events
    const { data: booking, error: dbError } = await supabase
      .from("bookings")
      .insert([
        {
          customer_name: validatedData.customerName,
          customer_email: validatedData.customerEmail,
          customer_phone: validatedData.customerPhone,
          appointment_date: validatedData.appointmentDate,
          appointment_time: validatedData.appointmentTime,
          address: `${validatedData.address}, ${validatedData.city}, ${validatedData.state}`,
          service_type: validatedData.serviceType,
          price: validatedData.price,
          notes: validatedData.notes,
          status: "confirmed",
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error("Database Error:", dbError);
      throw new Error("Failed to save booking");
    }

    // 3. Create Google Calendar Event (best effort, after DB success)
    let googleEventId = null;
    try {
      if (process.env.GOOGLE_CLIENT_EMAIL) {
        googleEventId = await createCalendarEvent(validatedData);

        // Update booking with calendar event ID
        if (googleEventId) {
          await supabase
            .from("bookings")
            .update({ google_event_id: googleEventId })
            .eq("id", booking.id);
        }
      } else {
        console.warn("Skipping Google Calendar: No credentials configured");
      }
    } catch (calError) {
      // Log but don't fail - booking is already saved
      console.error("Google Calendar Error (non-blocking):", calError);
    }

    // 4. Send Emails (fire and forget - don't block response)
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
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

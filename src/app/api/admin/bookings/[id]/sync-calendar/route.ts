import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { createCalendarEvent } from "@/lib/google-calendar";

export const dynamic = "force-dynamic";

/**
 * Manually sync a booking to Google Calendar
 * POST /api/admin/bookings/[id]/sync-calendar
 * Protected by middleware - requires admin authentication
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Check if Google Calendar is configured
    if (!process.env.GOOGLE_CLIENT_EMAIL) {
      return NextResponse.json(
        { error: "Google Calendar is not configured" },
        { status: 503 }
      );
    }

    // 2. Fetch booking from database
    const { data: booking, error: fetchError } = await supabaseAdmin
      .from("bookings")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // 3. Check if already synced
    if (booking.google_event_id) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking is already synced to Google Calendar",
          google_event_id: booking.google_event_id,
        },
        { status: 400 }
      );
    }

    // 4. Create calendar event
    const bookingData = {
      customerName: booking.customer_name,
      customerEmail: booking.customer_email,
      customerPhone: booking.customer_phone,
      appointmentDate: booking.appointment_date,
      appointmentTime: booking.appointment_time,
      address: booking.address,
      serviceType: booking.service_type,
      price: booking.price,
      notes: booking.notes,
    };

    const googleEventId = await createCalendarEvent(bookingData);

    if (!googleEventId) {
      return NextResponse.json(
        { error: "Failed to create calendar event" },
        { status: 500 }
      );
    }

    // 5. Update booking with calendar event ID
    const { error: updateError } = await supabaseAdmin
      .from("bookings")
      .update({ google_event_id: googleEventId })
      .eq("id", id);

    if (updateError) {
      console.error("Failed to update booking with calendar ID:", updateError);
      // Calendar event was created but DB update failed - log for manual cleanup
      return NextResponse.json(
        {
          success: false,
          error: "Calendar event created but failed to update database",
          google_event_id: googleEventId,
        },
        { status: 500 }
      );
    }

    // 6. Success
    return NextResponse.json({
      success: true,
      message: "Booking successfully synced to Google Calendar",
      google_event_id: googleEventId,
    });
  } catch (error) {
    console.error("Error syncing booking to calendar:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Middleware should protect this route (checking admin_session),
    // but we could also double-check headers/cookies here if needed.

    const { data, error } = await supabaseAdmin
      .from("bookings")
      .select("*")
      .order("appointment_date", { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

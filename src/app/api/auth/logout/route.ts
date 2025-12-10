import { NextResponse } from "next/server";
import { destroySession } from "@/lib/session";

export async function POST() {
  try {
    await destroySession();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    // Even if session destruction fails, return success to ensure user is logged out on client
    return NextResponse.json({ success: true });
  }
}

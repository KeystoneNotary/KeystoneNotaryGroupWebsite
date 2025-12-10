import { NextResponse } from "next/server";
import { setCSRFCookie } from "@/lib/csrf";

/**
 * GET /api/csrf
 * Returns a CSRF token for use in form submissions
 * The token is also set as an httpOnly cookie for validation
 */
export async function GET() {
  try {
    const token = await setCSRFCookie();

    return NextResponse.json({
      success: true,
      token,
    });
  } catch (error) {
    console.error("CSRF token generation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate CSRF token" },
      { status: 500 }
    );
  }
}

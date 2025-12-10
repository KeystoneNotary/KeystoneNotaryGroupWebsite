import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { unsealData } from "iron-session";
import type { SessionData } from "@/lib/session";

const SESSION_COOKIE_NAME = "kng_admin_session";

/**
 * Validates the admin session from the encrypted cookie
 * Uses unsealData for Edge runtime compatibility
 * @returns true if session is valid and not expired
 */
async function isValidSession(request: NextRequest): Promise<boolean> {
  // Check if SESSION_SECRET is configured
  const sessionSecret = process.env.SESSION_SECRET;
  if (!sessionSecret || sessionSecret.length < 32) {
    console.error("SESSION_SECRET not properly configured");
    return false;
  }

  try {
    // Get the session cookie value
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
    if (!sessionCookie?.value) {
      return false;
    }

    // Decrypt the session data
    const session = await unsealData<SessionData>(sessionCookie.value, {
      password: sessionSecret,
    });

    // Check if logged in
    if (!session.isLoggedIn) {
      return false;
    }

    // Check if session has expired (server-side validation)
    if (session.expiresAt && Date.now() > session.expiresAt) {
      return false;
    }

    return true;
  } catch (error) {
    // Session decryption failed - likely tampered or invalid
    console.error("Session validation error:", error);
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Protect Admin Dashboard (Pages)
  if (path.startsWith("/admin/dashboard")) {
    const isValid = await isValidSession(request);
    if (!isValid) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Protect Admin API Routes
  if (path.startsWith("/api/admin")) {
    const isValid = await isValidSession(request);
    if (!isValid) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Valid authentication required" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard/:path*", "/api/admin/:path*"],
};

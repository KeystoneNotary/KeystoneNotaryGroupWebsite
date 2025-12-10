import { NextResponse } from "next/server";
import { verifyPassword } from "@/lib/password-hash";
import { createSession, validateSessionConfig } from "@/lib/session";
import { csrfMiddleware } from "@/lib/csrf";
import { createAuthRateLimiter, checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    // Apply auth-specific rate limiting (5 attempts per minute)
    const rateLimiter = createAuthRateLimiter();
    const clientIP =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const { success: rateLimitOk, remaining, reset } = await checkRateLimit(
      `auth_${clientIP}`,
      rateLimiter
    );

    if (!rateLimitOk) {
      const retryAfter = reset ? Math.ceil((reset - Date.now()) / 1000) : 60;
      return NextResponse.json(
        {
          success: false,
          error: "Too many login attempts. Please try again later.",
          retryAfter,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(retryAfter),
            "X-RateLimit-Remaining": String(remaining || 0),
          },
        }
      );
    }

    // Validate CSRF token
    const csrfError = await csrfMiddleware(request);
    if (csrfError) {
      return csrfError;
    }

    const body = await request.json();
    const { password } = body;

    // Validate password is provided
    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { success: false, error: "Password is required" },
        { status: 400 }
      );
    }

    // Validate session configuration
    try {
      validateSessionConfig();
    } catch {
      console.error("Session configuration error: SESSION_SECRET not properly configured");
      return NextResponse.json(
        { success: false, error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Validate password hash is configured
    const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

    if (!ADMIN_PASSWORD_HASH) {
      console.error("ADMIN_PASSWORD_HASH environment variable not set");
      return NextResponse.json(
        { success: false, error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, ADMIN_PASSWORD_HASH);

    if (isValidPassword) {
      // Create encrypted session
      await createSession();
      return NextResponse.json({ success: true });
    }

    // Invalid password - use generic message to prevent enumeration
    return NextResponse.json(
      { success: false, error: "Invalid credentials" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "Authentication failed" },
      { status: 500 }
    );
  }
}

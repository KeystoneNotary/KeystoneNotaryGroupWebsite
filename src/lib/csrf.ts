import { cookies } from "next/headers";
import crypto from "crypto";
import { CSRF_HEADER } from "./constants";

const CSRF_COOKIE_NAME = "csrf_token";
const CSRF_HEADER_NAME = CSRF_HEADER;
const CSRF_TOKEN_LENGTH = 32; // 32 bytes = 64 hex characters
const CSRF_TOKEN_MAX_AGE = 60 * 60; // 1 hour

/**
 * Generates a cryptographically secure CSRF token
 * @returns A 64-character hex string
 */
export function generateCSRFToken(): string {
  return crypto.randomBytes(CSRF_TOKEN_LENGTH).toString("hex");
}

/**
 * Sets a CSRF token cookie and returns the token
 * Call this from a GET endpoint to provide token to client
 * @returns The generated CSRF token
 */
export async function setCSRFCookie(): Promise<string> {
  const token = generateCSRFToken();
  const cookieStore = await cookies();

  cookieStore.set(CSRF_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: CSRF_TOKEN_MAX_AGE,
  });

  return token;
}

/**
 * Gets the CSRF token from the cookie
 * @returns The token or null if not present
 */
export async function getCSRFCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(CSRF_COOKIE_NAME)?.value ?? null;
}

/**
 * Validates a CSRF token from a request header against the cookie
 * Uses timing-safe comparison to prevent timing attacks
 * @param headerToken - The token from the X-CSRF-Token header
 * @returns true if tokens match, false otherwise
 */
export async function validateCSRFToken(headerToken: string | null): Promise<boolean> {
  if (!headerToken) {
    return false;
  }

  const cookieToken = await getCSRFCookie();

  if (!cookieToken) {
    return false;
  }

  // Tokens must be same length for timing-safe comparison
  if (headerToken.length !== cookieToken.length) {
    return false;
  }

  try {
    return crypto.timingSafeEqual(
      Buffer.from(cookieToken, "utf8"),
      Buffer.from(headerToken, "utf8")
    );
  } catch {
    // Buffer creation failed - tokens are invalid
    return false;
  }
}

/**
 * Extracts CSRF token from a Request object
 * @param request - The incoming request
 * @returns The token from the header or null
 */
export function getCSRFTokenFromRequest(request: Request): string | null {
  return request.headers.get(CSRF_HEADER_NAME);
}

/**
 * Validates CSRF token from a request
 * Convenience function that combines extraction and validation
 * @param request - The incoming request
 * @returns true if valid, false otherwise
 */
export async function validateCSRFFromRequest(request: Request): Promise<boolean> {
  const headerToken = getCSRFTokenFromRequest(request);
  return validateCSRFToken(headerToken);
}

/**
 * CSRF validation middleware helper
 * Returns an error response if CSRF validation fails, null otherwise
 * @param request - The incoming request
 * @returns Response with 403 status if invalid, null if valid
 */
export async function csrfMiddleware(request: Request): Promise<Response | null> {
  const isValid = await validateCSRFFromRequest(request);

  if (!isValid) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "CSRF_VALIDATION_FAILED",
        message: "Invalid or missing CSRF token",
      }),
      {
        status: 403,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  return null;
}

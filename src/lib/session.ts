import { SessionOptions, getIronSession } from "iron-session";
import { cookies } from "next/headers";

/**
 * Session data interface for admin authentication
 */
export interface SessionData {
  isLoggedIn: boolean;
  loginTime?: number;
  expiresAt?: number;
}

/**
 * Default session state (unauthenticated)
 */
export const defaultSession: SessionData = {
  isLoggedIn: false,
};

/**
 * Iron-session configuration options
 * Uses encrypted, signed cookies for secure session management
 */
export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || "",
  cookieName: "kng_admin_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "strict" as const,
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  },
};

/**
 * Validates that SESSION_SECRET is properly configured
 * @throws Error if SESSION_SECRET is missing or too short
 */
export function validateSessionConfig(): void {
  const secret = process.env.SESSION_SECRET;

  if (!secret) {
    throw new Error(
      "SESSION_SECRET environment variable is required for secure session management"
    );
  }

  if (secret.length < 32) {
    throw new Error(
      "SESSION_SECRET must be at least 32 characters long. Generate with: openssl rand -hex 32"
    );
  }
}

/**
 * Gets the current session from cookies
 * @returns Session data with isLoggedIn flag and timestamps
 */
export async function getSession(): Promise<SessionData> {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

  // Return default session if not logged in
  if (!session.isLoggedIn) {
    return defaultSession;
  }

  // Check if session has expired (server-side validation)
  if (session.expiresAt && Date.now() > session.expiresAt) {
    // Session expired - clear it
    session.isLoggedIn = false;
    session.loginTime = undefined;
    session.expiresAt = undefined;
    await session.save();
    return defaultSession;
  }

  return {
    isLoggedIn: session.isLoggedIn,
    loginTime: session.loginTime,
    expiresAt: session.expiresAt,
  };
}

/**
 * Creates a new authenticated session
 * @returns The created session data
 */
export async function createSession(): Promise<SessionData> {
  validateSessionConfig();

  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

  const now = Date.now();
  const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours in ms

  session.isLoggedIn = true;
  session.loginTime = now;
  session.expiresAt = now + sessionDuration;

  await session.save();

  return {
    isLoggedIn: session.isLoggedIn,
    loginTime: session.loginTime,
    expiresAt: session.expiresAt,
  };
}

/**
 * Destroys the current session (logout)
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

  session.isLoggedIn = false;
  session.loginTime = undefined;
  session.expiresAt = undefined;

  await session.save();
}

/**
 * Checks if the current session is valid
 * @returns true if user is logged in with valid session
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session.isLoggedIn;
}

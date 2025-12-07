import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyPassword } from "@/lib/password-hash";

export async function POST(request: Request) {
  const body = await request.json();
  const { password } = body;

  const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

  if (!ADMIN_PASSWORD_HASH) {
    console.error("ADMIN_PASSWORD_HASH environment variable not set");
    return NextResponse.json({ success: false, error: "Server configuration error" }, { status: 500 });
  }

  const isValidPassword = await verifyPassword(password, ADMIN_PASSWORD_HASH);

  if (isValidPassword) {
    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false }, { status: 401 });
}

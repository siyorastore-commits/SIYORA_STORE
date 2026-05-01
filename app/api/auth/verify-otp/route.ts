import { NextResponse } from "next/server";
import { verifyOTPHash } from "@/lib/otp";
import { getOTPSession, deleteOTPSession, getUserByPhone, createUser, linkOrdersToUser } from "@/lib/supabase";
import { createUserSession, USER_COOKIE } from "@/lib/user-auth";

export async function POST(req: Request) {
  try {
    const { phone, otp } = await req.json();

    if (!phone || !otp) {
      return NextResponse.json({ success: false, error: "Phone and OTP required" }, { status: 400 });
    }

    const session = await getOTPSession(phone);
    if (!session) {
      return NextResponse.json({ success: false, error: "OTP expired or not found. Please request a new one." }, { status: 400 });
    }

    if (new Date(session.expires_at) < new Date()) {
      await deleteOTPSession(phone);
      return NextResponse.json({ success: false, error: "OTP has expired. Please request a new one." }, { status: 400 });
    }

    if (!verifyOTPHash(otp, phone, session.otp_hash)) {
      return NextResponse.json({ success: false, error: "Incorrect OTP. Please try again." }, { status: 400 });
    }

    await deleteOTPSession(phone);

    let user = await getUserByPhone(phone);
    let isNewUser = false;

    if (!user) {
      user = await createUser(phone);
      isNewUser = true;
      // Link any existing orders placed with this phone number
      await linkOrdersToUser(phone, user.id);
    } else {
      // Also link any orders placed while logged out
      await linkOrdersToUser(phone, user.id);
    }

    const token = createUserSession(user.id, phone);

    const response = NextResponse.json({ success: true, isNewUser, user });
    response.cookies.set(USER_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (err: any) {
    console.error("verify-otp error:", err);
    return NextResponse.json({ success: false, error: err.message || "Verification failed" }, { status: 500 });
  }
}

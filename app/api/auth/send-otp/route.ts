import { NextResponse } from "next/server";
import { generateOTP, hashOTP, sendOTPviaTwilio } from "@/lib/otp";
import { saveOTPSession } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();

    if (!phone || !/^\+91[6-9]\d{9}$/.test(phone)) {
      return NextResponse.json({ success: false, error: "Enter a valid 10-digit Indian mobile number" }, { status: 400 });
    }

    const otp = generateOTP();
    const otpHash = hashOTP(otp, phone);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    await saveOTPSession(phone, otpHash, expiresAt);
    await sendOTPviaTwilio(phone, otp);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("send-otp error:", err);
    return NextResponse.json({ success: false, error: err.message || "Failed to send OTP" }, { status: 500 });
  }
}

import crypto from "crypto";

const OTP_SECRET = process.env.OTP_SECRET || "siyora_otp_fallback_2024";

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function hashOTP(otp: string, phone: string): string {
  return crypto
    .createHmac("sha256", OTP_SECRET)
    .update(`${otp}:${phone}`)
    .digest("hex");
}

export function verifyOTPHash(otp: string, phone: string, storedHash: string): boolean {
  const expected = hashOTP(otp, phone);
  try {
    return crypto.timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(storedHash, "hex"));
  } catch {
    return false;
  }
}

export async function sendOTPviaTwilio(phone: string, otp: string): Promise<void> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID!;
  const authToken = process.env.TWILIO_AUTH_TOKEN!;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER!;

  const body = `Your Siyora verification code is ${otp}. Valid for 5 minutes. Do not share this with anyone.`;

  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
      },
      body: new URLSearchParams({ To: phone, From: fromNumber, Body: body }).toString(),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).message || "Failed to send OTP");
  }
}

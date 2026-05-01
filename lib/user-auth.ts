import crypto from "crypto";

const USER_SECRET = process.env.USER_SECRET || "siyora_user_fallback_2024";
export const USER_COOKIE = "siyora_user_session";
const TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

interface SessionPayload {
  userId: string;
  phone: string;
  issuedAt: number;
}

export function createUserSession(userId: string, phone: string): string {
  const payload: SessionPayload = { userId, phone, issuedAt: Date.now() };
  const data = JSON.stringify(payload);
  const sig = crypto.createHmac("sha256", USER_SECRET).update(data).digest("hex");
  return Buffer.from(JSON.stringify({ data, sig })).toString("base64url");
}

export function verifyUserSession(token: string): SessionPayload | null {
  try {
    const { data, sig } = JSON.parse(Buffer.from(token, "base64url").toString("utf-8"));
    const expected = crypto.createHmac("sha256", USER_SECRET).update(data).digest("hex");
    if (!crypto.timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(sig, "hex"))) return null;
    const session: SessionPayload = JSON.parse(data);
    if (Date.now() - session.issuedAt > TTL_MS) return null;
    return session;
  } catch {
    return null;
  }
}

import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ADMIN_SECRET =
  process.env.ADMIN_SECRET || "siyora-change-this-secret-in-env";
const SESSION_DURATION = 24 * 60 * 60 * 1000;
export const SESSION_COOKIE = "siyora_admin_session";

export function createSessionToken(): string {
  const payload = Buffer.from(JSON.stringify({ ts: Date.now() })).toString(
    "base64"
  );
  const sig = crypto
    .createHmac("sha256", ADMIN_SECRET)
    .update(payload)
    .digest("hex");
  return `${payload}.${sig}`;
}

export function verifySessionToken(token: string): boolean {
  try {
    const lastDot = token.lastIndexOf(".");
    if (lastDot === -1) return false;
    const payload = token.slice(0, lastDot);
    const sig = token.slice(lastDot + 1);
    const expectedSig = crypto
      .createHmac("sha256", ADMIN_SECRET)
      .update(payload)
      .digest("hex");
    const sigBuf = Buffer.from(sig);
    const expectedBuf = Buffer.from(expectedSig);
    if (sigBuf.length !== expectedBuf.length) return false;
    if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) return false;
    const data = JSON.parse(Buffer.from(payload, "base64").toString());
    return Date.now() - data.ts < SESSION_DURATION;
  } catch {
    return false;
  }
}

export async function requireAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  if (!session?.value || !verifySessionToken(session.value)) {
    redirect("/admin/login");
  }
}

export function checkAdminRequest(request: Request): boolean {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(
    new RegExp(`${SESSION_COOKIE}=([^;\\s]+)`)
  );
  const token = match ? decodeURIComponent(match[1]) : null;
  return token ? verifySessionToken(token) : false;
}

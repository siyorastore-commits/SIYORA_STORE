import { NextRequest, NextResponse } from "next/server";
import { verifyUserSession, USER_COOKIE } from "@/lib/user-auth";
import { updateUserProfile } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const token = req.cookies.get(USER_COOKIE)?.value;
  const session = token ? verifyUserSession(token) : null;
  if (!session) return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });

  const { name, email } = await req.json();
  if (!name?.trim()) return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 });

  const user = await updateUserProfile(session.userId, name.trim(), email?.trim() || undefined);
  return NextResponse.json({ success: true, user });
}

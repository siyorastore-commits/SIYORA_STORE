import { NextRequest, NextResponse } from "next/server";
import { verifyUserSession, USER_COOKIE } from "@/lib/user-auth";
import { getUserById } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(USER_COOKIE)?.value;
  if (!token) return NextResponse.json({ user: null }, { status: 401 });

  const session = verifyUserSession(token);
  if (!session) return NextResponse.json({ user: null }, { status: 401 });

  const user = await getUserById(session.userId);
  if (!user) return NextResponse.json({ user: null }, { status: 401 });

  return NextResponse.json({ user });
}

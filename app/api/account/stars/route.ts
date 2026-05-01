import { NextRequest, NextResponse } from "next/server";
import { verifyUserSession, USER_COOKIE } from "@/lib/user-auth";
import { getStarTransactions } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(USER_COOKIE)?.value;
  const session = token ? verifyUserSession(token) : null;
  if (!session) return NextResponse.json({ transactions: [] }, { status: 401 });

  const transactions = await getStarTransactions(session.userId);
  return NextResponse.json({ transactions });
}

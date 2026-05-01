import { NextRequest, NextResponse } from "next/server";
import { verifyUserSession, USER_COOKIE } from "@/lib/user-auth";
import { saveQuizResponse } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { phone, q1, q2, q3, q4, q5, completed } = await req.json();

    if (!phone) {
      return NextResponse.json({ success: false, error: "Phone required" }, { status: 400 });
    }

    const token = req.cookies.get(USER_COOKIE)?.value;
    const session = token ? verifyUserSession(token) : null;

    await saveQuizResponse({
      user_id: session?.userId,
      phone,
      q1: q1 || null,
      q2: q2 || null,
      q3: q3 || null,
      q4: q4 || null,
      q5: q5 || null,
      completed: !!completed,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("quiz submit error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

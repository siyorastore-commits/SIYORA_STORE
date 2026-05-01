import { NextResponse } from "next/server";
import { USER_COOKIE } from "@/lib/user-auth";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(USER_COOKIE, "", { maxAge: 0, path: "/" });
  return response;
}

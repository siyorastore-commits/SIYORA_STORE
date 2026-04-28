import { NextResponse } from "next/server";
import { checkAdminRequest } from "@/lib/admin-auth";
import { getSiteContent, setSiteContent } from "@/lib/supabase";
import { MARQUEE_ITEMS } from "@/lib/data";

export async function GET(request: Request) {
  if (!checkAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const marquee = (await getSiteContent("marquee_items")) || MARQUEE_ITEMS;
  return NextResponse.json({ marquee });
}

export async function POST(request: Request) {
  if (!checkAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { key, value } = await request.json();
  if (!key) {
    return NextResponse.json({ error: "key required" }, { status: 400 });
  }

  await setSiteContent(key, value);
  return NextResponse.json({ success: true });
}

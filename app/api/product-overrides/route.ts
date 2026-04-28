import { NextResponse } from "next/server";
import { getProductOverrides } from "@/lib/supabase";

export const revalidate = 60;

export async function GET() {
  const overrides = await getProductOverrides();
  return NextResponse.json({ overrides });
}

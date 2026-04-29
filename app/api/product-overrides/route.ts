import { NextResponse } from "next/server";
import { getProductOverrides } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const overrides = await getProductOverrides();
  return NextResponse.json(
    { overrides },
    { headers: { "Cache-Control": "no-store" } }
  );
}

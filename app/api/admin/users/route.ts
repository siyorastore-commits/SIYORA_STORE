import { NextRequest, NextResponse } from "next/server";
import { getAllUsers, getUserStarSummary, getUserWithOrders } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("id");

  if (userId) {
    const detail = await getUserWithOrders(userId);
    return NextResponse.json(detail);
  }

  const [users, starSummary] = await Promise.all([getAllUsers(), getUserStarSummary()]);
  return NextResponse.json({ users, starSummary });
}

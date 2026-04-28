import { NextResponse } from "next/server";
import { checkAdminRequest } from "@/lib/admin-auth";
import { getAllOrders, updateOrderStatus } from "@/lib/supabase";

export async function GET(request: Request) {
  if (!checkAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await getAllOrders();
  return NextResponse.json({ orders });
}

export async function PUT(request: Request) {
  if (!checkAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId, orderStatus, paymentStatus } = await request.json();
  if (!orderId || !orderStatus) {
    return NextResponse.json(
      { error: "orderId and orderStatus required" },
      { status: 400 }
    );
  }

  const result = await updateOrderStatus(orderId, orderStatus, paymentStatus);
  return NextResponse.json({ success: true, data: result });
}

import { NextResponse } from "next/server";
import { createRazorpayOrder } from "@/lib/razorpay";
import { createPendingOrder } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { amount, orderData } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const order = await createRazorpayOrder(amount);

    // Save a pending record immediately so every attempt is tracked in Supabase
    if (orderData) {
      await createPendingOrder({
        ...orderData,
        razorpay_order_id: order.id,
      }).catch((err) => console.error("Failed to save pending order:", err));
    }

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error: any) {
    console.error("Create order error:", error);
    return NextResponse.json({ error: error.message || "Failed to create order" }, { status: 500 });
  }
}

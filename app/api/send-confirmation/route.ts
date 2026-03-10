import { NextResponse } from "next/server";
import { sendOrderConfirmationEmail } from "@/lib/resend";

export async function POST(req: Request) {
  try {
    const { to, customerName, orderId, items, totalAmount, shippingAddress } =
      await req.json();

    await sendOrderConfirmationEmail({
      to,
      customerName,
      orderId,
      items,
      totalAmount,
      shippingAddress,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Send email error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

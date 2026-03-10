import { NextResponse } from "next/server";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { saveOrder } from "@/lib/supabase";
import { sendOrderConfirmationEmail } from "@/lib/resend";

export async function POST(req: Request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      isCOD,
      orderData,
    } = await req.json();

    // For COD, skip signature verification
    if (!isCOD) {
      const isValid = verifyRazorpaySignature(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      );

      if (!isValid) {
        return NextResponse.json(
          { success: false, error: "Invalid payment signature" },
          { status: 400 }
        );
      }
    }

    // Save order to Supabase
    const savedOrder = await saveOrder({
      ...orderData,
      razorpay_order_id,
      razorpay_payment_id: isCOD ? "COD" : razorpay_payment_id,
    });

    // Send confirmation email (non-blocking)
    sendOrderConfirmationEmail({
      to: orderData.customer_email,
      customerName: orderData.customer_name,
      orderId: razorpay_order_id,
      items: orderData.items,
      totalAmount: orderData.total_amount,
      shippingAddress: orderData.shipping_address,
    }).catch((err) => console.error("Email send failed:", err));

    return NextResponse.json({ success: true, orderId: savedOrder.id });
  } catch (error: any) {
    console.error("Verify payment error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Verification failed" },
      { status: 500 }
    );
  }
}

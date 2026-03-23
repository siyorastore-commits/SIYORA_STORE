import { NextResponse } from "next/server";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { updateOrderAfterPayment } from "@/lib/supabase";
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
        // Mark the pending record as failed
        await updateOrderAfterPayment(
          razorpay_order_id,
          razorpay_payment_id,
          "failed",
          "payment_failed"
        ).catch((err) => console.error("Failed to update order status:", err));

        return NextResponse.json(
          { success: false, error: "Invalid payment signature" },
          { status: 400 }
        );
      }
    }

    // Update the pending record to confirmed
    const savedOrder = await updateOrderAfterPayment(
      razorpay_order_id,
      isCOD ? "COD" : razorpay_payment_id,
      "paid",
      "confirmed"
    );

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

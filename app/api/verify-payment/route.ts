import { NextRequest, NextResponse } from "next/server";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { updateOrderAfterPayment, decrementProductQuantities, awardStars, getUserByPhone } from "@/lib/supabase";
import { sendOrderConfirmationEmail } from "@/lib/resend";
import { verifyUserSession, USER_COOKIE } from "@/lib/user-auth";

export async function POST(req: NextRequest) {
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

    // Decrement product quantities (non-blocking)
    const orderItems = (orderData.items || []).map((item: any) => ({
      productId: String(item.id),
      qty: item.qty || 1,
    }));
    decrementProductQuantities(orderItems).catch((err) =>
      console.error("Quantity decrement failed:", err)
    );

    // Stars: deduct redeemed stars then award +25 for placing order (non-blocking)
    const userToken = req.cookies.get(USER_COOKIE)?.value;
    const userSession = userToken ? verifyUserSession(userToken) : null;

    const resolveUserId = async (): Promise<string | null> => {
      if (userSession) return userSession.userId;
      if (orderData.customer_phone) {
        const u = await getUserByPhone(orderData.customer_phone).catch(() => null);
        return u?.id ?? null;
      }
      return null;
    };

    resolveUserId().then((userId) => {
      if (!userId) return;
      const chain: Promise<any>[] = [];
      // Deduct redeemed stars first
      if (orderData.stars_applied && orderData.stars_used > 0) {
        chain.push(awardStars(userId, -orderData.stars_used, "redeemed", savedOrder.id));
      }
      // Award +25 for placing the order
      chain.push(Promise.all(chain).then(() =>
        awardStars(userId, 25, "order_placed", savedOrder.id)
      ));
      return Promise.all(chain);
    }).catch((err) => console.error("Stars update failed:", err));

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

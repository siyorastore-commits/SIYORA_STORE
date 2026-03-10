import Link from "next/link";

export default function OrderSuccessPage({
  searchParams,
}: {
  searchParams: { order?: string };
}) {
  const orderId = searchParams.order || "SIY" + Date.now().toString().slice(-6);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "5%", background: "var(--cream)" }}>
      <div style={{ background: "white", borderRadius: 32, padding: "60px 48px", textAlign: "center", maxWidth: 540, width: "100%", border: "1px solid var(--border)", boxShadow: "0 30px 80px rgba(233,30,140,0.08)" }}>
        <div style={{ fontSize: 80, marginBottom: 24, animation: "popIn 0.6s cubic-bezier(0.4,0,0.2,1)" }}>🎉</div>

        <h1 style={{ fontFamily: "var(--serif)", fontSize: 44, fontWeight: 700, color: "var(--dark)", marginBottom: 12 }}>
          Order Placed!
        </h1>
        <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.8, marginBottom: 32 }}>
          Thank you for shopping with Siyora! Your order is confirmed and a confirmation email has been sent. We'll ship within 24–48 hours.
        </p>

        <div style={{ background: "var(--blush)", borderRadius: 12, padding: "16px 24px", display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 4, marginBottom: 32 }}>
          <span style={{ fontSize: 10, letterSpacing: "3px", textTransform: "uppercase", color: "var(--muted)", fontWeight: 600 }}>Order ID</span>
          <span style={{ fontFamily: "var(--serif)", fontSize: 24, fontWeight: 700, color: "var(--pink)" }}>#{orderId}</span>
        </div>

        {/* Steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 36, textAlign: "left" }}>
          {[["✅", "Order Confirmed", "Right now"], ["📦", "Packing Your Order", "Within 24 hours"], ["🚀", "Shipped via Shiprocket", "You'll receive a tracking link"], ["🏠", "Delivered to You", "3–5 business days"]].map(([icon, title, time]) => (
            <div key={title} style={{ display: "flex", alignItems: "center", gap: 14, padding: 14, background: "var(--cream)", borderRadius: 12, border: "1px solid var(--border)" }}>
              <span style={{ fontSize: 22 }}>{icon}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{title}</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>{time}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/shop" style={{ background: "var(--pink)", color: "white", padding: "16px 40px", borderRadius: 50, fontSize: 11, letterSpacing: "2.5px", fontWeight: 600, textTransform: "uppercase" }}>
            Continue Shopping
          </Link>
          <Link href="/contact" style={{ background: "transparent", color: "var(--dark)", padding: "16px 40px", borderRadius: 50, fontSize: 11, letterSpacing: "2.5px", fontWeight: 600, textTransform: "uppercase", border: "1.5px solid var(--border)" }}>
            Track Order
          </Link>
        </div>

        <p style={{ marginTop: 28, fontSize: 13, color: "var(--muted)" }}>
          Questions? DM us on Instagram <strong>@siyora.official</strong> or WhatsApp us
        </p>
      </div>

      <style>{`@keyframes popIn { from { transform: scale(0) rotate(-10deg); } to { transform: scale(1) rotate(0); } }`}</style>
    </div>
  );
}

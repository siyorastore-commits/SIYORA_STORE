import Link from "next/link";

export const metadata = {
  title: "Shipping Information – Siyora",
  description: "Shipping details, delivery timelines, and policies for Siyora orders.",
};

export default function ShippingPage() {
  return (
    <>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg,#180A08 0%,#2D1515 100%)", padding: "120px 5% 80px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", fontFamily: "var(--serif)", fontSize: 220, fontWeight: 700, color: "rgba(255,255,255,0.03)", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
          Shipping
        </div>
        <div style={{ maxWidth: 1400, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <span style={{ fontSize: 10, letterSpacing: "5px", color: "var(--coral)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: 20 }}>Delivery</span>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(44px,7vw,80px)", fontWeight: 700, color: "white", lineHeight: 1, marginBottom: 24 }}>
            Shipping <em style={{ color: "var(--pink)", fontStyle: "italic" }}>Information</em>
          </h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", maxWidth: 520, margin: "0 auto", lineHeight: 1.9, fontWeight: 300 }}>
            Everything you need to know about getting your Siyora order.
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <section style={{ padding: "60px 5%", background: "var(--blush)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24, textAlign: "center" }}>
          {[
            ["📦", "Free Shipping", "On orders above ₹999"],
            ["🚚", "6–7 Days", "Standard delivery timeline"],
            ["🇮🇳", "Pan-India", "We ship across all of India"],
            ["🔍", "Live Tracking", "Track via WhatsApp & email"],
          ].map(([icon, title, desc]) => (
            <div key={title as string} style={{ background: "white", borderRadius: 20, padding: "28px 20px", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{icon}</div>
              <div style={{ fontFamily: "var(--serif)", fontSize: 20, fontWeight: 700, marginBottom: 6 }}>{title}</div>
              <div style={{ fontSize: 13, color: "var(--muted)" }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: "80px 5%", maxWidth: 860, margin: "0 auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>

          <PolicySection title="Shipping Charges">
            <p>We offer <strong>free standard shipping</strong> on all orders with a total value of ₹999 or above.</p>
            <p>For orders below ₹999, a flat shipping fee will be calculated and displayed at checkout based on your delivery location.</p>
          </PolicySection>

          <PolicySection title="Processing Time">
            <p>Once your payment is confirmed, your order will be processed and packed within <strong>1–2 business days</strong>. Business days are Monday through Saturday (excluding public holidays).</p>
            <p>You will receive an email and/or WhatsApp notification once your order has been dispatched, along with your tracking details.</p>
          </PolicySection>

          <PolicySection title="Delivery Timeline">
            <p>Standard delivery across India takes approximately <strong>6–7 business days</strong> from the date of dispatch. Delivery times may vary depending on your location:</p>
            <ul>
              <li><strong>Metro cities</strong> (Mumbai, Delhi, Bangalore, Chennai, Hyderabad, Kolkata): 4–5 business days</li>
              <li><strong>Tier 2 & 3 cities:</strong> 5–7 business days</li>
              <li><strong>Remote & rural areas:</strong> 7–10 business days</li>
            </ul>
            <p>These are estimated timelines and not guaranteed delivery dates. Delays may occur due to courier backlogs, weather conditions, or local disruptions.</p>
          </PolicySection>

          <PolicySection title="Shipping Partner">
            <p>We ship all orders through <strong>Shiprocket</strong>, which works with trusted courier services including BlueDart, Delhivery, Xpressbees, and DTDC, depending on your pin code and serviceability.</p>
            <p>The courier partner is automatically assigned based on your location for the fastest possible delivery.</p>
          </PolicySection>

          <PolicySection title="Order Tracking">
            <p>Once your order is dispatched, you will receive:</p>
            <ul>
              <li>A confirmation email with your tracking ID and tracking link.</li>
              <li>A WhatsApp message (if your number is registered) with tracking details.</li>
            </ul>
            <p>You can track your order directly on the courier partner's website using the provided tracking ID. For assistance, contact us at siyora.store@gmail.com or WhatsApp +91 6280636359.</p>
          </PolicySection>

          <PolicySection title="Shipping Address">
            <p>Please ensure your delivery address is complete and accurate, including flat/house number, street, landmark, city, state, and PIN code. Siyora is not responsible for delays or failed deliveries due to incorrect or incomplete address information.</p>
            <p>Once an order is placed, the shipping address <strong>cannot be changed</strong> after dispatch. Address changes before dispatch can be requested by contacting us within 12 hours of placing the order.</p>
          </PolicySection>

          <PolicySection title="Failed Deliveries">
            <p>If delivery is unsuccessful after multiple attempts, the package will be returned to us. In such cases:</p>
            <ul>
              <li>For <strong>prepaid orders:</strong> We will attempt to redeliver. If redelivery is not possible, a store credit (not a refund) may be issued at our discretion, minus shipping charges.</li>
              <li>For <strong>COD orders:</strong> No refund or credit will be issued for refused or undelivered orders.</li>
            </ul>
          </PolicySection>

          <PolicySection title="Packaging">
            <p>At Siyora, we care about the environment as much as we care about fashion. All orders are packed in <strong>100% recyclable packaging</strong>. Your order arrives beautifully wrapped, making it a perfect gift right out of the box.</p>
          </PolicySection>

          <PolicySection title="Currently Shipping">
            <p>We currently ship <strong>within India only</strong>. International shipping is not available at this time. Stay tuned to our Instagram <strong>@siyora.in</strong> for updates on international shipping.</p>
          </PolicySection>

        </div>

        <div style={{ marginTop: 60, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
          <div style={{ padding: "28px", background: "var(--blush)", borderRadius: 20, textAlign: "center" }}>
            <p style={{ fontFamily: "var(--serif)", fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Track your order</p>
            <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>Check your email for your tracking ID or contact us.</p>
            <Link href="/contact" className="btn-primary" style={{ display: "inline-block", fontSize: 13 }}>Contact Support</Link>
          </div>
          <div style={{ padding: "28px", background: "#F0F8FF", borderRadius: 20, textAlign: "center", border: "1px solid var(--border)" }}>
            <p style={{ fontFamily: "var(--serif)", fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Exchange Policy</p>
            <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>Received a damaged item? We've got you covered.</p>
            <Link href="/returns" className="btn-primary" style={{ display: "inline-block", fontSize: 13, background: "var(--coral)" }}>View Policy</Link>
          </div>
        </div>
      </section>
    </>
  );
}

function PolicySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(22px,3vw,28px)", fontWeight: 700, marginBottom: 16, color: "var(--dark)" }}>{title}</h2>
      <div style={{ fontSize: 15, color: "var(--muted)", lineHeight: 2, display: "flex", flexDirection: "column", gap: 12 }}>
        {children}
      </div>
    </div>
  );
}

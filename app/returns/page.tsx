import Link from "next/link";

export const metadata = {
  title: "Exchange Policy – Siyora",
  description: "Siyora's exchange policy — no returns, exchange only for damaged or incorrect items.",
};

export default function ReturnsPage() {
  return (
    <>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg,#180A08 0%,#2D1515 100%)", padding: "120px 5% 80px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", fontFamily: "var(--serif)", fontSize: 220, fontWeight: 700, color: "rgba(255,255,255,0.03)", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
          Exchange
        </div>
        <div style={{ maxWidth: 1400, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <span style={{ fontSize: 10, letterSpacing: "5px", color: "var(--coral)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: 20 }}>Policy</span>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(44px,7vw,80px)", fontWeight: 700, color: "white", lineHeight: 1, marginBottom: 24 }}>
            Exchange <em style={{ color: "var(--pink)", fontStyle: "italic" }}>Policy</em>
          </h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", maxWidth: 560, margin: "0 auto", lineHeight: 1.9, fontWeight: 300 }}>
            We take pride in the quality of every handcrafted piece. Here's everything you need to know.
          </p>
        </div>
      </div>

      {/* Important Notice */}
      <section style={{ padding: "40px 5%" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", background: "#FFF3F0", border: "1px solid #FFD0C8", borderRadius: 20, padding: "32px 36px" }}>
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <span style={{ fontSize: 32, flexShrink: 0 }}>⚠️</span>
            <div>
              <p style={{ fontFamily: "var(--serif)", fontSize: 20, fontWeight: 700, color: "var(--dark)", marginBottom: 10 }}>No Returns Policy</p>
              <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.9 }}>
                Siyora does <strong>not accept returns or issue refunds</strong> for any reason including change of mind, incorrect size selection, or personal preference. All sales are final. Exchanges are only offered when items are received damaged or defective. Please review our Size Guide and product descriptions carefully before placing your order.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: "40px 5% 80px", maxWidth: 860, margin: "0 auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>

          <PolicySection title="When Are Exchanges Accepted?">
            <p>We will accept an exchange request <strong>only</strong> under the following circumstances:</p>
            <ul>
              <li><strong>Damaged item:</strong> The product arrived physically damaged, torn, or defective due to a manufacturing fault.</li>
              <li><strong>Wrong item sent:</strong> You received a product different from what you ordered (wrong colour, style, or size as per your order).</li>
            </ul>
            <p>Exchanges are <strong>not accepted</strong> for:</p>
            <ul>
              <li>Change of mind or preference.</li>
              <li>Incorrect size ordered by the customer (please use our Size Guide before ordering).</li>
              <li>Minor colour variation due to screen display differences — this is expected with handcrafted products.</li>
              <li>Slight variation in embroidery or fabric texture — inherent to the handcrafted nature of our garments.</li>
              <li>Items that have been worn, washed, or altered.</li>
              <li>Items with removed or damaged tags.</li>
            </ul>
          </PolicySection>

          <PolicySection title="How to Raise an Exchange Request">
            <p>If you believe your item qualifies for an exchange, follow these steps:</p>
            <ol>
              <li>
                <strong>Contact us within 48 hours of delivery.</strong><br />
                Reach us on WhatsApp at <strong>+91 6280636359</strong> or email us at <strong>siyora.store@gmail.com</strong>. Do not wait — requests raised after 48 hours will not be accepted.
              </li>
              <li>
                <strong>Share the following details:</strong>
                <ul>
                  <li>Your full name and order number.</li>
                  <li>Clear photographs of the damaged/defective item (all sides).</li>
                  <li>A brief description of the issue.</li>
                  <li>Unboxing video (strongly recommended — helps us process your request faster).</li>
                </ul>
              </li>
              <li>
                <strong>Wait for our confirmation.</strong><br />
                Our team will review your request within <strong>2 business days</strong> and let you know if the exchange is approved.
              </li>
              <li>
                <strong>Send the item back.</strong><br />
                If approved, we will provide you with the return shipping instructions. The item must be sent back in its original, unworn condition with all tags attached.
              </li>
              <li>
                <strong>Receive your exchange.</strong><br />
                Once we receive and verify the returned item, your replacement will be dispatched within <strong>3–5 business days</strong>.
              </li>
            </ol>
          </PolicySection>

          <PolicySection title="Exchange Conditions">
            <p>For an exchange to be processed, the item must be:</p>
            <ul>
              <li>In its <strong>original, unworn, and unwashed</strong> condition.</li>
              <li>With all <strong>original tags and packaging</strong> intact.</li>
              <li>Returned within <strong>7 days</strong> of receiving exchange approval from our team.</li>
            </ul>
            <p>Items that do not meet these conditions will be returned to the customer at their expense and no exchange will be issued.</p>
          </PolicySection>

          <PolicySection title="Refunds">
            <p>Siyora does <strong>not issue monetary refunds</strong> under any circumstances. In exceptional cases (such as an ordered product being unavailable for exchange), we may offer store credit at our discretion.</p>
            <p>For payment failures or double charges, please contact us immediately with your payment reference ID. Duplicate payments will be refunded to the original payment method within 5–7 business days.</p>
          </PolicySection>

          <PolicySection title="Cancellations">
            <p>Orders can only be cancelled <strong>within 12 hours</strong> of placement and only if the order has not yet been dispatched. To cancel, contact us on WhatsApp (+91 6280636359) immediately with your order number.</p>
            <p>Once dispatched, orders cannot be cancelled. Refusing delivery of a dispatched order does not qualify for a refund or exchange.</p>
          </PolicySection>

          <PolicySection title="Size Guide">
            <p>To avoid size issues, we strongly recommend referring to our detailed Size Guide before placing an order. We offer sizes <strong>XS to XL</strong> with exact measurements listed on each product page.</p>
            <p>If you're unsure about sizing, reach out to us on WhatsApp (+91 6280636359) before ordering — we're happy to help you find the right fit.</p>
          </PolicySection>

          <PolicySection title="Contact for Exchange">
            <p>To initiate an exchange or for any related queries:</p>
            <ul>
              <li><strong>WhatsApp:</strong> +91 6280636359 (fastest response)</li>
              <li><strong>Email:</strong> siyora.store@gmail.com</li>
              <li><strong>Instagram DM:</strong> @siyora.in</li>
              <li><strong>Hours:</strong> Monday – Saturday, 10am – 7pm</li>
            </ul>
          </PolicySection>

        </div>

        {/* CTA */}
        <div style={{ marginTop: 60, padding: "36px", background: "var(--blush)", borderRadius: 20, textAlign: "center" }}>
          <p style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Need help with an order?</p>
          <p style={{ fontSize: 14, color: "var(--muted)", marginBottom: 24 }}>We respond quickly on WhatsApp. Reach out and we'll sort it out.</p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="https://wa.me/916280636359" className="btn-primary" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block" }}>WhatsApp Us</a>
            <Link href="/contact" className="btn-primary" style={{ display: "inline-block", background: "transparent", border: "2px solid var(--pink)", color: "var(--pink)" }}>Contact Form</Link>
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

import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions – Siyora",
  description: "Terms and conditions governing your use of Siyora and purchases made on our platform.",
};

export default function TermsPage() {
  return (
    <>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg,#180A08 0%,#2D1515 100%)", padding: "120px 5% 80px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", fontFamily: "var(--serif)", fontSize: 220, fontWeight: 700, color: "rgba(255,255,255,0.03)", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
          Terms
        </div>
        <div style={{ maxWidth: 1400, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <span style={{ fontSize: 10, letterSpacing: "5px", color: "var(--coral)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: 20 }}>Legal</span>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(44px,7vw,80px)", fontWeight: 700, color: "white", lineHeight: 1, marginBottom: 24 }}>
            Terms &amp; <em style={{ color: "var(--pink)", fontStyle: "italic" }}>Conditions</em>
          </h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", maxWidth: 520, margin: "0 auto", lineHeight: 1.9, fontWeight: 300 }}>
            Last updated: March 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <section style={{ padding: "80px 5%", maxWidth: 860, margin: "0 auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>

          <PolicySection title="1. Agreement to Terms">
            <p>By accessing or using the Siyora website (siyora.in) or placing an order with us, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our services.</p>
            <p>Siyora is a fashion brand selling handcrafted kurtas, co-ord sets, and apparel for women, operated from India.</p>
          </PolicySection>

          <PolicySection title="2. Products">
            <p>All products listed on our website are handcrafted and subject to availability. We reserve the right to discontinue any product at any time.</p>
            <p>Product images are for illustrative purposes. Due to the handcrafted nature of our garments and variations in screen display, actual colours, textures, and embroidery details may vary slightly from what is shown online. This is a characteristic of handmade products and is not considered a defect.</p>
            <p>Sizes follow our Size Guide available on the website. We strongly recommend referring to measurements before placing an order as exchanges are only offered in limited circumstances (see Section 5).</p>
          </PolicySection>

          <PolicySection title="3. Pricing & Payments">
            <p>All prices are listed in Indian Rupees (₹) and are inclusive of applicable taxes unless stated otherwise.</p>
            <p>We accept the following payment methods through our secure Razorpay payment gateway:</p>
            <ul>
              <li>UPI (Google Pay, PhonePe, Paytm, etc.)</li>
              <li>Credit & Debit Cards (Visa, Mastercard, RuPay)</li>
              <li>Net Banking</li>
              <li>Cash on Delivery (COD) – available on select orders</li>
            </ul>
            <p>Siyora reserves the right to cancel any order if payment verification fails or if fraudulent activity is suspected. In such cases, a full refund will be initiated.</p>
          </PolicySection>

          <PolicySection title="4. Order Processing & Shipping">
            <p>Orders are processed within 1–2 business days of payment confirmation. Delivery typically takes <strong>6–7 business days</strong> across India, shipped via trusted courier partners through Shiprocket.</p>
            <p><strong>Free shipping</strong> is offered on all orders above ₹999. Orders below this threshold may attract a shipping fee displayed at checkout.</p>
            <p>Once an order is dispatched, a tracking ID will be shared via email and/or WhatsApp. Siyora is not responsible for delays caused by courier partners, natural events, or circumstances beyond our control.</p>
            <p>We currently ship only within India.</p>
          </PolicySection>

          <PolicySection title="5. Exchange & Return Policy">
            <div style={{ background: "#FFF3F0", borderLeft: "4px solid var(--coral)", padding: "16px 20px", borderRadius: "0 12px 12px 0" }}>
              <p style={{ fontWeight: 600, color: "var(--dark)", marginBottom: 8 }}>Important: No Returns Policy</p>
              <p>Siyora does <strong>not</strong> accept returns or issue refunds for change of mind, incorrect size selection, or any reason other than those listed below. Please review your order carefully before confirming your purchase.</p>
            </div>
            <p><strong>Exchanges are accepted only under the following conditions:</strong></p>
            <ul>
              <li>The item received is damaged or defective upon delivery.</li>
              <li>You received a wrong item (different from what you ordered).</li>
            </ul>
            <p><strong>To raise an exchange request:</strong></p>
            <ul>
              <li>Contact us within <strong>48 hours</strong> of delivery via WhatsApp (+91 6280636359) or email (siyora.store@gmail.com).</li>
              <li>Share your order number, a clear photo of the damaged/defective item, and a brief description of the issue.</li>
              <li>Our team will review and respond within 2 business days.</li>
              <li>Approved exchanges will be dispatched within 3–5 business days after the original item is received back by us.</li>
            </ul>
            <p>Items must be returned in their original, unworn, unwashed condition with all tags intact. Items that show signs of use will not be accepted for exchange.</p>
          </PolicySection>

          <PolicySection title="6. Cancellation Policy">
            <p>Orders can be cancelled <strong>within 12 hours</strong> of placement, provided they have not been dispatched. To cancel an order, contact us immediately via WhatsApp (+91 6280636359) or email (siyora.store@gmail.com) with your order number.</p>
            <p>Once an order has been dispatched, cancellation is not possible. If you refuse delivery of a dispatched order, the item will be treated as returned and no refund will be issued.</p>
            <p>For COD orders cancelled after dispatch, we reserve the right to block future COD orders for that account.</p>
          </PolicySection>

          <PolicySection title="7. Intellectual Property">
            <p>All content on this website — including but not limited to product images, brand name "Siyora", logo, tagline "Where Siya Meets Street", text, and design — is the intellectual property of Siyora and protected under applicable Indian laws.</p>
            <p>You may not reproduce, distribute, or use any content from this website without prior written permission from Siyora.</p>
          </PolicySection>

          <PolicySection title="8. Limitation of Liability">
            <p>Siyora shall not be liable for any indirect, incidental, or consequential damages arising from your use of our website or products. Our total liability for any claim shall not exceed the amount paid for the specific order in question.</p>
            <p>We do not guarantee uninterrupted, error-free access to our website and are not responsible for any losses arising from website downtime or technical issues.</p>
          </PolicySection>

          <PolicySection title="9. Governing Law">
            <p>These Terms and Conditions are governed by and construed in accordance with the laws of India. Any disputes arising from the use of our services shall be subject to the exclusive jurisdiction of courts in India.</p>
          </PolicySection>

          <PolicySection title="10. Changes to Terms">
            <p>Siyora reserves the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting on this page. Continued use of our services after any changes constitutes your acceptance of the revised terms.</p>
          </PolicySection>

          <PolicySection title="11. Contact Us">
            <p>For any questions regarding these Terms and Conditions, please contact:</p>
            <ul>
              <li><strong>Email:</strong> siyora.store@gmail.com</li>
              <li><strong>WhatsApp:</strong> +91 6280636359</li>
              <li><strong>Instagram:</strong> @siyora.in</li>
              <li><strong>Hours:</strong> Monday – Saturday, 10am – 7pm</li>
            </ul>
          </PolicySection>

        </div>

        <div style={{ marginTop: 60, padding: "32px", background: "var(--blush)", borderRadius: 20, textAlign: "center" }}>
          <p style={{ fontFamily: "var(--serif)", fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Have questions about an order?</p>
          <p style={{ fontSize: 14, color: "var(--muted)", marginBottom: 20 }}>Our team is available Monday – Saturday, 10am – 7pm.</p>
          <Link href="/contact" className="btn-primary" style={{ display: "inline-block" }}>Get in Touch</Link>
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

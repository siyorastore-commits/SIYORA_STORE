import Link from "next/link";

export const metadata = {
  title: "Privacy Policy – Siyora",
  description: "How Siyora collects, uses, and protects your personal information.",
};

export default function PrivacyPolicy() {
  return (
    <>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg,#180A08 0%,#2D1515 100%)", padding: "120px 5% 80px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", fontFamily: "var(--serif)", fontSize: 260, fontWeight: 700, color: "rgba(255,255,255,0.03)", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
          Privacy
        </div>
        <div style={{ maxWidth: 1400, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <span style={{ fontSize: 10, letterSpacing: "5px", color: "var(--coral)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: 20 }}>Legal</span>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(44px,7vw,80px)", fontWeight: 700, color: "white", lineHeight: 1, marginBottom: 24 }}>
            Privacy <em style={{ color: "var(--pink)", fontStyle: "italic" }}>Policy</em>
          </h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", maxWidth: 520, margin: "0 auto", lineHeight: 1.9, fontWeight: 300 }}>
            Last updated: March 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <section style={{ padding: "80px 5%", maxWidth: 860, margin: "0 auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>

          <PolicySection title="1. Introduction">
            <p>Welcome to Siyora ("we", "us", or "our"). We operate the website siyora.in and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or place an order with us.</p>
            <p>By using our services, you agree to the collection and use of information in accordance with this policy.</p>
          </PolicySection>

          <PolicySection title="2. Information We Collect">
            <p>We collect information you provide directly to us, including:</p>
            <ul>
              <li><strong>Personal Identification:</strong> Name, email address, phone number, and shipping/billing address when you place an order.</li>
              <li><strong>Payment Information:</strong> Payment is processed securely through Razorpay. We do not store your card details, UPI ID, or banking credentials on our servers.</li>
              <li><strong>Order Information:</strong> Products purchased, order history, and communication related to your orders.</li>
              <li><strong>Device & Usage Data:</strong> IP address, browser type, pages visited, and time spent on our website (collected via standard web analytics).</li>
              <li><strong>Communications:</strong> Messages you send us via email, WhatsApp, or our contact form.</li>
            </ul>
          </PolicySection>

          <PolicySection title="3. How We Use Your Information">
            <p>We use the information we collect to:</p>
            <ul>
              <li>Process and fulfil your orders, including shipping via Shiprocket.</li>
              <li>Send order confirmation and shipping update emails via our email service.</li>
              <li>Respond to your queries and customer service requests.</li>
              <li>Improve our website, products, and services.</li>
              <li>Prevent fraudulent transactions and maintain security.</li>
              <li>Comply with applicable legal obligations.</li>
            </ul>
            <p>We do <strong>not</strong> sell, trade, or rent your personal information to third parties for marketing purposes.</p>
          </PolicySection>

          <PolicySection title="4. Sharing of Information">
            <p>We share your personal data only with trusted service providers who assist us in operating our business:</p>
            <ul>
              <li><strong>Razorpay</strong> – Payment processing. Your payment details are governed by Razorpay's Privacy Policy.</li>
              <li><strong>Shiprocket / Delivery Partners</strong> – Your name, address, and phone number are shared to fulfil and deliver your order.</li>
              <li><strong>Supabase</strong> – Secure cloud database for storing order records.</li>
              <li><strong>Resend</strong> – Email delivery service for order confirmations.</li>
            </ul>
            <p>All third-party providers are contractually bound to handle your data securely and use it only for the specified purpose.</p>
          </PolicySection>

          <PolicySection title="5. Data Security">
            <p>We implement industry-standard security measures to protect your personal information. All transactions on our website are secured using SSL/TLS encryption. Payment data is handled exclusively by Razorpay, a PCI-DSS compliant payment gateway.</p>
            <p>While we strive to protect your information, no method of electronic transmission or storage is 100% secure. We encourage you to use strong passwords and keep your login credentials confidential.</p>
          </PolicySection>

          <PolicySection title="6. Cookies">
            <p>Our website may use cookies to enhance your browsing experience. Cookies are small data files stored on your device. They help us remember your cart items and understand how you use our site.</p>
            <p>You can choose to disable cookies through your browser settings. However, disabling cookies may affect some functionality of our website, such as the shopping cart.</p>
          </PolicySection>

          <PolicySection title="7. Your Rights">
            <p>You have the right to:</p>
            <ul>
              <li>Access the personal information we hold about you.</li>
              <li>Request correction of inaccurate or incomplete data.</li>
              <li>Request deletion of your personal data, subject to legal obligations.</li>
              <li>Opt out of any promotional communications from us.</li>
            </ul>
            <p>To exercise any of these rights, please contact us at <strong>siyora.store@gmail.com</strong>.</p>
          </PolicySection>

          <PolicySection title="8. Children's Privacy">
            <p>Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have inadvertently collected such information, please contact us immediately.</p>
          </PolicySection>

          <PolicySection title="9. Changes to This Policy">
            <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with a revised "Last updated" date. We encourage you to review this page periodically.</p>
          </PolicySection>

          <PolicySection title="10. Contact Us">
            <p>If you have any questions about this Privacy Policy, please reach out to us:</p>
            <ul>
              <li><strong>Email:</strong> siyora.store@gmail.com</li>
              <li><strong>WhatsApp:</strong> +91 6280636359</li>
              <li><strong>Instagram:</strong> @siyora.in</li>
              <li><strong>Hours:</strong> Monday – Saturday, 10am – 7pm</li>
            </ul>
          </PolicySection>

        </div>

        <div style={{ marginTop: 60, padding: "32px", background: "var(--blush)", borderRadius: 20, textAlign: "center" }}>
          <p style={{ fontFamily: "var(--serif)", fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Questions about your data?</p>
          <p style={{ fontSize: 14, color: "var(--muted)", marginBottom: 20 }}>We're here to help. Reach out anytime.</p>
          <Link href="/contact" className="btn-primary" style={{ display: "inline-block" }}>Contact Us</Link>
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

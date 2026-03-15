export default function ContactPage() {
  return (
    <>
      <div style={{ background: "linear-gradient(135deg,#FFE8F0,#FFF0E8)", padding: "80px 5% 70px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <span style={{ fontSize: 10, letterSpacing: "5px", color: "var(--pink)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: 16 }}>Say Hello</span>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(48px,7vw,80px)", fontWeight: 700, lineHeight: 1 }}>
            Get in <em style={{ color: "var(--pink)", fontStyle: "italic" }}>Touch</em>
          </h1>
          <p style={{ fontSize: 15, color: "var(--muted)", marginTop: 16, fontWeight: 300 }}>We'd love to hear from you</p>
        </div>
      </div>

      <section style={{ padding: "80px 5%", maxWidth: 900, margin: "0 auto" }}>
        {/* Contact cards */}
        <div className="contact-cards-grid">
          {[["📱", "WhatsApp Us", "Chat with us directly for the quickest help with orders and queries.", "+91 6280636359"], ["✉️", "Email Us", "For orders, returns, sizing questions, or just to say hi!", "siyora.store@gmail.com"], ["📸", "Instagram", "DM us or tag us in your Siyora looks. We repost our favourites!", "@siyora.in"], ["🕐", "Working Hours", "We're available Monday to Saturday. We rest on Sundays!", "Mon–Sat: 10am–7pm"]].map(([icon, title, text, detail]) => (
            <div key={title} style={{ background: "white", borderRadius: 20, padding: 36, textAlign: "center", border: "1px solid var(--border)", transition: "all 0.3s" }}>
              <div style={{ fontSize: 44, marginBottom: 16 }}>{icon}</div>
              <div style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{title}</div>
              <div style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.8, marginBottom: 12 }}>{text}</div>
              <span style={{ color: "var(--pink)", fontWeight: 600, fontSize: 14 }}>{detail}</span>
            </div>
          ))}
        </div>

        {/* Contact form */}
        <div style={{ background: "white", borderRadius: 24, padding: 40, border: "1px solid var(--border)" }}>
          <h3 style={{ fontFamily: "var(--serif)", fontSize: 28, fontWeight: 700, marginBottom: 24 }}>Send a Message</h3>
          <div className="contact-form-grid">
            {[["Name", "text", "Your name"], ["Email", "email", "your@email.com"], ["Phone", "tel", "+91 6280636359"]].map(([label, type, ph]) => (
              <div key={label} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label className="form-label">{label}</label>
                <input className="form-input" type={type} placeholder={ph} />
              </div>
            ))}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label className="form-label">Subject</label>
              <select className="form-input form-select">
                <option>Order Query</option>
                <option>Return / Exchange</option>
                <option>Product Question</option>
                <option>Wholesale / Collab</option>
                <option>Other</option>
              </select>
            </div>
            <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: 6 }}>
              <label className="form-label">Message</label>
              <textarea className="form-input" rows={4} placeholder="Tell us how we can help..." style={{ resize: "vertical" }} />
            </div>
          </div>
          <button className="btn-primary" style={{ marginTop: 20 }}>Send Message</button>
        </div>
      </section>
    </>
  );
}

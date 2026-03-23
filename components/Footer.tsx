import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-top">
          {/* Brand */}
          <div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 36, fontWeight: 700, color: "var(--pink)", marginBottom: 16 }}>
              Si<span style={{ color: "var(--coral)" }}>y</span>ora
            </div>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.8, maxWidth: 260, fontWeight: 300 }}>
              Where Siya Meets Street. Handcrafted fashion for the modern Indian woman.
            </p>
        
          </div>

          {/* Shop */}
          <div>
            <h4 style={{ fontFamily: "var(--serif)", fontSize: 16, fontWeight: 600, marginBottom: 20, color: "white" }}>Shop</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
              {["New Arrivals", "Kurtis", "Co-ord Sets", "Sale", "Gift Cards"].map((l) => (
                <li key={l}><Link href="/shop" className="footer-link">{l}</Link></li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 style={{ fontFamily: "var(--serif)", fontSize: 16, fontWeight: 600, marginBottom: 20, color: "white" }}>Help</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
              <li><Link href="/contact" className="footer-link">Track Order</Link></li>
              <li><Link href="/shipping" className="footer-link">Shipping Info</Link></li>
              <li><Link href="/returns" className="footer-link">Exchange Policy</Link></li>
              <li><Link href="/contact" className="footer-link">Contact Us</Link></li>
            </ul>
          </div>

          {/* Company + Newsletter */}
          <div>
            <h4 style={{ fontFamily: "var(--serif)", fontSize: 16, fontWeight: 600, marginBottom: 20, color: "white" }}>Company</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
              <li><Link href="/about" className="footer-link">About Us</Link></li>
              <li><Link href="/about" className="footer-link">Our Story</Link></li>
              <li><Link href="/privacy" className="footer-link">Privacy Policy</Link></li>
              <li><Link href="/terms" className="footer-link">Terms of Service</Link></li>
            </ul>
            {/* <div style={{ marginTop: 28 }}>
              <h4 style={{ fontFamily: "var(--serif)", fontSize: 16, fontWeight: 600, marginBottom: 12, color: "white" }}>Newsletter</h4>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.06)", color: "white", fontSize: 13 }}
                  placeholder="your@email.com"
                />
                <button style={{ background: "var(--pink)", color: "white", border: "none", borderRadius: 10, padding: "10px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>→</button>
              </div>
            </div> */}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 32, flexWrap: "wrap", gap: 16 }}>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>© 2025 Siyora. Made with ❤️ in India.</p>
          <div style={{ display: "flex", gap: 10 }}>
            {["UPI", "Visa", "RuPay", "Razorpay"].map((p) => (
              <span key={p} className="pay-badge">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

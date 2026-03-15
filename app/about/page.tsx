import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      {/* Dark Hero */}
      <div style={{ background: "linear-gradient(135deg,#180A08 0%,#2D1515 100%)", padding: "120px 5% 100px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", fontFamily: "var(--serif)", fontSize: 320, fontWeight: 700, color: "rgba(255,255,255,0.03)", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
          Siyora
        </div>
        <div style={{ maxWidth: 1400, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <span style={{ fontSize: 10, letterSpacing: "5px", color: "var(--coral)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: 20 }}>Est. 2025</span>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(52px,8vw,100px)", fontWeight: 700, color: "white", lineHeight: 0.9, marginBottom: 24 }}>
            Where <em style={{ color: "var(--pink)", fontStyle: "italic" }}>Siya</em><br />Meets Street
          </h1>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.6)", maxWidth: 560, margin: "0 auto", lineHeight: 1.9, fontWeight: 300 }}>
            The story of a girl who loved Indian fashion so much she decided to share it with the world.
          </p>
        </div>
      </div>

      {/* Story */}
      <section style={{ padding: "100px 5%", maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <span style={{ fontSize: 10, letterSpacing: "5px", color: "var(--pink)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: 16 }}>The Beginning</span>
        <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(36px,5vw,56px)", fontWeight: 700, marginBottom: 28 }}>
          A brand born from <em style={{ color: "var(--pink)", fontStyle: "italic" }}>passion</em>
        </h2>
        <p style={{ fontSize: 16, color: "var(--muted)", lineHeight: 2, marginBottom: 20 }}>
          Siyora started with one simple belief: that every Indian woman deserves to look stunning without compromising comfort or breaking the bank. Founded by Siya, the brand fuses traditional Indian textile heritage with fresh, contemporary silhouettes.
        </p>
        <p style={{ fontSize: 16, color: "var(--muted)", lineHeight: 2, marginBottom: 60 }}>
          Every kurta, every co-ord set we create is designed for real women, real lives — from morning chai to evening celebrations. We work with skilled artisans across India to bring you pieces that tell a story.
        </p>

        {/* Values */}
        <div className="about-values-grid">
          {[["🌿", "Ethical Sourcing", "We partner only with artisans who share our values of fair wages and sustainable practices."], ["💫", "Inclusive Sizing", "Sizes XS to XL because beauty has no size and every woman deserves to feel seen."], ["📦", "Thoughtful Packaging", "100% recyclable packaging because we love this planet as much as we love fashion."]].map(([icon, title, text]) => (
            <div key={title} style={{ background: "white", borderRadius: 24, padding: 36, border: "1px solid var(--border)", transition: "all 0.3s" }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>{icon}</div>
              <div style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 700, marginBottom: 10 }}>{title}</div>
              <div style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.8 }}>{text}</div>
            </div>
          ))}
        </div>

        {/* Numbers */}
        <div className="about-stats-grid">
          {[["500+", "Happy Customers"], ["20+", "Unique Designs"], ["100%", "Handcrafted"], ["4.8★", "Avg Rating"]].map(([num, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "var(--serif)", fontSize: 40, fontWeight: 700, color: "white", lineHeight: 1 }}>{num}</div>
              <div style={{ fontSize: 11, letterSpacing: 2, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", marginTop: 8 }}>{label}</div>
            </div>
          ))}
        </div>

        <Link href="/shop" className="btn-primary">Shop The Collection</Link>
      </section>
    </>
  );
}

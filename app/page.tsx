"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { PRODUCTS, CATEGORIES, TESTIMONIALS } from "@/lib/data";
import { Product } from "@/types";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import { useCart } from "@/context/CartContext";
import { showToast } from "@/components/Toast";

export default function HomePage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const { addToCart } = useCart();

  const filtered =
    activeCategory === "all"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeCategory);

  const handleAddToCart = (product: Product, size: string, colorIdx: number) => {
    addToCart(product, size, colorIdx);
    showToast(`${product.name} added to bag!`);
  };

  return (
    <>
      {/* Background blobs */}
      <div className="hero-blob hero-blob-1" />
      <div className="hero-blob hero-blob-2" />

      {/* ── HERO ─────────────────────────────────────────── */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 5%" }}>
        <div className="hero" style={{ padding: "0", maxWidth: "none" }}>
          <div className="hero-left">
            <div className="hero-eyebrow">New Collection 2026</div>
            <h1 className="hero-title">
              Where <em>Siya</em>
              <br />
              Meets Street
            </h1>
            <p className="hero-subtitle">
              Handcrafted kurtas & co-ord sets that blend traditional Indian
              elegance with modern street style. Wear your story.
            </p>
            <div className="hero-ctas">
              <Link href="/shop" className="btn-primary">Shop Now</Link>
              <Link href="/about" className="btn-outline">Our Story</Link>
            </div>
            <div className="hero-stats">
              {[["500+", "Happy Customers"], ["20+", "Unique Designs"], ["4.8★", "Average Rating"]].map(([num, label]) => (
                <div key={label}>
                  <div className="hero-stat-num">{num}</div>
                  <div className="hero-stat-label">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-right">
            <div className="float-badge float-badge-1">🌸 Just restocked!</div>
            <div className="hero-img-grid">
              {PRODUCTS.slice(0, 3).map((p, i) => {
                const heroImgSrc = p.media?.find((m) => m.type === "image" && m.src)?.src;
                return (
                <div
                  key={p.id}
                  className={`hero-card hero-card-${i + 1}`}
                  style={{ background: p.bgColor }}
                  onClick={() => setSelectedProduct(p)}
                >
                  <div className="hero-card-img">
                    {heroImgSrc ? (
                      <img
                        src={heroImgSrc}
                        alt={p.name}
                        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <span style={{ fontSize: 90 }}>{p.emoji}</span>
                    )}
                  </div>
                  <div className="hero-card-overlay">
                    <div className="hero-card-name">{p.name}</div>
                    <div className="hero-card-price">₹{p.price.toLocaleString()}</div>
                  </div>
                </div>
                );
              })}
            </div>
            <div className="float-badge float-badge-2">⚡ Free shipping ₹999+</div>
          </div>
        </div>
      </div>

      {/* ── SHOP SECTION ─────────────────────────────────── */}
      <section className="section">
        <div className="section-header">
          <span className="section-eyebrow">Curated For You</span>
          <h2 className="section-title">Our <em>Latest</em> Drops</h2>
          <p className="section-sub">From everyday elegance to festive statement pieces — every kurta tells a story.</p>
        </div>
        <div className="cat-filter" style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 52 }}>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              className={`cat-btn ${activeCategory === c.id ? "active" : ""}`}
              onClick={() => setActiveCategory(c.id)}
              style={{ padding: "10px 24px", borderRadius: 50, fontSize: 11, letterSpacing: 2, fontWeight: 600, textTransform: "uppercase", transition: "all 0.25s", border: "1.5px solid var(--border)", background: activeCategory === c.id ? "var(--pink)" : "white", color: activeCategory === c.id ? "white" : "var(--muted)", cursor: "pointer" }}
            >
              {c.label} ({c.count})
            </button>
          ))}
        </div>
        <div className="product-grid">
          {filtered.slice(0, 8).map((p, i) => (
            <ProductCard key={p.id} product={p} delay={i * 0.08} onQuickView={setSelectedProduct} />
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 52 }}>
          <Link href="/shop" className="btn-primary">View All Products</Link>
        </div>
      </section>

      {/* ── STORY ────────────────────────────────────────── */}
      <section className="story-section">
        <div className="story-bg-text">Siyora</div>
        <div className="story-inner">
          <div>
            <p style={{ fontSize: 10, letterSpacing: 5, color: "var(--coral)", textTransform: "uppercase", fontWeight: 600, marginBottom: 20 }}>Our Story</p>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(40px,5vw,64px)", fontWeight: 700, lineHeight: 1, marginBottom: 28, color: "white" }}>
              Born from <em style={{ color: "var(--pink)", fontStyle: "italic" }}>love</em> for Indian fashion
            </h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.65)", lineHeight: 2, marginBottom: 20, fontWeight: 300 }}>
              Siyora was born when Siya realised that Indian women deserve beautiful, wearable fashion that doesn't choose between tradition and trend.
            </p>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.65)", lineHeight: 2, fontWeight: 300 }}>
              We source the finest fabrics, work with skilled artisans, and pour love into every stitch — so you can pour love into every outfit.
            </p>
            <div className="story-values-grid">
              {[["🌿", "Sustainable", "Eco-friendly fabrics & packaging"], ["✋", "Handcrafted", "Artisan made with care"], ["💎", "Quality First", "Premium materials, fair pricing"], ["🚀", "Fast Shipping", "Pan-India via Shiprocket"]].map(([icon, title, text]) => (
                <div key={title} className="story-value">
                  <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
                  <div style={{ fontFamily: "var(--serif)", fontSize: 18, fontWeight: 600, marginBottom: 6, color: "white" }}>{title}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>{text}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="story-visual">
            <div className="story-cards">
              {PRODUCTS.slice(4, 8).map((p) => (
                <div key={p.id} className="story-card" style={{ background: p.bgColor }}>
                  <img  src={p?.media?.[0]?.src || ""} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PROCESS ──────────────────────────────────────── */}
      <section className="process-section">
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div className="section-header">
            <span className="section-eyebrow">The Siyora Way</span>
            <h2 className="section-title">From us to <em>you</em></h2>
          </div>
          <div className="process-grid">
            {[["🛍️", "Browse & Choose", "Explore our curated collection and find your perfect piece"], ["📦", "Place Your Order", "Secure checkout with Razorpay — UPI, Cards, Netbanking, COD"], ["✉️", "Get Confirmed", "Instant order confirmation email with all your details"], ["🚀", "We Ship Fast", "Dispatched within 24-48 hrs via Shiprocket, tracked to your door"]].map(([icon, title, text], i) => (
              <div key={title} className="process-step">
                <div className="step-num">{i + 1}</div>
                <span style={{ fontSize: 44, marginBottom: 20, display: "block" }}>{icon}</span>
                <div style={{ fontFamily: "var(--serif)", fontSize: 20, fontWeight: 700, marginBottom: 10 }}>{title}</div>
                <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.8 }}>{text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────── */}
      <section className="section">
        <div className="section-header">
          <span className="section-eyebrow">Love Notes</span>
          <h2 className="section-title">What our <em>girls</em> say</h2>
        </div>
        <div className="testimonials-grid">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="testi-card" style={{ transitionDelay: `${i * 0.15}s` }}>
              <div style={{ color: "#F59E0B", fontSize: 16, letterSpacing: 2, marginBottom: 20 }}>{"★".repeat(t.rating)}</div>
              <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.8, fontStyle: "italic", marginBottom: 24, position: "relative", zIndex: 1 }}>
                {t.text}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div className="testi-avatar">{t.name[0]}</div>
                <div>
                  <div style={{ fontFamily: "var(--serif)", fontSize: 17, fontWeight: 600 }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: 1 }}>{t.city}</div>
                  <div style={{ fontSize: 10, letterSpacing: 2, color: "var(--pink)", textTransform: "uppercase", fontWeight: 600, marginTop: 4 }}>{t.product}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BANNER ───────────────────────────────────────── */}
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div className="banner-section">
          <div style={{ position: "relative", zIndex: 1 }}>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(36px,5vw,56px)", fontWeight: 700, color: "white", lineHeight: 1.05, marginBottom: 12 }}>
              New arrivals<br />every Month
            </h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.8)", fontWeight: 300 }}>
              Follow us on Instagram for first looks & exclusive drops
            </p>
          </div>
          <Link href="/shop" className="banner-cta">Shop New Arrivals</Link>
        </div>
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
}

"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PRODUCTS } from "@/lib/data";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { showToast } from "@/components/Toast";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";

// ─── Media Viewer ────────────────────────────────────────────────────────────
function MediaViewer({ product }: { product: Product }) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const imgRef = useRef<HTMLDivElement>(null);

  const current = product.media[active];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="media-viewer-sticky" style={{ position: "sticky", top: 90 }}>
      {/* Main viewer */}
      <div
        ref={imgRef}
        onMouseEnter={() => current.type === "image" && setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
        onMouseMove={handleMouseMove}
        style={{
          background: current.bg,
          borderRadius: 24,
          aspectRatio: "4/5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          cursor: current.type === "image" ? "zoom-in" : "default",
          border: "1px solid var(--border)",
        }}
      >
        {current.type === "video" ? (
          /* ── VIDEO ── */
          <div style={{ width: "100%", height: "100%", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {current.src ? (
              <video
                controls
                autoPlay={false}
                poster={current.poster}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              >
                <source src={current.src} type="video/mp4" />
              </video>
            ) : (
              /* Placeholder for when you haven't uploaded a video yet */
              <div style={{ textAlign: "center", color: "rgba(255,255,255,0.7)" }}>
                <div style={{ fontSize: 72, marginBottom: 20 }}>🎬</div>
                <div style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 600, marginBottom: 8 }}>Video Coming Soon</div>
                <div style={{ fontSize: 13, opacity: 0.6 }}>Upload your video to<br /><code style={{ background: "rgba(255,255,255,0.1)", padding: "2px 8px", borderRadius: 4 }}>public/videos/product-{product.id}.mp4</code></div>
              </div>
            )}
          </div>
        ) : (
          /* ── IMAGE ── */
          <>
            {current.src ? (
              <img
                src={current.src}
                alt={current.alt}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.1s ease",
                  transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                  transform: zoomed ? "scale(2)" : "scale(1)",
                }}
              />
            ) : (
              /* Emoji placeholder */
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                <span style={{
                  fontSize: 180,
                  transition: "transform 0.3s ease",
                  display: "block",
                  transform: zoomed ? "scale(1.1)" : "scale(1)",
                }}>
                  {current.emoji}
                </span>
                <div style={{ position: "absolute", bottom: 16, left: 16, right: 16, background: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)", borderRadius: 10, padding: "10px 14px", fontSize: 11, color: "var(--muted)", textAlign: "center", letterSpacing: 1 }}>
                  📸 Replace with real product photo in <code>public/images/</code>
                </div>
              </div>
            )}
          </>
        )}

        {/* Slide navigation arrows */}
        {product.media.length > 1 && (
          <>
            <button
              onClick={() => setActive((a) => (a - 1 + product.media.length) % product.media.length)}
              style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.9)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, boxShadow: "0 4px 15px rgba(0,0,0,0.1)", backdropFilter: "blur(8px)", transition: "all 0.2s" }}
            >‹</button>
            <button
              onClick={() => setActive((a) => (a + 1) % product.media.length)}
              style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.9)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, boxShadow: "0 4px 15px rgba(0,0,0,0.1)", backdropFilter: "blur(8px)", transition: "all 0.2s" }}
            >›</button>
          </>
        )}

        {/* Badge */}
        <div style={{ position: "absolute", top: 16, left: 16, background: "var(--pink)", color: "white", fontSize: 9, letterSpacing: 2, padding: "5px 14px", borderRadius: 50, fontWeight: 600, textTransform: "uppercase" }}>
          {product.tag}
        </div>

        {/* Media type indicator */}
        {current.type === "video" && (
          <div style={{ position: "absolute", top: 16, right: 16, background: "rgba(0,0,0,0.6)", color: "white", fontSize: 10, letterSpacing: 1.5, padding: "5px 12px", borderRadius: 50, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
            ▶ VIDEO
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {product.media.length > 1 && (
        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          {product.media.map((m, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                flex: 1,
                aspectRatio: "1",
                borderRadius: 14,
                border: `2.5px solid ${active === i ? "var(--pink)" : "transparent"}`,
                background: m.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                overflow: "hidden",
                transition: "all 0.2s",
                padding: 0,
                outline: "none",
                position: "relative",
              }}
            >
              {m.src && m.type === "image" ? (
                <img src={m.src} alt={m.alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <span style={{ fontSize: 28 }}>{m.emoji}</span>
              )}
              {m.type === "video" && (
                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 16 }}>▶</div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Hover zoom hint */}
      {current.type === "image" && !zoomed && (
        <p style={{ textAlign: "center", fontSize: 11, color: "var(--muted)", marginTop: 10, letterSpacing: 1 }}>
          🔍 Hover to zoom
        </p>
      )}
    </div>
  );
}

// ─── Size Guide Modal ─────────────────────────────────────────────────────────
function SizeGuide({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 500, backdropFilter: "blur(4px)" }} />
      <div style={{ position: "fixed", left: "50%", top: "50%", transform: "translate(-50%,-50%)", background: "white", borderRadius: 24, padding: 40, zIndex: 501, width: "min(600px,95vw)", maxHeight: "80vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 28 }}>
          <h3 style={{ fontFamily: "var(--serif)", fontSize: 28, fontWeight: 700 }}>Size Guide</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "var(--muted)" }}>✕</button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ background: "var(--blush)" }}>
              {["Size", "Bust (in)", "Waist (in)", "Hip (in)",].map((h) => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "var(--muted)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[["XS", "32-33", "26-28", "36-38",], ["S", "34-35","28-30","38-40"], ["M", "36-37","30-32","40-42"], ["L", "38-39","34-36","42-44"], ["XL", "40-42","38-40","44-46"]].map(([size, ...vals], i) => (
              <tr key={size} style={{ borderBottom: "1px solid var(--border)", background: i % 2 === 0 ? "white" : "var(--cream)" }}>
                <td style={{ padding: "12px 16px", fontWeight: 700, color: "var(--pink)" }}>{size}</td>
                {vals.map((v, j) => <td key={j} style={{ padding: "12px 16px", color: "var(--dark)" }}>{v}"</td>)}
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 20, lineHeight: 1.8 }}>
          💡 <strong>Tip:</strong> If you're between sizes, we recommend sizing up for a more relaxed fit, or sizing down for a fitted look. All measurements are in inches.
        </p>
      </div>
    </>
  );
}

// ─── Reviews Section ──────────────────────────────────────────────────────────
function ReviewsSection({ product }: { product: Product }) {
  const reviews = product.reviewsList ?? [];

  const ratingDist = [5, 4, 3, 2, 1];
  const counts = [70, 20, 6, 3, 1];

  return (
    <div style={{ marginTop: 80, paddingTop: 60, borderTop: "1px solid var(--border)" }}>
      <h2 style={{ fontFamily: "var(--serif)", fontSize: 36, fontWeight: 700, marginBottom: 40 }}>
        Customer Reviews
      </h2>
      <div className="reviews-grid">
        {/* Summary */}
        <div style={{ background: "var(--blush)", borderRadius: 24, padding: 32, textAlign: "center" }}>
          <div style={{ fontFamily: "var(--serif)", fontSize: 72, fontWeight: 700, color: "var(--dark)", lineHeight: 1 }}>{product.rating}</div>
          <div style={{ color: "#F59E0B", fontSize: 24, margin: "8px 0" }}>{"★".repeat(Math.floor(product.rating))}</div>
          <div style={{ fontSize: 13, color: "var(--muted)" }}>{product.reviews} reviews</div>
          <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 8 }}>
            {ratingDist.map((r, i) => (
              <div key={r} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 12, color: "var(--muted)", width: 8 }}>{r}</span>
                <span style={{ color: "#F59E0B", fontSize: 12 }}>★</span>
                <div style={{ flex: 1, height: 6, background: "rgba(0,0,0,0.08)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: `${counts[i]}%`, height: "100%", background: "var(--pink)", borderRadius: 3 }} />
                </div>
                <span style={{ fontSize: 12, color: "var(--muted)", width: 24 }}>{counts[i]}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {reviews.map((r, i) => (
            <div key={i} style={{ background: "white", borderRadius: 20, padding: 28, border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,var(--pink),var(--coral))", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontFamily: "var(--serif)", fontSize: 16, fontWeight: 700 }}>{r.name[0]}</div>
                    <span style={{ fontWeight: 600, fontSize: 15 }}>{r.name}</span>
                    <span style={{ fontSize: 12, color: "var(--muted)" }}>{r.city}</span>
                  </div>
                  <div style={{ color: "#F59E0B", fontSize: 14 }}>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>{r.date}</div>
                </div>
              </div>
              <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.8 }}>{r.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ProductPage({ params }: { params: { id: string } }) {
  const product = PRODUCTS.find((p) => p.id === Number(params.id));
  if (!product) return notFound();

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(0);
  const [qty, setQty] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useCart();

  const discount =
    product.originalPrice > product.price
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : 0;

  const related = PRODUCTS.filter(
    (p) => p.id !== product.id && p.category === product.category
  ).slice(0, 4);

  const handleAdd = () => {
    const size = selectedSize || product.sizes[1] || "M";
    for (let i = 0; i < qty; i++) {
      addToCart(product, size, selectedColor);
    }
    showToast(`${product.name} added to bag!`);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <>
      {/* Breadcrumb */}
      <div style={{ padding: "20px 5%", maxWidth: 1400, margin: "0 auto", fontSize: 12, color: "var(--muted)", display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <Link href="/" style={{ color: "var(--muted)", transition: "color 0.2s" }}>Home</Link>
        <span style={{ opacity: 0.4 }}>›</span>
        <Link href="/shop" style={{ color: "var(--muted)", transition: "color 0.2s" }}>Shop</Link>
        <span style={{ opacity: 0.4 }}>›</span>
        <Link href={`/shop?category=${product.category}`} style={{ color: "var(--muted)", textTransform: "capitalize" }}>{product.category}</Link>
        <span style={{ opacity: 0.4 }}>›</span>
        <span style={{ color: "var(--dark)", fontWeight: 600 }}>{product.name}</span>
      </div>

      {/* Main content */}
      <section style={{ padding: "10px 5% 80px", maxWidth: 1400, margin: "0 auto" }}>
        <div className="product-detail-grid">

          {/* LEFT: Media Gallery */}
          <MediaViewer product={product} />

          {/* RIGHT: Product Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24, paddingTop: 10 }}>

            {/* Tag + Name */}
            <div>
              <span style={{ background: "var(--pink)", color: "white", fontSize: 9, letterSpacing: 2, padding: "5px 14px", borderRadius: 50, fontWeight: 600, textTransform: "uppercase", display: "inline-block", marginBottom: 14 }}>
                {product.tag}
              </span>
              <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(30px,3.5vw,46px)", fontWeight: 700, lineHeight: 1.05, color: "var(--dark)" }}>
                {product.name}
              </h1>
            </div>

            {/* Rating */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: 2 }}>
                {[1,2,3,4,5].map((s) => (
                  <span key={s} style={{ color: s <= Math.floor(product.rating) ? "#F59E0B" : "#DDD", fontSize: 18 }}>★</span>
                ))}
              </div>
              <span style={{ fontFamily: "var(--serif)", fontSize: 18, fontWeight: 700 }}>{product.rating}</span>
              <span style={{ fontSize: 14, color: "var(--muted)" }}>({product.reviews} reviews)</span>
              <a href="#reviews" style={{ fontSize: 13, color: "var(--pink)", fontWeight: 600 }}>Read all →</a>
            </div>

            {/* Price */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <span style={{ fontFamily: "var(--serif)", fontSize: "clamp(32px, 5vw, 44px)", fontWeight: 700, color: "var(--dark)" }}>
                ₹{product.price.toLocaleString()}
              </span>
              {discount > 0 && (
                <>
                  <span style={{ fontSize: 22, color: "var(--muted)", textDecoration: "line-through" }}>
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                  <span style={{ background: "rgba(255,107,91,0.12)", color: "var(--coral)", fontSize: 13, padding: "5px 14px", borderRadius: 50, fontWeight: 700 }}>
                    {discount}% OFF
                  </span>
                </>
              )}
            </div>
            <p style={{ fontSize: 12, color: "var(--muted)", marginTop: -16 }}>Inclusive of all taxes. Free shipping above ₹999.</p>

            <div style={{ height: 1, background: "var(--border)" }} />

            {/* Short description */}
            <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.9 }}>{product.description}</p>

            {/* Colour */}
            <div>
              <p style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "var(--muted)", fontWeight: 600, marginBottom: 12 }}>
                Colour — <span style={{ color: "var(--dark)", textTransform: "none", letterSpacing: 0 }}>Option {selectedColor + 1}</span>
              </p>
              <div style={{ display: "flex", gap: 12 }}>
                {product.colors.map((c, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedColor(i)}
                    title={`Colour ${i + 1}`}
                    style={{
                      width: 36, height: 36, borderRadius: "50%", background: c,
                      border: "3px solid white",
                      boxShadow: selectedColor === i ? "0 0 0 3px var(--pink)" : "0 0 0 1.5px rgba(0,0,0,0.12)",
                      cursor: "pointer", transition: "all 0.25s",
                      transform: selectedColor === i ? "scale(1.15)" : "scale(1)",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Size */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <p style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "var(--muted)", fontWeight: 600 }}>
                  Select Size {selectedSize && <span style={{ color: "var(--dark)", textTransform: "none", letterSpacing: 0 }}>— {selectedSize}</span>}
                </p>
                <button onClick={() => setSizeGuideOpen(true)} style={{ background: "none", border: "none", color: "var(--pink)", fontSize: 13, cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                  📏 Size Guide
                </button>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    style={{
                      padding: "12px 20px", borderRadius: 10,
                      border: `1.5px solid ${selectedSize === s ? "var(--dark)" : "var(--border)"}`,
                      fontSize: 13, fontWeight: 600, cursor: "pointer",
                      background: selectedSize === s ? "var(--dark)" : "white",
                      color: selectedSize === s ? "white" : "var(--dark)",
                      transition: "all 0.2s",
                      transform: selectedSize === s ? "translateY(-2px)" : "none",
                      boxShadow: selectedSize === s ? "0 4px 15px rgba(0,0,0,0.12)" : "none",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Qty */}
            <div>
              <p style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "var(--muted)", fontWeight: 600, marginBottom: 12 }}>Quantity</p>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 0, background: "white", border: "1.5px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ padding: "12px 20px", background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "var(--muted)", transition: "background 0.2s" }}>−</button>
                <span style={{ fontFamily: "var(--serif)", fontSize: 20, fontWeight: 700, minWidth: 48, textAlign: "center", borderLeft: "1px solid var(--border)", borderRight: "1px solid var(--border)", padding: "12px 0" }}>{qty}</span>
                <button onClick={() => setQty(qty + 1)} style={{ padding: "12px 20px", background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "var(--muted)", transition: "background 0.2s" }}>+</button>
              </div>
            </div>

            {/* Add to cart + Buy now */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button
                onClick={product.outOfStock ? undefined : handleAdd}
                disabled={!!product.outOfStock}
                style={{
                  flex: 1,
                  background: product.outOfStock ? "#D1D5DB" : addedToCart ? "#22C55E" : "var(--pink)",
                  color: product.outOfStock ? "#9CA3AF" : "white", padding: "18px 32px", borderRadius: 14,
                  fontSize: 12, letterSpacing: "2.5px", fontWeight: 700, textTransform: "uppercase",
                  border: "none", cursor: product.outOfStock ? "not-allowed" : "pointer", transition: "all 0.3s",
                  transform: addedToCart ? "none" : undefined,
                  boxShadow: product.outOfStock ? "none" : "0 8px 30px rgba(233,30,140,0.25)",
                }}
              >
                {product.outOfStock ? "Out of Stock" : addedToCart ? "✓ Added to Bag!" : `Add to Bag — ₹${(product.price * qty).toLocaleString()}`}
              </button>
              <Link
                href="/checkout"
                style={{
                  background: "var(--dark)", color: "white", padding: "18px 28px",
                  borderRadius: 14, fontSize: 12, letterSpacing: "2px",
                  fontWeight: 700, textTransform: "uppercase", whiteSpace: "nowrap",
                  display: "flex", alignItems: "center",
                }}
              >
                Buy Now
              </Link>
            </div>

            {/* Trust badges */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[["🚀", "Ships in 6-7 Days", "via Shiprocket"], ["🔒", "Secure payments", "via Razorpay"], ["🏆", "Authentic quality", "Guaranteed"], ["📦", "All sales final", "No returns"]].map(([icon, title, sub]) => (
                <div key={title} style={{ display: "flex", gap: 12, alignItems: "center", background: "white", borderRadius: 12, padding: "14px 16px", border: "1px solid var(--border)" }}>
                  <span style={{ fontSize: 22 }}>{icon}</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--dark)" }}>{title}</div>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>{sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Accordion: Description / Fabric / Shipping */}
            <ProductAccordion product={product} />
          </div>
        </div>

        {/* Reviews */}
        <div id="reviews">
          <ReviewsSection product={product} />
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div style={{ marginTop: 80, paddingTop: 60, borderTop: "1px solid var(--border)" }}>
            <div className="section-header" style={{ marginBottom: 40 }}>
              <span className="section-eyebrow">You May Also Like</span>
              <h2 className="section-title">More <em>beautiful</em> pieces</h2>
            </div>
            <div className="product-grid">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} delay={i * 0.08} onQuickView={setModalProduct} />
              ))}
            </div>
          </div>
        )}
      </section>

      {sizeGuideOpen && <SizeGuide onClose={() => setSizeGuideOpen(false)} />}
      {modalProduct && <ProductModal product={modalProduct} onClose={() => setModalProduct(null)} />}
    </>
  );
}

// ─── Accordion ───────────────────────────────────────────────────────────────
function ProductAccordion({ product }: { product: Product }) {
  const [open, setOpen] = useState<string | null>("description");

  const sections = [
    {
      id: "description",
      title: "📖 Full Description",
      content: (
        <div>
          {product.longDescription?.split("\n\n").map((para, i) => (
            <p key={i} style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.9, marginBottom: 14 }}>{para}</p>
          ))}
          {product.highlights && (
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8, marginTop: 16 }}>
              {product.highlights.map((h) => (
                <li key={h} style={{ fontSize: 14, color: "var(--dark)", display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ color: "var(--pink)", fontWeight: 700 }}>✦</span> {h}
                </li>
              ))}
            </ul>
          )}
        </div>
      ),
    },
    {
      id: "fabric",
      title: "🪡 Fabric & Care",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[["Fabric", product.fabric], ["Care Instructions", product.care]].map(([label, val]) => (
            <div key={label}>
              <div style={{ fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--muted)", fontWeight: 600, marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 14, color: "var(--dark)", lineHeight: 1.7 }}>{val}</div>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "shipping",
      title: "📦 Shipping & Returns",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 14, fontSize: 14, color: "var(--muted)", lineHeight: 1.8 }}>
          <div>🚀 <strong style={{ color: "var(--dark)" }}>Delivery:</strong> {product.deliveryDays} business days via Shiprocket. Free shipping on orders above ₹999.</div>
          <div>📦 <strong style={{ color: "var(--dark)" }}>Dispatch:</strong> Orders are dispatched within 3-4 days of placement.</div>
          <div>📍 <strong style={{ color: "var(--dark)" }}>Ships to:</strong> All of India. International shipping coming soon.</div>
          <div style={{ background: "rgba(239,68,68,0.06)", borderRadius: 10, padding: "12px 14px", border: "1px solid rgba(239,68,68,0.15)" }}>
            ⚠ <strong style={{ color: "var(--dark)" }}>Returns &amp; Exchanges:</strong> We currently do not support returns . Please review your size carefully before ordering. Exchanges allowed only if product is defective.
          </div>
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 8 }}>
      {sections.map((s) => (
        <div key={s.id} style={{ border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
          <button
            onClick={() => setOpen(open === s.id ? null : s.id)}
            style={{ width: "100%", padding: "18px 20px", background: open === s.id ? "var(--blush)" : "white", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: 600, fontSize: 14, color: "var(--dark)", transition: "background 0.2s" }}
          >
            {s.title}
            <span style={{ fontSize: 18, transform: open === s.id ? "rotate(180deg)" : "none", transition: "transform 0.3s", color: "var(--pink)" }}>⌄</span>
          </button>
          {open === s.id && (
            <div style={{ padding: "4px 20px 20px", background: open === s.id ? "var(--blush)" : "white" }}>
              {s.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

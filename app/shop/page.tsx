"use client";
import { useState } from "react";
import { PRODUCTS, CATEGORIES } from "@/lib/data";
import { Product } from "@/types";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [sort, setSort] = useState("default");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  let filtered =
    activeCategory === "all"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeCategory);

  if (sort === "low") filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sort === "high") filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sort === "popular") filtered = [...filtered].sort((a, b) => b.reviews - a.reviews);
  if (sort === "rated") filtered = [...filtered].sort((a, b) => b.rating - a.rating);

  return (
    <>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg,#FFF0E8,#FFE8F0)", padding: "80px 5% 70px" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <span style={{ fontSize: 10, letterSpacing: "5px", color: "var(--pink)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: 12 }}>
            The Collection
          </span>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(48px,7vw,80px)", fontWeight: 700, lineHeight: 1 }}>
            Shop <em style={{ color: "var(--pink)", fontStyle: "italic" }}>Siyora</em>
          </h1>
          <p style={{ fontSize: 15, color: "var(--muted)", marginTop: 14, fontWeight: 300 }}>
            {filtered.length} styles crafted for the modern Indian woman
          </p>
        </div>
      </div>

      <section className="section">
        {/* Filter + Sort bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                style={{
                  padding: "10px 24px",
                  borderRadius: 50,
                  fontSize: 11,
                  letterSpacing: 2,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  border: `1.5px solid ${activeCategory === c.id ? "var(--pink)" : "var(--border)"}`,
                  background: activeCategory === c.id ? "var(--pink)" : "white",
                  color: activeCategory === c.id ? "white" : "var(--muted)",
                  cursor: "pointer",
                  transition: "all 0.25s",
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
          <select
            className="form-input form-select"
            style={{ width: 220 }}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="default">Sort: Featured</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
            <option value="popular">Most Popular</option>
            <option value="rated">Highest Rated</option>
          </select>
        </div>

        {/* Grid */}
        <div className="product-grid">
          {filtered.map((p, i) => (
            <ProductCard
              key={p.id}
              product={p}
              delay={i * 0.06}
              onQuickView={setSelectedProduct}
            />
          ))}
        </div>
      </section>

      {/* Modal */}
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </>
  );
}

"use client";
import Link from "next/link";
import { Product } from "@/types";

interface Props {
  product: Product;
  onQuickView: (product: Product) => void;
  delay?: number;
}

export default function ProductCard({ product, onQuickView, delay = 0 }: Props) {
  const discount =
    product.originalPrice > product.price
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : 0;

  const tagClass: Record<string, string> = {
    SALE: "sale",
    BESTSELLER: "bestseller",
    TRENDING: "trending",
  };

  const firstImageSrc = product.media?.find((m) => m.type === "image" && m.src)?.src;

  return (
    <div className="p-card fade-in visible" style={{ transitionDelay: `${delay}s` }}>
      {/* Image — clicking opens full product page */}
      <Link href={`/product/${product.id}`} style={{ display: "block", textDecoration: "none" }}>
        <div className="p-card-img" style={{ background: product.bgColor }}>
          {firstImageSrc ? (
            <img
              src={firstImageSrc}
              alt={product.name}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: product.outOfStock ? 0.55 : 1 }}
            />
          ) : (
            <span className="p-card-emoji" style={{ opacity: product.outOfStock ? 0.55 : 1 }}>{product.emoji}</span>
          )}
          <span className={`p-card-tag ${tagClass[product.tag] || ""}`}>{product.tag}</span>
          {product.outOfStock && (
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{
                background: "rgba(20,20,20,0.72)",
                color: "white",
                fontSize: 10,
                letterSpacing: "3px",
                fontWeight: 700,
                textTransform: "uppercase",
                padding: "8px 18px",
                borderRadius: 50,
                backdropFilter: "blur(4px)",
              }}>
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Wishlist button */}
      <button
        className="p-card-wish"
        onClick={(e) => e.stopPropagation()}
        aria-label="Wishlist"
        style={{ position: "absolute", top: 14, right: 14 }}
      >
        ♡
      </button>

      {/* Quick view button */}
      <button
        className="p-card-quick"
        onClick={(e) => {
          e.stopPropagation();
          onQuickView(product);
        }}
      >
        Quick View
      </button>

      {/* Body */}
      <div className="p-card-body">
        <Link href={`/product/${product.id}`} style={{ textDecoration: "none", color: "inherit" }}>
          <div className="p-card-name">{product.name}</div>
        </Link>
        <div className="p-card-rating">
          <span className="stars">
            {"★".repeat(Math.floor(product.rating))}
            {"☆".repeat(5 - Math.floor(product.rating))}
          </span>
          <span className="rating-count">({product.reviews})</span>
        </div>
        <div className="p-card-prices">
          <span className="p-card-price">₹{product.price.toLocaleString()}</span>
          {discount > 0 && (
            <>
              <span className="p-card-original">₹{product.originalPrice.toLocaleString()}</span>
              <span className="p-card-discount">-{discount}%</span>
            </>
          )}
        </div>
        <div className="p-card-colors">
          {product.colors.map((c, i) => (
            <div key={i} className="color-dot" style={{ background: c }} />
          ))}
        </div>
      </div>
    </div>
  );
}

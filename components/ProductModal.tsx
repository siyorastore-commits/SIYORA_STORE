"use client";
import { useState } from "react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";

interface Props {
  product: Product | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: Props) {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(0);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  if (!product) return null;

  const firstImageSrc = product.media?.find((m) => m.type === "image" && m.src)?.src;

  const discount =
    product.originalPrice > product.price
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : 0;

  const handleAdd = () => {
    addToCart(product, selectedSize || product.sizes[1] || "M", selectedColor);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <>
      <div className="modal-overlay open" onClick={onClose} />
      <div className="modal open">
        {/* Image */}
        <div
          style={{
            background: product.bgColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "clamp(90px, 18vw, 150px)",
            position: "relative",
            minHeight: "clamp(240px, 40vw, 400px)",
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              zIndex: 10,
              border: "none",
            }}
          >
            ✕
          </button>
          {firstImageSrc ? (
            <img
              src={firstImageSrc}
              alt={product.name}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            product.emoji
          )}
        </div>

        {/* Info */}
        <div style={{ padding: "48px 40px", display: "flex", flexDirection: "column", gap: 16, overflowY: "auto" }}>
          <span
            style={{
              background: "var(--pink)",
              color: "white",
              fontSize: 9,
              letterSpacing: 2,
              padding: "5px 14px",
              borderRadius: 50,
              fontWeight: 600,
              textTransform: "uppercase",
              display: "inline-block",
              width: "fit-content",
            }}
          >
            {product.tag}
          </span>

          <h2 style={{ fontFamily: "var(--serif)", fontSize: 36, fontWeight: 700, color: "var(--dark)", lineHeight: 1.1 }}>
            {product.name}
          </h2>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#F59E0B" }}>{"★".repeat(Math.floor(product.rating))}</span>
            <span style={{ fontSize: 13, color: "var(--muted)" }}>
              {product.rating} ({product.reviews} reviews)
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontFamily: "var(--serif)", fontSize: 36, fontWeight: 700 }}>
              ₹{product.price.toLocaleString()}
            </span>
            {discount > 0 && (
              <>
                <span style={{ fontSize: 18, color: "var(--muted)", textDecoration: "line-through" }}>
                  ₹{product.originalPrice.toLocaleString()}
                </span>
                <span style={{ background: "rgba(255,107,91,0.1)", color: "var(--coral)", fontSize: 12, padding: "4px 12px", borderRadius: 50, fontWeight: 600 }}>
                  Save {discount}%
                </span>
              </>
            )}
          </div>

          <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.9 }}>{product.description}</p>

          {/* Size */}
          <div>
            <p style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "var(--muted)", fontWeight: 600, marginBottom: 8 }}>
              Select Size
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 8,
                    border: `1.5px solid ${selectedSize === s ? "var(--dark)" : "var(--border)"}`,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    background: selectedSize === s ? "var(--dark)" : "white",
                    color: selectedSize === s ? "white" : "var(--dark)",
                    transition: "all 0.2s",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div>
            <p style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "var(--muted)", fontWeight: 600, marginBottom: 8 }}>
              Colour
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              {product.colors.map((c, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedColor(i)}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: c,
                    border: "3px solid white",
                    boxShadow: selectedColor === i ? "0 0 0 3px var(--pink)" : "0 0 0 1.5px rgba(0,0,0,0.1)",
                    cursor: "pointer",
                    transition: "all 0.25s",
                  }}
                />
              ))}
            </div>
          </div>

          <p style={{ fontSize: 13, color: "var(--muted)" }}>
            <strong style={{ fontWeight: 600 }}>Fabric:</strong> {product.fabric}&nbsp;|&nbsp;
            <strong style={{ fontWeight: 600 }}>Care:</strong> {product.care}
          </p>

          <button
            onClick={product.outOfStock ? undefined : handleAdd}
            disabled={!!product.outOfStock}
            style={{
              background: product.outOfStock ? "#D1D5DB" : added ? "#22C55E" : "var(--pink)",
              color: product.outOfStock ? "#9CA3AF" : "white",
              padding: "18px 32px",
              borderRadius: 14,
              fontSize: 12,
              letterSpacing: 2,
              fontWeight: 600,
              textTransform: "uppercase",
              transition: "all 0.3s",
              border: "none",
              cursor: product.outOfStock ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              marginTop: 8,
            }}
          >
            {product.outOfStock ? "Out of Stock" : added ? "✓ Added to Bag!" : "Add to Bag"}
          </button>
        </div>
      </div>
    </>
  );
}

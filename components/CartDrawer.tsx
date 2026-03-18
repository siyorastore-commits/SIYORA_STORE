"use client";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const { cartItems, isCartOpen, setCartOpen, removeFromCart, updateQty, cartTotal } = useCart();
  const freeShipping = cartTotal >= 999;
  const shipping = freeShipping ? 0 : 60;

  return (
    <>
      <div className={`cart-overlay ${isCartOpen ? "open" : ""}`} onClick={() => setCartOpen(false)} />
      <div className={`cart-drawer ${isCartOpen ? "open" : ""}`}>
        {/* Header */}
        <div style={{ padding: "28px 28px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: 26, fontWeight: 700 }}>
            Your Bag{" "}
            {cartItems.length > 0 && (
              <span style={{ fontSize: 14, color: "var(--muted)", fontFamily: "var(--sans)", fontWeight: 400 }}>
                ({cartItems.length})
              </span>
            )}
          </h2>
          <button onClick={() => setCartOpen(false)} style={{ background: "none", border: "none", fontSize: 20, color: "var(--muted)", cursor: "pointer", padding: 8 }}>
            ✕
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 28px" }}>
          {cartItems.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center", gap: 16 }}>
              <span style={{ fontSize: 64, opacity: 0.4 }}>🛍️</span>
              <div style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 600 }}>Your bag is empty</div>
              <p style={{ fontSize: 14, color: "var(--muted)" }}>Add some beautiful pieces!</p>
              <button className="btn-primary" onClick={() => setCartOpen(false)}>Continue Shopping</button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.cartId} style={{ display: "flex", gap: 16, padding: "18px 0", borderBottom: "1px solid var(--border)", alignItems: "flex-start" }}>
                <div style={{ width: 80, height: 100, borderRadius: 12, background: item.bgColor, overflow: "hidden", flexShrink: 0 }}>
                  {item.media?.[0]?.src ? (
                    <img src={item.media[0].src} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>{item.emoji}</div>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "var(--serif)", fontSize: 17, fontWeight: 600, marginBottom: 4 }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 10 }}>
                    {item.selectedSize && `Size: ${item.selectedSize}`}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <button
                      onClick={() => updateQty(item.cartId, -1)}
                      style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid var(--border)", background: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 14 }}
                    >−</button>
                    <span style={{ fontSize: 15, fontWeight: 600, minWidth: 20, textAlign: "center" }}>{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.cartId, 1)}
                      style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid var(--border)", background: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 14 }}
                    >+</button>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                  <span style={{ fontFamily: "var(--serif)", fontSize: 18, fontWeight: 700 }}>
                    ₹{(item.price * item.qty).toLocaleString()}
                  </span>
                  <button onClick={() => removeFromCart(item.cartId)} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 16 }}>🗑</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div style={{ padding: "20px 28px 28px", borderTop: "1px solid var(--border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1 }}>Subtotal</span>
              <span style={{ fontFamily: "var(--serif)", fontSize: 24, fontWeight: 700 }}>₹{cartTotal.toLocaleString()}</span>
            </div>
            <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 20 }}>
              {freeShipping ? (
                <span style={{ color: "var(--coral)", fontWeight: 600 }}>✓ You've unlocked free shipping!</span>
              ) : (
                <>Add <span style={{ color: "var(--coral)", fontWeight: 600 }}>₹{(999 - cartTotal).toLocaleString()}</span> more for free shipping</>
              )}
            </p>
            <Link
              href="/checkout"
              onClick={() => setCartOpen(false)}
              style={{
                display: "block",
                width: "100%",
                background: "var(--pink)",
                color: "white",
                padding: 18,
                borderRadius: 16,
                fontSize: 12,
                letterSpacing: "2.5px",
                fontWeight: 600,
                textTransform: "uppercase",
                textAlign: "center",
                transition: "all 0.3s",
              }}
            >
              Proceed to Checkout →
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

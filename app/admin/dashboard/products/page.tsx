"use client";
import { useEffect, useState } from "react";

interface AdminProduct {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  category: string;
  tag: string;
  media: string;
  outOfStock: boolean;
  hidden: boolean;
  priceOverride: number | null;
  tagOverride: string | null;
  quantity: number | null;
}

export default function ProductsAdmin() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [priceEdits, setPriceEdits] = useState<Record<string, string>>({});
  const [tagEdits, setTagEdits] = useState<Record<string, string>>({});
  const [qtyEdits, setQtyEdits] = useState<Record<string, string>>({});

  async function loadProducts() {
    setLoading(true);
    const r = await fetch("/api/admin/products", { cache: "no-store" });
    const d = await r.json();
    setProducts(d.products || []);
    const prices: Record<string, string> = {};
    const tags: Record<string, string> = {};
    const qtys: Record<string, string> = {};
    (d.products || []).forEach((p: AdminProduct) => {
      prices[p.id] = p.priceOverride != null ? String(p.priceOverride) : "";
      tags[p.id] = p.tagOverride || "";
      qtys[p.id] = p.quantity != null ? String(p.quantity) : "";
    });
    setPriceEdits(prices);
    setTagEdits(tags);
    setQtyEdits(qtys);
    setLoading(false);
  }

  useEffect(() => {
    loadProducts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function saveProduct(p: AdminProduct) {
    setSaving(String(p.id));
    const priceVal = priceEdits[p.id];
    const tagVal = tagEdits[p.id];
    const qtyVal = qtyEdits[p.id];
    const quantity = qtyVal !== "" ? Number(qtyVal) : null;

    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: p.id,
        out_of_stock: quantity === 0 ? true : p.outOfStock,
        hidden: p.hidden,
        price_override: priceVal ? Number(priceVal) : null,
        tag_override: tagVal || null,
        quantity,
      }),
    });

    if (!res.ok) {
      setSaving(null);
      alert("Save failed — check your Supabase connection or env vars.");
      return;
    }

    // Re-fetch fresh data from server so admin panel reflects actual DB state
    await loadProducts();
    setSaving(null);
    setSaved(String(p.id));
    setTimeout(() => setSaved(null), 2000);
  }

  function toggle(id: number, field: "outOfStock" | "hidden") {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: !p[field] } : p))
    );
  }

  if (loading) return <p style={{ color: "#7A5555" }}>Loading products…</p>;

  return (
    <div>
      <h1
        style={{
          fontFamily: "var(--serif)",
          fontSize: 32,
          fontWeight: 700,
          color: "#180A08",
          marginBottom: 4,
        }}
      >
        Products
      </h1>
      <p style={{ color: "#7A5555", fontSize: 14, marginBottom: 32 }}>
        Manage stock, visibility, prices, and tags. Changes apply immediately to the store.
      </p>

      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          overflow: "hidden",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#fdf8f5" }}>
                {["Product", "Category", "Price (₹)", "Tag Override", "Quantity", "Out of Stock", "Hidden", ""].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontSize: 10,
                        letterSpacing: "2px",
                        textTransform: "uppercase",
                        color: "#7A5555",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        borderBottom: "1px solid #f0ebe6",
                      }}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr
                  key={p.id}
                  style={{
                    borderTop: "1px solid #f5f0eb",
                    opacity: p.hidden ? 0.5 : 1,
                    background: p.outOfStock ? "#fff8f8" : "#fff",
                  }}
                >
                  {/* Product name + image */}
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {p.media && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.media}
                          alt={p.name}
                          style={{
                            width: 40,
                            height: 40,
                            objectFit: "cover",
                            borderRadius: 6,
                            flexShrink: 0,
                          }}
                        />
                      )}
                      <div>
                        <div style={{ fontWeight: 600, color: "#180A08" }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: "#7A5555", marginTop: 1 }}>
                          ID: {p.id} · {p.tag}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td style={{ padding: "12px 16px", color: "#7A5555", textTransform: "capitalize" }}>
                    {p.category}
                  </td>

                  {/* Price override */}
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 3 }}>
                      Base: ₹{p.price}
                    </div>
                    <input
                      type="number"
                      placeholder="Override…"
                      value={priceEdits[p.id] || ""}
                      onChange={(e) =>
                        setPriceEdits((prev) => ({ ...prev, [p.id]: e.target.value }))
                      }
                      style={{
                        width: 90,
                        padding: "6px 8px",
                        border: "1.5px solid #e8ddd8",
                        borderRadius: 6,
                        fontSize: 12,
                        fontFamily: "var(--sans)",
                        outline: "none",
                      }}
                    />
                  </td>

                  {/* Tag override */}
                  <td style={{ padding: "12px 16px" }}>
                    <input
                      type="text"
                      placeholder={p.tag}
                      value={tagEdits[p.id] || ""}
                      onChange={(e) =>
                        setTagEdits((prev) => ({ ...prev, [p.id]: e.target.value }))
                      }
                      style={{
                        width: 100,
                        padding: "6px 8px",
                        border: "1.5px solid #e8ddd8",
                        borderRadius: 6,
                        fontSize: 12,
                        fontFamily: "var(--sans)",
                        outline: "none",
                      }}
                    />
                  </td>

                  {/* Quantity */}
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 3 }}>
                      {p.quantity != null ? (
                        <span style={{ color: p.quantity === 0 ? "#dc2626" : p.quantity <= 5 ? "#d97706" : "#16a34a", fontWeight: 600 }}>
                          {p.quantity} in stock
                        </span>
                      ) : (
                        <span>Untracked</span>
                      )}
                    </div>
                    <input
                      type="number"
                      min="0"
                      placeholder="Set qty…"
                      value={qtyEdits[p.id] ?? ""}
                      onChange={(e) =>
                        setQtyEdits((prev) => ({ ...prev, [p.id]: e.target.value }))
                      }
                      style={{
                        width: 80,
                        padding: "6px 8px",
                        border: "1.5px solid #e8ddd8",
                        borderRadius: 6,
                        fontSize: 12,
                        fontFamily: "var(--sans)",
                        outline: "none",
                      }}
                    />
                  </td>

                  {/* Out of stock toggle */}
                  <td style={{ padding: "12px 16px" }}>
                    <button
                      onClick={() => toggle(p.id, "outOfStock")}
                      style={{
                        width: 44,
                        height: 24,
                        borderRadius: 12,
                        border: "none",
                        background: p.outOfStock ? "#E91E8C" : "#e5e7eb",
                        position: "relative",
                        cursor: "pointer",
                        transition: "background 0.2s",
                        flexShrink: 0,
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          top: 3,
                          left: p.outOfStock ? 23 : 3,
                          width: 18,
                          height: 18,
                          borderRadius: "50%",
                          background: "#fff",
                          transition: "left 0.2s",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                        }}
                      />
                    </button>
                    <div style={{ fontSize: 10, color: p.outOfStock ? "#E91E8C" : "#9ca3af", marginTop: 3 }}>
                      {p.outOfStock ? "Yes" : "No"}
                    </div>
                  </td>

                  {/* Hidden toggle */}
                  <td style={{ padding: "12px 16px" }}>
                    <button
                      onClick={() => toggle(p.id, "hidden")}
                      style={{
                        width: 44,
                        height: 24,
                        borderRadius: 12,
                        border: "none",
                        background: p.hidden ? "#dc2626" : "#e5e7eb",
                        position: "relative",
                        cursor: "pointer",
                        transition: "background 0.2s",
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          top: 3,
                          left: p.hidden ? 23 : 3,
                          width: 18,
                          height: 18,
                          borderRadius: "50%",
                          background: "#fff",
                          transition: "left 0.2s",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                        }}
                      />
                    </button>
                    <div style={{ fontSize: 10, color: p.hidden ? "#dc2626" : "#9ca3af", marginTop: 3 }}>
                      {p.hidden ? "Hidden" : "Visible"}
                    </div>
                  </td>

                  {/* Save button */}
                  <td style={{ padding: "12px 16px" }}>
                    <button
                      onClick={() => saveProduct(p)}
                      disabled={saving === String(p.id)}
                      style={{
                        padding: "7px 16px",
                        background:
                          saved === String(p.id)
                            ? "#16a34a"
                            : saving === String(p.id)
                            ? "#ccc"
                            : "#E91E8C",
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: saving === String(p.id) ? "not-allowed" : "pointer",
                        whiteSpace: "nowrap",
                        fontFamily: "var(--sans)",
                      }}
                    >
                      {saved === String(p.id) ? "✓ Saved" : saving === String(p.id) ? "…" : "Save"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

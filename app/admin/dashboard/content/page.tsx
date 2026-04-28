"use client";
import { useEffect, useState } from "react";

export default function ContentAdmin() {
  const [marquee, setMarquee] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newItem, setNewItem] = useState("");

  useEffect(() => {
    fetch("/api/admin/content")
      .then((r) => r.json())
      .then((d) => {
        setMarquee(d.marquee || []);
        setLoading(false);
      });
  }, []);

  async function saveMarquee() {
    setSaving(true);
    await fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "marquee_items", value: marquee }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function addItem() {
    if (!newItem.trim()) return;
    setMarquee((prev) => [...prev, newItem.trim().toUpperCase()]);
    setNewItem("");
  }

  function removeItem(i: number) {
    setMarquee((prev) => prev.filter((_, idx) => idx !== i));
  }

  function updateItem(i: number, value: string) {
    setMarquee((prev) => prev.map((item, idx) => (idx === i ? value : item)));
  }

  function moveUp(i: number) {
    if (i === 0) return;
    setMarquee((prev) => {
      const next = [...prev];
      [next[i - 1], next[i]] = [next[i], next[i - 1]];
      return next;
    });
  }

  function moveDown(i: number) {
    setMarquee((prev) => {
      if (i === prev.length - 1) return prev;
      const next = [...prev];
      [next[i], next[i + 1]] = [next[i + 1], next[i]];
      return next;
    });
  }

  if (loading) return <p style={{ color: "#7A5555" }}>Loading content…</p>;

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
        Content
      </h1>
      <p style={{ color: "#7A5555", fontSize: 14, marginBottom: 32 }}>
        Edit the scrolling marquee banner and other site-wide content.
      </p>

      {/* Marquee editor */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          overflow: "hidden",
          marginBottom: 20,
        }}
      >
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid #f0ebe6",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "var(--serif)",
                fontSize: 20,
                fontWeight: 700,
                color: "#180A08",
              }}
            >
              Marquee Banner
            </h2>
            <p style={{ fontSize: 12, color: "#7A5555", marginTop: 2 }}>
              The scrolling text at the top of every page
            </p>
          </div>

          <button
            onClick={saveMarquee}
            disabled={saving}
            style={{
              padding: "10px 24px",
              background: saved ? "#16a34a" : saving ? "#ccc" : "#E91E8C",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              cursor: saving ? "not-allowed" : "pointer",
              fontFamily: "var(--sans)",
            }}
          >
            {saved ? "✓ Saved!" : saving ? "Saving…" : "Save Changes"}
          </button>
        </div>

        <div style={{ padding: "20px 24px" }}>
          {/* Preview */}
          <div
            style={{
              background: "#180A08",
              borderRadius: 8,
              padding: "10px 20px",
              marginBottom: 24,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                color: "#fff",
                fontSize: 10,
                letterSpacing: "3px",
                whiteSpace: "nowrap",
              }}
            >
              {marquee.join("   ✦   ")}   ✦   {marquee.join("   ✦   ")}
            </div>
          </div>

          {/* Items list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {marquee.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#fdf8f5",
                  borderRadius: 8,
                  padding: "8px 12px",
                }}
              >
                <span style={{ color: "#9ca3af", fontSize: 12, minWidth: 20 }}>{i + 1}</span>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateItem(i, e.target.value)}
                  style={{
                    flex: 1,
                    padding: "6px 10px",
                    border: "1.5px solid #e8ddd8",
                    borderRadius: 6,
                    fontSize: 12,
                    fontFamily: "var(--sans)",
                    outline: "none",
                    background: "#fff",
                    letterSpacing: "1px",
                  }}
                />
                <button
                  onClick={() => moveUp(i)}
                  disabled={i === 0}
                  style={{
                    padding: "4px 8px",
                    background: "transparent",
                    border: "1px solid #e8ddd8",
                    borderRadius: 4,
                    cursor: i === 0 ? "default" : "pointer",
                    opacity: i === 0 ? 0.3 : 1,
                    fontSize: 12,
                  }}
                >
                  ↑
                </button>
                <button
                  onClick={() => moveDown(i)}
                  disabled={i === marquee.length - 1}
                  style={{
                    padding: "4px 8px",
                    background: "transparent",
                    border: "1px solid #e8ddd8",
                    borderRadius: 4,
                    cursor: i === marquee.length - 1 ? "default" : "pointer",
                    opacity: i === marquee.length - 1 ? 0.3 : 1,
                    fontSize: 12,
                  }}
                >
                  ↓
                </button>
                <button
                  onClick={() => removeItem(i)}
                  style={{
                    padding: "4px 8px",
                    background: "transparent",
                    border: "1px solid #fca5a5",
                    borderRadius: 4,
                    cursor: "pointer",
                    color: "#dc2626",
                    fontSize: 12,
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Add new item */}
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <input
              type="text"
              placeholder="NEW MARQUEE TEXT"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addItem()}
              style={{
                flex: 1,
                padding: "10px 14px",
                border: "1.5px solid #e8ddd8",
                borderRadius: 8,
                fontSize: 13,
                fontFamily: "var(--sans)",
                outline: "none",
                letterSpacing: "1px",
              }}
            />
            <button
              onClick={addItem}
              style={{
                padding: "10px 20px",
                background: "#180A08",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "var(--sans)",
              }}
            >
              + Add
            </button>
          </div>
        </div>
      </div>

      <div
        style={{
          background: "#fff8e8",
          border: "1px solid #f0d88a",
          borderRadius: 10,
          padding: "14px 20px",
          fontSize: 13,
          color: "#92400e",
        }}
      >
        <strong>Note:</strong> Marquee changes save to the database. For product descriptions, prices, and images — those changes still need to be made in <code>lib/data.ts</code> for now. The overrides system handles stock, visibility, and price changes.
      </div>
    </div>
  );
}

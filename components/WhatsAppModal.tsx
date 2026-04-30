"use client";
import { useEffect, useState } from "react";

interface Item {
  name: string;
  qty: number;
  price: number;
  selectedSize?: string;
}

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  items: Item[];
  total_amount: number;
  order_status: string;
  payment_status: string;
}

interface Props {
  order: Order;
  onClose: () => void;
}

const STATUS_EMOJI: Record<string, string> = {
  initiated:  "🛍️",
  confirmed:  "✅",
  processing: "🔧",
  shipped:    "🚀",
  delivered:  "🎉",
};

const STATUS_LINE: Record<string, string> = {
  initiated:  "We've received your order and it's being reviewed.",
  confirmed:  "Great news — your order is confirmed and being packed!",
  processing: "Your order is being carefully prepared by our team.",
  shipped:    "Your order is on its way! Expect it at your door soon.",
  delivered:  "Your order has been delivered. We hope you love it! 💕",
};

function buildMessage(order: Order): string {
  const firstName = order.customer_name.split(" ")[0];
  const emoji = STATUS_EMOJI[order.order_status] ?? "📦";
  const statusLine = STATUS_LINE[order.order_status] ?? "Your order has been updated.";
  const itemLines = order.items
    .map((item) => {
      const size = item.selectedSize ? ` (${item.selectedSize})` : "";
      return `  • ${item.name}${size} × ${item.qty}`;
    })
    .join("\n");
  const total = `₹${order.total_amount.toLocaleString("en-IN")}`;
  const statusLabel = order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1);

  return `Hi ${firstName}! 🌸

${statusLine}

*Order Update ${emoji}*
━━━━━━━━━━━━━━━━
*Status:* ${statusLabel}
*Items:*
${itemLines}
*Total:* ${total}
━━━━━━━━━━━━━━━━

For any questions, just reply here — we're always happy to help! 💬

Thank you for shopping with *Siyora* 🪷
_Where Siya meets street_ ✨`;
}

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("91") && digits.length === 12) return digits;
  if (digits.length === 10) return "91" + digits;
  return digits;
}

export default function WhatsAppModal({ order, onClose }: Props) {
  const [message, setMessage] = useState(() => buildMessage(order));

  useEffect(() => {
    document.body.style.overflow = "hidden";
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  function handleSend() {
    const phone = formatPhone(order.customer_phone);
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  const firstName = order.customer_name.split(" ")[0];

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(10,4,3,0.55)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        padding: "20px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 480,
          maxHeight: "92vh",
          borderRadius: 20,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 32px 80px rgba(0,0,0,0.4)",
        }}
      >
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #E91E8C 0%, #c2185b 100%)",
          padding: "18px 20px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexShrink: 0,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%",
            background: "rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20,
          }}>
            🪷
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, fontFamily: "var(--sans)" }}>
              WhatsApp {order.customer_name}
            </div>
            <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 12 }}>
              {order.customer_phone}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.2)",
              border: "none",
              color: "#fff",
              width: 30, height: 30,
              borderRadius: "50%",
              cursor: "pointer",
              fontSize: 16,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>

        {/* Chat preview */}
        <div style={{
          background: "#ece5dd",
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4c9bc' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          padding: "16px 12px",
          flexGrow: 1,
          overflowY: "auto",
          minHeight: 0,
        }}>
          {/* Date chip */}
          <div style={{
            textAlign: "center",
            marginBottom: 12,
          }}>
            <span style={{
              background: "rgba(0,0,0,0.12)",
              color: "#555",
              fontSize: 11,
              padding: "3px 10px",
              borderRadius: 8,
              fontFamily: "var(--sans)",
            }}>
              Today
            </span>
          </div>

          {/* Message bubble */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{
              background: "#dcf8c6",
              borderRadius: "12px 2px 12px 12px",
              padding: "10px 14px",
              maxWidth: "85%",
              boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
            }}>
              {/* Siyora badge */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 8,
                paddingBottom: 8,
                borderBottom: "1px solid rgba(0,0,0,0.08)",
              }}>
                <span style={{ fontSize: 16 }}>🪷</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#E91E8C", letterSpacing: "0.5px", fontFamily: "var(--sans)" }}>
                  SIYORA
                </span>
              </div>

              <pre style={{
                fontSize: 13,
                color: "#111",
                fontFamily: "var(--sans)",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                margin: 0,
                lineHeight: 1.65,
              }}>
                {message}
              </pre>

              <div style={{ textAlign: "right", marginTop: 6, fontSize: 10, color: "#888" }}>
                {new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} ✓✓
              </div>
            </div>
          </div>
        </div>

        {/* Edit area */}
        <div style={{ background: "#f0f0f0", padding: "10px 12px", flexShrink: 0 }}>
          <div style={{ fontSize: 10, color: "#999", marginBottom: 6, fontFamily: "var(--sans)", letterSpacing: "0.5px", textTransform: "uppercase" }}>
            Edit before sending
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1.5px solid #e8ddd8",
              borderRadius: 10,
              fontSize: 12,
              fontFamily: "var(--sans)",
              resize: "vertical",
              outline: "none",
              background: "#fff",
              color: "#180A08",
              lineHeight: 1.6,
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Footer actions */}
        <div style={{
          background: "#fff",
          padding: "14px 16px",
          display: "flex",
          gap: 10,
          borderTop: "1px solid #f0ebe6",
          flexShrink: 0,
        }}>
          <button
            onClick={() => setMessage(buildMessage(order))}
            style={{
              flex: 1,
              padding: "10px",
              background: "#fdf8f5",
              border: "1.5px solid #e8ddd8",
              borderRadius: 10,
              fontSize: 12,
              fontWeight: 600,
              color: "#7A5555",
              cursor: "pointer",
              fontFamily: "var(--sans)",
            }}
          >
            Reset
          </button>
          <button
            onClick={handleSend}
            style={{
              flex: 3,
              padding: "10px",
              background: "#25d366",
              border: "none",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 700,
              color: "#fff",
              cursor: "pointer",
              fontFamily: "var(--sans)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Open WhatsApp & Send
          </button>
        </div>
      </div>
    </div>
  );
}

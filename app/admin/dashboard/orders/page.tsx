"use client";
import { useEffect, useState } from "react";

interface Order {
  id: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: { address: string; city: string; state: string; pincode: string };
  items: { name: string; qty: number; price: number; selectedSize?: string }[];
  total_amount: number;
  payment_status: string;
  order_status: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
}

const ORDER_STATUSES = ["initiated", "confirmed", "processing", "shipped", "delivered"];
const PAYMENT_STATUSES = ["pending", "paid", "failed", "cod_pending"];

const STATUS_COLORS: Record<string, string> = {
  paid: "#16a34a",
  pending: "#d97706",
  failed: "#dc2626",
  cod_pending: "#7c3aed",
  confirmed: "#2563eb",
  processing: "#d97706",
  shipped: "#0891b2",
  delivered: "#16a34a",
  initiated: "#9ca3af",
};

const STATUS_FILTER_OPTIONS = ["all", "initiated", "confirmed", "processing", "shipped", "delivered"];

export default function OrdersAdmin() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [saving, setSaving] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [localStatus, setLocalStatus] = useState<Record<string, string>>({});
  const [localPayment, setLocalPayment] = useState<Record<string, string>>({});
  const [refreshing, setRefreshing] = useState(false);

  function fetchOrders(silent = false) {
    if (silent) setRefreshing(true);
    else setLoading(true);
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then((d) => {
        const o = d.orders || [];
        setOrders(o);
        setLocalStatus((prev) => {
          const statuses: Record<string, string> = {};
          o.forEach((order: Order) => {
            statuses[order.id] = prev[order.id] ?? order.order_status;
          });
          return statuses;
        });
        setLocalPayment((prev) => {
          const payments: Record<string, string> = {};
          o.forEach((order: Order) => {
            payments[order.id] = prev[order.id] ?? order.payment_status;
          });
          return payments;
        });
        setLoading(false);
        setRefreshing(false);
      });
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  async function saveStatus(orderId: string) {
    setSaving(orderId);
    await fetch("/api/admin/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId,
        orderStatus: localStatus[orderId],
        paymentStatus: localPayment[orderId],
      }),
    });
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, order_status: localStatus[orderId], payment_status: localPayment[orderId] }
          : o
      )
    );
    setSaving(null);
  }

  const filtered =
    filter === "all" ? orders : orders.filter((o) => o.order_status === filter);

  if (loading) return <p style={{ color: "#7A5555" }}>Loading orders…</p>;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 4 }}>
        <h1
          style={{
            fontFamily: "var(--serif)",
            fontSize: 32,
            fontWeight: 700,
            color: "#180A08",
            margin: 0,
          }}
        >
          Orders
        </h1>
        <button
          onClick={() => fetchOrders(true)}
          disabled={refreshing}
          style={{
            padding: "6px 14px",
            background: refreshing ? "#f5f0eb" : "#fff",
            border: "1.5px solid #e8ddd8",
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 600,
            color: "#7A5555",
            cursor: refreshing ? "not-allowed" : "pointer",
            fontFamily: "var(--sans)",
          }}
        >
          {refreshing ? "Refreshing…" : "Refresh"}
        </button>
      </div>
      <p style={{ color: "#7A5555", fontSize: 14, marginBottom: 24 }}>
        {orders.length} total orders · Auto-refreshes every 30s
      </p>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {STATUS_FILTER_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              padding: "7px 16px",
              borderRadius: 20,
              border: "1.5px solid",
              borderColor: filter === s ? "#E91E8C" : "#e8ddd8",
              background: filter === s ? "#E91E8C" : "#fff",
              color: filter === s ? "#fff" : "#7A5555",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              textTransform: "capitalize",
              fontFamily: "var(--sans)",
            }}
          >
            {s === "all" ? `All (${orders.length})` : `${s} (${orders.filter((o) => o.order_status === s).length})`}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map((o) => {
          const isExpanded = expanded === o.id;
          return (
            <div
              key={o.id}
              style={{
                background: "#fff",
                borderRadius: 12,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                overflow: "hidden",
              }}
            >
              {/* Order header */}
              <div
                onClick={() => setExpanded(isExpanded ? null : o.id)}
                style={{
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  cursor: "pointer",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ flex: 1, minWidth: 160 }}>
                  <div style={{ fontWeight: 600, color: "#180A08", fontSize: 14 }}>
                    {o.customer_name}
                  </div>
                  <div style={{ fontSize: 11, color: "#7A5555", marginTop: 2 }}>
                    {o.customer_email} · {o.customer_phone}
                  </div>
                </div>

                <div style={{ fontWeight: 700, color: "#180A08", fontSize: 16 }}>
                  ₹{o.total_amount.toLocaleString("en-IN")}
                </div>

                <span
                  style={{
                    background: `${STATUS_COLORS[o.payment_status] || "#9ca3af"}18`,
                    color: STATUS_COLORS[o.payment_status] || "#9ca3af",
                    padding: "3px 10px",
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: "capitalize",
                  }}
                >
                  {o.payment_status}
                </span>

                <span
                  style={{
                    background: `${STATUS_COLORS[o.order_status] || "#9ca3af"}18`,
                    color: STATUS_COLORS[o.order_status] || "#9ca3af",
                    padding: "3px 10px",
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: "capitalize",
                  }}
                >
                  {o.order_status}
                </span>

                <div style={{ fontSize: 11, color: "#9ca3af", whiteSpace: "nowrap" }}>
                  {new Date(o.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>

                <div style={{ color: "#9ca3af", fontSize: 14 }}>{isExpanded ? "▲" : "▼"}</div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div
                  style={{
                    borderTop: "1px solid #f5f0eb",
                    padding: "20px",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 20,
                  }}
                >
                  {/* Items */}
                  <div>
                    <div
                      style={{
                        fontSize: 10,
                        letterSpacing: "2px",
                        textTransform: "uppercase",
                        color: "#7A5555",
                        fontWeight: 600,
                        marginBottom: 10,
                      }}
                    >
                      Items
                    </div>
                    {(o.items || []).map((item, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "6px 0",
                          borderBottom: "1px solid #f5f0eb",
                          fontSize: 13,
                        }}
                      >
                        <span>
                          {item.name}
                          {item.selectedSize && (
                            <span style={{ color: "#7A5555" }}> · {item.selectedSize}</span>
                          )}
                          <span style={{ color: "#9ca3af" }}>  ×{item.qty}</span>
                        </span>
                        <span style={{ fontWeight: 600 }}>₹{(item.price * item.qty).toLocaleString("en-IN")}</span>
                      </div>
                    ))}
                  </div>

                  {/* Right panel: address + status update */}
                  <div>
                    <div
                      style={{
                        fontSize: 10,
                        letterSpacing: "2px",
                        textTransform: "uppercase",
                        color: "#7A5555",
                        fontWeight: 600,
                        marginBottom: 10,
                      }}
                    >
                      Shipping Address
                    </div>
                    <div style={{ fontSize: 13, color: "#180A08", lineHeight: 1.6, marginBottom: 20 }}>
                      {o.shipping_address?.address}<br />
                      {o.shipping_address?.city}, {o.shipping_address?.state} - {o.shipping_address?.pincode}
                    </div>

                    <div
                      style={{
                        fontSize: 10,
                        letterSpacing: "2px",
                        textTransform: "uppercase",
                        color: "#7A5555",
                        fontWeight: 600,
                        marginBottom: 10,
                      }}
                    >
                      Update Status
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                      <select
                        value={localStatus[o.id] || o.order_status}
                        onChange={(e) =>
                          setLocalStatus((prev) => ({ ...prev, [o.id]: e.target.value }))
                        }
                        style={{
                          padding: "8px 12px",
                          border: "1.5px solid #e8ddd8",
                          borderRadius: 6,
                          fontSize: 12,
                          fontFamily: "var(--sans)",
                          outline: "none",
                          background: "#fff",
                        }}
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>

                      <select
                        value={localPayment[o.id] || o.payment_status}
                        onChange={(e) =>
                          setLocalPayment((prev) => ({ ...prev, [o.id]: e.target.value }))
                        }
                        style={{
                          padding: "8px 12px",
                          border: "1.5px solid #e8ddd8",
                          borderRadius: 6,
                          fontSize: 12,
                          fontFamily: "var(--sans)",
                          outline: "none",
                          background: "#fff",
                        }}
                      >
                        {PAYMENT_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => saveStatus(o.id)}
                        disabled={saving === o.id}
                        style={{
                          padding: "8px 18px",
                          background: saving === o.id ? "#ccc" : "#E91E8C",
                          color: "#fff",
                          border: "none",
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: saving === o.id ? "not-allowed" : "pointer",
                          fontFamily: "var(--sans)",
                        }}
                      >
                        {saving === o.id ? "…" : "Update"}
                      </button>
                    </div>

                    {o.razorpay_payment_id && (
                      <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 8 }}>
                        Payment ID: {o.razorpay_payment_id}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: "48px",
              textAlign: "center",
              color: "#7A5555",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            No orders in this category
          </div>
        )}
      </div>
    </div>
  );
}

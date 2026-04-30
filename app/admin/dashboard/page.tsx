"use client";
import { useEffect, useState } from "react";

interface Order {
  id: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  payment_status: string;
  order_status: string;
  items: { name: string; qty: number }[];
}

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

export default function DashboardOverview() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/orders", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        setOrders(d.orders || []);
        setLoading(false);
      });
  }, []);

  const paid = orders.filter((o) => o.payment_status === "paid");
  const revenue = paid.reduce((sum, o) => sum + o.total_amount, 0);
  const pending = orders.filter(
    (o) => o.payment_status === "pending" || o.payment_status === "cod_pending"
  );
  const recent = orders.slice(0, 6);

  const stats = [
    { label: "Total Orders", value: orders.length, color: "#E91E8C" },
    { label: "Revenue", value: `₹${revenue.toLocaleString("en-IN")}`, color: "#16a34a" },
    { label: "Paid Orders", value: paid.length, color: "#2563eb" },
    { label: "Pending", value: pending.length, color: "#d97706" },
  ];

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
        Overview
      </h1>
      <p style={{ color: "#7A5555", fontSize: 14, marginBottom: 32 }}>
        Welcome back — here&apos;s your store at a glance.
      </p>

      {loading ? (
        <p style={{ color: "#7A5555" }}>Loading…</p>
      ) : (
        <>
          {/* Stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: 16,
              marginBottom: 40,
            }}
          >
            {stats.map((s) => (
              <div
                key={s.label}
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  padding: "24px 20px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  borderTop: `3px solid ${s.color}`,
                }}
              >
                <div
                  style={{ fontSize: 28, fontWeight: 700, color: s.color, fontFamily: "var(--serif)" }}
                >
                  {s.value}
                </div>
                <div style={{ fontSize: 12, color: "#7A5555", marginTop: 4, fontWeight: 500 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Recent orders */}
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              overflow: "hidden",
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
              <h2 style={{ fontFamily: "var(--serif)", fontSize: 20, fontWeight: 700, color: "#180A08" }}>
                Recent Orders
              </h2>
              <a href="/admin/dashboard/orders" style={{ fontSize: 12, color: "#E91E8C", textDecoration: "none" }}>
                View all →
              </a>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#fdf8f5" }}>
                    {["Customer", "Amount", "Payment", "Status", "Date"].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "10px 20px",
                          textAlign: "left",
                          fontSize: 10,
                          letterSpacing: "2px",
                          textTransform: "uppercase",
                          color: "#7A5555",
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recent.map((o) => (
                    <tr
                      key={o.id}
                      style={{ borderTop: "1px solid #f5f0eb" }}
                    >
                      <td style={{ padding: "12px 20px", color: "#180A08", fontWeight: 500 }}>
                        {o.customer_name}
                      </td>
                      <td style={{ padding: "12px 20px", color: "#180A08", fontWeight: 600 }}>
                        ₹{o.total_amount.toLocaleString("en-IN")}
                      </td>
                      <td style={{ padding: "12px 20px" }}>
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
                      </td>
                      <td style={{ padding: "12px 20px" }}>
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
                      </td>
                      <td style={{ padding: "12px 20px", color: "#7A5555", whiteSpace: "nowrap" }}>
                        {new Date(o.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </td>
                    </tr>
                  ))}
                  {recent.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ padding: "32px 20px", textAlign: "center", color: "#7A5555" }}>
                        No orders yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

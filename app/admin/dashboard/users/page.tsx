"use client";
import { useEffect, useState } from "react";

interface User {
  id: string;
  phone: string;
  name: string | null;
  email: string | null;
  siyora_stars: number;
  created_at: string;
}

interface StarTransaction {
  id: string;
  delta: number;
  reason: string;
  order_id: string | null;
  created_at: string;
}

interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  order_status: string;
  payment_status: string;
  razorpay_order_id?: string;
}

interface Quiz {
  q1: string | null; q2: string | null; q3: string | null;
  q4: string | null; q5: string | null; completed: boolean;
}

interface UserDetail {
  user: User;
  orders: Order[];
  transactions: StarTransaction[];
  quiz: Quiz | null;
}

const STATUS_COLORS: Record<string, string> = {
  paid: "#16a34a", pending: "#d97706", failed: "#dc2626", cod_pending: "#7c3aed",
  confirmed: "#2563eb", processing: "#d97706", shipped: "#0891b2", delivered: "#16a34a", initiated: "#9ca3af",
};

const QUIZ_LABELS = [
  "Everyday vibe", "Colour soul", "Occasion", "Styling instinct", "Shopping truth",
];

function badge(text: string, color: string) {
  return (
    <span style={{
      background: `${color}18`, color, padding: "3px 10px",
      borderRadius: 20, fontSize: 11, fontWeight: 600, textTransform: "capitalize" as const,
    }}>{text}</span>
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [starSummary, setStarSummary] = useState({ totalAwarded: 0, totalRedeemed: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<UserDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((d) => { setUsers(d.users || []); setStarSummary(d.starSummary || {}); })
      .finally(() => setLoading(false));
  }, []);

  async function openUser(id: string) {
    setDetailLoading(true);
    setSelected(null);
    const d = await fetch(`/api/admin/users?id=${id}`).then((r) => r.json());
    setSelected(d);
    setDetailLoading(false);
  }

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.phone.includes(q) ||
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q)
    );
  });

  const totalStars = users.reduce((s, u) => s + u.siyora_stars, 0);
  const avgStars = users.length ? Math.round(totalStars / users.length) : 0;

  const stats = [
    { label: "Total Members", value: users.length, color: "#E91E8C" },
    { label: "Stars Awarded", value: starSummary.totalAwarded, color: "#c8956c" },
    { label: "Stars Redeemed", value: starSummary.totalRedeemed, color: "#7c3aed" },
    { label: "Avg Stars / User", value: avgStars, color: "#0891b2" },
  ];

  return (
    <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
      {/* Left: list */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h1 style={{ fontFamily: "var(--serif)", fontSize: 32, fontWeight: 700, color: "#180A08", marginBottom: 4 }}>
          Members
        </h1>
        <p style={{ color: "#7A5555", fontSize: 14, marginBottom: 28 }}>
          All registered users and their Siyora Stars activity.
        </p>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 14, marginBottom: 28 }}>
          {stats.map((s) => (
            <div key={s.label} style={{
              background: "#fff", borderRadius: 12, padding: "20px 18px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)", borderTop: `3px solid ${s.color}`,
            }}>
              <div style={{ fontSize: 26, fontWeight: 700, color: s.color, fontFamily: "var(--serif)" }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "#7A5555", marginTop: 4, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <input
          placeholder="Search by name, phone or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%", padding: "11px 16px", fontSize: 13, borderRadius: 10,
            border: "1.5px solid #f0ebe6", outline: "none", marginBottom: 16,
            fontFamily: "var(--sans)", background: "#fff",
          }}
        />

        {/* Table */}
        <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflow: "hidden" }}>
          {loading ? (
            <p style={{ padding: 32, color: "#7A5555", textAlign: "center" }}>Loading…</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#fdf8f5" }}>
                    {["Member", "Phone", "Email", "Stars", "Joined"].map((h) => (
                      <th key={h} style={{
                        padding: "10px 18px", textAlign: "left", fontSize: 10,
                        letterSpacing: "2px", textTransform: "uppercase", color: "#7A5555",
                        fontWeight: 600, whiteSpace: "nowrap",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u) => (
                    <tr
                      key={u.id}
                      onClick={() => openUser(u.id)}
                      style={{
                        borderTop: "1px solid #f5f0eb", cursor: "pointer",
                        background: selected?.user?.id === u.id ? "#fdf6ee" : "transparent",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) => { if (selected?.user?.id !== u.id) (e.currentTarget as HTMLElement).style.background = "#fdf8f5"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = selected?.user?.id === u.id ? "#fdf6ee" : "transparent"; }}
                    >
                      <td style={{ padding: "13px 18px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: "50%",
                            background: "linear-gradient(135deg, #c8956c, #e8b48a)",
                            color: "#fff", fontSize: 13, fontWeight: 700,
                            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                          }}>
                            {(u.name?.[0] || u.phone.slice(-2)[0]).toUpperCase()}
                          </div>
                          <span style={{ fontWeight: 600, color: "#180A08" }}>{u.name || <span style={{ color: "#aaa", fontWeight: 400 }}>—</span>}</span>
                        </div>
                      </td>
                      <td style={{ padding: "13px 18px", color: "#444", fontFamily: "monospace", fontSize: 12 }}>{u.phone}</td>
                      <td style={{ padding: "13px 18px", color: "#666", fontSize: 12 }}>{u.email || <span style={{ color: "#ccc" }}>—</span>}</td>
                      <td style={{ padding: "13px 18px" }}>
                        <span style={{
                          display: "inline-flex", alignItems: "center", gap: 4,
                          background: "#fdf6ee", color: "#c8956c", fontWeight: 700,
                          fontSize: 12, padding: "3px 10px", borderRadius: 20,
                        }}>★ {u.siyora_stars}</span>
                      </td>
                      <td style={{ padding: "13px 18px", color: "#7A5555", whiteSpace: "nowrap", fontSize: 12 }}>
                        {new Date(u.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={5} style={{ padding: "40px 20px", textAlign: "center", color: "#7A5555" }}>
                      {search ? "No users match your search" : "No members yet"}
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Right: detail panel */}
      {(detailLoading || selected) && (
        <div style={{
          width: 360, flexShrink: 0, background: "#fff", borderRadius: 14,
          boxShadow: "0 2px 16px rgba(0,0,0,0.08)", overflow: "hidden",
          position: "sticky", top: 24, maxHeight: "calc(100vh - 80px)", overflowY: "auto",
        }}>
          {detailLoading ? (
            <div style={{ padding: 40, textAlign: "center", color: "#7A5555" }}>Loading…</div>
          ) : selected && (
            <>
              {/* Profile header */}
              <div style={{ background: "linear-gradient(135deg, #1a1a1a, #3a2a1a)", padding: "28px 24px" }}>
                <button
                  onClick={() => setSelected(null)}
                  style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 13, cursor: "pointer", padding: 0, marginBottom: 16, fontFamily: "var(--sans)" }}
                >
                  ← close
                </button>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: "50%",
                    background: "linear-gradient(135deg, #c8956c, #e8b48a)",
                    color: "#fff", fontSize: 20, fontWeight: 700,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {(selected.user.name?.[0] || selected.user.phone.slice(-2)[0]).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>{selected.user.name || "No name"}</div>
                    <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginTop: 2 }}>{selected.user.phone}</div>
                    {selected.user.email && <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, marginTop: 1 }}>{selected.user.email}</div>}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 16, marginTop: 20 }}>
                  <div>
                    <div style={{ color: "#f0c080", fontSize: 22, fontWeight: 800 }}>★ {selected.user.siyora_stars}</div>
                    <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>Stars balance</div>
                  </div>
                  <div style={{ width: 1, background: "rgba(255,255,255,0.1)" }} />
                  <div>
                    <div style={{ color: "#fff", fontSize: 22, fontWeight: 800 }}>{selected.orders.length}</div>
                    <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>Orders</div>
                  </div>
                  <div style={{ width: 1, background: "rgba(255,255,255,0.1)" }} />
                  <div>
                    <div style={{ color: "#fff", fontSize: 22, fontWeight: 800 }}>
                      ₹{Math.floor(selected.user.siyora_stars * 20 / 50)}
                    </div>
                    <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>Redeemable</div>
                  </div>
                </div>
              </div>

              {/* Quiz responses */}
              {selected.quiz && (
                <div style={{ padding: "20px 24px", borderBottom: "1px solid #f5f0eb" }}>
                  <div style={{ fontSize: 10, letterSpacing: "2px", textTransform: "uppercase", color: "#7A5555", fontWeight: 600, marginBottom: 12 }}>
                    Quiz Responses {selected.quiz.completed ? "✓" : "(skipped)"}
                  </div>
                  {[selected.quiz.q1, selected.quiz.q2, selected.quiz.q3, selected.quiz.q4, selected.quiz.q5].map((ans, i) => ans && (
                    <div key={i} style={{ marginBottom: 8 }}>
                      <div style={{ fontSize: 10, color: "#aaa", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>{QUIZ_LABELS[i]}</div>
                      <div style={{ fontSize: 13, color: "#180A08", fontWeight: 500, marginTop: 2 }}>{ans.replace(/_/g, " ")}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Orders */}
              <div style={{ padding: "20px 24px", borderBottom: "1px solid #f5f0eb" }}>
                <div style={{ fontSize: 10, letterSpacing: "2px", textTransform: "uppercase", color: "#7A5555", fontWeight: 600, marginBottom: 12 }}>
                  Orders ({selected.orders.length})
                </div>
                {selected.orders.length === 0 ? (
                  <p style={{ fontSize: 13, color: "#aaa" }}>No orders yet</p>
                ) : selected.orders.map((o) => (
                  <div key={o.id} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "10px 0", borderBottom: "1px solid #f9f6f3",
                  }}>
                    <div>
                      <div style={{ fontSize: 12, fontFamily: "monospace", color: "#444" }}>
                        #{o.razorpay_order_id?.slice(-8) || o.id.slice(-8)}
                      </div>
                      <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>
                        {new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: "#180A08" }}>₹{(o.total_amount / 100).toLocaleString("en-IN")}</div>
                      <div style={{ marginTop: 3 }}>{badge(o.order_status, STATUS_COLORS[o.order_status] || "#9ca3af")}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Star transactions */}
              <div style={{ padding: "20px 24px" }}>
                <div style={{ fontSize: 10, letterSpacing: "2px", textTransform: "uppercase", color: "#7A5555", fontWeight: 600, marginBottom: 12 }}>
                  Stars History
                </div>
                {selected.transactions.length === 0 ? (
                  <p style={{ fontSize: 13, color: "#aaa" }}>No activity</p>
                ) : selected.transactions.map((t) => (
                  <div key={t.id} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "8px 0", borderBottom: "1px solid #f9f6f3",
                  }}>
                    <div>
                      <div style={{ fontSize: 12, color: "#444", fontWeight: 500, textTransform: "capitalize" }}>
                        {t.reason.replace(/_/g, " ")}
                      </div>
                      <div style={{ fontSize: 11, color: "#aaa", marginTop: 1 }}>
                        {new Date(t.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                    </div>
                    <span style={{
                      fontWeight: 700, fontSize: 13,
                      color: t.delta > 0 ? "#16a34a" : "#dc2626",
                    }}>
                      {t.delta > 0 ? "+" : ""}{t.delta} ★
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

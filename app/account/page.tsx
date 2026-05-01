"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import type { Order, StarTransaction } from "@/types";
import { Star } from "lucide-react";

const ORDER_STATUS_LABEL: Record<string, string> = {
  initiated: "Order Placed",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  payment_failed: "Payment Failed",
};

const ORDER_STATUS_COLOR: Record<string, string> = {
  initiated: "#6b7280",
  confirmed: "#2563eb",
  processing: "#d97706",
  shipped: "#7c3aed",
  delivered: "#16a34a",
  payment_failed: "#dc2626",
};

function StarBar({ stars }: { stars: number }) {
  const REDEEM_AT = 50;
  const pct = Math.min((stars % REDEEM_AT) / REDEEM_AT * 100, 100);
  return (
    <div className="stars-bar-wrap">
      <div className="stars-bar-track">
        <div className="stars-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="stars-bar-label">
        {REDEEM_AT - (stars % REDEEM_AT)} more stars = ₹20 off
      </span>
    </div>
  );
}

export default function AccountPage() {
  const { user, loading, logout } = useUser();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [transactions, setTransactions] = useState<StarTransaction[]>([]);
  const [tab, setTab] = useState<"orders" | "stars">("orders");
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/account");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      fetch("/api/account/orders").then((r) => r.json()),
      fetch("/api/account/stars").then((r) => r.json()),
    ]).then(([ordersData, starsData]) => {
      setOrders(ordersData.orders || []);
      setTransactions(starsData.transactions || []);
    }).finally(() => setDataLoading(false));
  }, [user]);

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  if (loading || !user) {
    return (
      <div className="account-loading">
        <div className="account-spinner" />
      </div>
    );
  }

  return (
    <div className="account-page">
      {/* Profile header */}
      <div className="account-hero">
        <div className="account-avatar">
          {(user.name?.[0] || user.phone.slice(-2)).toUpperCase()}
        </div>
        <div>
          <h1 className="account-name">{user.name || "Siyora Member"}</h1>
          <p className="account-phone">+91 {user.phone.replace("+91", "")}</p>
        </div>
        <button className="account-logout" onClick={handleLogout}>Logout</button>
      </div>

      {/* Stars card */}
      <div className="stars-card">
        <div className="stars-card-left">
          <div className="stars-icon">
            <Star size={32} fill="#f0c080" stroke="#f0c080" />
          </div>
          <div>
            <div className="stars-count">{user.siyora_stars}</div>
            <div className="stars-label">Siyora Stars</div>
          </div>
        </div>
        <div className="stars-card-right">
          <div className="stars-value">≈ ₹{Math.floor(user.siyora_stars * 20 / 50)} off</div>
          <div className="stars-hint">Redeem at checkout</div>
        </div>
      </div>
      <StarBar stars={user.siyora_stars} />

      {/* How stars work */}
      <div className="stars-explainer">
        <div className="stars-exp-item">
          <span className="stars-exp-pill">+50</span>
          <span>on signup</span>
        </div>
        <div className="stars-exp-divider" />
        <div className="stars-exp-item">
          <span className="stars-exp-pill">+25</span>
          <span>per order placed</span>
        </div>
        <div className="stars-exp-divider" />
        <div className="stars-exp-item">
          <span className="stars-exp-pill">50 = ₹20</span>
          <span>at checkout</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="account-tabs">
        <button
          className={`account-tab ${tab === "orders" ? "active" : ""}`}
          onClick={() => setTab("orders")}
        >
          My Orders
          {orders.length > 0 && <span className="tab-count">{orders.length}</span>}
        </button>
        <button
          className={`account-tab ${tab === "stars" ? "active" : ""}`}
          onClick={() => setTab("stars")}
        >
          Stars History
        </button>
      </div>

      {dataLoading ? (
        <div className="account-loading-inline"><div className="account-spinner" /></div>
      ) : tab === "orders" ? (
        orders.length === 0 ? (
          <div className="account-empty">
            <div className="account-empty-icon">🛍️</div>
            <p>No orders yet</p>
            <Link href="/shop" className="account-shop-btn">Start Shopping</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-card-header">
                  <div>
                    <div className="order-id">#{order.razorpay_order_id?.slice(-8) || order.id?.slice(-8)}</div>
                    <div className="order-date">
                      {new Date(order.created_at!).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric"
                      })}
                    </div>
                  </div>
                  <span
                    className="order-status-badge"
                    style={{ background: `${ORDER_STATUS_COLOR[order.order_status] || "#6b7280"}18`, color: ORDER_STATUS_COLOR[order.order_status] || "#6b7280" }}
                  >
                    {ORDER_STATUS_LABEL[order.order_status] || order.order_status}
                  </span>
                </div>

                <div className="order-items-preview">
                  {(order.items || []).slice(0, 3).map((item, i) => {
                    const firstMedia = item.media?.[0];
                    const imgSrc = firstMedia?.type === "image" && firstMedia.src && !firstMedia.src.startsWith("#") ? firstMedia.src : null;
                    return (
                      <div key={i} className="order-item-thumb" title={`${item.name} × ${item.qty}`}>
                        {imgSrc ? (
                          <img src={imgSrc} alt={item.name} className="order-item-img" />
                        ) : (
                          <div className="order-item-emoji" style={{ background: firstMedia?.bg || item.bgColor || "#f5f0eb" }}>
                            {firstMedia?.emoji || item.emoji || "👗"}
                          </div>
                        )}
                        {item.qty > 1 && <span className="order-item-qty">×{item.qty}</span>}
                      </div>
                    );
                  })}
                  {(order.items || []).length > 3 && (
                    <div className="order-item-thumb order-item-more">+{order.items.length - 3}</div>
                  )}
                  <div className="order-item-names">
                    {(order.items || []).map((item, i) => (
                      <span key={i}>{item.name}{i < order.items.length - 1 ? ", " : ""}</span>
                    ))}
                  </div>
                </div>

                <div className="order-card-footer">
                  <span className="order-total">₹{order.total_amount.toLocaleString("en-IN")}</span>
                  <span className="order-payment-status" data-status={order.payment_status}>
                    {order.payment_status === "paid" ? "Paid" :
                     order.payment_status === "cod_pending" ? "COD" :
                     order.payment_status === "pending" ? "Pending" : order.payment_status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        transactions.length === 0 ? (
          <div className="account-empty">
            <div className="account-empty-icon"><Star size={36} fill="#e8d5bf" stroke="#e8d5bf" /></div>
            <p>No star activity yet</p>
          </div>
        ) : (
          <div className="transactions-list">
            {transactions.map((t) => (
              <div key={t.id} className="transaction-row">
                <div>
                  <div className="transaction-reason">
                    {t.reason === "signup_bonus" && "Welcome bonus"}
                    {t.reason === "order_placed" && "Order placed"}
                    {t.reason === "redeemed" && "Redeemed at checkout"}
                  </div>
                  <div className="transaction-date">
                    {new Date(t.created_at).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric"
                    })}
                  </div>
                </div>
                <span className={`transaction-delta ${t.delta > 0 ? "positive" : "negative"}`}>
                  {t.delta > 0 ? "+" : ""}{t.delta}
                  <Star size={13} fill="currentColor" stroke="currentColor" />
                </span>
              </div>
            ))}
          </div>
        )
      )}

      <style jsx>{`
        .account-page {
          max-width: 640px;
          margin: 0 auto;
          padding: 32px 16px 64px;
        }
        .account-loading {
          min-height: 60vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .account-spinner {
          width: 32px; height: 32px;
          border: 3px solid #f0ece8;
          border-top-color: #c8956c;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .account-hero {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }
        .account-avatar {
          width: 56px; height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, #c8956c, #e8b48a);
          color: #fff;
          font-size: 20px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .account-name { font-size: 20px; font-weight: 700; color: #1a1a1a; margin: 0 0 2px; }
        .account-phone { font-size: 13px; color: #888; margin: 0; }
        .account-logout {
          margin-left: auto;
          background: none;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 7px 14px;
          font-size: 13px;
          color: #666;
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s;
          flex-shrink: 0;
        }
        .account-logout:hover { border-color: #c8956c; color: #c8956c; }

        .stars-card {
          background: linear-gradient(135deg, #1a1a1a 0%, #3a2a1a 100%);
          border-radius: 18px;
          padding: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #fff;
          margin-bottom: 12px;
        }
        .stars-card-left { display: flex; align-items: center; gap: 14px; }
        .stars-icon { font-size: 32px; }
        .stars-count { font-size: 36px; font-weight: 800; letter-spacing: -1px; }
        .stars-label { font-size: 12px; color: rgba(255,255,255,0.6); margin-top: 2px; }
        .stars-card-right { text-align: right; }
        .stars-value { font-size: 20px; font-weight: 700; color: #f0c080; }
        .stars-hint { font-size: 11px; color: rgba(255,255,255,0.5); margin-top: 2px; }

        .stars-bar-wrap {
          margin-bottom: 16px;
        }
        .stars-bar-track {
          height: 6px;
          background: #f0ece8;
          border-radius: 99px;
          overflow: hidden;
        }
        .stars-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #c8956c, #e8b48a);
          border-radius: 99px;
          transition: width 0.6s ease;
        }
        .stars-bar-label {
          font-size: 11px;
          color: #aaa;
          margin-top: 5px;
          display: block;
        }

        .stars-explainer {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #fdf6ee;
          border: 1px solid #f0dcc8;
          border-radius: 12px;
          padding: 12px 16px;
          margin-bottom: 28px;
          flex-wrap: wrap;
        }
        .stars-exp-item {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 12px;
          color: #7a5c3a;
        }
        .stars-exp-pill {
          background: #c8956c;
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 99px;
        }
        .stars-exp-divider {
          width: 1px;
          height: 20px;
          background: #e8d5bf;
        }

        .account-tabs {
          display: flex;
          border-bottom: 2px solid #f0ece8;
          margin-bottom: 20px;
          gap: 0;
        }
        .account-tab {
          padding: 10px 20px;
          background: none;
          border: none;
          font-size: 14px;
          font-weight: 600;
          color: #aaa;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          margin-bottom: -2px;
          transition: color 0.2s, border-color 0.2s;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .account-tab.active { color: #1a1a1a; border-bottom-color: #c8956c; }
        .tab-count {
          background: #f0ece8;
          color: #888;
          font-size: 11px;
          padding: 1px 7px;
          border-radius: 99px;
          font-weight: 600;
        }

        .account-loading-inline {
          display: flex;
          justify-content: center;
          padding: 40px;
        }

        .account-empty {
          text-align: center;
          padding: 48px 16px;
          color: #aaa;
        }
        .account-empty-icon { font-size: 40px; margin-bottom: 12px; }
        .account-empty p { font-size: 15px; margin: 0 0 16px; }
        .account-shop-btn {
          display: inline-block;
          padding: 11px 24px;
          background: #1a1a1a;
          color: #fff;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          transition: background 0.2s;
        }
        .account-shop-btn:hover { background: #c8956c; }

        .orders-list { display: flex; flex-direction: column; gap: 14px; }
        .order-card {
          background: #fff;
          border: 1px solid #f0ece8;
          border-radius: 16px;
          padding: 18px 20px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
        }
        .order-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }
        .order-id { font-size: 13px; font-weight: 700; color: #1a1a1a; font-family: monospace; }
        .order-date { font-size: 12px; color: #aaa; margin-top: 2px; }
        .order-status-badge {
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 99px;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }
        .order-items-preview {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }
        .order-item-thumb {
          position: relative;
          width: 52px;
          height: 52px;
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid #f0ece8;
          flex-shrink: 0;
        }
        .order-item-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .order-item-emoji {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }
        .order-item-qty {
          position: absolute;
          bottom: 2px;
          right: 3px;
          font-size: 9px;
          font-weight: 700;
          color: #fff;
          background: rgba(0,0,0,0.55);
          border-radius: 4px;
          padding: 1px 3px;
          line-height: 1.3;
        }
        .order-item-more {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
          color: #888;
          background: #f8f6f3;
        }
        .order-item-names {
          font-size: 12px;
          color: #888;
          flex: 1;
          min-width: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .order-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid #f5f2ef;
          padding-top: 12px;
        }
        .order-total { font-size: 16px; font-weight: 700; color: #1a1a1a; }
        .order-payment-status {
          font-size: 12px;
          font-weight: 600;
          padding: 3px 10px;
          border-radius: 99px;
          background: #f0fdf4;
          color: #16a34a;
        }
        .order-payment-status[data-status="pending"] { background: #fffbeb; color: #d97706; }
        .order-payment-status[data-status="failed"] { background: #fef2f2; color: #dc2626; }
        .order-payment-status[data-status="cod_pending"] { background: #eff6ff; color: #2563eb; }

        .transactions-list { display: flex; flex-direction: column; }
        .transaction-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 0;
          border-bottom: 1px solid #f5f2ef;
        }
        .transaction-reason { font-size: 14px; font-weight: 600; color: #1a1a1a; }
        .transaction-date { font-size: 12px; color: #aaa; margin-top: 2px; }
        .transaction-delta {
          font-size: 15px;
          font-weight: 700;
        }
        .transaction-delta { display: flex; align-items: center; gap: 4px; }
        .transaction-delta.positive { color: #16a34a; }
        .transaction-delta.negative { color: #dc2626; }
      `}</style>
    </div>
  );
}

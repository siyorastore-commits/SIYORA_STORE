"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { OrderForm } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

// ─── Validation ───────────────────────────────────────────────────────────────
function validateForm(
  form: OrderForm,
): Partial<Record<keyof OrderForm, string>> {
  const errors: Partial<Record<keyof OrderForm, string>> = {};

  if (!form.name.trim() || form.name.trim().length < 2)
    errors.name = "Please enter your full name";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.email.trim() || !emailRegex.test(form.email.trim()))
    errors.email = "Please enter a valid email address";

  const cleanPhone = form.phone.replace(/[\s\-+()\u00a0]/g, "");
  if (!cleanPhone || !/^[6-9]\d{9}$/.test(cleanPhone))
    errors.phone = "Please enter a valid 10-digit Indian mobile number";

  if (!form.address.trim() || form.address.trim().length < 10)
    errors.address = "Please enter your complete address (min 10 characters)";

  if (!form.city.trim() || form.city.trim().length < 2)
    errors.city = "Please enter your city";

  if (!/^\d{6}$/.test(form.pincode.trim()))
    errors.pincode = "Please enter a valid 6-digit pincode";

  return errors;
}

// ─── Animation variants ───────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const errorAnim = {
  hidden: { opacity: 0, y: -6, height: 0 },
  visible: { opacity: 1, y: 0, height: "auto", transition: { duration: 0.2 } },
  exit: { opacity: 0, y: -4, height: 0, transition: { duration: 0.15 } },
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const shipping = cartTotal >= 999 ? 0 : 69;
  const grandTotal = cartTotal + shipping;

  const [form, setForm] = useState<OrderForm>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "Maharashtra",
    pincode: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof OrderForm, string>>
  >({});
  const [loading, setLoading] = useState(false);

  const update = (key: keyof OrderForm, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const handlePay = async () => {
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstKey = Object.keys(validationErrors)[0];
      document
        .getElementById(`field-${firstKey}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setLoading(true);

    const orderData = {
      customer_name: form.name,
      customer_email: form.email,
      customer_phone: form.phone,
      shipping_address: {
        address: form.address,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
      },
      items: cartItems,
      total_amount: grandTotal,
    };

    try {
      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Pass full orderData so a pending record is saved immediately
        body: JSON.stringify({ amount: grandTotal, orderData }),
      });
      const { orderId: razorpayOrderId } = await orderRes.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: grandTotal * 100,
        currency: "INR",
        name: "Siyora",
        description: "Fashion Order",
        order_id: razorpayOrderId,
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: "#E91E8C" },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          const verifyRes = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...response, orderData }),
          });
          const data = await verifyRes.json();
          if (data.success) {
            clearCart();
            router.push(`/order-success?order=${response.razorpay_order_id}`);
          } else {
            alert("Payment verification failed. Contact support.");
          }
        },
        modal: {
          // User closed the Razorpay modal without paying — record stays as "pending"
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch {
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
    // Note: setLoading(false) is NOT in a finally block here intentionally.
    // The button stays in "Processing…" state while the Razorpay modal is open.
    // It resets via ondismiss (user closes modal) or after the handler completes.
  };

  const fields: [string, keyof OrderForm, string, string, boolean][] = [
    ["Full Name", "name", "text", "Jane Doe", false],
    ["Email Address", "email", "email", "your@email.com", false],
    ["Phone Number", "phone", "tel", "98765 43210", false],
    ["Full Address", "address", "text", "123, Street Name, Area", true],
    ["City", "city", "text", "Mumbai", false],
    ["Pincode", "pincode", "text", "400001", false],
  ];

  return (
    <>
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />

      <motion.section
        initial="hidden"
        animate="visible"
        variants={stagger}
        style={{ padding: "60px 5% 80px", maxWidth: 1200, margin: "0 auto" }}
      >
        {/* Header */}
        <motion.div variants={fadeUp} style={{ marginBottom: 40 }}>
          <h1
            style={{
              fontFamily: "var(--serif)",
              fontSize: "clamp(32px, 5vw, 48px)",
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            Checkout
          </h1>
          <p style={{ color: "var(--muted)", fontSize: 14 }}>
            Almost there! Fill in your details and place your order.
          </p>
        </motion.div>

        <div className="checkout-main">
          {/* ── Left: Form ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Shipping details */}
            <motion.div
              variants={fadeUp}
              style={{
                background: "white",
                borderRadius: 24,
                padding: 32,
                border: "1px solid var(--border)",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--serif)",
                  fontSize: 22,
                  fontWeight: 700,
                  marginBottom: 24,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                📦 Shipping Details
              </h3>
              <div className="checkout-fields">
                {fields.map(([label, key, type, ph, full]) => (
                  <div
                    key={key}
                    id={`field-${key}`}
                    style={{
                      gridColumn: full ? "1 / -1" : undefined,
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                    }}
                  >
                    <label className="form-label">{label} *</label>
                    <input
                      className="form-input"
                      type={type}
                      placeholder={ph}
                      value={form[key]}
                      onChange={(e) => update(key, e.target.value)}
                      style={{
                        borderColor: errors[key] ? "#EF4444" : undefined,
                        background: errors[key]
                          ? "rgba(239,68,68,0.03)"
                          : undefined,
                        transition: "border-color 0.2s, background 0.2s",
                      }}
                    />
                    <AnimatePresence>
                      {errors[key] && (
                        <motion.span
                          key={`err-${key}`}
                          variants={errorAnim}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          style={{
                            fontSize: 11,
                            color: "#EF4444",
                            overflow: "hidden",
                            display: "block",
                          }}
                        >
                          ⚠ {errors[key]}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 6 }}
                >
                  <label className="form-label">State</label>
                  <select
                    className="form-input form-select"
                    value={form.state}
                    onChange={(e) => update("state", e.target.value)}
                  >
                    {[
                      "Andhra Pradesh",
                      "Arunachal Pradesh",
                      "Assam",
                      "Bihar",
                      "Chhattisgarh",
                      "Goa",
                      "Gujarat",
                      "Haryana",
                      "Himachal Pradesh",
                      "Jharkhand",
                      "Karnataka",
                      "Kerala",
                      "Madhya Pradesh",
                      "Maharashtra",
                      "Manipur",
                      "Meghalaya",
                      "Mizoram",
                      "Nagaland",
                      "Odisha",
                      "Punjab",
                      "Rajasthan",
                      "Sikkim",
                      "Tamil Nadu",
                      "Telangana",
                      "Tripura",
                      "Uttar Pradesh",
                      "Uttarakhand",
                      "West Bengal",
                      "Andaman and Nicobar Islands",
                      "Chandigarh",
                      "Dadra and Nagar Haveli and Daman and Diu",
                      "Delhi",
                      "Jammu and Kashmir",
                      "Ladakh",
                      "Lakshadweep",
                      "Puducherry",
                    ].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Payment method — online only */}
            <motion.div
              variants={fadeUp}
              style={{
                background: "white",
                borderRadius: 24,
                padding: 32,
                border: "1px solid var(--border)",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--serif)",
                  fontSize: 22,
                  fontWeight: 700,
                  marginBottom: 20,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                💳 Payment Method
              </h3>
              <div
                style={{
                  border: "2px solid var(--pink)",
                  borderRadius: 14,
                  padding: "18px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  background: "rgba(233,30,140,0.03)",
                }}
              >
                <span style={{ fontSize: 28 }}>💳</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>
                    Online Payment
                  </div>
                  <div style={{ fontSize: 13, color: "var(--muted)" }}>
                    UPI, Cards, Netbanking via Razorpay
                  </div>
                </div>
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: "var(--pink)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: 13,
                  }}
                >
                  ✓
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── Right: Order Summary ── */}
          <motion.div
            variants={fadeUp}
            className="order-summary-card"
            style={{
              background: "white",
              borderRadius: 24,
              padding: 32,
              border: "1px solid var(--border)",
              position: "sticky",
              top: 120,
            }}
          >
            <h3
              style={{
                fontFamily: "var(--serif)",
                fontSize: 22,
                fontWeight: 700,
                marginBottom: 24,
              }}
            >
              Order Summary
            </h3>

            {cartItems.length === 0 ? (
              <p
                style={{
                  fontSize: 14,
                  color: "var(--muted)",
                  textAlign: "center",
                  padding: "32px 0",
                }}
              >
                Your bag is empty.
              </p>
            ) : (
              <>
                {cartItems.map((item) => (
                  <div
                    key={item.cartId}
                    style={{
                      display: "flex",
                      gap: 14,
                      alignItems: "center",
                      padding: "14px 0",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    <div
                      style={{
                        width: 64,
                        height: 76,
                        borderRadius: 12,
                        background: item.bgColor,
                        overflow: "hidden",
                        flexShrink: 0,
                      }}
                    >
                      {item.media?.[0]?.src ? (
                        <img src={item.media[0].src} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>{item.emoji}</div>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontFamily: "var(--serif)",
                          fontSize: 15,
                          fontWeight: 600,
                        }}
                      >
                        {item.name}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "var(--muted)",
                          marginTop: 2,
                        }}
                      >
                        Qty: {item.qty}
                        {item.selectedSize ? ` · ${item.selectedSize}` : ""}
                      </div>
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--serif)",
                        fontSize: 16,
                        fontWeight: 700,
                      }}
                    >
                      ₹{(item.price * item.qty).toLocaleString()}
                    </div>
                  </div>
                ))}

                <div
                  style={{
                    height: 1,
                    background: "var(--border)",
                    margin: "20px 0",
                  }}
                />
                {[
                  ["Subtotal", `₹${cartTotal.toLocaleString()}`],
                  ["Shipping", shipping === 0 ? "FREE" : `₹${shipping}`],
                ].map(([label, val]) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 14,
                      color: "var(--muted)",
                      marginBottom: 10,
                    }}
                  >
                    <span>{label}</span>
                    <span
                      style={{
                        color: val === "FREE" ? "var(--coral)" : "inherit",
                        fontWeight: val === "FREE" ? 600 : 400,
                      }}
                    >
                      {val}
                    </span>
                  </div>
                ))}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingTop: 16,
                    borderTop: "2px solid var(--dark)",
                  }}
                >
                  <span style={{ fontSize: 15, fontWeight: 600 }}>Total</span>
                  <span
                    style={{
                      fontFamily: "var(--serif)",
                      fontSize: 28,
                      fontWeight: 700,
                    }}
                  >
                    ₹{grandTotal.toLocaleString()}
                  </span>
                </div>
              </>
            )}

            <motion.button
              whileHover={
                cartItems.length > 0
                  ? {
                      scale: 1.02,
                      boxShadow: "0 14px 40px rgba(233,30,140,0.38)",
                    }
                  : {}
              }
              whileTap={cartItems.length > 0 ? { scale: 0.97 } : {}}
              onClick={handlePay}
              disabled={loading || cartItems.length === 0}
              style={{
                width: "100%",
                background: "linear-gradient(135deg,var(--pink),var(--coral))",
                color: "white",
                padding: 20,
                borderRadius: 16,
                fontSize: 12,
                letterSpacing: "2.5px",
                fontWeight: 700,
                textTransform: "uppercase",
                border: "none",
                cursor: loading
                  ? "wait"
                  : cartItems.length === 0
                    ? "not-allowed"
                    : "pointer",
                marginTop: 24,
                opacity: cartItems.length === 0 ? 0.5 : 1,
                boxShadow: "0 8px 30px rgba(233,30,140,0.25)",
              }}
            >
              {loading
                ? "Processing…"
                : `Pay ₹${grandTotal.toLocaleString()} Securely →`}
            </motion.button>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                fontSize: 11,
                color: "var(--muted)",
                marginTop: 12,
              }}
            >
              🔒 SSL Secured · Powered by Razorpay
            </div>
          </motion.div>
        </div>
      </motion.section>
    </>
  );
}

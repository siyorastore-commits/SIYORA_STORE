"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      router.replace("/admin/dashboard");
    } else {
      const { error: msg } = await res.json();
      setError(msg || "Invalid credentials");
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #FFF0E8, #FFE8F0)",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: "48px 40px",
          width: "100%",
          maxWidth: 400,
          boxShadow: "0 20px 60px rgba(180,80,80,0.12)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div
            style={{
              fontFamily: "var(--serif)",
              fontSize: 32,
              fontWeight: 700,
              color: "#180A08",
              letterSpacing: "-0.5px",
            }}
          >
            Siyora
          </div>
          <div
            style={{
              fontSize: 11,
              letterSpacing: "4px",
              color: "#E91E8C",
              textTransform: "uppercase",
              fontWeight: 600,
              marginTop: 4,
            }}
          >
            Admin Panel
          </div>
        </div>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label
              style={{ fontSize: 11, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: "#7A5555", display: "block", marginBottom: 6 }}
            >
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "1.5px solid #e8ddd8",
                borderRadius: 8,
                fontSize: 15,
                outline: "none",
                boxSizing: "border-box",
                fontFamily: "var(--sans)",
              }}
            />
          </div>

          <div>
            <label
              style={{ fontSize: 11, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: "#7A5555", display: "block", marginBottom: 6 }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "1.5px solid #e8ddd8",
                borderRadius: 8,
                fontSize: 15,
                outline: "none",
                boxSizing: "border-box",
                fontFamily: "var(--sans)",
              }}
            />
          </div>

          {error && (
            <div
              style={{
                background: "#fff0f0",
                border: "1px solid #ffcccc",
                borderRadius: 8,
                padding: "10px 14px",
                fontSize: 13,
                color: "#cc3333",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? "#ccc" : "#E91E8C",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "14px",
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: "1px",
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: 8,
              fontFamily: "var(--sans)",
            }}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

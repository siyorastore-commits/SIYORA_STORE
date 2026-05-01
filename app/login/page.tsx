"use client";
import { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { Star } from "lucide-react";

type Step = "phone" | "otp" | "profile";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useUser();

  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  function formatPhone(raw: string) {
    return raw.replace(/\D/g, "").slice(0, 10);
  }

  async function handleSendOTP(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (phone.length !== 10) { setError("Enter a valid 10-digit mobile number"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: `+91${phone}` }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setStep("otp");
      startResendCooldown();
    } catch (err: any) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOTP(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const otpStr = otp.join("");
    if (otpStr.length !== 6) { setError("Enter the 6-digit OTP"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: `+91${phone}`, otp: otpStr }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      if (data.isNewUser) {
        localStorage.setItem("siyora_show_quiz", "true");
        setStep("profile");
      } else {
        await refreshUser();
        router.push(searchParams.get("redirect") || "/");
      }
    } catch (err: any) {
      setError(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim()) { setError("Please enter your name"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim() || undefined }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      await refreshUser();
      router.push(searchParams.get("redirect") || "/");
    } catch (err: any) {
      setError(err.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  }

  function handleOTPInput(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    if (digit && index < 5) otpRefs.current[index + 1]?.focus();
  }

  function handleOTPKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otp[index] && index > 0) otpRefs.current[index - 1]?.focus();
  }

  function handleOTPPaste(e: React.ClipboardEvent) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) { setOtp(pasted.split("")); otpRefs.current[5]?.focus(); }
  }

  function startResendCooldown() {
    setResendCooldown(30);
    const interval = setInterval(() => {
      setResendCooldown((c) => { if (c <= 1) { clearInterval(interval); return 0; } return c - 1; });
    }, 1000);
  }

  async function handleResend() {
    if (resendCooldown > 0) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: `+91${phone}` }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setOtp(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
      startResendCooldown();
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <Link href="/" className="login-logo">Si<span>y</span>ora</Link>

        {/* ── STEP 1: Phone ── */}
        {step === "phone" && (
          <>
            <div className="login-header">
              <h1>Welcome back</h1>
              <p>Sign in or create your account with your phone number</p>
            </div>
            <form onSubmit={handleSendOTP} className="login-form">
              <div className="phone-input-wrap">
                <span className="phone-prefix">+91</span>
                <input
                  type="tel" inputMode="numeric" placeholder="98765 43210"
                  value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))}
                  maxLength={10} className="phone-input" autoFocus
                />
              </div>
              {error && <p className="login-error">{error}</p>}
              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? <span className="login-spinner" /> : "Send OTP"}
              </button>
            </form>
            <p className="login-terms">
              By continuing, you agree to our <Link href="/terms">Terms</Link> &amp;{" "}
              <Link href="/privacy">Privacy Policy</Link>
            </p>
            <div className="login-stars-teaser">
              <Star size={16} fill="#c8956c" stroke="#c8956c" />
              <span>New members get <strong>50 Siyora Stars</strong> on signup!</span>
            </div>
          </>
        )}

        {/* ── STEP 2: OTP ── */}
        {step === "otp" && (
          <>
            <div className="login-header">
              <h1>Enter OTP</h1>
              <p>We sent a 6-digit code to <strong>+91 {phone}</strong></p>
            </div>
            <form onSubmit={handleVerifyOTP} className="login-form">
              <div className="otp-boxes" onPaste={handleOTPPaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i} ref={(el) => { otpRefs.current[i] = el; }}
                    type="tel" inputMode="numeric" maxLength={1} value={digit}
                    onChange={(e) => handleOTPInput(i, e.target.value)}
                    onKeyDown={(e) => handleOTPKeyDown(i, e)}
                    className={`otp-box ${digit ? "filled" : ""}`} autoFocus={i === 0}
                  />
                ))}
              </div>
              {error && <p className="login-error">{error}</p>}
              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? <span className="login-spinner" /> : "Verify & Continue"}
              </button>
            </form>
            <div className="otp-footer">
              <button className="otp-back"
                onClick={() => { setStep("phone"); setError(""); setOtp(["", "", "", "", "", ""]); }}>
                ← Change number
              </button>
              <button className={`otp-resend ${resendCooldown > 0 ? "disabled" : ""}`}
                onClick={handleResend} disabled={resendCooldown > 0}>
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
              </button>
            </div>
          </>
        )}

        {/* ── STEP 3: Profile (new users only) ── */}
        {step === "profile" && (
          <>
            <div className="login-header">
              <h1>One last thing ✨</h1>
              <p>Tell us your name so we can personalise your experience</p>
            </div>
            <form onSubmit={handleSaveProfile} className="login-form">
              <div className="profile-field">
                <label className="profile-label">Your name <span className="required">*</span></label>
                <input
                  type="text" placeholder="e.g. Priya Sharma"
                  value={name} onChange={(e) => setName(e.target.value)}
                  className="profile-input" autoFocus autoComplete="name"
                />
              </div>
              <div className="profile-field">
                <label className="profile-label">
                  Email <span className="optional">(optional)</span>
                </label>
                <input
                  type="email" placeholder="priya@example.com"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  className="profile-input" autoComplete="email"
                />
              </div>
              {error && <p className="login-error">{error}</p>}
              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? <span className="login-spinner" /> : "Let's go →"}
              </button>
            </form>
            <div className="profile-stars-note">
              <Star size={14} fill="#c8956c" stroke="#c8956c" />
              <span>Your <strong>50 stars</strong> are already waiting for you!</span>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        .login-page {
          min-height: 92vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #faf9f7;
          padding: 0 16px;
        }
        .login-card {
          background: #fff;
          border-radius: 20px;
          padding: 40px 36px;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 4px 40px rgba(0,0,0,0.08);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
        }
        .login-logo { font-size: 28px; font-weight: 800; letter-spacing: -1px; color: #1a1a1a; text-decoration: none; }
        .login-logo span { color: #c8956c; }
        .login-header { text-align: center; }
        .login-header h1 { font-size: 22px; font-weight: 700; color: #1a1a1a; margin: 0 0 6px; }
        .login-header p { font-size: 14px; color: #666; margin: 0; }
        .login-form { width: 100%; display: flex; flex-direction: column; gap: 14px; }
        .phone-input-wrap {
          display: flex; align-items: center;
          border: 1.5px solid #e0e0e0; border-radius: 12px; overflow: hidden; transition: border-color 0.2s;
        }
        .phone-input-wrap:focus-within { border-color: #c8956c; }
        .phone-prefix {
          padding: 14px 14px 14px 16px; font-size: 15px; font-weight: 600; color: #1a1a1a;
          background: #f8f6f3; border-right: 1.5px solid #e0e0e0; white-space: nowrap;
        }
        .phone-input { flex: 1; padding: 14px 16px; font-size: 16px; border: none; outline: none; background: transparent; letter-spacing: 0.5px; }
        .login-btn {
          width: 100%; padding: 15px; background: #1a1a1a; color: #fff; border: none; border-radius: 12px;
          font-size: 15px; font-weight: 600; cursor: pointer; transition: background 0.2s, transform 0.1s;
          display: flex; align-items: center; justify-content: center; min-height: 52px;
        }
        .login-btn:hover:not(:disabled) { background: #c8956c; }
        .login-btn:active:not(:disabled) { transform: scale(0.98); }
        .login-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .login-spinner {
          width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .login-error { font-size: 13px; color: #e53e3e; text-align: center; margin: 0; }
        .login-terms { font-size: 12px; color: #999; text-align: center; margin: 0; }
        .login-terms a { color: #c8956c; text-decoration: none; }
        .login-stars-teaser {
          display: flex; align-items: center; gap: 8px;
          background: #fdf6ee; border: 1px solid #f0dcc8; border-radius: 10px;
          padding: 12px 16px; font-size: 13px; color: #7a5c3a; width: 100%;
        }
        .otp-boxes { display: flex; gap: 10px; justify-content: center; }
        .otp-box {
          width: 48px; height: 56px; text-align: center; font-size: 22px; font-weight: 700;
          border: 1.5px solid #e0e0e0; border-radius: 12px; outline: none;
          transition: border-color 0.2s, background 0.2s; background: #fafafa;
        }
        .otp-box:focus { border-color: #c8956c; background: #fff; }
        .otp-box.filled { border-color: #1a1a1a; background: #fff; }
        .otp-footer { display: flex; justify-content: space-between; width: 100%; font-size: 13px; }
        .otp-back, .otp-resend { background: none; border: none; cursor: pointer; font-size: 13px; padding: 0; }
        .otp-back { color: #666; }
        .otp-resend { color: #c8956c; font-weight: 600; }
        .otp-resend.disabled { color: #aaa; cursor: not-allowed; }
        /* Profile step */
        .profile-field { width: 100%; display: flex; flex-direction: column; gap: 6px; }
        .profile-label { font-size: 13px; font-weight: 600; color: #444; }
        .required { color: #c8956c; }
        .optional { font-weight: 400; color: #aaa; }
        .profile-input {
          width: 100%; padding: 14px 16px; font-size: 15px;
          border: 1.5px solid #e0e0e0; border-radius: 12px; background: #fafafa;
          transition: border-color 0.2s, background 0.2s;
        }
        .profile-input:focus { border-color: #c8956c; background: #fff; outline: none; }
        .profile-stars-note {
          display: flex; align-items: center; gap: 8px;
          background: #fdf6ee; border: 1px solid #f0dcc8; border-radius: 10px;
          padding: 12px 16px; font-size: 13px; color: #7a5c3a; width: 100%;
        }
        @media (max-width: 480px) {
          .login-card { padding: 32px 20px; }
          .otp-box { width: 42px; height: 50px; font-size: 20px; }
        }
      `}</style>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { Star } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { cartCount, setCartOpen } = useCart();
  const { user, loading: userLoading } = useUser();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Close mobile menu on route changes / outside clicks
  useEffect(() => {
    if (!mobileOpen) return;
    const close = (e: MouseEvent) => {
      const nav = document.querySelector(".nav");
      if (nav && !nav.contains(e.target as Node)) setMobileOpen(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [mobileOpen]);

  return (
    <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-inner">
        <Link href="/" className="logo">
          Si<span>y</span>ora
        </Link>

        <ul className="nav-links">
          <li><Link href="/shop" className="nav-link">Shop</Link></li>
          <li><Link href="/about" className="nav-link">About</Link></li>
          <li><Link href="/contact" className="nav-link">Contact</Link></li>
        </ul>

        <div className="nav-right">
          {!userLoading && (
            user ? (
              <Link href="/account" className="nav-avatar-btn" aria-label="My account">
                <span className="nav-avatar-circle">
                  {(user.name?.[0] || user.phone.slice(-2)[0]).toUpperCase()}
                </span>
                <span className="nav-avatar-stars">
                  <Star size={9} fill="#fff" stroke="#fff" />
                  {user.siyora_stars}
                </span>
              </Link>
            ) : (
              <Link href="/login" className="nav-login-btn">Login</Link>
            )
          )}

          <button className="cart-btn" onClick={() => setCartOpen(true)}>
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            Bag
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>

          <button
            className={`nav-toggle ${mobileOpen ? "open" : ""}`}
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`nav-mobile ${mobileOpen ? "open" : ""}`}>
        <Link href="/shop" className="nav-mobile-link" onClick={() => setMobileOpen(false)}>Shop</Link>
        <Link href="/about" className="nav-mobile-link" onClick={() => setMobileOpen(false)}>About</Link>
        <Link href="/contact" className="nav-mobile-link" onClick={() => setMobileOpen(false)}>Contact</Link>
        {user ? (
          <Link href="/account" className="nav-mobile-link nav-mobile-account" onClick={() => setMobileOpen(false)}>
            <span className="nav-mobile-avatar">
              {(user.name?.[0] || user.phone.slice(-2)[0]).toUpperCase()}
            </span>
            <span>
              <span className="nav-mobile-account-name">{user.name || "My Account"}</span>
              <span className="nav-mobile-account-stars">
                <Star size={11} fill="#c8956c" stroke="#c8956c" />
                {user.siyora_stars} stars
              </span>
            </span>
          </Link>
        ) : (
          <Link href="/login" className="nav-mobile-link" onClick={() => setMobileOpen(false)}>Login / Sign up</Link>
        )}
      </div>
    </nav>
  );
}

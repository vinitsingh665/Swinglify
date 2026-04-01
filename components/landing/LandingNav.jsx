"use client";

import Link from 'next/link';

export default function LandingNav() {
  return (
    <nav className="landing-nav">
      <Link href="/" className="landing-logo">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
        <span>Swinglify</span>
      </Link>

      <div className="landing-nav-links">
        <a href="#features">Features</a>
        <Link href="/screener">Screener</Link>
        <Link href="/community">Community</Link>
      </div>

      <Link href="/dashboard" className="landing-nav-cta">
        Launch App
      </Link>
    </nav>
  );
}

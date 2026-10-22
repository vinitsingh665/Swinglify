"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`landing-nav-wrapper ${scrolled ? 'is-scrolled' : ''}`}>
      <nav className="landing-nav-inner">
        {/* Brand Logo */}
        <Link href="/" className="landing-brand">
          <div className="landing-brand-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <span className="landing-brand-text">Swinglify</span>
          <span className="landing-brand-badge">BETA</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="landing-nav-links">
          <a href="#features" className="landing-link">Features</a>
          <Link href="/screener" className="landing-link">Screener</Link>
          <Link href="/markets" className="landing-link">Markets</Link>
          <Link href="/compare" className="landing-link">Compare</Link>
          <Link href="/community" className="landing-link">Community</Link>
        </div>

        {/* Action CTAs */}
        <div className="landing-nav-actions">
          <Link href="/auth/signin" className="landing-btn-ghost">
            Sign In
          </Link>
          <Link href="/dashboard" className="landing-btn-terminal">
            <span>Launch Terminal</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>

          {/* Mobile hamburger button */}
          <button 
            className="landing-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="landing-mobile-menu">
          <a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
          <Link href="/screener" onClick={() => setMobileMenuOpen(false)}>Stock Screener</Link>
          <Link href="/markets" onClick={() => setMobileMenuOpen(false)}>Live Markets</Link>
          <Link href="/compare" onClick={() => setMobileMenuOpen(false)}>Compare Stocks</Link>
          <Link href="/community" onClick={() => setMobileMenuOpen(false)}>Trader Community</Link>
          <Link href="/all-stocks" onClick={() => setMobileMenuOpen(false)}>All Stocks Directory</Link>
          <div className="mobile-menu-cta">
            <Link href="/dashboard" className="landing-btn-terminal full-width" onClick={() => setMobileMenuOpen(false)}>
              Launch Free Terminal →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import UserMenu from './UserMenu';

const ACCENT_COLORS = [
  { id: 'indigo', val: '#6366f1' },
  { id: 'blue', val: '#3b82f6' },
  { id: 'gold', val: '#d4af37' },
  { id: 'orange', val: '#f97316' },
  { id: 'green', val: '#22c55e' },
  { id: 'cyan', val: '#06b6d4' },
  { id: 'purple', val: '#a855f7' },
  { id: 'rose', val: '#f43f5e' },
];

function lightenHex(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, (num >> 16) + Math.round(2.55 * percent));
  const g = Math.min(255, ((num >> 8) & 0x00FF) + Math.round(2.55 * percent));
  const b = Math.min(255, (num & 0x0000FF) + Math.round(2.55 * percent));
  return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
}

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function Sidebar({ isOpen, setIsOpen }) {
  const pathname = usePathname();
  const [accentOpen, setAccentOpen] = useState(false);
  const [currentAccent, setCurrentAccent] = useState('#6366f1');
  const accentRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('swinglify_accent') || '#6366f1';
    setCurrentAccent(saved);
  }, []);

  // Close accent popup on outside click
  useEffect(() => {
    const handler = (e) => {
      if (accentRef.current && !accentRef.current.contains(e.target)) setAccentOpen(false);
    };
    if (accentOpen) document.addEventListener('pointerdown', handler);
    return () => document.removeEventListener('pointerdown', handler);
  }, [accentOpen]);

  const applyAccent = (color) => {
    setCurrentAccent(color);
    localStorage.setItem('swinglify_accent', color);
    document.documentElement.style.setProperty('--accent', color);
    document.documentElement.style.setProperty('--accent-hover', lightenHex(color, 25));
    document.documentElement.style.setProperty('--accent-bg', hexToRgba(color, 0.1));
    window.dispatchEvent(new Event('swinglify_settings_update'));
    setAccentOpen(false);
  };

  return (
    <aside className="sidebar">
      <Link href="/" className="sidebar-logo" style={{ display: 'block' }}>
        <img src="/logo.png" alt="Swinglify" width="30" height="30" />
      </Link>

      <nav className="sidebar-nav">
        <div className="sidebar-nav-top">
          {/* Dashboard */}
          <Link href="/dashboard" className={`sidebar-icon ${pathname === '/dashboard' ? 'active' : ''}`} title="Dashboard" aria-label="Stock Trading Dashboard">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
          </Link>

          {/* Markets */}
          <Link href="/markets" className={`sidebar-icon ${pathname?.startsWith('/markets') ? 'active' : ''}`} title="Markets" aria-label="Live Market Data for NSE and BSE">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 12l2-2 4 4 6-8 6 6" />
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h7" />
            </svg>
          </Link>

          {/* Portfolio */}
          <Link href="/portfolio" className={`sidebar-icon ${pathname?.startsWith('/portfolio') ? 'active' : ''}`} title="Portfolio" aria-label="Stock Portfolio Tracker">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </Link>

          {/* Screener */}
          <Link href="/screener" className={`sidebar-icon ${pathname?.startsWith('/screener') ? 'active' : ''}`} title="Screener" aria-label="Stock Screener with Technical Filters">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </Link>

          {/* Analytics */}
          <Link href="/analytics" className={`sidebar-icon ${pathname?.startsWith('/analytics') ? 'active' : ''}`} title="Analytics" aria-label="Advanced Stock Analytics">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 12a9 9 0 11-6.219-8.56" />
              <path d="M21 3v9h-9" />
            </svg>
          </Link>

          {/* Watchlist */}
          <Link href="/watchlist" className={`sidebar-icon ${pathname?.startsWith('/watchlist') ? 'active' : ''}`} title="Watchlist" aria-label="Stock Watchlist Tracker">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </Link>

          {/* Alerts */}
          <Link href="/alerts" className={`sidebar-icon ${pathname?.startsWith('/alerts') ? 'active' : ''}`} title="Alerts" aria-label="Stock Price Alerts">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
          </Link>

          {/* Compare */}
          <Link href="/compare" className={`sidebar-icon ${pathname?.startsWith('/compare') ? 'active' : ''}`} title="Compare" aria-label="Compare Stocks Side by Side">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="1" y="4" width="22" height="16" rx="2" />
              <line x1="12" y1="4" x2="12" y2="20" />
            </svg>
          </Link>
        </div>

        <div className="sidebar-divider"></div>

        <div className="sidebar-nav-bottom">
          {/* Community */}
          <Link href="/community" className={`sidebar-icon ${pathname?.startsWith('/community') ? 'active' : ''}`} title="Community" aria-label="Stock Trading Community Forum">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87" />
              <path d="M16 3.13a4 4 0 010 7.75" />
            </svg>
          </Link>

          {/* Settings */}
          <Link href="/settings" className={`sidebar-icon ${pathname.startsWith('/settings') ? 'active' : ''}`} title="Settings" aria-label="Account Settings and Preferences">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
            </svg>
          </Link>

          {/* Accent Color Picker */}
          <div className="sidebar-accent-wrapper" ref={accentRef}>
            <button
              className="sidebar-icon"
              title="Accent Color"
              onClick={() => setAccentOpen(o => !o)}
              style={{ color: currentAccent }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" />
              </svg>
            </button>

            {accentOpen && (
              <div className="sidebar-accent-popup">
                <div className="sidebar-accent-title">Accent Color</div>
                <div className="sidebar-accent-grid">
                  {ACCENT_COLORS.map(c => (
                    <button
                      key={c.id}
                      className={`sidebar-accent-swatch ${currentAccent === c.val ? 'active' : ''}`}
                      style={{ background: c.val }}
                      title={c.id}
                      onClick={() => applyAccent(c.val)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Account */}
          <UserMenu />
        </div>
      </nav>
    </aside>
  );
}

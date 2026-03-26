"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import './MobileBottomNav.css';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);
  const [theme, setTheme] = useState('dark');
  const menuRef = useRef(null);

  useEffect(() => {
    const handleThemeEvent = () => {
      const saved = localStorage.getItem('swinglify_theme') || 'dark';
      setTheme(saved);
    };
    handleThemeEvent();
    window.addEventListener('swinglify_settings_update', handleThemeEvent);
    return () => window.removeEventListener('swinglify_settings_update', handleThemeEvent);
  }, []);

  // Close profile menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    if (profileOpen) document.addEventListener('pointerdown', handler);
    return () => document.removeEventListener('pointerdown', handler);
  }, [profileOpen]);

  // Close menu on route change
  useEffect(() => { setProfileOpen(false); }, [pathname]);

  const isProfileSection = ['/portfolio', '/alerts', '/settings'].some(p => pathname?.startsWith(p));

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('swinglify_theme', next);
    window.dispatchEvent(new Event('swinglify_settings_update'));
    setProfileOpen(false);
  };

  // Hide the regular app's bottom nav entirely on the admin pages
  if (pathname.startsWith('/vinit_admin')) {
    return null;
  }

  return (
    <nav className="mob-bottom-nav">
      {/* Home */}
      <Link href="/" className={`mob-nav-item ${pathname === '/' ? 'active' : ''}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
        <span>Home</span>
      </Link>

      {/* Markets */}
      <Link href="/markets" className={`mob-nav-item ${pathname?.startsWith('/markets') || pathname?.startsWith('/analytics') || pathname?.startsWith('/compare') ? 'active' : ''}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 12l2-2 4 4 6-8 6 6" />
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h7" />
        </svg>
        <span>Markets</span>
      </Link>

      {/* Screener */}
      <Link href="/screener" className={`mob-nav-item ${pathname?.startsWith('/screener') ? 'active' : ''}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
        <span>Screener</span>
      </Link>

      {/* Watchlist */}
      <Link href="/watchlist" className={`mob-nav-item ${pathname?.startsWith('/watchlist') ? 'active' : ''}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
        <span>Watchlist</span>
      </Link>

      {/* Profile (with flyout) */}
      <div className={`mob-nav-item mob-profile-trigger ${isProfileSection ? 'active' : ''}`} ref={menuRef}>
        <button className="mob-profile-btn" onClick={() => setProfileOpen(o => !o)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span>Profile</span>
        </button>

        {profileOpen && (
          <div className="mob-profile-menu">
            <Link href="/portfolio" className="mob-pm-item" onClick={() => setProfileOpen(false)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
              Portfolio
            </Link>
            <Link href="/alerts" className="mob-pm-item" onClick={() => setProfileOpen(false)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></svg>
              Alerts
            </Link>
            <Link href="/settings" className="mob-pm-item" onClick={() => setProfileOpen(false)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" /></svg>
              Settings
            </Link>

            <div className="mob-pm-divider" />

            <button className="mob-pm-item" onClick={toggleTheme}>
              {theme === 'dark' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="4.22" x2="19.78" y2="5.64" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>
              )}
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
            <button className="mob-pm-item mob-pm-logout">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

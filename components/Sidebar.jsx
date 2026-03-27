"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import UserMenu from './UserMenu';

export default function Sidebar({ isOpen, setIsOpen }) {
  const pathname = usePathname();
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const handleThemeEvent = () => {
      const saved = localStorage.getItem('swinglify_theme') || 'dark';
      setTheme(saved);
    };
    handleThemeEvent(); // Set initial theme
    window.addEventListener('swinglify_settings_update', handleThemeEvent);
    return () => window.removeEventListener('swinglify_settings_update', handleThemeEvent);
  }, []);

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src="/logo.png" alt="Swinglify" />
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-nav-top">
          {/* Dashboard */}
          <Link href="/" className={`sidebar-icon ${pathname === '/' ? 'active' : ''}`} title="Dashboard">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
          </Link>

          {/* Markets */}
          <Link href="/markets" className={`sidebar-icon ${pathname?.startsWith('/markets') ? 'active' : ''}`} title="Markets">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 12l2-2 4 4 6-8 6 6" />
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h7" />
            </svg>
          </Link>

          {/* Portfolio */}
          <Link href="/portfolio" className={`sidebar-icon ${pathname?.startsWith('/portfolio') ? 'active' : ''}`} title="Portfolio">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </Link>

          {/* Screener */}
          <Link href="/screener" className={`sidebar-icon ${pathname?.startsWith('/screener') ? 'active' : ''}`} title="Screener">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </Link>

          {/* Analytics */}
          <Link href="/analytics" className={`sidebar-icon ${pathname?.startsWith('/analytics') ? 'active' : ''}`} title="Analytics">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 12a9 9 0 11-6.219-8.56" />
              <path d="M21 3v9h-9" />
            </svg>
          </Link>

          {/* Watchlist */}
          <Link href="/watchlist" className={`sidebar-icon ${pathname?.startsWith('/watchlist') ? 'active' : ''}`} title="Watchlist">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </Link>

          {/* Alerts */}
          <Link href="/alerts" className={`sidebar-icon ${pathname?.startsWith('/alerts') ? 'active' : ''}`} title="Alerts">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
          </Link>

          {/* Compare */}
          <Link href="/compare" className={`sidebar-icon ${pathname?.startsWith('/compare') ? 'active' : ''}`} title="Compare">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="1" y="4" width="22" height="16" rx="2" />
              <line x1="12" y1="4" x2="12" y2="20" />
            </svg>
          </Link>
        </div>

        <div className="sidebar-divider"></div>

        <div className="sidebar-nav-bottom">
          {/* Community */}
          <Link href="/community" className={`sidebar-icon ${pathname?.startsWith('/community') ? 'active' : ''}`} title="Community">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87" />
              <path d="M16 3.13a4 4 0 010 7.75" />
            </svg>
          </Link>

          {/* Settings */}
          <Link href="/settings" className={`sidebar-icon ${pathname.startsWith('/settings') ? 'active' : ''}`} title="Settings">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
            </svg>
          </Link>

          {/* Theme */}
          <button className="sidebar-icon" title="Theme" onClick={() => {
            const next = theme === 'dark' ? 'light' : 'dark';
            setTheme(next);
            localStorage.setItem('swinglify_theme', next);
            window.dispatchEvent(new Event('swinglify_settings_update'));
          }}>
            {theme === 'dark' ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="19.78" y1="19.78" x2="18.36" y2="18.36" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="19.78" y1="4.22" x2="18.36" y2="5.64" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            )}
          </button>

          {/* User Account */}
          <UserMenu />
        </div>
      </nav>
    </aside>
  );
}

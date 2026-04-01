"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, notFound } from 'next/navigation';
import { useSession } from 'next-auth/react';
import './admin.css';

const ADMIN_EMAILS = [
  "vinitsingh665@gmail.com",
  "vinits.7kushwaha@gmail.com"
];

export default function AdminLayout({ children }) {
  const { data: session, status } = useSession();
  const [theme, setThemeState] = useState('dark');
  const pathname = usePathname();
  
  // Force dark mode for admin dashboard or respect system
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.style.setProperty('--accent', '#6366f1'); // Different accent for Admin (Indigo)
    document.documentElement.style.setProperty('--accent-bg', 'rgba(99, 102, 241, 0.1)');
    
    return () => {
      // Cleanup when leaving admin
      const t = localStorage.getItem('swinglify_theme') || 'dark';
      document.documentElement.setAttribute('data-theme', t);
      
      const accent = localStorage.getItem('swinglify_accent');
      if (accent) {
        document.documentElement.style.setProperty('--accent', accent);
        try {
          const r = parseInt(accent.slice(1, 3), 16);
          const g = parseInt(accent.slice(3, 5), 16);
          const b = parseInt(accent.slice(5, 7), 16);
          document.documentElement.style.setProperty('--accent-bg', 'rgba('+r+','+g+','+b+',0.1)');
        } catch(e) {}
      } else {
        document.documentElement.style.setProperty('--accent', '#6366f1');
        document.documentElement.style.setProperty('--accent-bg', 'rgba(99, 102, 241, 0.1)');
      }
    };
  }, []);

  // Ensure hydration logic waits for NextAuth session
  if (status === 'loading') {
    return <div style={{ height: '100vh', background: '#0a0a0a' }}></div>;
  }

  // If unauthenticated or email is not recognized, immediately trigger Next.js 404
  if (status === 'unauthenticated' || !session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
    notFound(); 
  }

  return (
    <div className="admin-layout">
      {/* Sleek Admin Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-logo">S</div>
          <span>COMMAND</span>
        </div>
        <nav className="admin-nav">
          <Link href="/vinit_admin" className={`admin-nav-item ${pathname === '/vinit_admin' ? 'active' : ''}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            Overview
          </Link>
          <Link href="/vinit_admin/users" className={`admin-nav-item ${pathname === '/vinit_admin/users' ? 'active' : ''}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            Users
          </Link>
          <Link href="/vinit_admin/feedback" className={`admin-nav-item ${pathname === '/vinit_admin/feedback' ? 'active' : ''}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            Feedback
          </Link>
          <Link href="/vinit_admin/health" className={`admin-nav-item ${pathname === '/vinit_admin/health' ? 'active' : ''}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
            System Health
          </Link>
        </nav>
        <Link href="/" className="admin-nav-item admin-nav-exit">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Exit Admin
        </Link>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        {/* Admin Topbar */}
        <header className="admin-topbar">
          <div className="admin-tb-left">
            <div className="admin-status-indicator">
              <span className="live-dot"></span>
              System Online
            </div>
            <div className="admin-time" id="admin-live-time">
              {new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour12: false })} IST
            </div>
          </div>
          <div className="admin-tb-right">
             <div className="admin-profile">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Admin" />
               <span>Super Admin</span>
             </div>
          </div>
        </header>

        <div className="admin-content-scroll">
          {children}
        </div>
      </main>

      {/* Admin Mobile Bottom Nav */}
      <nav className="admin-mob-nav">
        <Link href="/vinit_admin" className={`admin-mob-item ${pathname === '/vinit_admin' ? 'active' : ''}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          Overview
        </Link>
        <Link href="/vinit_admin/users" className={`admin-mob-item ${pathname === '/vinit_admin/users' ? 'active' : ''}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          Users
        </Link>
        <Link href="/vinit_admin/feedback" className={`admin-mob-item ${pathname === '/vinit_admin/feedback' ? 'active' : ''}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
          Feedback
        </Link>
        <Link href="/vinit_admin/health" className={`admin-mob-item ${pathname === '/vinit_admin/health' ? 'active' : ''}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
          </svg>
          Health
        </Link>
        <Link href="/" className="admin-mob-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Exit
        </Link>
      </nav>
    </div>
  );
}

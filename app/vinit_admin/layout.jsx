"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './admin.css';

export default function AdminLayout({ children }) {
  const [theme, setThemeState] = useState('dark');
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [authChecking, setAuthChecking] = useState(true);
  
  // Force dark mode for admin dashboard or respect system
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.style.setProperty('--accent', '#6366f1'); // Different accent for Admin (Indigo)
    document.documentElement.style.setProperty('--accent-bg', 'rgba(99, 102, 241, 0.1)');
    
    // Check Auth session
    if (sessionStorage.getItem('swinglify_admin_auth') === 'true') {
      setIsAuthenticated(true);
    }
    setAuthChecking(false);

    return () => {
      // Cleanup when leaving admin
      const t = localStorage.getItem('swinglify_theme') || 'dark';
      document.documentElement.setAttribute('data-theme', t);
      
      const prefsStr = localStorage.getItem('swinglify_prefs');
      if (prefsStr) {
        try {
          const prefs = JSON.parse(prefsStr);
          if (prefs.accent) {
             document.documentElement.style.setProperty('--accent', prefs.accent);
             const r = parseInt(prefs.accent.slice(1, 3), 16);
             const g = parseInt(prefs.accent.slice(3, 5), 16);
             const b = parseInt(prefs.accent.slice(5, 7), 16);
             document.documentElement.style.setProperty('--accent-bg', 'rgba('+r+','+g+','+b+',0.1)');
          } else {
             document.documentElement.style.removeProperty('--accent');
             document.documentElement.style.removeProperty('--accent-bg');
          }
        } catch(e){}
      }
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await fetch('/api/vinit_admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pin })
      });

      if (res.ok) {
        sessionStorage.setItem('swinglify_admin_auth', 'true');
        setIsAuthenticated(true);
      } else {
        const data = await res.json();
        setError(data.error || 'Invalid Password. Access Denied.');
        setPin('');
      }
    } catch(err) {
      setError('Connection error while authenticating.');
      setPin('');
    }
  };

  if (authChecking) {
    return <div style={{ height: '100vh', background: '#0a0a0a' }}></div>;
  }

  if (!isAuthenticated) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', color: '#fff', flexDirection: 'column' }}>
        <div style={{ background: '#111', padding: '40px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', width: '90%', maxWidth: '400px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
          <div className="admin-logo" style={{ margin: '0 auto 20px auto', width: '60px', height: '60px', fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--accent)', borderRadius: '12px' }}>S</div>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '1.5rem', fontWeight: 600 }}>Command Center</h1>
          <p style={{ margin: '0 0 24px 0', color: '#888', fontSize: '0.9rem' }}>Enter authorized password to proceed</p>
          
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input 
              type="password" 
              value={pin}
              onChange={(e) => { setPin(e.target.value); setError(''); }}
              placeholder="Enter Password"
              style={{ padding: '12px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '1rem', textAlign: 'center', letterSpacing: '2px', outline: 'none' }}
              autoFocus
            />
            {error && <div style={{ color: '#ef4444', fontSize: '0.85rem' }}>{error}</div>}
            <button type="submit" style={{ padding: '12px', borderRadius: '8px', background: 'var(--accent)', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer', transition: '0.2s' }}>
              Authenticate
            </button>
            <Link href="/" style={{ color: '#666', fontSize: '0.85rem', textDecoration: 'none', marginTop: '8px', transition: '0.2s' }}>
              ← Return to public site
            </Link>
          </form>
        </div>
      </div>
    );
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

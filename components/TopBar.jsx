"use client";
import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import { useMarketStatus, useIndices } from '../hooks/useStockData';
import { formatNumber } from '../utils';
import NotificationDropdown from './NotificationDropdown';

export default function TopBar() {
  const { data: session, status } = useSession();
  const marketStatus = useMarketStatus();
  const { indices } = useIndices();

  // Pick key indices for pills
  const nifty = indices.find(i => i.symbol === 'NIFTY' || (i.name && i.name.includes('Nifty 50')));
  const bankNifty = indices.find(i => i.symbol === 'BANKNIFTY' || (i.name && i.name.includes('Bank')));
  const vix = indices.find(i => i.symbol === 'INDIA_VIX' || (i.name && i.name.includes('VIX')));

  return (
    <div className="topbar">
      <div className="topbar-left">
        {/* Mobile-only logo — left corner */}
        <Link href="/" className="topbar-mobile-logo">
          <img src="/logo.png" alt="Swinglify" />
        </Link>
        {nifty && (
          <div className="topbar-pill hide-on-mobile">
            <span className="pill-label">Nifty 50:</span>
            <span className={`pill-value ${(nifty.change || 0) >= 0 ? 'positive' : 'negative'}`}>
              {(nifty.change || 0) >= 0 ? '+' : ''}{nifty.change}%
            </span>
          </div>
        )}
        {bankNifty && (
          <div className="topbar-pill hide-on-mobile">
            <span className="pill-label">BankNifty:</span>
            <span className={`pill-value ${(bankNifty.change || 0) >= 0 ? 'positive' : 'negative'}`}>
              {(bankNifty.change || 0) >= 0 ? '+' : ''}{bankNifty.change}%
            </span>
          </div>
        )}
        {vix && (
          <div className="topbar-pill">
            <span className="pill-label">India VIX:</span>
            <span className="pill-value">{formatNumber(vix.value)}</span>
          </div>
        )}
        <div className="topbar-pill hide-on-mobile">
          <span className="pill-label">Exchange:</span>
          <span className="pill-value" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>NSE</span>
        </div>
      </div>

      <div className="topbar-center" style={{
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 10
      }}>
        <Link href="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          textDecoration: 'none',
          pointerEvents: 'auto'
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 4px var(--accent))' }}>
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
          </svg>
          <h1 style={{
            margin: 0,
            fontSize: '1.25rem',
            fontWeight: 600,
            color: '#ffffff',
            fontFamily: '"Quicksand", sans-serif',
            letterSpacing: '0.5px'
          }}>
            Swinglify
          </h1>
        </Link>
      </div>

      <div className="topbar-right">
        <NotificationDropdown />
        <div className="topbar-account">
          <span>
            {marketStatus.isOpen ? '🟢' : '🔴'}&nbsp;
            {marketStatus.isOpen ? 'Live' : 'Closed'}
          </span>
        </div>

        <Link href="/all-stocks" className="hide-on-mobile" style={{
          marginLeft: '8px', padding: '6px 12px', fontSize: '0.8rem', 
          fontWeight: 600, color: 'var(--text-muted)', textDecoration: 'none',
          border: '1px solid var(--border)', borderRadius: '6px', transition: 'all 0.2s'
        }} onMouseOver={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--text-dim)' }} onMouseOut={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)' }}>
          A-Z Stocks
        </Link>
        
        {/* Sign In Button for unauthenticated users */}
        {status !== 'loading' && !session && (
          <button 
            className="hide-on-mobile"
            onClick={() => window.location.href = '/auth/signin'}
            style={{
              marginLeft: '12px',
              padding: '6px 16px',
              borderRadius: '8px',
              backgroundColor: 'var(--accent)',
              color: 'var(--bg-primary)',
              border: 'none',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.9rem',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
          >
            Sign In
          </button>
        )}
      </div>
    </div>
  );
}

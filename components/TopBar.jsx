"use client";
import { useSession, signIn } from 'next-auth/react';
import { useMarketStatus, useIndices } from '../hooks/useStockData';
import { formatNumber } from '../utils';

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
        {nifty && (
          <div className="topbar-pill">
            <span className="pill-label">Nifty 50:</span>
            <span className={`pill-value ${(nifty.change || 0) >= 0 ? 'positive' : 'negative'}`}>
              {(nifty.change || 0) >= 0 ? '+' : ''}{nifty.change}%
            </span>
          </div>
        )}
        {bankNifty && (
          <div className="topbar-pill">
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
        <div className="topbar-pill">
          <span className="pill-label">Exchange:</span>
          <span className="pill-value" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>NSE</span>
        </div>
      </div>

      <div className="topbar-right">
        <button className="topbar-icon-btn" title="Notifications">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
        </button>
        <div className="topbar-account">
          <span>
            {marketStatus.isOpen ? '🟢' : '🔴'}&nbsp;
            {marketStatus.isOpen ? 'Live' : 'Closed'}
          </span>
        </div>
        
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

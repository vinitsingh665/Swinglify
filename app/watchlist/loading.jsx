"use client";

import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import Skeleton from '../../components/Skeleton';
import './watchlist.css';

export default function WatchlistLoading() {
  const [theme, setThemeState] = useState('dark');
  useEffect(() => {
    const saved = localStorage.getItem('swinglify_theme') || localStorage.getItem('theme');
    if (saved) setThemeState(saved);
  }, []);
  const setTheme = (t) => { setThemeState(t); localStorage.setItem('theme', t); };

  return (
    <div className="app-layout" data-theme={theme}>
      <Sidebar theme={theme} setTheme={setTheme} />
      <div className="main-area">
        <TopBar />
        <div className="watchlist-layout">

          {/* Top bar skeleton */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <Skeleton width="160px" height="32px" />
            <Skeleton width="120px" height="36px" borderRadius="var(--radius-sm)" />
          </div>

          {/* Filter pills */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            {[1,2,3,4,5].map(i => (
              <Skeleton key={i} width="80px" height="32px" borderRadius="8px" />
            ))}
          </div>

          {/* Body: table */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden' }}>
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
                <Skeleton width="32px" height="32px" circle />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <Skeleton width="90px" height="14px" />
                  <Skeleton width="130px" height="10px" />
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <Skeleton width="70px" height="16px" />
                  <Skeleton width="55px" height="22px" borderRadius="5px" />
                  <Skeleton width="30px" height="30px" borderRadius="6px" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

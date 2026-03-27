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
          <div className="wl-topbar">
            <div className="wl-tb-left">
              <Skeleton width="120px" height="28px" />
              <Skeleton width="280px" height="34px" borderRadius="8px" />
            </div>
            <div className="wl-tb-right">
              <Skeleton width="100px" height="30px" borderRadius="6px" />
            </div>
          </div>

          {/* Filter pills */}
          <div className="wl-pills" style={{ marginTop: '4px', marginBottom: '12px' }}>
            {[1,2,3,4,5].map(i => (
              <Skeleton key={i} width="80px" height="30px" borderRadius="20px" />
            ))}
          </div>

          {/* Body: table */}
          <div className="wl-body no-panel">
            <div className="wl-table-wrap" style={{ minHeight: '500px' }}>
              <div style={{ display: 'flex', padding: '12px 16px', borderBottom: '1px solid var(--border)', background: 'var(--bg-card)' }}>
                 <Skeleton width="150px" height="16px" />
              </div>
              {[1,2,3,4,5,6,7,8,9,10].map(i => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
                  <Skeleton width="32px" height="32px" circle />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <Skeleton width="90px" height="14px" />
                    <Skeleton width="130px" height="10px" />
                  </div>
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <Skeleton width="70px" height="18px" />
                    <Skeleton width="55px" height="22px" borderRadius="5px" />
                    <Skeleton width="30px" height="30px" borderRadius="6px" />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

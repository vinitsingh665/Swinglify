"use client";

import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import Skeleton from '../../components/Skeleton';
import './screener.css';

export default function ScreenerLoading() {
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
        <div className="screener-layout">

          {/* Top Bar Skeleton */}
          <div className="screener-topbar">
            <div className="st-left">
              <Skeleton width="130px" height="32px" />
              <div className="st-search" style={{ border: 'none', background: 'transparent', padding: 0 }}>
                <Skeleton width="100%" height="40px" borderRadius="10px" />
              </div>
            </div>
            <div className="st-right">
              <Skeleton width="220px" height="36px" borderRadius="8px" />
              <Skeleton width="110px" height="36px" borderRadius="8px" />
            </div>
          </div>

          {/* 3-Panel Body Skeleton */}
          <div className="screener-body">
            {/* Left: Filters */}
            <div className="filter-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Skeleton height="30px" width="120px" style={{ marginBottom: '8px' }} />
              {[1,2,3,4,5].map(i => (
                <div key={i}>
                  <Skeleton height="14px" width="80px" style={{ marginBottom: '10px' }} />
                  <Skeleton height="36px" borderRadius="8px" />
                </div>
              ))}
              <Skeleton height="44px" borderRadius="10px" style={{ marginTop: '10px' }} />
            </div>

            {/* Center: Results table */}
            <div className="screener-results">
              <div className="sr-header">
                <Skeleton width="180px" height="20px" />
              </div>
              <div className="sr-table-wrap" style={{ minHeight: '500px' }}>
                <div style={{ display: 'flex', padding: '12px 16px', borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
                   <Skeleton width="100%" height="16px" />
                </div>
                {[1,2,3,4,5,6,7,8,9].map(i => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
                    <Skeleton width="30px" height="30px" circle />
                    <Skeleton width="100px" height="16px" />
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: '24px' }}>
                      <Skeleton width="60px" height="16px" />
                      <Skeleton width="50px" height="22px" borderRadius="5px" />
                      <Skeleton width="40px" height="22px" borderRadius="6px" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Insights */}
            <div className="insights-panel">
               <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '300px', opacity: 0.5 }}>
                 <Skeleton width="48px" height="48px" circle style={{ marginBottom: '16px' }} />
                 <Skeleton width="140px" height="16px" style={{ marginBottom: '8px' }} />
                 <Skeleton width="100px" height="12px" />
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

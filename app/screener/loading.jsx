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
              <Skeleton width="120px" height="28px" />
              <Skeleton width="280px" height="38px" borderRadius="10px" />
            </div>
            <div className="st-right">
              <Skeleton width="200px" height="34px" borderRadius="8px" />
              <Skeleton width="100px" height="34px" borderRadius="8px" />
            </div>
          </div>

          {/* 3-Panel Body Skeleton */}
          <div className="screener-body">
            {/* Left: Filters */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Skeleton height="40px" borderRadius="14px" />
              {[1,2,3,4].map(i => (
                <Skeleton key={i} height="60px" borderRadius="10px" />
              ))}
              <Skeleton height="44px" borderRadius="10px" />
            </div>

            {/* Center: Results table */}
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
                <Skeleton width="180px" height="20px" />
              </div>
              <div style={{ padding: '0' }}>
                {[1,2,3,4,5,6,7,8].map(i => (
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
            <Skeleton height="360px" borderRadius="14px" />
          </div>

        </div>
      </div>
    </div>
  );
}

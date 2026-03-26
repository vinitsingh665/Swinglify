"use client";

import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import Skeleton from '../../components/Skeleton';
import './markets.css';

export default function MarketsLoading() {
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
        <div className="markets-content">

          {/* Control bar skeleton */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', padding: '0 4px' }}>
            <Skeleton width="160px" height="32px" />
            <div style={{ display: 'flex', gap: '8px' }}>
              <Skeleton width="240px" height="38px" borderRadius="10px" />
              <Skeleton width="100px" height="38px" borderRadius="8px" />
            </div>
          </div>

          {/* Summary strip skeleton */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            {[1,2,3,4].map(i => (
              <Skeleton key={i} width="160px" height="56px" borderRadius="10px" />
            ))}
          </div>

          {/* Body: filters + table */}
          <div className="markets-layout">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '220px', flexShrink: 0 }}>
              {[1,2,3,4,5].map(i => (
                <Skeleton key={i} height="44px" borderRadius="10px" />
              ))}
            </div>
            <div style={{ flex: 1 }}>
              <div className="market-table-card border-glass" style={{ overflow: 'hidden' }}>
                <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
                  <Skeleton width="200px" height="18px" />
                </div>
                {[1,2,3,4,5,6,7,8,9,10].map(i => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 18px', borderBottom: '1px solid var(--border)' }}>
                    <Skeleton width="30px" height="30px" circle />
                    <Skeleton width="100px" height="14px" />
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: '20px' }}>
                      <Skeleton width="60px" height="14px" />
                      <Skeleton width="50px" height="20px" borderRadius="5px" />
                      <Skeleton width="40px" height="20px" borderRadius="5px" />
                      <Skeleton width="48px" height="20px" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

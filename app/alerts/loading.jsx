"use client";

import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import Skeleton from '../../components/Skeleton';
import './alerts.css';

export default function AlertsLoading() {
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
        <div className="alerts-layout">

          {/* Top bar skeleton */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Skeleton width="120px" height="32px" />
              <div style={{ display: 'flex', gap: '6px' }}>
                {[1,2,3].map(i => (
                  <Skeleton key={i} width="70px" height="30px" borderRadius="8px" />
                ))}
              </div>
            </div>
            <Skeleton width="130px" height="36px" borderRadius="var(--radius-sm)" />
          </div>

          {/* 2-column body: list + panel */}
          <div className="al-body">
            {/* Left: Alert list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: '0 0 35%' }}>
              {[1,2,3,4,5].map(i => (
                <Skeleton key={i} height="72px" borderRadius="12px" />
              ))}
            </div>

            {/* Right: Detail panel */}
            <div style={{ flex: 1 }}>
              <Skeleton height="400px" borderRadius="14px" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

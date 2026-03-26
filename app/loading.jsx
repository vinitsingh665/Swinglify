"use client";

import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import Skeleton from '../components/Skeleton';

export default function Loading() {
  const [theme, setThemeState] = useState('dark');

  useEffect(() => {
    const saved = localStorage.getItem('swinglify_theme') || localStorage.getItem('theme');
    if (saved) setThemeState(saved);
  }, []);

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <div className="app-layout" data-theme={theme}>
      <Sidebar theme={theme} setTheme={setTheme} />
      <div className="main-area">
        <TopBar />
        <div className="content">
          <div className="content-inner">
            
            <div className="overview-header" style={{ marginBottom: '24px' }}>
              <Skeleton width="180px" height="32px" />
              <div style={{ marginLeft: 'auto' }}>
                <Skeleton width="140px" height="36px" borderRadius="var(--radius-sm)" />
              </div>
            </div>

            <div className="overview-cards" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '20px', marginBottom: '24px' }}>
              <Skeleton height="180px" borderRadius="var(--radius)" />
              <Skeleton height="180px" borderRadius="var(--radius)" />
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <Skeleton width="120px" height="36px" borderRadius="var(--radius-sm)" />
              <Skeleton width="120px" height="36px" borderRadius="var(--radius-sm)" />
              <Skeleton width="120px" height="36px" borderRadius="var(--radius-sm)" />
            </div>

            <Skeleton height="400px" borderRadius="var(--radius)" style={{ marginBottom: '24px' }} />

          </div>
        </div>
      </div>
    </div>
  );
}

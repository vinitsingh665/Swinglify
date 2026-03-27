"use client";

import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import Skeleton from '../../components/Skeleton';

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
            
            <div className="overview-header">
              <h1 className="overview-title">Overview</h1>
              <div style={{ marginLeft: 'auto', width: '320px', height: '42px', borderRadius: '100px', overflow: 'hidden' }}>
                <Skeleton />
              </div>
            </div>

            <div className="overview-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', marginBottom: '24px' }}>
              <Skeleton height="150px" borderRadius="var(--radius)" />
              <Skeleton height="150px" borderRadius="var(--radius)" />
              <Skeleton height="150px" borderRadius="var(--radius)" />
              <Skeleton height="150px" borderRadius="var(--radius)" />
            </div>

            <div className="opportunities-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              <Skeleton height="320px" borderRadius="var(--radius)" />
              <Skeleton height="320px" borderRadius="var(--radius)" />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <Skeleton height="450px" borderRadius="var(--radius)" />
            </div>

            <div className="dashboard-bottom-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px', marginBottom: '24px' }}>
              <Skeleton height="350px" borderRadius="var(--radius)" />
              <Skeleton height="350px" borderRadius="var(--radius)" />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

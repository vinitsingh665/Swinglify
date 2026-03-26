"use client";

import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import Skeleton from '../../components/Skeleton';
import './portfolio.css';

export default function PortfolioLoading() {
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
        <div className="portfolio-layout">
          
          <div className="portfolio-header" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between' }}>
            <Skeleton width="160px" height="32px" />
            <Skeleton width="120px" height="36px" borderRadius="var(--radius-sm)" />
          </div>

          <div className="summary-grid" style={{ marginBottom: '32px' }}>
            <Skeleton height="110px" borderRadius="var(--radius)" />
            <Skeleton height="110px" borderRadius="var(--radius)" />
            <Skeleton height="110px" borderRadius="var(--radius)" />
            <Skeleton height="110px" borderRadius="var(--radius)" />
          </div>

          <div className="portfolio-body" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>
            <Skeleton height="400px" borderRadius="var(--radius)" />
            <Skeleton height="400px" borderRadius="var(--radius)" />
          </div>

        </div>
      </div>
    </div>
  );
}

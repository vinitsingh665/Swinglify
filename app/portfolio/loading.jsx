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
          
          <div className="portfolio-header">
            <h2 className="portfolio-title">Portfolio</h2>
            <Skeleton width="120px" height="42px" borderRadius="12px" />
          </div>

          <div className="summary-grid">
            <Skeleton height="135px" borderRadius="20px" />
            <Skeleton height="135px" borderRadius="20px" />
            <Skeleton height="135px" borderRadius="20px" />
            <Skeleton height="135px" borderRadius="20px" />
          </div>

          <div className="portfolio-body">
            <Skeleton height="400px" borderRadius="20px" />
            <Skeleton height="400px" borderRadius="20px" />
          </div>

        </div>
      </div>
    </div>
  );
}

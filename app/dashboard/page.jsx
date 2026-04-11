"use client";

import './dashboard.css';
import { useState, useEffect, useCallback } from 'react';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import OverviewCards from '../../components/OverviewCards';
import StockModal from '../../components/StockModal';
import SearchBar from '../../components/SearchBar';
import OpportunitiesRow from '../../components/dashboard/OpportunitiesRow';
import SmartStockTable from '../../components/dashboard/SmartStockTable';
import MiniWatchlist from '../../components/dashboard/MiniWatchlist';
import SectorSnapshot from '../../components/dashboard/SectorSnapshot';

export default function Page() {
  const [category, setCategory] = useState('nifty50');
  const [categoryName, setCategoryName] = useState('Nifty 50');
  const [modalSymbol, setModalSymbol] = useState(null);
  const [theme, setThemeState] = useState('dark');

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved) setThemeState(saved);

    // Sync from settings page
    const syncTheme = () => {
      const globalSaved = localStorage.getItem('swinglify_theme');
      if (globalSaved) setThemeState(globalSaved);
    };
    syncTheme();
    window.addEventListener('swinglify_settings_update', syncTheme);
    return () => window.removeEventListener('swinglify_settings_update', syncTheme);
  }, []);

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleCategoryChange = useCallback((id, label) => {
    setCategory(id);
    setCategoryName(label.replace(/[🟢🔴🔥]\s*/g, ''));
  }, []);

  return (
    <div className="app-layout" data-theme={theme}>
      <Sidebar theme={theme} setTheme={setTheme} />

      <div className="main-area">
        <TopBar />

        <div className="content">
          <div className="content-inner">
            <div className="overview-header">
              <h1 className="overview-title">Overview</h1>
              <SearchBar onOpenStock={setModalSymbol} />
            </div>

            {/* Top Section - Retained */}
            <OverviewCards
              theme={theme}
              categoryName={categoryName}
              onCategoryChange={handleCategoryChange}
              onOpenStock={setModalSymbol}
            />

            {/* Middle Section - Opportunities */}
            <OpportunitiesRow onOpenStock={setModalSymbol} />

            {/* Smart List Table */}
            <SmartStockTable onOpenStock={setModalSymbol} />

            {/* Bottom Section */}
            <div className="dashboard-bottom-grid">
              <MiniWatchlist onOpenStock={setModalSymbol} />
              <SectorSnapshot />
            </div>

          </div>
        </div>
      </div>

      {modalSymbol && <StockModal symbol={modalSymbol} onClose={() => setModalSymbol(null)} />}
    </div>
  );
}

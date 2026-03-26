"use client";

import { useState, useEffect, useMemo } from 'react';
import './portfolio.css';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import { usePortfolio, usePortfolioQuotes } from '../../hooks/usePortfolio';
import PortfolioSummary from './components/PortfolioSummary';
import HoldingsTable from './components/HoldingsTable';
import AllocationChart from './components/AllocationChart';
import AddStockModal from './components/AddStockModal';
import Skeleton from '../../components/Skeleton';

export default function PortfolioPage() {
  const [theme, setThemeState] = useState('dark');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingHolding, setEditingHolding] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved) setThemeState(saved);
  }, []);

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const { holdings, isLoaded, addHolding, removeHolding, updateHolding } = usePortfolio();

  // Collect unique symbols for live quotes
  const symbols = useMemo(() => [...new Set(holdings.map(h => h.symbol))], [holdings]);
  const { quotes, loading: quotesLoading } = usePortfolioQuotes(symbols);

  const handleAdd = (data) => {
    if (data.id) {
      // Edit mode
      updateHolding(data.id, { symbol: data.symbol, name: data.name, logo: data.logo, qty: data.qty, avgPrice: data.avgPrice });
    } else {
      addHolding(data);
    }
  };

  const handleEdit = (holding) => {
    setEditingHolding(holding);
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingHolding(null);
  };

  if (!isLoaded) {
    return (
      <div className="app-layout" data-theme={theme}>
        <Sidebar theme={theme} setTheme={setTheme} />
        <div className="main-area">
          <TopBar />
          <div className="portfolio-layout">
            <div className="portfolio-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
              <Skeleton width="160px" height="32px" />
              <Skeleton width="120px" height="36px" borderRadius="var(--radius-sm)" />
            </div>
            <div className="summary-grid">
              <Skeleton height="110px" borderRadius="var(--radius)" />
              <Skeleton height="110px" borderRadius="var(--radius)" />
              <Skeleton height="110px" borderRadius="var(--radius)" />
              <Skeleton height="110px" borderRadius="var(--radius)" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleRequestEdit = (symbol) => {
    const existing = holdings.find(h => h.symbol === symbol);
    if (existing) {
      setEditingHolding(existing);
    }
  };

  return (
    <div className="app-layout" data-theme={theme}>
      <Sidebar theme={theme} setTheme={setTheme} />
      <div className="main-area">
        <TopBar />
        <div className="portfolio-layout">
          
          {/* Header */}
          <div className="portfolio-header">
            <h1 className="portfolio-title">Portfolio</h1>
            <button className="btn-add-stock" onClick={() => setShowAddModal(true)}>
              + Add Stock
            </button>
          </div>

          {/* Summary Cards */}
          <PortfolioSummary holdings={holdings} quotes={quotes} />

          {/* Body: Table + Allocation */}
          <div className={holdings.length > 0 ? "portfolio-body" : ""}>
            <HoldingsTable 
              holdings={holdings} 
              quotes={quotes} 
              onEdit={handleEdit}
              onRemove={removeHolding}
            />
            {holdings.length > 0 && (
              <AllocationChart holdings={holdings} quotes={quotes} />
            )}
          </div>

        </div>
      </div>

      {/* Modal */}
      {showAddModal && (
        <AddStockModal 
          onAdd={handleAdd} 
          onClose={closeModal}
          editingHolding={editingHolding}
          existingSymbols={symbols}
          onRequestEdit={handleRequestEdit}
        />
      )}
    </div>
  );
}

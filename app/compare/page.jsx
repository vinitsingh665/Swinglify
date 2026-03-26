"use client";

import { useState, useEffect, useCallback } from 'react';
import './compare.css';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';

import StockSelector from './components/StockSelector';
import PerformanceChart from './components/PerformanceChart';
import MetricsTable from './components/MetricsTable';
import WinnerInsight from './components/WinnerInsight';

const DEFAULT_STOCKS = ['RELIANCE', 'TCS', 'HDFCBANK'];

export default function ComparePage() {
  const [theme, setThemeState] = useState('dark');
  const [symbols, setSymbols] = useState(DEFAULT_STOCKS);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  // Theme persistence
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

  // Fetch data for selected symbols
  const fetchData = useCallback(async () => {
    if (symbols.length === 0) { setData({}); setLoading(false); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/portfolio-quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbols: symbols.map(s => `NSE:${s}`) })
      });
      const json = await res.json();
      if (json.success) {
        const mapped = {};
        json.data.forEach(d => {
          const sym = d.symbol?.split(':')[1] || d.symbol;
          mapped[sym] = d;
        });
        setData(mapped);
      }
    } catch (e) {
      console.error('Compare fetch error:', e);
    } finally {
      setLoading(false);
    }
  }, [symbols]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAdd = (sym) => {
    if (!symbols.includes(sym) && symbols.length < 4) {
      setSymbols(prev => [...prev, sym]);
    }
  };

  const handleRemove = (sym) => {
    setSymbols(prev => prev.filter(s => s !== sym));
  };

  return (
    <div className="app-layout" data-theme={theme}>
      <Sidebar theme={theme} setTheme={setTheme} />
      <div className="main-area">
        <TopBar />

        <div className="compare-layout">
          {/* Stock Selector Strip */}
          <StockSelector symbols={symbols} onAdd={handleAdd} onRemove={handleRemove} />

          {loading ? (
            <div className="cmp-loading">Loading comparison data...</div>
          ) : (
            <>
              {/* Performance Chart */}
              <PerformanceChart stocks={symbols} data={data} />

              {/* Winner Insight */}
              <WinnerInsight stocks={symbols} data={data} />

              {/* Metrics Table */}
              <MetricsTable stocks={symbols} data={data} />
            </>
          )}
        </div>

      </div>
    </div>
  );
}

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
  const [symbols, setSymbols] = useState([]);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  // Theme persistence
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved) setThemeState(saved);
  }, []);

  // Symbol persistence
  useEffect(() => {
    let currentSymbols = DEFAULT_STOCKS;
    // 1. Try local storage first
    const savedSymbols = localStorage.getItem('compare_symbols');
    if (savedSymbols) {
      try {
        const parsed = JSON.parse(savedSymbols);
        if (Array.isArray(parsed) && parsed.length > 0) {
          currentSymbols = parsed;
        }
      } catch (e) {
        console.error('Failed to parse compare_symbols', e);
      }
    }

    setSymbols(currentSymbols);
    setInitialLoaded(true);

    // 2. Try fetching from user's synced data
    fetch('/api/user/sync')
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data?.compareSymbols?.length > 0) {
          const synced = json.data.compareSymbols;
          if (JSON.stringify(synced) !== JSON.stringify(currentSymbols)) {
            setSymbols(synced);
            localStorage.setItem('compare_symbols', JSON.stringify(synced));
          }
        }
      })
      .catch(err => {
        // Likely unauthenticated or offline
      });
  }, []);

  const syncSymbolsToBackend = (newSymbols) => {
    fetch('/api/user/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ compareSymbols: newSymbols })
    }).catch(e => {});
  };

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Fetch data for selected symbols
  const fetchData = useCallback(async () => {
    if (!initialLoaded) return;
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
  }, [symbols, initialLoaded]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAdd = (sym) => {
    if (!symbols.includes(sym) && symbols.length < 4) {
      setSymbols(prev => {
        const newSymbols = [...prev, sym];
        localStorage.setItem('compare_symbols', JSON.stringify(newSymbols));
        syncSymbolsToBackend(newSymbols);
        return newSymbols;
      });
    }
  };

  const handleRemove = (sym) => {
    setSymbols(prev => {
      const newSymbols = prev.filter(s => s !== sym);
      localStorage.setItem('compare_symbols', JSON.stringify(newSymbols));
      syncSymbolsToBackend(newSymbols);
      return newSymbols;
    });
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

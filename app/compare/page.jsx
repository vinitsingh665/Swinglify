"use client";
import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import './compare.css';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';

import StockSelector from './components/StockSelector';
import PerformanceChart from './components/PerformanceChart';
import MetricsTable from './components/MetricsTable';
import WinnerInsight from './components/WinnerInsight';

const DEFAULT_STOCKS = ['RELIANCE', 'TCS', 'HDFCBANK'];

export function CompareContent({ initialSymbols = null, seoHeader = null }) {
  const searchParams = useSearchParams();
  const queryStock = searchParams.get('stock');
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
    if (initialSymbols && initialSymbols.length > 0) {
      setSymbols(initialSymbols);
      setInitialLoaded(true);
      return;
    }

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

  useEffect(() => {
    if (initialLoaded && queryStock) {
      const sym = queryStock.toUpperCase();
      if (!symbols.includes(sym) && symbols.length < 4) {
        setSymbols(prev => {
          if (prev.includes(sym)) return prev;
          const newSymbols = [...prev, sym];
          localStorage.setItem('compare_symbols', JSON.stringify(newSymbols));
          syncSymbolsToBackend(newSymbols);
          return newSymbols;
        });
      }
    }
  }, [initialLoaded, queryStock, symbols.length]);

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
          {seoHeader ? (
            <div className="compare-seo-header" style={{ marginBottom: 18, padding: '18px 22px', background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: 'var(--accent-bg)', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Peer Stock Comparison
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                  NSE & BSE Side-by-Side
                </span>
              </div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
                {seoHeader.title}
              </h1>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                {seoHeader.summary}
              </p>
            </div>
          ) : (
            <h1 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>Compare Stocks Side-by-Side</h1>
          )}
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

export default function ComparePage() {
  return (
    <Suspense fallback={<div style={{ padding: '40px', color: '#888', textAlign: 'center', fontFamily: 'Inter' }}>Loading compare data...</div>}>
      <CompareContent />
    </Suspense>
  );
}

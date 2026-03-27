"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import './screener.css';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import FilterPanel from './components/FilterPanel';
import ScreenerTable from './components/ScreenerTable';
import QuickInsights from './components/QuickInsights';

const TIMEFRAME_PRESETS = {
  intraday: {
    exchange: 'NSE', priceMin: '', priceMax: '',
    changeMin: '1', volumeMin: '1000000',
    rsiMode: null, emaMode: null,
    marketCap: null, sector: null, signal: null,
    sortBy: 'volume', sortOrder: 'desc'
  },
  swing: {
    exchange: 'NSE', priceMin: '', priceMax: '',
    changeMin: '', volumeMin: '',
    rsiMode: null, emaMode: 'above50',
    marketCap: null, sector: null, signal: null,
    sortBy: 'volume', sortOrder: 'desc'
  },
  positional: {
    exchange: 'NSE', priceMin: '', priceMax: '',
    changeMin: '', volumeMin: '',
    rsiMode: null, emaMode: 'golden',
    marketCap: 'large', sector: null, signal: null,
    sortBy: 'marketcap', sortOrder: 'desc'
  }
};

const DEFAULT_FILTERS = TIMEFRAME_PRESETS.swing;

export default function ScreenerPage() {
  const searchParams = useSearchParams();
  const [theme, setThemeState] = useState('dark');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [stocks, setStocks] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStock, setSelectedStock] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [timeframe, setTimeframe] = useState('swing');
  const [selectedIndex, setSelectedIndex] = useState(null);

  // Apply URL query params as filters (from dashboard opportunity cards)
  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    if (Object.keys(params).length > 0) {
      setTimeframe(''); // Clear timeframe toggle since custom filters are applied
      setFilters(prev => ({
        ...prev,
        exchange: params.exchange || prev.exchange,
        priceMin: params.priceMin || '',
        priceMax: params.priceMax || '',
        changeMin: params.changeMin || '',
        volumeMin: params.volumeMin || '',
        rsiMode: params.rsiMode || null,
        emaMode: params.emaMode || null,
        marketCap: params.marketCap || null,
        sector: params.sector || null,
        signal: params.signal || null,
        sortBy: params.sortBy || 'volume',
        sortOrder: params.sortOrder || 'desc'
      }));
    }
  }, [searchParams]);

  // Load default market from preferences
  useEffect(() => {
    try {
      const prefs = JSON.parse(localStorage.getItem('swinglify_prefs') || '{}');
      if (prefs.market) {
        setFilters(f => ({ ...f, exchange: prefs.market }));
      }
    } catch(e) {}
  }, []);

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

  // Fetch screener data (custom filters or index-based)
  const fetchScreener = useCallback(async () => {
    try {
      setLoading(true);

      if (selectedIndex) {
        // Fetch from category API when an index is selected
        const res = await fetch(`/api/stocks/${selectedIndex}?exchange=${filters.exchange}`);
        const data = await res.json();
        if (data.success) {
          setStocks(data.data);
        }
      } else {
        // Fetch from custom screener API
        const res = await fetch('/api/screener', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            exchange: filters.exchange,
            priceMin: filters.priceMin || undefined,
            priceMax: filters.priceMax || undefined,
            changeMin: filters.changeMin || undefined,
            volumeMin: filters.volumeMin || undefined,
            rsiMode: filters.rsiMode || undefined,
            emaMode: filters.emaMode || undefined,
            marketCap: filters.marketCap || undefined,
            sector: filters.sector || undefined,
            signal: filters.signal || undefined,
            sortBy: filters.sortBy,
            sortOrder: filters.sortOrder,
            limit: 1000
          })
        });
        const data = await res.json();
        if (data.success) {
          setStocks(data.data);
          if (data.sectors) setSectors(data.sectors);
        }
      }
    } catch (err) {
      console.error('Screener fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, selectedIndex]);

  useEffect(() => {
    fetchScreener();
  }, [fetchScreener]);

  // Client-side search filter
  const filteredStocks = useMemo(() => {
    if (!searchQuery.trim()) return stocks;
    const q = searchQuery.toLowerCase();
    return stocks.filter(s =>
      s.symbol?.toLowerCase().includes(q) ||
      s.name?.toLowerCase().includes(q)
    );
  }, [stocks, searchQuery]);

  // Client-side sort (for instant column clicking)
  const sortedStocks = useMemo(() => {
    const copy = [...filteredStocks];
    const key = filters.sortBy;
    const dir = filters.sortOrder === 'desc' ? -1 : 1;

    const sortMap = {
      'name': 'symbol',
      'price': 'price',
      'change': 'change',
      'volume': 'volume',
      'rsi': 'rsi',
      'marketcap': 'marketCap'
    };
    const field = sortMap[key] || 'volume';

    copy.sort((a, b) => {
      const av = a[field] ?? 0;
      const bv = b[field] ?? 0;
      if (typeof av === 'string') return av.localeCompare(bv) * dir;
      return (av - bv) * dir;
    });
    return copy;
  }, [filteredStocks, filters.sortBy, filters.sortOrder]);

  const handleSort = (col, order) => {
    setFilters(p => ({ ...p, sortBy: col, sortOrder: order }));
  };

  // "Find Opportunities" auto-filter
  const handleFindOpportunities = () => {
    setFilters({
      ...DEFAULT_FILTERS,
      rsiMode: 'oversold',
      volumeMin: '500000',
      signal: 'BUY',
      sortBy: 'volume',
      sortOrder: 'desc'
    });
  };

  // Active filters count
  const activeCount = useMemo(() => {
    let count = 0;
    if (filters.priceMin) count++;
    if (filters.priceMax) count++;
    if (filters.changeMin) count++;
    if (filters.volumeMin) count++;
    if (filters.rsiMode) count++;
    if (filters.emaMode) count++;
    if (filters.marketCap) count++;
    if (filters.sector) count++;
    if (filters.signal) count++;
    return count;
  }, [filters]);

  return (
    <div className="app-layout" data-theme={theme}>
      <Sidebar theme={theme} setTheme={setTheme} />
      <div className="main-area">
        <TopBar />
        <div className="screener-layout">

          {/* Top Bar */}
          <div className="screener-topbar">
            <div className="st-left">
              <h1 className="st-title">Screener</h1>
              <div className="st-search">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                <input placeholder="Search symbol or name..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              </div>
            </div>
            <div className="st-right">
              <div className="st-toggle-group">
                {['Intraday', 'Swing', 'Positional'].map(t => (
                  <button key={t} className={`st-toggle ${timeframe === t.toLowerCase() ? 'active' : ''}`} onClick={() => {
                    const tf = t.toLowerCase();
                    if (timeframe === tf) {
                      // Deselect — reset to no preset filters
                      setTimeframe('');
                      setFilters(prev => ({
                        exchange: prev.exchange, priceMin: '', priceMax: '',
                        changeMin: '', volumeMin: '',
                        rsiMode: null, emaMode: null,
                        marketCap: null, sector: null, signal: null,
                        sortBy: 'volume', sortOrder: 'desc'
                      }));
                    } else {
                      setTimeframe(tf);
                      setFilters({ ...TIMEFRAME_PRESETS[tf], exchange: filters.exchange });
                    }
                  }}>{t}</button>
                ))}
              </div>
              <div className="st-exchange">
                {['NSE', 'BSE'].map(ex => (
                  <button key={ex} className={`st-ex-btn ${filters.exchange === ex ? 'active' : ''}`} onClick={() => setFilters(p => ({ ...p, exchange: p.exchange === ex ? 'NSE' : ex }))}>{ex}</button>
                ))}
              </div>
            </div>
          </div>

          {/* 3-Panel Body */}
          <div className={`screener-body ${!selectedStock ? '' : ''}`}>
            {/* Left: Filters */}
            <FilterPanel
              filters={filters}
              setFilters={(f) => { setSelectedIndex(null); setFilters(f); }}
              onFindOpportunities={() => { setSelectedIndex(null); handleFindOpportunities(); }}
              activeCount={activeCount}
              sectors={sectors}
              selectedIndex={selectedIndex}
              onSelectIndex={(idx) => { setSelectedIndex(idx); setTimeframe(''); }}
            />

            {/* Center: Results */}
            <ScreenerTable
              stocks={sortedStocks}
              loading={loading}
              sortBy={filters.sortBy}
              sortOrder={filters.sortOrder}
              onSort={handleSort}
              selectedSymbol={selectedStock?.symbol}
              onSelect={setSelectedStock}
            />

            {/* Right: Quick Insights */}
            <QuickInsights stock={selectedStock} />
          </div>

        </div>
      </div>
    </div>
  );
}

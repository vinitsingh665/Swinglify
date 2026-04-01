"use client";

import { useState, useEffect } from 'react';
import './markets.css';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import MarketControlBar from './components/MarketControlBar';
import MarketSummaryStrip from './components/MarketSummaryStrip';
import SmartFiltersPanel from './components/SmartFiltersPanel';
import MarketTable from './components/MarketTable';
import StockModal from '../../components/StockModal';
import { useStockData } from '../../hooks/useStockData';

export default function MarketsPage() {
  const [theme, setThemeState] = useState('dark');
  const [modalSymbol, setModalSymbol] = useState(null);

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
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Advanced filters state
  const [filters, setFilters] = useState({
    exchange: 'NSE', // NSE or BSE
    marketCap: 'All', // Large, Mid, Small, All
    sort: 'Volume', // Volume, Price, % Change
    quickTag: null, // Top Gainers, Top Losers, etc.
    priceMin: '',
    priceMax: '',
    minVolume: '',
    minChange: '',
    rsi: 'All', // All, Oversold (<30), Overbought (>70)
    signal: 'All', // BUY, SELL, HOLD, All
  });

  // Load default market from preferences
  useEffect(() => {
    try {
      const prefs = JSON.parse(localStorage.getItem('swinglify_prefs') || '{}');
      if (prefs.market) {
        setFilters(f => ({ ...f, exchange: prefs.market }));
      }
    } catch(e) {}
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Determine base category from API to fetch
  const baseCategory = 
    filters.quickTag === 'Top Gainers' ? 'gainers' : 
    filters.quickTag === 'Top Losers' ? 'losers' : 
    filters.quickTag === 'High Volume' ? 'mostactive' :
    filters.quickTag === 'Breakouts' ? 'breakouts' :
    filters.marketCap === 'Large' ? 'nifty100' :
    filters.marketCap === 'Mid' ? 'midcap150' :
    filters.marketCap === 'Small' ? 'smallcap250' : 'nifty500';

  const { stocks, loading, error, refresh } = useStockData(baseCategory, 1000, filters.exchange);

  // Reset pagination if filters change or data refreshes
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchQuery, baseCategory]);

  // Apply strict client-side Smart Filters
  let filteredStocks = (stocks || []).filter(stock => {
    if (searchQuery && !stock.symbol.includes(searchQuery.toUpperCase()) && !stock.name.toUpperCase().includes(searchQuery.toUpperCase())) return false;
    
    // API returns NSE primarily, skipping exact exchange filtering for now or default true
    
    if (filters.priceMin && stock.price < Number(filters.priceMin)) return false;
    if (filters.priceMax && stock.price > Number(filters.priceMax)) return false;
    if (filters.minVolume && stock.volume < Number(filters.minVolume)) return false;
    if (filters.minChange && stock.change < Number(filters.minChange)) return false;
    
    if (filters.rsi === 'Oversold' && (stock.rsi == null || stock.rsi >= 30)) return false;
    if (filters.rsi === 'Overbought' && (stock.rsi == null || stock.rsi <= 70)) return false;
    
    // Signal Badge Filtering (Score >=55 BUY, Score <=45 SELL, Margin HOLD)
    if (filters.signal !== 'All') {
       const score = stock.indicatorScore?.score || 50;
       const signal = score >= 55 ? 'BUY' : score <= 45 ? 'SELL' : 'HOLD';
       if (filters.signal !== signal) return false;
    }
    
    return true;
  });

  // Client-side Sort
  filteredStocks.sort((a, b) => {
    if (filters.sort === 'Volume') return (b.volume || 0) - (a.volume || 0);
    if (filters.sort === '% Change') return Math.abs(b.change || 0) - Math.abs(a.change || 0); // Abs sort or raw?
    if (filters.sort === 'Price') return (b.price || 0) - (a.price || 0);
    return 0;
  });

  const itemsPerPage = 50;
  const totalPages = Math.max(1, Math.ceil(filteredStocks.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const finalStocks = filteredStocks.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="app-layout" data-theme={theme}>
      <Sidebar theme={theme} setTheme={setTheme} />
      <div className="main-area">
        <TopBar />
        <div className="markets-content">
          <MarketControlBar 
            searchQuery={searchQuery} setSearchQuery={setSearchQuery}
            filters={filters} setFilters={setFilters} 
          />
          <MarketSummaryStrip />
          
          <div className="markets-layout">
            <SmartFiltersPanel filters={filters} setFilters={setFilters} />
            
            <div className="markets-table-container">
              {error ? (
                <div className="error-panel">
                  <p>⚠️ {error}</p>
                  <button onClick={refresh} className="btn-retry">Retry Connection</button>
                </div>
              ) : (
                <>
                  <MarketTable 
                     stocks={finalStocks} 
                     loading={loading} 
                     onOpenStock={setModalSymbol} 
                  />
                  
                  {!loading && totalPages > 1 && (
                    <div className="pagination-controls">
                      <button 
                        className="page-btn"
                        disabled={currentPage === 1} 
                        onClick={() => setCurrentPage(p => p - 1)}
                      >
                        ← Previous
                      </button>
                      <span className="page-indicator">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button 
                        className="page-btn"
                        disabled={currentPage === totalPages} 
                        onClick={() => setCurrentPage(p => p + 1)}
                      >
                        Next →
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {modalSymbol && <StockModal symbol={modalSymbol} onClose={() => setModalSymbol(null)} />}
    </div>
  );
}

"use client";

import { useState, useEffect, useMemo } from 'react';
import './watchlist.css';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import WatchlistTopBar from './components/WatchlistTopBar';
import FilterPills from './components/FilterPills';
import WatchlistTable from './components/WatchlistTable';
import InsightsPanel from './components/InsightsPanel';

import { useWatchlist } from '../../hooks/useWatchlist';
import { usePortfolioQuotes as useWatchlistQuotes } from '../../hooks/usePortfolio';

export default function WatchlistPage() {
  const [theme, setThemeState] = useState('dark');
  const [filter, setFilter] = useState('all');
  const [selectedSymbol, setSelectedSymbol] = useState(null);

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

  // Data fetching
  const { watchedSymbols, isLoaded, addStock, removeStock } = useWatchlist();
  
  // Reuse the portfolio quotes hook since it just fetches a bulk list of symbols from TradingView
  const { quotes, loading: quotesLoading } = useWatchlistQuotes(watchedSymbols, 5); // refresh every 5s

  // Convert quotes map to array and apply active filter
  const filteredStocks = useMemo(() => {
    const arr = watchedSymbols.map(sym => quotes[sym] || { symbol: sym, _loading: true });
    
    if (filter === 'all') return arr;
    
    return arr.filter(s => {
      if (s._loading) return true; // keep loading shells in view
      if (filter === 'gainers') return (s.change || 0) > 0;
      if (filter === 'losers') return (s.change || 0) < 0;
      if (filter === 'volume') return s.volume && s.avgVolume10d && s.volume > s.avgVolume10d * 1.5;
      if (filter === 'signals') return s.recommendation && (s.recommendation.includes('BUY') || s.recommendation.includes('SELL'));
      return true;
    });
  }, [quotes, filter, watchedSymbols]);

  // Determine active stock object for panel
  const activeStockDetails = useMemo(() => {
    if (!selectedSymbol) return null;
    return quotes[selectedSymbol] || { symbol: selectedSymbol, _loading: true };
  }, [selectedSymbol, quotes]);

  // If you filter out the currently selected stock, close the panel
  useEffect(() => {
    if (selectedSymbol && !filteredStocks.find(s => s.symbol === selectedSymbol)) {
      setSelectedSymbol(null);
    }
  }, [filteredStocks, selectedSymbol]);

  return (
    <div className="app-layout" data-theme={theme}>
      <Sidebar theme={theme} setTheme={setTheme} />
      <div className="main-area">
        <TopBar />
        
        <div className="watchlist-layout">
          <WatchlistTopBar onAddStock={addStock} />
          
          <FilterPills currentFilter={filter} setFilter={setFilter} />

          <div className={`wl-body ${selectedSymbol ? 'has-panel' : 'no-panel'}`}>
            <WatchlistTable 
              stocks={filteredStocks} 
              loading={!isLoaded || quotesLoading} 
              symbolsCount={watchedSymbols.length}
              onRemove={(sym) => {
                if (selectedSymbol === sym) setSelectedSymbol(null);
                removeStock(sym);
              }}
              selectedSymbol={selectedSymbol}
              onSelect={(sym) => setSelectedSymbol(sym === selectedSymbol ? null : sym)}
            />

            {selectedSymbol && (
              <InsightsPanel 
                stock={activeStockDetails} 
                onClose={() => setSelectedSymbol(null)} 
              />
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

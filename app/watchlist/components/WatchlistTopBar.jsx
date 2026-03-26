"use client";
import { useState, useEffect, useRef } from 'react';

export default function WatchlistTopBar({ onAddStock }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setResults([]);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Search API
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.success) {
          setResults(data.data.slice(0, 6)); // top 6
        }
      } catch (e) {
        console.error("Search failed", e);
      } finally {
        setIsSearching(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (stock) => {
    // Extract strictly the symbol symbol, ignoring the NSE: prefix if present like in TradingView search
    let sym = stock.symbol;
    if (sym.includes(':')) {
      sym = sym.split(':')[1];
    }
    // Handle BSE edge case if necessary, but portfolio proxy handles raw NSE symbols best right now
    // Removing the hyphen like "-EQ" if the search API brought it
    sym = sym.split('-')[0];

    onAddStock(sym);
    setQuery('');
    setResults([]);
  };

  return (
    <div className="wl-topbar">
      <div className="wl-tb-left">
        <h1 className="wl-title">Watchlist</h1>
        
        <div className="wl-search" ref={searchRef}>
          <div className="wl-search-input-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input 
              placeholder="Search symbol to add..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {isSearching && <div style={{ width: 12, height: 12, border: '2px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />}
          </div>

          {/* Quick Add Dropdown */}
          {results.length > 0 && (
            <div className="wl-search-dropdown">
              {results.map(s => (
                <div key={s.symbol} className="wl-search-item" onClick={() => handleSelect(s)}>
                  <span className="wl-si-sym">{s.symbol.split(':')[1] || s.symbol}</span>
                  <span className="wl-si-name">{s.description || s.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

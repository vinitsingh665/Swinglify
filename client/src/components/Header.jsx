import { useMarketStatus, useSearch } from '../hooks/useStockData';
import { formatNumber } from '../utils';
import { useState, useRef, useEffect } from 'react';

export default function Header({ countdown, onRefresh, onOpenStock }) {
  const marketStatus = useMarketStatus();
  const { results, search, clearResults } = useSearch();
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  const handleSearch = (e) => {
    const val = e.target.value;
    setQuery(val);
    search(val);
    setShowResults(val.trim().length >= 1);
  };

  const handleRefresh = () => {
    setSpinning(true);
    setTimeout(() => setSpinning(false), 600);
    onRefresh();
  };

  const statusClass = marketStatus.isOpen ? 'open' : marketStatus.isPreMarket ? 'pre-market' : 'closed';
  const statusText = marketStatus.isOpen ? 'Market Open' : marketStatus.isPreMarket ? 'Pre-Market' : 'Market Closed';

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          </div>
          <div className="logo-text">
            <h1>Swinglify</h1>
            <span className="logo-tagline">(Stocks Available for Swing Trades at One Place)</span>
            <span className="logo-subtitle">Indian Market · Live</span>
          </div>
        </div>
      </div>

      <div className="header-center">
        <div className={`market-status ${statusClass}`}>
          <span className="status-dot"></span>
          <span className="status-text">{statusText}</span>
        </div>
      </div>

      <div className="header-right">
        <div className="search-container" ref={searchRef}>
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search stocks... (e.g. RELIANCE, TCS)"
            value={query}
            onChange={handleSearch}
            onFocus={() => query.trim().length >= 1 && setShowResults(true)}
          />
          {showResults && results.length > 0 && (
            <div className="search-results active">
              {results.map(s => (
                <div key={s.symbol} className="search-result-item" onClick={() => {
                  onOpenStock(s.symbol);
                  setShowResults(false);
                  setQuery('');
                  clearResults();
                }}>
                  <div>
                    <div className="sr-symbol">{s.symbol}</div>
                    <div className="sr-name">{s.name}</div>
                  </div>
                  <div className="sr-price">
                    <div style={{ fontWeight: 600 }}>₹{formatNumber(s.price)}</div>
                    <div style={{ color: s.change >= 0 ? 'var(--green)' : 'var(--red)', fontSize: '0.75rem' }}>
                      {s.change >= 0 ? '+' : ''}{s.change}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="refresh-info">
          <button className={`btn-refresh ${spinning ? 'spinning' : ''}`} onClick={handleRefresh} title="Refresh now">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 4 23 10 17 10"></polyline>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
            </svg>
          </button>
          <span className="countdown">{countdown}s</span>
        </div>
      </div>
    </header>
  );
}

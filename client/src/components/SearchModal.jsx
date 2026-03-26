import { useState, useRef, useEffect } from 'react';
import { useSearch } from '../hooks/useStockData';
import { formatNumber } from '../utils';

export default function SearchModal({ onClose, onOpenStock }) {
  const { results, search, clearResults } = useSearch();
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    search(val);
  };

  return (
    <div className="search-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="search-modal">
        <input
          ref={inputRef}
          type="text"
          className="search-modal-input"
          placeholder="Search stocks... (e.g. RELIANCE, TCS, INFY)"
          value={query}
          onChange={handleChange}
        />
        <div className="search-modal-results">
          {results.map(s => (
            <div key={s.symbol} className="search-modal-item" onClick={() => onOpenStock(s.symbol)}>
              <div>
                <div className="sr-symbol">{s.symbol}</div>
                <div className="sr-name">{s.name}</div>
              </div>
              <div className="sr-price">
                <div style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>₹{formatNumber(s.price)}</div>
                <div style={{ color: s.change >= 0 ? 'var(--green)' : 'var(--red)', fontSize: '0.7rem', textAlign: 'right' }}>
                  {s.change >= 0 ? '+' : ''}{s.change}%
                </div>
              </div>
            </div>
          ))}
          {query.length > 0 && results.length === 0 && (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.82rem' }}>
              Type to search...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";
import { useState, useRef, useEffect } from 'react';
import { useSearch } from '../hooks/useStockData';
import { formatNumber } from '../utils';

export default function SearchBar({ onOpenStock }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const [showAllResults, setShowAllResults] = useState(false);
  const { results, search, clearResults } = useSearch();
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const dropdownRef = useRef(null);
  const [lockedHeight, setLockedHeight] = useState(null);

  // ⌘K shortcut to focus search
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsExpanded(true);
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setIsExpanded(false);
        inputRef.current?.blur();
        setQuery('');
        setShowAllResults(false);
        setLockedHeight(null);
        clearResults();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [clearResults]);

  // Click outside to collapse
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsExpanded(false);
        setQuery('');
        setShowAllResults(false);
        setLockedHeight(null);
        clearResults();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [clearResults]);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setShowAllResults(false);
    setLockedHeight(null);
    search(val);
  };

  const handleSelect = (symbol) => {
    onOpenStock(symbol);
    setIsExpanded(false);
    setQuery('');
    setShowAllResults(false);
    setLockedHeight(null);
    clearResults();
  };

  return (
    <div className="search-container" ref={containerRef}>
      <div 
        className={`search-input-wrapper ${isExpanded ? 'expanded' : ''}`}
        onClick={() => {
          setIsExpanded(true);
          inputRef.current?.focus();
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search..."
          value={query}
          onChange={handleChange}
          onFocus={() => setIsExpanded(true)}
        />
        {!isExpanded && <span className="search-shortcut">⌘K</span>}
      </div>

      {isExpanded && query.length > 0 && (
        <div 
          className="search-dropdown" 
          ref={dropdownRef}
          style={{ 
            height: lockedHeight ? `${lockedHeight}px` : 'auto',
            maxHeight: lockedHeight ? `${lockedHeight}px` : '480px',
            overflowY: showAllResults ? 'auto' : 'hidden',
            paddingRight: showAllResults ? '4px' : '8px'
          }}
        >
          {results.length > 0 ? (
            <>
              {(showAllResults ? results : results.slice(0, 7)).map(s => (
                <div key={s.symbol} className="search-dropdown-item" onClick={() => handleSelect(s.symbol)}>
                  <div>
                    <div className="sr-symbol" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{s.symbol}</div>
                    <div className="sr-name" style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{s.name}</div>
                  </div>
                  <div className="sr-price" style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 500, fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>₹{formatNumber(s.price)}</div>
                    <div style={{ color: s.change >= 0 ? 'var(--green)' : 'var(--red)', fontSize: '0.7rem' }}>
                      {s.change >= 0 ? '+' : ''}{s.change}%
                    </div>
                  </div>
                </div>
              ))}
              {!showAllResults && results.length > 7 && (
                <div 
                  className="search-view-more" 
                  style={{ padding: '12px', textAlign: 'center', color: 'var(--accent)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 500, borderTop: '1px solid var(--border)', transition: 'background 0.15s' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (dropdownRef.current) {
                      setLockedHeight(dropdownRef.current.offsetHeight);
                    }
                    setShowAllResults(true);
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  View all results ({results.length - 7} more)
                </div>
              )}
            </>
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.82rem' }}>
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
}

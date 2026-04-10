"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function DirectoryClient({ groupedStocks, letters }) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter stocks based on query
  const getFilteredStocks = (letter) => {
    if (!searchQuery.trim()) return groupedStocks[letter];
    const q = searchQuery.toLowerCase();
    return groupedStocks[letter].filter(sym => sym.toLowerCase().includes(q));
  };

  // If there's a search query, some letters might have no matching stocks
  // We only want to show letters that have at least one matching stock
  const visibleLetters = letters.filter(letter => getFilteredStocks(letter).length > 0);

  return (
    <>
      <div className="directory-search-wrapper">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ds-icon">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input 
          type="text" 
          placeholder="Search for a stock symbol in the directory..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="directory-search"
        />
        {searchQuery && (
          <button className="ds-clear" onClick={() => setSearchQuery('')}>✕</button>
        )}
      </div>

      <div className="alphabet-nav">
        {letters.map(letter => (
          <a 
            key={letter} 
            href={`#letter-${letter}`} 
            className={`alpha-link ${visibleLetters.includes(letter) ? '' : 'alpha-link-disabled'}`}
            onClick={(e) => {
              if (!visibleLetters.includes(letter)) e.preventDefault();
            }}
          >
            {letter}
          </a>
        ))}
      </div>

      <div className="directory-content">
        {visibleLetters.length === 0 ? (
          <div className="directory-empty">No stocks found matching "{searchQuery}"</div>
        ) : (
          visibleLetters.map(letter => {
            const filtered = getFilteredStocks(letter);
            return (
              <div key={letter} id={`letter-${letter}`} className="letter-section">
                <h2 className="letter-heading">{letter} <span className="letter-count">({filtered.length})</span></h2>
                <div className="stock-grid">
                  {filtered.map(sym => (
                    <Link key={sym} href={`/stock/${sym}`} prefetch={false} className="stock-link">
                      {sym}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}

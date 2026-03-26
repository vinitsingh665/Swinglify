"use client";
import React from 'react';
import Link from 'next/link';
import { useWatchlist } from '../../hooks/useWatchlist';
import { usePortfolioQuotes } from '../../hooks/usePortfolio';

export default function MiniWatchlist({ onOpenStock }) {
  const { watchedSymbols } = useWatchlist();
  
  // Only grab the first 5 symbols for the dashboard mini-view
  const topSymbols = watchedSymbols.slice(0, 5);
  
  // Fetch real quotes
  const { quotes, loading } = usePortfolioQuotes(topSymbols, 5);

  return (
    <div className="mwl-card">
      <div className="mwl-header">
        <h3 className="mwl-title">Watchlist</h3>
        <Link href="/watchlist" className="mwl-view-all">View All</Link>
      </div>
      <div className="mwl-list">
        {topSymbols.length === 0 && !loading && (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
            Your watchlist is empty.
          </div>
        )}
        {topSymbols.map((symbol) => {
          const s = quotes[symbol];
          if (!s) return (
            <div key={symbol} className="mwl-item" style={{ minHeight: 49 }}>
              <span className="mwl-sym">{symbol}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Loading...</span>
            </div>
          );

          const isUp = (s.change || 0) >= 0;
          const formattedPrice = s.price?.toLocaleString('en-IN') || '0';
          const formattedChange = (s.change || 0) > 0 ? `+${s.change}%` : `${s.change}%`;

          return (
            <div key={symbol} className="mwl-item" onClick={() => onOpenStock && onOpenStock(symbol)}>
              <div className="mwl-info">
                <span className="mwl-sym">{symbol}</span>
                <span className="mwl-price">₹{formattedPrice}</span>
              </div>
              <div className="mwl-chart">
                 <svg viewBox="0 0 40 15" preserveAspectRatio="none">
                   <path d={isUp ? "M0,12 L10,8 L20,9 L30,4 L40,2" : "M0,2 L10,5 L20,3 L30,10 L40,12"}
                         fill="none" stroke={isUp ? "var(--green)" : "var(--red)"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                 </svg>
              </div>
              <div className={`mwl-change ${isUp ? 'up' : 'down'}`}>
                {formattedChange}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

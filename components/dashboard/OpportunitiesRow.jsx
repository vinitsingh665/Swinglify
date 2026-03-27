"use client";
import React, { useState, useEffect, useCallback } from 'react';

const CARD_CONFIGS = [
  {
    id: 'breakout',
    title: "Breakout Stocks",
    tag: "Breakout",
    color: "var(--green)",
    desc: "Volume > 200%",
    filters: { changeMin: 3, volumeMin: 500000, sortBy: 'change', sortOrder: 'desc', limit: 10 },
    screenerParams: 'changeMin=3&volumeMin=500000&sortBy=change&sortOrder=desc'
  },
  {
    id: 'oversold',
    title: "Oversold (RSI < 30)",
    tag: "Oversold",
    color: "var(--accent)",
    desc: "Swing potential",
    filters: { rsiMode: 'oversold', sortBy: 'rsi', sortOrder: 'asc', limit: 10 },
    screenerParams: 'rsiMode=oversold&sortBy=rsi&sortOrder=asc'
  },
  {
    id: 'volspike',
    title: "Volume Spike",
    tag: "Vol Spike",
    color: "var(--blue, #3b82f6)",
    desc: "Sudden activity",
    filters: { volumeMin: 1000000, sortBy: 'volume', sortOrder: 'desc', limit: 10 },
    screenerParams: 'volumeMin=1000000&sortBy=volume&sortOrder=desc'
  }
];

function formatVolume(v) {
  if (!v) return '-';
  if (v >= 10000000) return (v / 10000000).toFixed(1) + ' Cr';
  if (v >= 100000) return (v / 100000).toFixed(1) + ' L';
  if (v >= 1000) return (v / 1000).toFixed(1) + ' K';
  return v.toString();
}

export default function OpportunitiesRow({ onOpenStock }) {
  const [expandedCard, setExpandedCard] = useState(null);
  const [stocksMap, setStocksMap] = useState({});
  const [loadingMap, setLoadingMap] = useState({});
  const [counts, setCounts] = useState({});

  // Fetch counts on mount
  useEffect(() => {
    CARD_CONFIGS.forEach(async (card) => {
      try {
        const res = await fetch('/api/screener', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...card.filters, limit: 1 })
        });
        const data = await res.json();
        if (data.success) {
          setCounts(prev => ({ ...prev, [card.id]: data.totalCount || data.count || 0 }));
        }
      } catch (e) { /* ignore */ }
    });
  }, []);

  const handleCardClick = useCallback(async (card) => {
    if (expandedCard === card.id) {
      setExpandedCard(null);
      return;
    }

    setExpandedCard(card.id);

    // Fetch stocks if not already loaded
    if (!stocksMap[card.id]) {
      setLoadingMap(prev => ({ ...prev, [card.id]: true }));
      try {
        const res = await fetch('/api/screener', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(card.filters)
        });
        const data = await res.json();
        if (data.success) {
          setStocksMap(prev => ({ ...prev, [card.id]: data.data }));
          setCounts(prev => ({ ...prev, [card.id]: data.totalCount || data.count }));
        }
      } catch (e) {
        console.error('Failed to fetch opportunity stocks:', e);
      } finally {
        setLoadingMap(prev => ({ ...prev, [card.id]: false }));
      }
    }
  }, [expandedCard, stocksMap]);

  return (
    <div className="opp-section">
      <div className="opp-row">
        {CARD_CONFIGS.map((card) => {
          const isExpanded = expandedCard === card.id;
          const count = counts[card.id];

          return (
            <div
              key={card.id}
              className={`opp-card ${isExpanded ? 'active' : ''}`}
              onClick={() => handleCardClick(card)}
            >
              <div className="opp-header">
                <span className="opp-title">{card.title}</span>
                <span className="opp-tag" style={{ color: card.color, background: `color-mix(in srgb, ${card.color} 15%, transparent)` }}>{card.tag}</span>
              </div>
              <div className="opp-body">
                <div className="opp-val">{count != null ? `${count} Stocks` : '...'}</div>
                <div className="opp-desc">{card.desc}</div>
              </div>
              <div className="opp-sparkline">
                <svg viewBox="0 0 100 30" preserveAspectRatio="none">
                  <path d="M0,25 Q15,20 25,22 T50,15 T70,18 T85,5 T100,10" fill="none" stroke={card.color} strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div className="opp-expand-icon" style={{ color: card.color }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"
                  style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s' }}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded Stock List */}
      {expandedCard && (
        <div className="opp-expanded" style={{ '--card-color': CARD_CONFIGS.find(c => c.id === expandedCard)?.color }}>
          {loadingMap[expandedCard] ? (
            <div className="opp-expanded-loading">
              <div className="opp-spinner" />
              <span>Loading stocks...</span>
            </div>
          ) : stocksMap[expandedCard]?.length > 0 ? (
            <>
              <div className="opp-stock-header">
                <span className="opp-sh-symbol">Symbol</span>
                <span className="opp-sh-price">Price</span>
                <span className="opp-sh-change">Change</span>
                <span className="opp-sh-rsi">RSI</span>
                <span className="opp-sh-vol">Volume</span>
              </div>
              {stocksMap[expandedCard].map((stock) => (
                <div
                  key={stock.symbol}
                  className="opp-stock-row"
                  onClick={(e) => { e.stopPropagation(); onOpenStock?.(stock.symbol); }}
                >
                  <div className="opp-sr-symbol">
                    {stock.logo && <img src={stock.logo} alt="" className="opp-sr-logo" />}
                    <div>
                      <div className="opp-sr-ticker">{stock.symbol}</div>
                      <div className="opp-sr-name">{stock.name}</div>
                    </div>
                  </div>
                  <span className="opp-sr-price">₹{stock.price?.toLocaleString('en-IN')}</span>
                  <span className={`opp-sr-change ${(stock.change || 0) >= 0 ? 'positive' : 'negative'}`}>
                    {(stock.change || 0) >= 0 ? '+' : ''}{stock.change}%
                  </span>
                  <span className="opp-sr-rsi">{stock.rsi ?? '-'}</span>
                  <span className="opp-sr-vol">{formatVolume(stock.volume)}</span>
                </div>
              ))}
              {counts[expandedCard] > stocksMap[expandedCard].length && (
                <div className="opp-expanded-footer">
                  <span>Showing {stocksMap[expandedCard].length} of {counts[expandedCard]} stocks</span>
                  <a href={`/screener?${CARD_CONFIGS.find(c => c.id === expandedCard)?.screenerParams || ''}`} className="opp-view-all-link">View all in Screener →</a>
                </div>
              )}
            </>
          ) : (
            <div className="opp-expanded-empty">No matching stocks found right now.</div>
          )}
        </div>
      )}
    </div>
  );
}

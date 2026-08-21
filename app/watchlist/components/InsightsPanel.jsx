"use client";
import { useState, useEffect } from 'react';

const formatVol = (v) => {
  if (!v) return '—';
  if (v >= 10000000) return `${(v / 10000000).toFixed(1)}Cr`;
  if (v >= 100000) return `${(v / 100000).toFixed(1)}L`;
  if (v >= 1000) return `${(v / 1000).toFixed(0)}K`;
  return v.toLocaleString('en-IN');
};

const formatMCap = (m) => {
  if (!m) return '—';
  if (m >= 10000000000000) return `${(m / 10000000000000).toFixed(2)}L Cr`;
  if (m >= 100000000000) return `${(m / 10000000).toFixed(0)} Cr`;
  return `${(m / 10000000).toFixed(0)} Cr`;
};

function WatchlistAIInsight({ stock }) {
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!stock || !stock.symbol || !stock.price) return;

    setLoading(true);
    fetch('/api/stocks/insight', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ticker: stock.symbol,
        currentPrice: stock.price,
        rsi: stock.rsi,
        technicalScore: stock.recommendation || 'Neutral',
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        setInsight(data.insight);
        setLoading(false);
      })
      .catch(() => {
        setInsight('AI analysis is currently unavailable.');
        setLoading(false);
      });
  }, [stock?.symbol]);

  return (
    <div className="ai-insight-card" style={{ marginTop: '0', background: 'transparent', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '12px', boxShadow: 'none' }}>
      <div className="ai-insight-header">
        <span className="ai-param-icon">✨</span>
        <span className="ai-insight-title">AI Insight</span>
        <span className="ai-insight-badge" style={{ fontSize: '0.6rem', padding: '1px 5px' }}>GPT-OSS</span>
      </div>
      <div className="ai-insight-body">
        {loading ? (
          <div className="ai-skeleton-container">
            <div className="ai-skeleton-line" style={{ width: '95%' }}></div>
            <div className="ai-skeleton-line" style={{ width: '85%' }}></div>
          </div>
        ) : (
          <p className="ai-insight-text" style={{ fontSize: '0.8rem' }}>{insight}</p>
        )}
      </div>
    </div>
  );
}

export default function InsightsPanel({ stock, onClose }) {
  if (!stock) return null;

  const isUp = (stock.change || 0) >= 0;

  return (
    <div className="wl-panel">
      <button className="wlp-close" onClick={onClose} title="Close Insights">
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
          <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <div className="wlp-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {stock.logo ? <img src={stock.logo} style={{ width: 36, height: 36, borderRadius: '50%', background: 'white', padding: 2 }} alt="" /> : null}
          <div>
            <div className="wlp-sym">{stock.symbol}</div>
            <div className="wlp-name">{stock.name}</div>
          </div>
        </div>
        
        <div className="wlp-price-wrap">
          <div className="wlp-price">₹{stock.price?.toLocaleString('en-IN')}</div>
          <div className={`wlp-change ${isUp ? 'up' : 'down'}`}>
            {isUp ? '+' : ''}{stock.change?.toFixed(2)}%
          </div>
        </div>
      </div>

      <div className="wlp-stats">
        <div className="wlp-stat">
          <span className="wlp-sl">Volume</span>
          <span className="wlp-sv">{formatVol(stock.volume)}</span>
        </div>
        <div className="wlp-stat">
          <span className="wlp-sl">Market Cap</span>
          <span className="wlp-sv">{formatMCap(stock.marketCap)}</span>
        </div>
        <div className="wlp-stat">
          <span className="wlp-sl">RSI</span>
          <span className="wlp-sv">{stock.rsi != null ? stock.rsi.toFixed(1) : '—'}</span>
        </div>
        <div className="wlp-stat">
          <span className="wlp-sl">Sector</span>
          <span className="wlp-sv" style={{ fontSize: '0.65rem' }}>{stock.sector || '—'}</span>
        </div>
      </div>

      <WatchlistAIInsight stock={stock} />
    </div>
  );
}


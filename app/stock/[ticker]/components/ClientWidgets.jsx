"use client";

import { useState, useEffect } from 'react';

export function AIInsightWidget({ ticker, price, rsi, recommendation }) {
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ticker || !price) return;

    setLoading(true);
    fetch('/api/stocks/insight', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ticker,
        currentPrice: price,
        rsi: rsi,
        technicalScore: recommendation,
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
  }, [ticker, price, rsi, recommendation]);

  return (
    <div className="ai-insight-card">
      <div className="ai-insight-header">
        <span className="ai-param-icon">✨</span>
        <span className="ai-insight-title">AI Insight</span>
        <span className="ai-insight-badge">Llama 3</span>
      </div>
      <div className="ai-insight-body">
        {loading ? (
          <div className="ai-skeleton-container">
            <div className="ai-skeleton-line" style={{ width: '95%' }}></div>
            <div className="ai-skeleton-line" style={{ width: '85%' }}></div>
            <div className="ai-skeleton-line" style={{ width: '70%' }}></div>
          </div>
        ) : (
          <p className="ai-insight-text">{insight}</p>
        )}
      </div>
    </div>
  );
}

export function ScreenerLink({ symbol }) {
  return (
    <a href={`/screener?search=${symbol}`} className="stock-cta-btn">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      View in Screener
    </a>
  );
}

export function CompareLink({ symbol }) {
  return (
    <a href={`/compare?stock=${symbol}`} className="stock-cta-btn">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
      Compare
    </a>
  );
}

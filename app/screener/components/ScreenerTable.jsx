"use client";
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

const ITEMS_PER_PAGE = 50;

const formatVol = (v) => {
  if (!v) return '—';
  if (v >= 10000000) return `${(v / 10000000).toFixed(1)}Cr`;
  if (v >= 100000) return `${(v / 100000).toFixed(1)}L`;
  if (v >= 1000) return `${(v / 1000).toFixed(0)}K`;
  return v.toLocaleString('en-IN');
};

function getRsiClass(rsi) {
  if (rsi == null) return 'neutral';
  if (rsi < 30) return 'oversold';
  if (rsi > 70) return 'overbought';
  return 'neutral';
}

function getSignalClass(rec) {
  if (!rec) return 'neutral';
  if (rec.includes('BUY')) return 'buy';
  if (rec.includes('SELL')) return 'sell';
  return 'neutral';
}

function getSignalLabel(rec) {
  if (!rec) return 'Neutral';
  return rec.replace('STRONG_', 'S.').replace('_', ' ');
}

/* ─── Inline Insight Mini-Bar (reused from QuickInsights) ─── */
function MiniMetric({ label, value, displayValue, min = 0, max = 100, invertColor = false }) {
  const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  let cls = 'neutral';
  if (!invertColor) {
    if (pct >= 60) cls = 'bullish';
    else if (pct <= 40) cls = 'bearish';
  } else {
    if (value < 30) cls = 'bullish';
    else if (value > 70) cls = 'bearish';
  }
  return (
    <div className="qi-metric">
      <div className="qi-metric-header">
        <span className="qi-metric-label">{label}</span>
        <span className={`qi-metric-value ${cls}`}>{displayValue}</span>
      </div>
      <div className="qi-bar">
        <div className={`qi-bar-fill ${cls}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/* ─── Inline Insights Row (mobile-only) ─── */
function InlineInsights({ stock }) {
  const ref = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.scrollHeight);
    }
  }, [stock]);

  const s = stock;
  const volRatio = s.avgVolume10d ? ((s.volume / s.avgVolume10d) * 100).toFixed(0) : null;
  const emaAbove = s.ema50 ? (s.price > s.ema50 ? 'Above' : 'Below') : null;
  const score = s.indicatorScore?.score || 50;
  const verdictLabel = s.indicatorScore?.label || 'NEUTRAL';
  const verdictCls = score >= 55 ? 'bullish' : score <= 45 ? 'bearish' : 'neutral';

  return (
    <tr className="sr-inline-insights-row">
      <td colSpan="7" style={{ padding: 0, border: 'none' }}>
        <div
          className="sr-inline-insights-wrapper"
          style={{ maxHeight: height || 'none' }}
          ref={ref}
        >
          <div className="sr-inline-insights">
            <div className="sr-ii-header">
              <span className="qi-title">Why {s.symbol}?</span>
              <span className="qi-stock-price" style={{ fontSize: '0.82rem' }}>
                ₹{s.price?.toLocaleString('en-IN')}&nbsp;
                <span style={{ color: (s.change || 0) >= 0 ? 'var(--green-bright)' : 'var(--red-bright)' }}>
                  {(s.change || 0) >= 0 ? '+' : ''}{s.change?.toFixed(2)}%
                </span>
              </span>
            </div>

            <InlineAIInsight ticker={s.symbol} s={s} />

            <div className="sr-ii-metrics">
              {s.rsi != null && (
                <MiniMetric label="RSI" value={s.rsi}
                  displayValue={`${s.rsi.toFixed(0)} → ${s.rsi < 30 ? 'Oversold' : s.rsi > 70 ? 'Overbought' : 'Neutral'}`}
                  invertColor />
              )}
              {volRatio && (
                <MiniMetric label="Vol vs 10d Avg" value={Number(volRatio)}
                  displayValue={`${volRatio}%`} min={0} max={300} />
              )}
              {emaAbove && (
                <MiniMetric label="Price vs 50 EMA"
                  value={s.price > s.ema50 ? 75 : 25} displayValue={emaAbove} />
              )}
              {s.macd != null && s.macdSignal != null && (
                <MiniMetric label="MACD"
                  value={s.macd > s.macdSignal ? 75 : 25}
                  displayValue={s.macd > s.macdSignal ? 'Bullish' : 'Bearish'} />
              )}
            </div>

            <div className={`qi-verdict ${verdictCls}`} style={{ marginTop: 8 }}>
              <div className="qi-verdict-label">Overall Signal</div>
              <div className={`qi-verdict-signal ${verdictCls}`}>{verdictLabel}</div>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}

/* ─── Inline AI Insight for mobile ─── */
function InlineAIInsight({ ticker, s }) {
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ticker || !s || !s.price) return;

    setLoading(true);
    fetch('/api/stocks/insight', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ticker,
        currentPrice: s.price,
        rsi: s.rsi,
        technicalScore: s.indicatorScore?.label || s.recommendation || 'Neutral',
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
  }, [ticker, s]);

  return (
    <div className="ai-insight-card" style={{ marginTop: '12px', marginBottom: '4px', background: 'transparent', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '12px', boxShadow: 'none' }}>
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

export default function ScreenerTable({ 
  stocks, 
  loading, 
  sortBy, 
  sortOrder, 
  onSort, 
  selectedSymbol, 
  onSelect,
  selectedIndex,
  selectedIndexLabel,
  onClearIndex
}) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil((stocks?.length || 0) / ITEMS_PER_PAGE);
  const paged = (stocks || []).slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // Reset page when index or stocks list changes
  useEffect(() => {
    setPage(1);
  }, [selectedIndex, stocks?.length]);

  const handleSort = (col) => {
    if (sortBy === col) {
      onSort(col, sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      onSort(col, 'desc');
    }
  };

  const arrow = (col) => {
    if (sortBy !== col) return '';
    return sortOrder === 'desc' ? ' ▼' : ' ▲';
  };

  if (loading) {
    return (
      <div className="screener-results">
        <div className="sr-header">
          <span className="sr-count">Loading...</span>
        </div>
        <div className="sr-loading">
          <div style={{ fontSize: '2rem', marginBottom: 12 }}>📊</div>
          <div>Scanning stocks...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="screener-results">
      <div className="sr-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span className="sr-count"><strong>{stocks?.length || 0}</strong> stocks found</span>
          {selectedIndex && selectedIndexLabel && (
            <div className="sr-active-index-pill">
              <span className="sr-aip-dot"></span>
              <span>{selectedIndexLabel}</span>
              {onClearIndex && (
                <button onClick={onClearIndex} title="Clear index filter" className="sr-aip-clear">✕</button>
              )}
            </div>
          )}
        </div>
        {totalPages > 1 && <span className="sr-page-info">Page {page} of {totalPages}</span>}
      </div>


      <div className="sr-table-wrap">
        <table className="sr-table">
          <caption className="sr-only" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', borderWidth: 0 }}>Filtered stock screener results with technical indicators</caption>
          <thead>
            <tr>
              <th onClick={() => handleSort('name')}>Stock{arrow('name')}</th>
              <th onClick={() => handleSort('price')}>Price{arrow('price')}</th>
              <th onClick={() => handleSort('change')}>% Change{arrow('change')}</th>
              <th onClick={() => handleSort('volume')}>Volume{arrow('volume')}</th>
              <th onClick={() => handleSort('rsi')}>RSI{arrow('rsi')}</th>
              <th>Signal</th>
              <th onClick={() => handleSort('marketcap')}>M.Cap{arrow('marketcap')}</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((s) => (
              <React.Fragment key={s.symbol}>
                <tr className={`sr-row ${selectedSymbol === s.symbol ? 'selected' : ''}`} onClick={() => onSelect(selectedSymbol === s.symbol ? null : s)}>
                  <td>
                    <div className="sr-stock">
                      {s.logo ? (
                        <img className="sr-logo" src={s.logo} alt={`${s.symbol} logo`} width="28" height="28" loading="lazy" onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                      ) : null}
                      <div className="sr-logo-fallback" style={s.logo ? { display: 'none' } : {}}>{(s.symbol || '?')[0]}</div>
                      <div>
                        <div className="sr-sym">
                          <Link
                            href={`/stock/${s.symbol}`}
                            onClick={(e) => e.stopPropagation()}
                            title={`View ${s.symbol} share price and technical analysis`}
                            style={{ color: 'inherit', textDecoration: 'none' }}
                          >
                            {s.symbol}
                            <span style={{ display: 'inline-block', marginLeft: 4, fontSize: '0.65rem', opacity: 0.55 }}>↗</span>
                          </Link>
                        </div>
                        <div className="sr-name">{s.name}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="sr-price">₹{s.price?.toLocaleString('en-IN') || '—'}</span></td>
                  <td>
                    <span className={`sr-change ${(s.change || 0) >= 0 ? 'positive' : 'negative'}`}>
                      {(s.change || 0) >= 0 ? '+' : ''}{s.change?.toFixed(2) || 0}%
                    </span>
                  </td>
                  <td><span className="sr-volume">{formatVol(s.volume)}</span></td>
                  <td>
                    <span className={`sr-rsi-badge ${getRsiClass(s.rsi)}`}>
                      {s.rsi != null ? s.rsi.toFixed(0) : '—'}
                    </span>
                  </td>
                  <td>
                    <span className={`sr-signal ${getSignalClass(s.recommendation)}`}>
                      {getSignalLabel(s.recommendation)}
                    </span>
                  </td>
                  <td>
                    <span className="sr-volume">
                      {s.marketCap ? (s.marketCap >= 10000000000000 ? `${(s.marketCap/10000000000000).toFixed(1)}L Cr` : s.marketCap >= 100000000000 ? `${(s.marketCap/10000000).toFixed(0)} Cr` : s.marketCap >= 10000000 ? `${(s.marketCap/10000000).toFixed(0)} Cr` : '—') : '—'}
                    </span>
                  </td>
                  {/* TradingView hover action */}
                  <td style={{ padding: 0, width: 0, border: 'none' }}>
                    <div className="sr-tv-action" onClick={(e) => e.stopPropagation()}>
                      <a
                        href={`https://www.tradingview.com/chart/?symbol=NSE%3A${s.symbol}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sr-tv-btn"
                        title={`View ${s.symbol} on TradingView`}
                      >
                        <svg width="16" height="16" viewBox="0 0 36 28" fill="none">
                          <path d="M14 22H7V11h7v11zm11 0h-7V6h7v16zm11 0h-7V0h7v22zM3 28H0V0h3v28z" fill="currentColor"/>
                        </svg>
                        <span>TradingView</span>
                      </a>
                    </div>
                  </td>
                </tr>
                {selectedSymbol === s.symbol && <InlineInsights stock={s} />}
              </React.Fragment>
            ))}
            {(!stocks || stocks.length === 0) && (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: 40, color: 'var(--text-dim)' }}>No stocks match your filters. Try adjusting criteria.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="sr-pagination">
          <button className="sr-page-btn" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
          <span className="sr-page-info">Page {page} / {totalPages}</span>
          <button className="sr-page-btn" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
        </div>
      )}
    </div>
  );
}

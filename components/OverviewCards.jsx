"use client";
import { useState, useEffect, useRef, useCallback } from 'react';
import { useIndices, useSearch, useStockDetail } from '../hooks/useStockData';
import { formatNumber, formatMarketCap } from '../utils';

export default function OverviewCards({ theme, categoryName, onCategoryChange, onOpenStock }) {
  const { indices } = useIndices();
  const nifty = indices.find(i => i.symbol === 'NIFTY' || (i.name && i.name.includes('Nifty 50')));
  const [activePeriod, setActivePeriod] = useState('1D');
  const [activeToggle, setActiveToggle] = useState('actual');
  const [chartSymbol, setChartSymbol] = useState(null); // null = show index chart, string = show stock chart

  const handleChartSymbol = useCallback((symbol) => {
    setChartSymbol(symbol);
  }, []);

  const handleClearChartSymbol = useCallback(() => {
    setChartSymbol(null);
  }, []);

  return (
    <div className="overview-cards">
      <BalanceCard
        theme={theme}
        categoryName={categoryName}
        nifty={nifty}
        activePeriod={activePeriod}
        setActivePeriod={setActivePeriod}
        activeToggle={activeToggle}
        setActiveToggle={setActiveToggle}
        onCategoryChange={(id, label) => { handleClearChartSymbol(); onCategoryChange(id, label); }}
        chartSymbol={chartSymbol}
        onClearChartSymbol={handleClearChartSymbol}
      />
      <SwapCard onOpenStock={onOpenStock} onChartSymbol={handleChartSymbol} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   BALANCE CARD — Market Overview with Real Chart Data
   ═══════════════════════════════════════════════════════════════════════════ */
function BalanceCard({ theme, categoryName, nifty, activePeriod, setActivePeriod, activeToggle, setActiveToggle, onCategoryChange, chartSymbol, onClearChartSymbol }) {
  const canvasRef = useRef(null);
  const periods = ['1D', '1W', '1Y', 'Max'];
  const [chartData, setChartData] = useState(null);
  const [chartLoading, setChartLoading] = useState(true);
  const timerRef = useRef(null);

  // Map category names to index keys for the chart API
  const getIndexKey = useCallback(() => {
    const cn = (categoryName || '').toLowerCase();
    if (cn.includes('bank')) return 'banknifty';
    if (cn.includes('mid')) return 'midcap100';
    if (cn.includes('small')) return 'smallcap100';
    return 'nifty50';
  }, [categoryName]);

  // Fetch chart data
  const fetchChart = useCallback(async () => {
    if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return;
    try {
      let url;
      if (chartSymbol) {
        // Fetch individual stock chart
        url = `/api/chart?symbol=${encodeURIComponent(chartSymbol)}&period=${activePeriod}`;
      } else {
        // Fetch index chart
        const idx = getIndexKey();
        url = `/api/chart?index=${idx}&period=${activePeriod}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setChartData(data);
      } else {
        setChartData(null); // Clear chart to prevent sticky data
      }
    } catch (e) {
      console.warn('Chart fetch failed:', e);
      setChartData(null);
    } finally {
      setChartLoading(false);
    }
  }, [getIndexKey, activePeriod, chartSymbol]);

  // Initial fetch + 30s auto-refresh
  useEffect(() => {
    setChartLoading(true);
    fetchChart();
    
    // Auto-refresh every 30 seconds
    timerRef.current = setInterval(fetchChart, 30000);
    return () => clearInterval(timerRef.current);
  }, [fetchChart]);

  // Derive chart values
  const chartPrice = chartData?.currentPrice;
  const prevClose = chartData?.previousClose;
  const displayValue = chartPrice ? formatNumber(chartPrice) : (nifty ? formatNumber(nifty.value) : '—');
  const changePercent = (chartPrice && prevClose)
    ? Math.round(((chartPrice - prevClose) / prevClose) * 10000) / 100
    : (nifty ? nifty.change : 0);

  // Draw the chart
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);

    const isLight = theme === 'light';
    const padding = { top: 10, right: 50, bottom: 30, left: 10 };
    const chartW = rect.width - padding.left - padding.right;
    const chartH = rect.height - padding.top - padding.bottom;

    // If no data yet, show loading placeholder
    if (!chartData?.points?.length) {
      ctx.fillStyle = isLight ? '#9ca3af' : '#444444';
      ctx.font = '11px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(chartLoading ? 'Loading chart data…' : 'No data available', rect.width / 2, rect.height / 2);
      return;
    }

    const points = chartData.points;
    const values = points.map(p => p.value);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const range = maxVal - minVal || 1;

    // Determine chart color based on performance
    const isPositive = values[values.length - 1] >= values[0];
    const lineColor = isPositive ? '#22c55e' : '#ef4444';
    const fillColorTop = isPositive ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)';
    const fillColorBot = 'transparent';

    // Grid lines
    ctx.strokeStyle = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 3; i++) {
      const y = padding.top + (chartH / 3) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(rect.width - padding.right, y);
      ctx.stroke();
    }

    // Previous close reference line (for 1D)
    if (activePeriod === '1D' && prevClose && prevClose >= minVal && prevClose <= maxVal) {
      const prevY = padding.top + chartH - ((prevClose - minVal) / range) * chartH;
      ctx.strokeStyle = isLight ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.12)';
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padding.left, prevY);
      ctx.lineTo(rect.width - padding.right, prevY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Label
      ctx.fillStyle = isLight ? '#6b7280' : '#666666';
      ctx.font = '8px Inter';
      ctx.textAlign = 'right';
      ctx.fillText('Prev', rect.width - 4, prevY - 4);
    }

    // Area fill gradient
    const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
    gradient.addColorStop(0, fillColorTop);
    gradient.addColorStop(1, fillColorBot);

    ctx.beginPath();
    points.forEach((p, i) => {
      const x = padding.left + (i / (points.length - 1)) * chartW;
      const y = padding.top + chartH - ((p.value - minVal) / range) * chartH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    // Close the area path
    const lastX = padding.left + chartW;
    const firstX = padding.left;
    ctx.lineTo(lastX, padding.top + chartH);
    ctx.lineTo(firstX, padding.top + chartH);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Chart line
    ctx.beginPath();
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1.8;
    ctx.lineJoin = 'round';
    points.forEach((p, i) => {
      const x = padding.left + (i / (points.length - 1)) * chartW;
      const y = padding.top + chartH - ((p.value - minVal) / range) * chartH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Live dot on last point
    const lastPoint = points[points.length - 1];
    const dotX = padding.left + chartW;
    const dotY = padding.top + chartH - ((lastPoint.value - minVal) / range) * chartH;
    
    // Glow
    ctx.beginPath();
    ctx.arc(dotX, dotY, 5, 0, Math.PI * 2);
    ctx.fillStyle = isPositive ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)';
    ctx.fill();
    // Dot
    ctx.beginPath();
    ctx.arc(dotX, dotY, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = lineColor;
    ctx.fill();

    // Y-axis labels (3 points: max, mid, min)
    ctx.fillStyle = isLight ? '#6b7280' : '#444444';
    ctx.font = '9px Inter';
    ctx.textAlign = 'right';
    const yVals = [maxVal, (maxVal + minVal) / 2, minVal];
    yVals.forEach((val, i) => {
      const y = padding.top + (chartH / (yVals.length - 1)) * i + 3;
      ctx.fillText(val.toFixed(0), rect.width - 4, y);
    });

    // X-axis labels (time-based)
    ctx.fillStyle = isLight ? '#6b7280' : '#444444';
    ctx.font = '9px Inter';
    ctx.textAlign = 'center';
    
    const labelCount = 5;
    const xLabels = [];
    for (let i = 0; i < labelCount; i++) {
      const idx = Math.floor((i / (labelCount - 1)) * (points.length - 1));
      const pt = points[idx];
      const d = new Date(pt.time);
      
      let label;
      if (activePeriod === '1D') {
        label = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
      } else if (activePeriod === '1W') {
        label = d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' });
      } else if (activePeriod === '1Y') {
        label = d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
      } else {
        label = d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
      }
      xLabels.push(label);
    }
    
    xLabels.forEach((label, i) => {
      const x = padding.left + (i / (xLabels.length - 1)) * chartW;
      ctx.fillText(label, x, rect.height - 8);
    });
  }, [chartData, activePeriod, theme, chartLoading, prevClose]);

  // Index label for display
  const indexLabels = {
    'nifty50': 'NIFTY 50 • NSE',
    'banknifty': 'BANK NIFTY • NSE',
    'midcap100': 'NIFTY MIDCAP 100 • NSE',
    'smallcap100': 'NIFTY SMALLCAP 100 • NSE',
  };
  const indexKey = getIndexKey();

  // Determine display label
  const chartLabel = chartSymbol
    ? `${chartSymbol.toUpperCase()} • NSE`
    : (indexLabels[indexKey] || 'NIFTY 50 • NSE');

  return (
    <div className="balance-card">
      <div className="balance-card-header">
        <span className="balance-card-title">
          {chartSymbol ? 'Stock Chart' : 'Market Overview'}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {chartLoading && (
            <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
              Updating…
            </span>
          )}
          <div className="balance-toggle">
            <button
              className="balance-toggle-btn active"
            >Actual</button>
            <button
              className="balance-toggle-btn"
              onClick={() => {
                setActiveToggle('predicted');
                setTimeout(() => setActiveToggle('actual'), 2500);
              }}
            >✨ AI predicted</button>
          </div>
        </div>
      </div>

      {activeToggle === 'predicted' && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          padding: '6px 14px', margin: '4px 0',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--accent-bg)',
          border: '1px solid var(--accent)',
          fontSize: '0.72rem', fontWeight: 600,
          color: 'var(--accent)',
          animation: 'notifSlideIn 0.2s ease',
        }}>
          🚀 AI Predicted Charts — Coming Soon!
        </div>
      )}

      <div className="balance-amount">
        {chartSymbol && '₹'}{displayValue}
      </div>
      <div className="balance-sub">
        {chartLabel} • {' '}
        <span style={{ color: changePercent >= 0 ? 'var(--green)' : 'var(--red)' }}>
          {changePercent >= 0 ? '+' : ''}{changePercent}%
        </span>
        <span style={{ marginLeft: 6, fontSize: '0.62rem', color: 'var(--text-dim)' }}>
          • refreshes every 30s
        </span>
      </div>

      <div className="balance-periods">
        {periods.map(p => (
          <button
            key={p}
            className={`period-btn ${activePeriod === p ? 'active' : ''}`}
            onClick={() => setActivePeriod(p)}
          >{p}</button>
        ))}
        <button className="period-btn" title="Chart settings">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18M9 21V9" />
          </svg>
        </button>
      </div>

      <div className="chart-container">
        <canvas ref={canvasRef} className="chart-canvas" />
      </div>

      <div className="action-buttons">
        <button className={`action-btn ${(categoryName || '').includes('Nifty 50') ? 'active' : ''}`} onClick={() => onCategoryChange('nifty50', 'Nifty 50')}>
          Nifty 50
        </button>
        <button className={`action-btn ${(categoryName || '').includes('Bank Nifty') ? 'active' : ''}`} onClick={() => onCategoryChange('banknifty', 'Bank Nifty')}>
          Bank Nifty
        </button>
        <button className={`action-btn ${(categoryName || '').includes('MidCap') ? 'active' : ''}`} onClick={() => onCategoryChange('midcap100', 'MidCap 100')}>
          MidCap
        </button>
        <button className={`action-btn ${(categoryName || '').includes('SmallCap') ? 'active' : ''}`} onClick={() => onCategoryChange('smallcap100', 'SmallCap 100')}>
          SmallCap
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SWAP CARD — Quick Stock Lookup
   ═══════════════════════════════════════════════════════════════════════════ */
function SwapCard({ onOpenStock, onChartSymbol }) {
  const [symbol, setSymbol] = useState('');
  const { stock, loading, fetchStock } = useStockDetail();
  const { results, search, clearResults } = useSearch();
  const [inputVal, setInputVal] = useState('RELIANCE');
  const [outputVal, setOutputVal] = useState('');
  const [exchange, setExchange] = useState('NSE');
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    fetchStock('RELIANCE');
  }, [fetchStock]);

  useEffect(() => {
    if (stock) {
      setOutputVal(formatNumber(stock.price));
    }
  }, [stock]);

  const handleLookup = () => {
    if (inputVal.trim()) {
      const sym = inputVal.trim().toUpperCase();
      fetchStock(sym);
      if (onChartSymbol) onChartSymbol(sym);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleLookup();
  };

  return (
    <div className="swap-card">
      <div className="swap-card-title">Quick Lookup</div>

      <div className="swap-input-group">
        <span className="swap-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Symbol</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Quick Select</span>
        </span>
        <div className="swap-input-row" ref={containerRef} style={{ position: 'relative' }}>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => {
              const val = e.target.value.toUpperCase();
              setInputVal(val);
              search(val);
              setShowDropdown(val.trim().length > 0);
            }}
            onFocus={() => {
              if (inputVal.trim().length > 0) {
                search(inputVal);
                setShowDropdown(true);
              }
            }}
            onKeyDown={handleKeyDown}
            style={{
              background: 'transparent', border: 'none', outline: 'none',
              color: 'var(--text-primary)', fontFamily: 'var(--font)',
              fontSize: '1.5rem', fontWeight: 600, width: '100%', letterSpacing: '-0.5px'
            }}
            placeholder="SYMBOL"
          />
          <div 
            className="swap-token" 
            onClick={() => setExchange(e => e === 'NSE' ? 'BSE' : 'NSE')}
            style={{ cursor: 'pointer', transition: 'background-color 0.2s', userSelect: 'none' }}
            title="Click to toggle exchange"
          >
            <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{exchange}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: 4, width: 14, height: 14 }}><path d="M6 9l6 6 6-6"/></svg>
          </div>

          {/* Search Dropdown */}
          {showDropdown && results.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: '12px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              zIndex: 100,
              maxHeight: '240px',
              overflowY: 'auto'
            }}>
              {results.slice(0, 5).map(s => (
                <div 
                  key={s.symbol}
                  onClick={() => {
                    setInputVal(s.symbol);
                    setShowDropdown(false);
                    fetchStock(s.symbol);
                    if (onChartSymbol) onChartSymbol(s.symbol);
                  }}
                  style={{
                    padding: '12px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    borderBottom: '1px solid var(--border)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{s.symbol}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{s.name}</div>
                  </div>
                  <div style={{ textAlign: 'right', marginLeft: 16 }}>
                    <div style={{ fontWeight: 500, fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-primary)' }}>₹{formatNumber(s.price)}</div>
                    <div style={{ color: s.change >= 0 ? 'var(--green)' : 'var(--red)', fontSize: '0.7rem' }}>
                      {s.change >= 0 ? '+' : ''}{s.change}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="swap-arrow">
        <div className="swap-arrow-circle" onClick={handleLookup}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </div>
      </div>

      <div className="swap-input-group">
        <span className="swap-label">Current Price</span>
        <div className="swap-input-row">
          <div className="swap-input-value">
            {loading ? '...' : stock ? (
              <>₹{formatNumber(stock.price)}</>
            ) : '—'}
          </div>
          {stock && (
            <div className="swap-token">
              <span style={{ color: stock.change >= 0 ? 'var(--green)' : 'var(--red)' }}>
                {stock.change >= 0 ? '+' : ''}{stock.change}%
              </span>
            </div>
          )}
        </div>
      </div>

      {stock && (
        <>
          <div className="swap-info">
            <span className="swap-info-label">Market Cap</span>
            <span className="swap-info-value">{formatMarketCap(stock.marketCap)}</span>
          </div>
          <div className="swap-info" style={{ borderTop: 'none', marginTop: 0 }}>
            <span className="swap-info-label">Signal</span>
            <span className="swap-info-value" style={{
              color: stock.recommendation === 'STRONG_BUY' || stock.recommendation === 'BUY'
                ? 'var(--green)' : stock.recommendation === 'STRONG_SELL' || stock.recommendation === 'SELL'
                ? 'var(--red)' : 'var(--text-secondary)'
            }}>
              {stock.recommendation?.replace('_', ' ') || 'NEUTRAL'}
            </span>
          </div>
        </>
      )}

      <button className="swap-submit" onClick={() => stock && onOpenStock(stock.symbol)}>
        View Details
      </button>
    </div>
  );
}

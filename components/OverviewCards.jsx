"use client";
import { useState, useEffect, useRef, useCallback } from 'react';
import { useIndices, useSearch, useStockDetail } from '../hooks/useStockData';
import { formatNumber, formatMarketCap } from '../utils';

export default function OverviewCards({ theme, categoryName, onCategoryChange, onOpenStock }) {
  const { indices } = useIndices();
  const nifty = indices.find(i => i.symbol === 'NIFTY' || (i.name && i.name.includes('Nifty 50')));
  const [activePeriod, setActivePeriod] = useState('1D');
  const [activeToggle, setActiveToggle] = useState('actual');

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
        onCategoryChange={onCategoryChange}
      />
      <SwapCard onOpenStock={onOpenStock} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   BALANCE CARD — Market Overview with Chart
   ═══════════════════════════════════════════════════════════════════════════ */
function BalanceCard({ theme, categoryName, nifty, activePeriod, setActivePeriod, activeToggle, setActiveToggle, onCategoryChange }) {
  const canvasRef = useRef(null);
  const periods = ['1D', '1W', '1Y', 'Max'];

  const niftyValue = nifty ? formatNumber(nifty.value) : '—';
  const niftyChange = nifty ? nifty.change : 0;

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

    // Generate realistic-looking chart data
    const points = 80;
    const data = [];
    let val = 50 + Math.random() * 20;
    for (let i = 0; i < points; i++) {
      val += (Math.random() - 0.48) * 4;
      val = Math.max(10, Math.min(90, val));
      data.push(val);
    }

    const padding = { top: 10, right: 50, bottom: 30, left: 10 };
    const chartW = rect.width - padding.left - padding.right;
    const chartH = rect.height - padding.top - padding.bottom;
    const minVal = Math.min(...data);
    const maxVal = Math.max(...data);
    const range = maxVal - minVal || 1;

    const isLight = theme === 'light';

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

    // Chart line
    ctx.beginPath();
    ctx.strokeStyle = isLight ? '#121212' : '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.lineJoin = 'round';
    data.forEach((v, i) => {
      const x = padding.left + (i / (points - 1)) * chartW;
      const y = padding.top + chartH - ((v - minVal) / range) * chartH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Y-axis labels
    ctx.fillStyle = '#444444';
    ctx.font = '9px Inter';
    ctx.textAlign = 'right';
    const yLabels = nifty
      ? [
          (nifty.value * 1.02).toFixed(0),
          nifty.value.toFixed(0),
          (nifty.value * 0.98).toFixed(0)
        ]
      : ['$3k', '$2k', '$1k'];
    yLabels.forEach((label, i) => {
      const y = padding.top + (chartH / (yLabels.length - 1)) * i + 3;
      ctx.fillText(label, rect.width - 4, y);
    });

    // X-axis labels
    ctx.fillStyle = '#444444';
    ctx.font = '9px Inter';
    ctx.textAlign = 'center';
    const xLabels = ['9:15 am', '10:30 am', '12 pm', '1:30 pm', '3:30 pm'];
    xLabels.forEach((label, i) => {
      const x = padding.left + (i / (xLabels.length - 1)) * chartW;
      ctx.fillText(label, x, rect.height - 8);
    });
  }, [nifty, activePeriod, theme]);

  return (
    <div className="balance-card">
      <div className="balance-card-header">
        <span className="balance-card-title">Market Overview</span>
        <div className="balance-toggle">
          <button
            className={`balance-toggle-btn ${activeToggle === 'actual' ? 'active' : ''}`}
            onClick={() => setActiveToggle('actual')}
          >Actual</button>
          <button
            className={`balance-toggle-btn ${activeToggle === 'predicted' ? 'active' : ''}`}
            onClick={() => setActiveToggle('predicted')}
          >✨ AI predicted</button>
        </div>
      </div>

      <div className="balance-amount">{niftyValue}</div>
      <div className="balance-sub">NIFTY 50 • NSE • {niftyChange >= 0 ? '+' : ''}{niftyChange}%</div>

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
function SwapCard({ onOpenStock }) {
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
      fetchStock(inputVal.trim().toUpperCase());
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

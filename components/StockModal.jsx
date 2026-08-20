"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStockDetail } from '../hooks/useStockData';
import { formatNumber, formatVolume, formatMarketCap, getSignalClass, formatSignal } from '../utils';

export default function StockModal({ symbol, onClose }) {
  const { stock, loading, fetchStock } = useStockDetail();

  useEffect(() => {
    if (symbol) fetchStock(symbol);
  }, [symbol, fetchStock]);

  if (!symbol) return null;

  const s = stock;
  const changeColor = s && (s.change || 0) >= 0 ? 'var(--green)' : 'var(--red)';
  const changeSign = s && (s.change || 0) >= 0 ? '+' : '';

  return (
    <div className="modal-overlay active" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal glass-card">
        <button className="modal-close" onClick={onClose}>&times;</button>
        <div className="modal-content">
          {loading ? (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Loading...</div>
          ) : !s ? (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--red)' }}>Stock not found</div>
          ) : (
            <>
              {/* Header */}
              <div className="modal-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {s.logo && <img className="stock-logo" src={s.logo} alt={s.symbol} style={{ width: 32, height: 32 }} onError={(e) => e.target.style.display = 'none'} />}
                  <div>
                    <div className="modal-symbol">{s.symbol}</div>
                    <div className="modal-name">{s.name} · {s.exchange} · {s.sector || 'N/A'}</div>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="modal-price-block">
                <div className="modal-price">₹{formatNumber(s.price)}</div>
                <div className="modal-change" style={{ color: changeColor }}>
                  {changeSign}{(s.change || 0).toFixed(2)}% ({changeSign}₹{formatNumber(Math.abs(s.changeAbs || 0))})
                </div>
              </div>

              {/* Full Page Link */}
              <Link
                href={`/stock/${s.symbol}`}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '10px 20px', borderRadius: 10, marginBottom: 8,
                  background: 'var(--accent)', color: '#fff', textDecoration: 'none',
                  fontSize: '0.82rem', fontWeight: 700, transition: 'opacity 0.2s',
                  border: 'none', cursor: 'pointer',
                }}
                onMouseOver={e => e.currentTarget.style.opacity = '0.85'}
                onMouseOut={e => e.currentTarget.style.opacity = '1'}
              >
                View Full Analysis →
              </Link>

              {/* TradingView Link */}
              <a
                href={`https://www.tradingview.com/chart/?symbol=NSE%3A${s.symbol}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '10px 20px', borderRadius: 10, marginBottom: 12,
                  background: 'rgba(41, 98, 255, 0.1)', color: '#5b9cf6', textDecoration: 'none',
                  fontSize: '0.82rem', fontWeight: 700, transition: 'all 0.2s',
                  border: '1px solid rgba(41, 98, 255, 0.25)', cursor: 'pointer',
                }}
                onMouseOver={e => { e.currentTarget.style.background = 'rgba(41, 98, 255, 0.2)'; e.currentTarget.style.borderColor = 'rgba(41, 98, 255, 0.5)'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'rgba(41, 98, 255, 0.1)'; e.currentTarget.style.borderColor = 'rgba(41, 98, 255, 0.25)'; }}
              >
                <svg width="16" height="16" viewBox="0 0 36 28" fill="none">
                  <path d="M14 22H7V11h7v11zm11 0h-7V6h7v16zm11 0h-7V0h7v22zM3 28H0V0h3v28z" fill="currentColor"/>
                </svg>
                View on TradingView ↗
              </a>

              {/* AI Insight */}
              <AIInsight ticker={s.symbol} s={s} />

              {/* Indicator Signals */}
              <IndicatorSignals s={s} />

              {/* Key Stats */}
              <div className="modal-grid">
                <Stat label="Open" value={`₹${formatNumber(s.open)}`} />
                <Stat label="High" value={`₹${formatNumber(s.high)}`} />
                <Stat label="Low" value={`₹${formatNumber(s.low)}`} />
                <Stat label="Volume" value={formatVolume(s.volume)} />
                <Stat label="Market Cap" value={formatMarketCap(s.marketCap)} />
                <Stat label="P/E Ratio" value={s.pe ? s.pe.toFixed(2) : '—'} />
                <Stat label="EPS" value={s.eps ? `₹${s.eps.toFixed(2)}` : '—'} />
                <Stat label="52W High" value={`₹${formatNumber(s.week52High)}`} />
                <Stat label="52W Low" value={`₹${formatNumber(s.week52Low)}`} />
                <Stat label="RSI (14)" value={s.rsi ? s.rsi.toFixed(1) : '—'} />
                <Stat label="ADX" value={s.adx ? s.adx.toFixed(1) : '—'} />
                <Stat label="Signal" value={<span className={`signal-badge ${getSignalClass(s.recommendation)}`}>{formatSignal(s.recommendation)}</span>} />
              </div>

              {/* Performance */}
              <div style={{ marginTop: 20 }}>
                <h4 style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Performance</h4>
                <div className="modal-grid" style={{ gridTemplateColumns: 'repeat(6,1fr)' }}>
                  <PerfStat label="1 Week" value={s.perfWeek} />
                  <PerfStat label="1 Month" value={s.perfMonth} />
                  <PerfStat label="3 Month" value={s.perf3Month} />
                  <PerfStat label="6 Month" value={s.perf6Month} />
                  <PerfStat label="YTD" value={s.perfYTD} />
                  <PerfStat label="1 Year" value={s.perfYear} />
                </div>
              </div>

              {/* Moving Averages */}
              <div style={{ marginTop: 20 }}>
                <h4 style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Moving Averages</h4>
                <div className="modal-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
                  <MAStat label="EMA 20" maValue={s.ema20} price={s.price} />
                  <MAStat label="SMA 50" maValue={s.sma50} price={s.price} />
                  <MAStat label="SMA 200" maValue={s.sma200} price={s.price} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function IndicatorSignals({ s }) {
  const indicators = [];

  if (s.rsi != null) {
    let signal, desc, strength;
    const isUptrend = s.price > (s.sma200 || s.sma50 || s.ema20 || s.price);
    
    if (s.rsi < 30) {
      signal = isUptrend ? 'STRONG BUY' : 'NEUTRAL'; 
      desc = isUptrend ? `RSI ${s.rsi.toFixed(1)} — Dip in Uptrend` : `RSI ${s.rsi.toFixed(1)} — Oversold in Downtrend`; 
      strength = isUptrend ? 90 : 30;
    } else if (s.rsi > 70) {
      signal = isUptrend ? 'HOLD' : 'SELL'; 
      desc = isUptrend ? `RSI ${s.rsi.toFixed(1)} — Overbought (Strong Trend)` : `RSI ${s.rsi.toFixed(1)} — Overbought (Downtrend)`; 
      strength = isUptrend ? 60 : 90;
    } else if (s.rsi < 45) {
      signal = 'WEAK SELL'; desc = `RSI ${s.rsi.toFixed(1)} — Bearish momentum`; strength = 40;
    } else if (s.rsi > 55) {
      signal = 'WEAK BUY'; desc = `RSI ${s.rsi.toFixed(1)} — Bullish momentum`; strength = 60;
    } else {
      signal = 'NEUTRAL'; desc = `RSI ${s.rsi.toFixed(1)} — No clear signal`; strength = 10;
    }
    indicators.push({ name: 'RSI (14)', signal, desc, strength });
  }

  if (s.ema20 != null && s.price != null) {
    const diff = ((s.price - s.ema20) / s.ema20 * 100);
    let signal, desc, strength;
    if (diff > 5) {
      signal = 'CAUTION'; desc = `Overextended ${diff.toFixed(1)}% above EMA20`; strength = 80;
    } else if (diff > 1) {
      signal = 'HOLD'; desc = `Riding above EMA20`; strength = 60;
    } else if (diff > -1) {
      signal = 'WEAK BUY'; desc = `Testing EMA20 support`; strength = 40;
    } else if (diff < -5) {
      signal = 'STRONG BUY'; desc = `Oversold ${Math.abs(diff).toFixed(1)}% below EMA20`; strength = 85;
    } else {
      signal = 'SELL'; desc = `Trending below EMA20`; strength = 70;
    }
    indicators.push({ name: 'EMA 20', signal, desc, strength });
  }

  if (s.adx != null) {
    let signal, desc, strength;
    // Context-aware trend (fallback to Daily Change if no SMAs exist to be safe, but ideally uses SMAs)
    const isBullTrend = s.price > (s.sma50 || s.ema20 || s.price);
    const trendName = isBullTrend ? 'Bullish' : 'Bearish';
    const trendSignal = isBullTrend ? 'BUY' : 'SELL';
    
    if (s.adx > 35) {
      signal = trendSignal; desc = `ADX ${s.adx.toFixed(1)} — Strong ${trendName}`; strength = Math.min(s.adx * 1.5, 100);
    } else if (s.adx > 25) {
      signal = isBullTrend ? 'WEAK BUY' : 'WEAK SELL'; desc = `ADX ${s.adx.toFixed(1)} — ${trendName} Trend`; strength = s.adx * 2;
    } else {
      signal = 'NEUTRAL'; desc = `ADX ${s.adx.toFixed(1)} — Sideways/No Trend`; strength = 10;
    }
    indicators.push({ name: 'ADX', signal, desc, strength });
  }

  if (indicators.length === 0) return null;

  const getColor = (sig) => {
    if (sig === 'STRONG BUY') return { bg: 'var(--green-bg)', border: 'var(--green-border)', text: 'var(--green)', bar: 'var(--green)' };
    if (sig === 'BUY') return { bg: 'var(--green-bg)', border: 'var(--green-border)', text: 'var(--green)', bar: 'var(--green)' };
    if (sig === 'SELL') return { bg: 'var(--red-bg)', border: 'var(--red-border)', text: 'var(--red)', bar: 'var(--red)' };
    if (sig === 'WEAK BUY') return { bg: 'rgba(34,197,94,0.05)', border: 'rgba(34,197,94,0.12)', text: 'var(--green-bright)', bar: 'var(--green-bright)' };
    if (sig === 'WEAK SELL') return { bg: 'rgba(239,68,68,0.05)', border: 'rgba(239,68,68,0.12)', text: 'var(--red-bright)', bar: 'var(--red-bright)' };
    if (sig === 'CAUTION') return { bg: 'rgba(234, 179, 8, 0.1)', border: 'rgba(234, 179, 8, 0.3)', text: 'var(--yellow)', bar: 'var(--yellow)' };
    if (sig === 'HOLD') return { bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)', text: 'var(--text-secondary)', bar: 'var(--text-secondary)' };
    return { bg: 'rgba(255,255,255,0.02)', border: 'var(--border-subtle)', text: 'var(--text-muted)', bar: 'var(--text-dim)' };
  };

  return (
    <div style={{ marginTop: 16, marginBottom: 16 }}>
      <h4 style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        Indicator Signals
      </h4>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${indicators.length}, 1fr)`, gap: 8 }}>
        {indicators.map(ind => {
          const c = getColor(ind.signal);
          return (
            <div key={ind.name} style={{ padding: '12px 14px', borderRadius: 12, background: c.bg, border: `1px solid ${c.border}` }}>
              <div style={{ fontSize: '0.62rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>{ind.name}</div>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: c.text, marginBottom: 6, fontFamily: 'var(--font-mono)' }}>{ind.signal}</div>
              <div style={{ height: 3, background: 'rgba(255,255,255,0.04)', borderRadius: 2, marginBottom: 6, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${Math.max(5, Math.min(100, ind.strength))}%`, background: c.bar, borderRadius: 2, transition: 'width 0.6s ease' }} />
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{ind.desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="modal-stat">
      <div className="modal-stat-label">{label}</div>
      <div className="modal-stat-value">{value}</div>
    </div>
  );
}

function PerfStat({ label, value }) {
  const color = value > 0 ? 'var(--green)' : value < 0 ? 'var(--red)' : 'var(--text-muted)';
  const sign = value > 0 ? '+' : '';
  return (
    <div className="modal-stat" style={{ textAlign: 'center' }}>
      <div className="modal-stat-label">{label}</div>
      <div className="modal-stat-value" style={{ color }}>{value != null ? `${sign}${value.toFixed(1)}%` : '—'}</div>
    </div>
  );
}

function MAStat({ label, maValue, price }) {
  const above = maValue && price ? price > maValue : null;
  const color = above === true ? 'var(--green)' : above === false ? 'var(--red)' : 'var(--text-muted)';
  return (
    <div className="modal-stat">
      <div className="modal-stat-label">{label}</div>
      <div className="modal-stat-value" style={{ color }}>₹{maValue ? formatNumber(maValue) : '—'}</div>
    </div>
  );
}


function AIInsight({ ticker, s }) {
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
        technicalScore: s.recommendation,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        setInsight(data.insight);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setInsight('AI analysis is currently unavailable.');
        setLoading(false);
      });
  }, [ticker, s]);

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
          </div>
        ) : (
          <p className="ai-insight-text">{insight}</p>
        )}
      </div>
    </div>
  );
}

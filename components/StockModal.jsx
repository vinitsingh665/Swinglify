"use client";
import { useEffect } from 'react';
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
    if (s.rsi < 30) {
      signal = 'BUY'; desc = `RSI ${s.rsi.toFixed(1)} — Oversold`; strength = ((30 - s.rsi) / 30 * 100);
    } else if (s.rsi > 70) {
      signal = 'SELL'; desc = `RSI ${s.rsi.toFixed(1)} — Overbought`; strength = ((s.rsi - 70) / 30 * 100);
    } else if (s.rsi < 45) {
      signal = 'WEAK SELL'; desc = `RSI ${s.rsi.toFixed(1)} — Bearish momentum`; strength = ((45 - s.rsi) / 15 * 60);
    } else if (s.rsi > 55) {
      signal = 'WEAK BUY'; desc = `RSI ${s.rsi.toFixed(1)} — Bullish momentum`; strength = ((s.rsi - 55) / 15 * 60);
    } else {
      signal = 'NEUTRAL'; desc = `RSI ${s.rsi.toFixed(1)} — No signal`; strength = 30;
    }
    indicators.push({ name: 'RSI (14)', signal, desc, strength });
  }

  if (s.ema20 != null && s.price != null) {
    const diff = ((s.price - s.ema20) / s.ema20 * 100);
    let signal, desc, strength;
    if (diff > 3) {
      signal = 'BUY'; desc = `${diff.toFixed(1)}% above EMA20`; strength = Math.min(diff * 10, 100);
    } else if (diff < -3) {
      signal = 'SELL'; desc = `${Math.abs(diff).toFixed(1)}% below EMA20`; strength = Math.min(Math.abs(diff) * 10, 100);
    } else if (diff > 0) {
      signal = 'WEAK BUY'; desc = `Slightly above EMA20`; strength = diff * 15;
    } else {
      signal = 'WEAK SELL'; desc = `Slightly below EMA20`; strength = Math.abs(diff) * 15;
    }
    indicators.push({ name: 'EMA 20', signal, desc, strength });
  }

  if (s.adx != null) {
    let signal, desc, strength;
    const trend = s.change >= 0 ? 'Bullish' : 'Bearish';
    const trendSignal = s.change >= 0 ? 'BUY' : 'SELL';
    if (s.adx > 40) {
      signal = trendSignal; desc = `ADX ${s.adx.toFixed(1)} — Strong ${trend.toLowerCase()} trend`; strength = Math.min(s.adx * 1.5, 100);
    } else if (s.adx > 25) {
      signal = trendSignal; desc = `ADX ${s.adx.toFixed(1)} — ${trend} confirmed`; strength = s.adx * 2;
    } else if (s.adx > 15) {
      signal = 'NEUTRAL'; desc = `ADX ${s.adx.toFixed(1)} — Weak trend`; strength = s.adx;
    } else {
      signal = 'NEUTRAL'; desc = `ADX ${s.adx.toFixed(1)} — Sideways`; strength = 10;
    }
    indicators.push({ name: 'ADX', signal, desc, strength });
  }

  if (indicators.length === 0) return null;

  const getColor = (sig) => {
    if (sig === 'BUY') return { bg: 'var(--green-bg)', border: 'var(--green-border)', text: 'var(--green)', bar: 'var(--green)' };
    if (sig === 'SELL') return { bg: 'var(--red-bg)', border: 'var(--red-border)', text: 'var(--red)', bar: 'var(--red)' };
    if (sig === 'WEAK BUY') return { bg: 'rgba(34,197,94,0.05)', border: 'rgba(34,197,94,0.12)', text: 'var(--green-bright)', bar: 'var(--green-bright)' };
    if (sig === 'WEAK SELL') return { bg: 'rgba(239,68,68,0.05)', border: 'rgba(239,68,68,0.12)', text: 'var(--red-bright)', bar: 'var(--red-bright)' };
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

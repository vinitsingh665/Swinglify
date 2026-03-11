import { useEffect } from 'react';
import { useStockDetail } from '../hooks/useStockData';
import { formatNumber, formatVolume, formatMarketCap, getSignalClass, formatSignal } from '../utils';

function TradingViewChart({ symbol }) {
  return (
    <div style={{
      margin: '16px 0',
      padding: '20px',
      borderRadius: 12,
      border: '1px solid var(--glass-border)',
      background: 'rgba(15, 23, 42, 0.5)',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '2rem', marginBottom: 8 }}>📊</div>
      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
        View full interactive chart with indicators
      </div>
      <a
        href={`https://www.tradingview.com/chart/?symbol=NSE:${symbol}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '10px 24px',
          background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
          color: 'white', borderRadius: 100,
          textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem',
          fontFamily: 'var(--font-sans)',
          boxShadow: 'var(--shadow-glow-blue)',
          transition: 'all 0.25s ease',
        }}
      >
        📈 Open {symbol} Chart on TradingView
      </a>
      <div style={{ marginTop: 10, fontSize: '0.7rem', color: 'var(--text-dim)' }}>
        Candlestick, MA, RSI, MACD & more available on TradingView
      </div>
    </div>
  );
}

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
                <div>
                  {s.logo && <img className="stock-logo" src={s.logo} alt={s.symbol} style={{ width: 36, height: 36, marginBottom: 8 }} onError={(e) => e.target.style.display = 'none'} />}
                  <div className="modal-symbol">{s.symbol}</div>
                  <div className="modal-name">{s.name} · {s.exchange} · {s.sector || 'N/A'}</div>
                </div>
              </div>

              {/* Price */}
              <div className="modal-price-block">
                <div className="modal-price">₹{formatNumber(s.price)}</div>
                <div className="modal-change" style={{ color: changeColor }}>
                  {changeSign}{(s.change || 0).toFixed(2)}% ({changeSign}₹{formatNumber(Math.abs(s.changeAbs || 0))})
                </div>
              </div>

              {/* Top 3 Indicator Signals */}
              <IndicatorSignals s={s} />

              {/* TradingView Chart Widget */}
              <TradingViewChart symbol={s.symbol} />

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
                <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 12 }}>Performance</h4>
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
                <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 12 }}>Moving Averages</h4>
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

  // 1. RSI
  if (s.rsi != null) {
    let signal, desc, strength;
    if (s.rsi < 30) {
      signal = 'BUY'; desc = `RSI ${s.rsi.toFixed(1)} — Oversold. Strong bounce likely.`; strength = ((30 - s.rsi) / 30 * 100);
    } else if (s.rsi > 70) {
      signal = 'SELL'; desc = `RSI ${s.rsi.toFixed(1)} — Overbought. Pullback likely.`; strength = ((s.rsi - 70) / 30 * 100);
    } else if (s.rsi < 45) {
      signal = 'WEAK SELL'; desc = `RSI ${s.rsi.toFixed(1)} — Bearish momentum building.`; strength = ((45 - s.rsi) / 15 * 60);
    } else if (s.rsi > 55) {
      signal = 'WEAK BUY'; desc = `RSI ${s.rsi.toFixed(1)} — Bullish momentum building.`; strength = ((s.rsi - 55) / 15 * 60);
    } else {
      signal = 'NEUTRAL'; desc = `RSI ${s.rsi.toFixed(1)} — No clear momentum signal.`; strength = 30;
    }
    indicators.push({ name: 'RSI (14)', signal, desc, strength });
  }

  // 2. EMA 20 Crossover
  if (s.ema20 != null && s.price != null) {
    const diff = ((s.price - s.ema20) / s.ema20 * 100);
    let signal, desc, strength;
    if (diff > 3) {
      signal = 'BUY'; desc = `Price ${diff.toFixed(1)}% above EMA20 — Strong uptrend.`; strength = Math.min(diff * 10, 100);
    } else if (diff < -3) {
      signal = 'SELL'; desc = `Price ${Math.abs(diff).toFixed(1)}% below EMA20 — Downtrend active.`; strength = Math.min(Math.abs(diff) * 10, 100);
    } else if (diff > 0) {
      signal = 'WEAK BUY'; desc = `Price slightly above EMA20 — Mild uptrend.`; strength = diff * 15;
    } else {
      signal = 'WEAK SELL'; desc = `Price slightly below EMA20 — Mild downtrend.`; strength = Math.abs(diff) * 15;
    }
    indicators.push({ name: 'EMA 20 Cross', signal, desc, strength });
  }

  // 3. ADX (Trend Strength)
  if (s.adx != null) {
    let signal, desc, strength;
    const trend = s.change >= 0 ? 'Bullish' : 'Bearish';
    const trendSignal = s.change >= 0 ? 'BUY' : 'SELL';
    if (s.adx > 40) {
      signal = trendSignal; desc = `ADX ${s.adx.toFixed(1)} — Very strong ${trend.toLowerCase()} trend. High conviction.`; strength = Math.min(s.adx * 1.5, 100);
    } else if (s.adx > 25) {
      signal = trendSignal; desc = `ADX ${s.adx.toFixed(1)} — Strong trend confirmed. ${trend} bias.`; strength = s.adx * 2;
    } else if (s.adx > 15) {
      signal = 'NEUTRAL'; desc = `ADX ${s.adx.toFixed(1)} — Weak trend. Choppy market, avoid.`; strength = s.adx;
    } else {
      signal = 'NEUTRAL'; desc = `ADX ${s.adx.toFixed(1)} — No trend. Sideways market.`; strength = 10;
    }
    indicators.push({ name: 'ADX Trend', signal, desc, strength });
  }

  if (indicators.length === 0) return null;

  const getColor = (sig) => {
    if (sig === 'BUY') return { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)', text: 'var(--green)', bar: 'var(--green)' };
    if (sig === 'SELL') return { bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)', text: 'var(--red)', bar: 'var(--red)' };
    if (sig === 'WEAK BUY') return { bg: 'rgba(16,185,129,0.06)', border: 'rgba(16,185,129,0.15)', text: 'var(--green-bright)', bar: 'var(--green-bright)' };
    if (sig === 'WEAK SELL') return { bg: 'rgba(239,68,68,0.06)', border: 'rgba(239,68,68,0.15)', text: 'var(--red-bright)', bar: 'var(--red-bright)' };
    return { bg: 'rgba(148,163,184,0.06)', border: 'rgba(148,163,184,0.15)', text: 'var(--text-muted)', bar: 'var(--text-dim)' };
  };

  return (
    <div style={{ marginTop: 20, marginBottom: 4 }}>
      <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
        🎯 Top {indicators.length} Indicator Signals
      </h4>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${indicators.length}, 1fr)`, gap: 10 }}>
        {indicators.map(ind => {
          const c = getColor(ind.signal);
          return (
            <div key={ind.name} style={{ padding: '14px 16px', borderRadius: 12, background: c.bg, border: `1px solid ${c.border}` }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>{ind.name}</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: c.text, marginBottom: 6, fontFamily: 'var(--font-mono)' }}>{ind.signal}</div>
              {/* Strength bar */}
              <div style={{ height: 4, background: 'rgba(148,163,184,0.1)', borderRadius: 2, marginBottom: 8, overflow:'hidden' }}>
                <div style={{ height: '100%', width: `${Math.max(5, Math.min(100, ind.strength))}%`, background: c.bar, borderRadius: 2, transition: 'width 0.6s ease' }} />
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{ind.desc}</div>
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

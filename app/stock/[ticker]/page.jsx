import { notFound } from 'next/navigation';
import Link from 'next/link';
import { fetchFromTradingView, parseStockData, FIELDS } from '../../../lib/api-core';
import StockStructuredData from './components/StockStructuredData';
import StockChart from './components/StockChart';
import { AIInsightWidget, ScreenerLink, CompareLink } from './components/ClientWidgets';
import Sidebar from '../../../components/Sidebar';
import TopBar from '../../../components/TopBar';
import './stock-page.css';

// ISR: revalidate every 5 minutes
export const revalidate = 300;

// Pre-render top 50 stocks at build time for fast initial loads
export async function generateStaticParams() {
  try {
    const body = {
      filter: [
        { left: 'is_primary', operation: 'equal', right: true },
        { left: 'exchange', operation: 'equal', right: 'NSE' },
        { left: 'market_cap_basic', operation: 'greater', right: 200000000000 },
      ],
      symbols: { query: { types: ['stock'] } },
      columns: ['name'],
      sort: { sortBy: 'market_cap_basic', sortOrder: 'desc' },
      range: [0, 50],
    };
    const tvData = await fetchFromTradingView(body);
    if (tvData?.data) {
      return tvData.data.map(item => ({ ticker: item.d[0] }));
    }
  } catch (e) {
    console.error('generateStaticParams error:', e);
  }
  // Fallback: don't pre-render any, let ISR handle everything
  return [];
}

// Server-side data fetching
async function getStockData(ticker) {
  try {
    const symbol = ticker.toUpperCase();
    const body = {
      filter: [
        { left: 'name,logoid,description', operation: 'match', right: symbol },
      ],
      symbols: { query: { types: ['stock'] } },
      columns: FIELDS,
      sort: { sortBy: 'volume', sortOrder: 'desc' },
      range: [0, 5],
      options: { lang: 'en' },
    };

    const tvData = await fetchFromTradingView(body);
    const stocks = parseStockData(tvData);

    if (stocks.length === 0) return null;

    // Try exact match first, then fallback to first result
    const exactMatch = stocks.find(s => s.symbol === symbol);
    return exactMatch || stocks[0];
  } catch (error) {
    console.error(`[Stock Page] Error fetching ${ticker}:`, error);
    return null;
  }
}

// ─── Helper Functions ──────────────────────────────────────────────────────────

function formatNumber(val) {
  if (val === null || val === undefined) return '—';
  return val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatVolume(val) {
  if (!val) return '—';
  if (val >= 10000000) return (val / 10000000).toFixed(2) + ' Cr';
  if (val >= 100000) return (val / 100000).toFixed(2) + ' L';
  if (val >= 1000) return (val / 1000).toFixed(1) + ' K';
  return val.toLocaleString('en-IN');
}

function formatMarketCap(val) {
  if (!val) return '—';
  if (val >= 10000000000000) return '₹' + (val / 10000000000000).toFixed(2) + 'L Cr';
  if (val >= 100000000000) return '₹' + (val / 100000000000).toFixed(2) + 'K Cr';
  if (val >= 10000000) return '₹' + (val / 10000000).toFixed(0) + ' Cr';
  return '₹' + val.toLocaleString('en-IN');
}

function getScoreClass(score) {
  if (score >= 75) return 'strong-buy';
  if (score >= 55) return 'buy';
  if (score <= 25) return 'strong-sell';
  if (score <= 45) return 'sell';
  return 'neutral';
}

function getIndicatorSignals(s) {
  const indicators = [];

  if (s.rsi != null) {
    const isUptrend = s.price > (s.sma200 || s.sma50 || s.ema20 || s.price);
    let signal, desc, strength;

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
    const isBullTrend = s.price > (s.sma50 || s.ema20 || s.price);
    const trendName = isBullTrend ? 'Bullish' : 'Bearish';
    let signal, desc, strength;

    if (s.adx > 35) {
      signal = isBullTrend ? 'BUY' : 'SELL';
      desc = `ADX ${s.adx.toFixed(1)} — Strong ${trendName}`;
      strength = Math.min(s.adx * 1.5, 100);
    } else if (s.adx > 25) {
      signal = isBullTrend ? 'WEAK BUY' : 'WEAK SELL';
      desc = `ADX ${s.adx.toFixed(1)} — ${trendName} Trend`;
      strength = s.adx * 2;
    } else {
      signal = 'NEUTRAL';
      desc = `ADX ${s.adx.toFixed(1)} — Sideways/No Trend`;
      strength = 10;
    }
    indicators.push({ name: 'ADX', signal, desc, strength });
  }

  if (s.macd != null && s.macdSignal != null) {
    let signal, desc, strength;
    if (s.macd > s.macdSignal && s.macd > 0) {
      signal = 'BUY'; desc = 'Bullish crossover above zero'; strength = 80;
    } else if (s.macd > s.macdSignal) {
      signal = 'WEAK BUY'; desc = 'Bullish crossover below zero'; strength = 55;
    } else if (s.macd < s.macdSignal && s.macd < 0) {
      signal = 'SELL'; desc = 'Bearish crossover below zero'; strength = 80;
    } else if (s.macd < s.macdSignal) {
      signal = 'WEAK SELL'; desc = 'Bearish crossover above zero'; strength = 55;
    } else {
      signal = 'NEUTRAL'; desc = 'No crossover'; strength = 10;
    }
    indicators.push({ name: 'MACD', signal, desc, strength });
  }

  if (s.bbLower != null && s.bbUpper != null && s.price != null) {
    let signal, desc, strength;
    if (s.price <= s.bbLower) {
      signal = 'BUY'; desc = 'Price at lower Bollinger Band'; strength = 75;
    } else if (s.price >= s.bbUpper) {
      signal = 'SELL'; desc = 'Price at upper Bollinger Band'; strength = 75;
    } else {
      const mid = (s.bbUpper + s.bbLower) / 2;
      const pos = ((s.price - s.bbLower) / (s.bbUpper - s.bbLower)) * 100;
      signal = 'NEUTRAL'; desc = `Price at ${pos.toFixed(0)}% of BB range`; strength = 10;
    }
    indicators.push({ name: 'Bollinger', signal, desc, strength });
  }

  return indicators;
}

function getIndicatorColor(sig) {
  if (sig === 'STRONG BUY' || sig === 'BUY') return { text: 'var(--green)', bar: 'var(--green)', bg: 'var(--green-bg)', border: 'var(--green-border)' };
  if (sig === 'WEAK BUY') return { text: 'var(--green)', bar: 'var(--green)', bg: 'rgba(34,197,94,0.05)', border: 'rgba(34,197,94,0.12)' };
  if (sig === 'SELL' || sig === 'STRONG SELL') return { text: 'var(--red)', bar: 'var(--red)', bg: 'var(--red-bg)', border: 'var(--red-border)' };
  if (sig === 'WEAK SELL') return { text: 'var(--red)', bar: 'var(--red)', bg: 'rgba(239,68,68,0.05)', border: 'rgba(239,68,68,0.12)' };
  if (sig === 'CAUTION') return { text: 'var(--yellow)', bar: 'var(--yellow)', bg: 'rgba(234,179,8,0.1)', border: 'rgba(234,179,8,0.3)' };
  if (sig === 'HOLD') return { text: 'var(--text-secondary)', bar: 'var(--text-secondary)', bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)' };
  return { text: 'var(--text-muted)', bar: 'var(--text-dim)', bg: 'rgba(255,255,255,0.02)', border: 'var(--border-subtle)' };
}

// ─── Page Component ────────────────────────────────────────────────────────────

export default async function StockPage({ params }) {
  const { ticker } = await params;
  const stock = await getStockData(ticker);

  if (!stock) {
    return (
      <div className="app-layout">
        <Sidebar />
        <div className="main-area">
          <TopBar />
          <div className="stock-page">
            <div className="stock-not-found">
              <h2>Stock Not Found</h2>
              <p>We couldn't find data for "{ticker.toUpperCase()}". It may not be listed on NSE/BSE.</p>
              <a href="/screener" className="stock-cta-btn primary">Browse All Stocks →</a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const s = stock;
  const changeUp = (s.change || 0) >= 0;
  const changeSign = changeUp ? '+' : '';
  const indicators = getIndicatorSignals(s);
  const score = s.indicatorScore || { label: 'NEUTRAL', score: 50, bullishCount: 0, bearishCount: 0 };
  const scoreClass = getScoreClass(score.score);

  const perfData = [
    { label: '1 Week', value: s.perfWeek },
    { label: '1 Month', value: s.perfMonth },
    { label: '3 Month', value: s.perf3Month },
    { label: '6 Month', value: s.perf6Month },
    { label: 'YTD', value: s.perfYTD },
    { label: '1 Year', value: s.perfYear },
  ];

  const maData = [
    { name: 'EMA 10', value: s.ema10, price: s.price },
    { name: 'EMA 20', value: s.ema20, price: s.price },
    { name: 'SMA 20', value: s.sma20, price: s.price },
    { name: 'EMA 50', value: s.ema50, price: s.price },
    { name: 'SMA 50', value: s.sma50, price: s.price },
    { name: 'EMA 200', value: s.ema200, price: s.price },
    { name: 'SMA 200', value: s.sma200, price: s.price },
  ];

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-area">
        <TopBar />
        <div className="stock-page">

          <StockStructuredData stock={s} />

          {/* Breadcrumb */}
          <nav className="stock-breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span className="bc-sep">›</span>
            <a href="/screener">Screener</a>
            <span className="bc-sep">›</span>
            <span>{s.symbol}</span>
          </nav>

          {/* Hero */}
          <div className="stock-hero">
            <div className="stock-hero-left">
              {s.logo ? (
                <img className="stock-hero-logo" src={s.logo} alt={`${s.symbol} company logo`} width="48" height="48" />
              ) : (
                <div className="stock-hero-logo-placeholder">{s.symbol?.charAt(0)}</div>
              )}
              <div className="stock-hero-info">
                <h1>{s.symbol} — {s.name}</h1>
                <div className="stock-hero-subtitle">
                  <span className="stock-hero-tag">{s.exchange || 'NSE'}</span>
                  {s.sector && <span>· {s.sector}</span>}
                  {s.industry && <span>· {s.industry}</span>}
                </div>
              </div>
            </div>
            <div className="stock-hero-right">
              <div className="stock-hero-price">₹{formatNumber(s.price)}</div>
              <div className={`stock-hero-change ${changeUp ? 'up' : 'down'}`}>
                {changeSign}{(s.change || 0).toFixed(2)}% ({changeSign}₹{formatNumber(Math.abs(s.changeAbs || 0))})
              </div>
            </div>
          </div>

          {/* Stock Chart */}
          <StockChart symbol={s.symbol} />

          {/* Composite Score */}
          <div className="stock-score-card">
            <div className="stock-score-label-block">
              <div className={`stock-score-signal ${scoreClass}`}>{score.label}</div>
              <div className="stock-score-subtitle">Composite Score: {score.score}/100</div>
            </div>
            <div className="stock-score-bar-wrapper">
              <div className="stock-score-bar">
                <div
                  className={`stock-score-bar-fill ${score.score >= 55 ? 'bullish' : score.score <= 45 ? 'bearish' : 'neutral-bar'}`}
                  style={{ width: `${score.score}%` }}
                />
              </div>
              <div className="stock-score-counts">
                <span>{score.bullishCount} bullish</span>
                <span>{score.bearishCount} bearish</span>
              </div>
            </div>
          </div>

          {/* CTA Row */}
          <div className="stock-cta-row">
            <ScreenerLink symbol={s.symbol} />
            <CompareLink symbol={s.symbol} />
          </div>

          {/* AI Insight (Client Component — loads after SSR) */}
          <div className="stock-ai-section">
            <AIInsightWidget
              ticker={s.symbol}
              price={s.price}
              rsi={s.rsi}
              recommendation={s.recommendation}
            />
          </div>

          {/* Key Stats */}
          <h2 className="stock-section-title">Key Statistics</h2>
          <div className="stock-indicators-grid">
            <RichStatCard label="Open" value={`₹${formatNumber(s.open)}`} desc={s.open && s.price ? (s.price > s.open ? `Trading ${((s.price - s.open) / s.open * 100).toFixed(1)}% above open` : `Trading ${((s.open - s.price) / s.open * 100).toFixed(1)}% below open`) : null} signal={s.open && s.price ? (s.price > s.open ? 'bullish' : 'bearish') : 'neutral'} strength={s.open && s.price ? Math.min(100, Math.abs((s.price - s.open) / s.open * 100) * 10) : 0} />
            <RichStatCard label="Day High" value={`₹${formatNumber(s.high)}`} desc={s.high && s.price ? `${((s.high - s.price) / s.price * 100).toFixed(1)}% from current` : null} signal="bullish" strength={s.high && s.low && s.price ? ((s.price - s.low) / (s.high - s.low) * 100) : 50} />
            <RichStatCard label="Day Low" value={`₹${formatNumber(s.low)}`} desc={s.low && s.price ? `${((s.price - s.low) / s.price * 100).toFixed(1)}% above low` : null} signal="bearish" strength={s.high && s.low && s.price ? ((s.high - s.price) / (s.high - s.low) * 100) : 50} />
            <RichStatCard label="Volume" value={formatVolume(s.volume)} desc={s.avgVolume10d && s.volume ? `${(s.volume / s.avgVolume10d * 100).toFixed(0)}% of 10d avg` : null} signal={s.avgVolume10d && s.volume ? (s.volume > s.avgVolume10d * 1.5 ? 'bullish' : s.volume < s.avgVolume10d * 0.5 ? 'bearish' : 'neutral') : 'neutral'} strength={s.avgVolume10d && s.volume ? Math.min(100, s.volume / s.avgVolume10d * 50) : 30} />
            <RichStatCard label="Avg Vol (10d)" value={formatVolume(s.avgVolume10d)} desc="10-day average" signal="neutral" strength={30} />
            <RichStatCard label="Avg Vol (30d)" value={formatVolume(s.avgVolume30d)} desc="30-day average" signal="neutral" strength={30} />
            <RichStatCard label="Market Cap" value={formatMarketCap(s.marketCap)} desc={s.marketCap >= 200000000000 ? 'Large Cap' : s.marketCap >= 50000000000 ? 'Mid Cap' : 'Small Cap'} signal={s.marketCap >= 200000000000 ? 'bullish' : s.marketCap >= 50000000000 ? 'neutral' : 'bearish'} strength={s.marketCap >= 200000000000 ? 80 : s.marketCap >= 50000000000 ? 50 : 25} />
            <RichStatCard label="P/E Ratio" value={s.pe ? s.pe.toFixed(2) : '—'} desc={s.pe ? (s.pe < 15 ? 'Undervalued range' : s.pe < 30 ? 'Fair value range' : 'Premium valuation') : null} signal={s.pe ? (s.pe < 15 ? 'bullish' : s.pe < 30 ? 'neutral' : 'bearish') : 'neutral'} strength={s.pe ? Math.min(100, s.pe * 2) : 0} />
            <RichStatCard label="EPS" value={s.eps ? `₹${s.eps.toFixed(2)}` : '—'} desc={s.eps ? (s.eps > 0 ? 'Profitable' : 'Loss-making') : null} signal={s.eps ? (s.eps > 0 ? 'bullish' : 'bearish') : 'neutral'} strength={s.eps ? (s.eps > 0 ? 70 : 30) : 0} />
            <RichStatCard label="52W High" value={`₹${formatNumber(s.week52High)}`} desc={s.week52High && s.price ? `${((s.week52High - s.price) / s.price * 100).toFixed(1)}% away` : null} signal={s.week52High && s.price ? (((s.week52High - s.price) / s.price * 100) < 5 ? 'bullish' : 'neutral') : 'neutral'} strength={s.week52High && s.week52Low && s.price ? ((s.price - s.week52Low) / (s.week52High - s.week52Low) * 100) : 50} />
            <RichStatCard label="52W Low" value={`₹${formatNumber(s.week52Low)}`} desc={s.week52Low && s.price ? `${((s.price - s.week52Low) / s.price * 100).toFixed(1)}% above` : null} signal={s.week52Low && s.price ? (((s.price - s.week52Low) / s.price * 100) < 10 ? 'bearish' : 'neutral') : 'neutral'} strength={s.week52High && s.week52Low && s.price ? ((s.week52High - s.price) / (s.week52High - s.week52Low) * 100) : 50} />
            <RichStatCard label="Volatility" value={s.volatility ? `${s.volatility.toFixed(2)}%` : '—'} desc={s.volatility ? (s.volatility > 3 ? 'High volatility' : s.volatility > 1.5 ? 'Moderate' : 'Low volatility') : null} signal={s.volatility ? (s.volatility > 3 ? 'bearish' : s.volatility < 1.5 ? 'bullish' : 'neutral') : 'neutral'} strength={s.volatility ? Math.min(100, s.volatility * 20) : 0} />
          </div>

          {/* Indicator Signals */}
          {indicators.length > 0 && (
            <>
              <h2 className="stock-section-title">Indicator Signals</h2>
              <div className="stock-indicators-grid">
                {indicators.map(ind => {
                  const c = getIndicatorColor(ind.signal);
                  return (
                    <div
                      key={ind.name}
                      className="stock-indicator-card"
                      style={{ background: c.bg, borderColor: c.border }}
                    >
                      <div className="stock-indicator-name">{ind.name}</div>
                      <div className="stock-indicator-signal" style={{ color: c.text }}>{ind.signal}</div>
                      <div className="stock-indicator-bar">
                        <div
                          className="stock-indicator-bar-fill"
                          style={{ width: `${Math.max(5, Math.min(100, ind.strength))}%`, background: c.bar }}
                        />
                      </div>
                      <div className="stock-indicator-desc">{ind.desc}</div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Performance */}
          <h2 className="stock-section-title">Performance</h2>
          <div className="stock-perf-grid">
            {perfData.map(p => {
              const isUp = p.value > 0;
              const isDown = p.value < 0;
              const sign = isUp ? '+' : '';
              const signal = isUp ? 'bullish' : isDown ? 'bearish' : 'neutral';
              const c = signal === 'bullish' 
                ? { text: 'var(--green)', bg: 'var(--green-bg, rgba(34,197,94,0.08))', border: 'var(--green-border, rgba(34,197,94,0.2))', bar: 'var(--green)' }
                : signal === 'bearish'
                ? { text: 'var(--red)', bg: 'var(--red-bg, rgba(239,68,68,0.08))', border: 'var(--red-border, rgba(239,68,68,0.2))', bar: 'var(--red)' }
                : { text: 'var(--text-muted)', bg: 'rgba(255,255,255,0.02)', border: 'var(--border-subtle)', bar: 'var(--text-dim)' };
              const strength = p.value != null ? Math.min(100, Math.abs(p.value) * 3) : 0;
              return (
                <div key={p.label} className="stock-indicator-card" style={{ background: c.bg, borderColor: c.border }}>
                  <div className="stock-indicator-name">{p.label}</div>
                  <div className="stock-indicator-signal" style={{ color: c.text, fontSize: '1.1rem' }}>
                    {p.value != null ? `${sign}${p.value.toFixed(2)}%` : '—'}
                  </div>
                  <div className="stock-indicator-bar">
                    <div className="stock-indicator-bar-fill" style={{ width: `${Math.max(5, strength)}%`, background: c.bar }} />
                  </div>
                  <div className="stock-indicator-desc">
                    {p.value != null ? (isUp ? 'Positive return' : isDown ? 'Negative return' : 'Flat') : 'No data'}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Moving Averages */}
          <h2 className="stock-section-title">Moving Averages</h2>
          <div className="stock-indicators-grid">
            {maData.map(ma => {
              const above = ma.value && ma.price ? ma.price > ma.value : null;
              const diff = ma.value && ma.price ? ((ma.price - ma.value) / ma.value * 100) : 0;
              const signal = above === true ? 'bullish' : above === false ? 'bearish' : 'neutral';
              const c = signal === 'bullish'
                ? { text: 'var(--green)', bg: 'var(--green-bg, rgba(34,197,94,0.08))', border: 'var(--green-border, rgba(34,197,94,0.2))', bar: 'var(--green)' }
                : signal === 'bearish'
                ? { text: 'var(--red)', bg: 'var(--red-bg, rgba(239,68,68,0.08))', border: 'var(--red-border, rgba(239,68,68,0.2))', bar: 'var(--red)' }
                : { text: 'var(--text-muted)', bg: 'rgba(255,255,255,0.02)', border: 'var(--border-subtle)', bar: 'var(--text-dim)' };
              const strength = ma.value ? Math.min(100, Math.abs(diff) * 5 + 20) : 0;
              return (
                <div key={ma.name} className="stock-indicator-card" style={{ background: c.bg, borderColor: c.border }}>
                  <div className="stock-indicator-name">{ma.name}</div>
                  <div className="stock-indicator-signal" style={{ color: c.text }}>
                    {ma.value ? `₹${formatNumber(ma.value)}` : '—'}
                  </div>
                  <div className="stock-indicator-bar">
                    <div className="stock-indicator-bar-fill" style={{ width: `${Math.max(5, strength)}%`, background: c.bar }} />
                  </div>
                  <div className="stock-indicator-desc">
                    {above !== null ? `Price ${above ? 'above' : 'below'} by ${Math.abs(diff).toFixed(1)}%` : 'No data'}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Technical summary for SEO — visible text that search engines can index */}
          <h2 className="stock-section-title">About {s.symbol}</h2>
          <div className="stock-stat-card" style={{ padding: '20px', marginBottom: 28 }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.7, margin: 0 }}>
              <strong>{s.symbol}</strong> ({s.name}) is listed on {s.exchange || 'NSE'}{s.sector ? ` in the ${s.sector} sector` : ''}{s.industry ? `, ${s.industry} industry` : ''}.
              The current share price is <strong>₹{formatNumber(s.price)}</strong>, with a daily change of {changeSign}{(s.change || 0).toFixed(2)}%.
              {s.marketCap ? ` The market capitalization is ${formatMarketCap(s.marketCap)}.` : ''}
              {s.rsi ? ` The RSI (14) is at ${s.rsi.toFixed(1)}, indicating ${s.rsi < 30 ? 'oversold' : s.rsi > 70 ? 'overbought' : 'neutral'} conditions.` : ''}
              {s.pe ? ` The P/E ratio stands at ${s.pe.toFixed(2)}.` : ''}
              {s.week52High && s.week52Low ? ` The 52-week range is ₹${formatNumber(s.week52Low)} — ₹${formatNumber(s.week52High)}.` : ''}
              {' '}Analyze {s.symbol} with RSI, MACD, Bollinger Bands, and 40+ technical indicators on Swinglify — the free swing trading platform for Indian stocks.
            </p>
          </div>

          {/* Related Links for Internal Linking (SEO) */}
          <h2 className="stock-section-title">Explore More</h2>
          <div className="stock-related-links" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: 28 }}>
            <Link href="/screener" className="stock-cta-btn" style={{ textAlign: 'center', padding: '12px 16px', borderRadius: '10px', background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem', transition: 'all 0.2s' }}>
              Browse Stock Screener
            </Link>
            <Link href={`/compare?stock=${s.symbol}`} className="stock-cta-btn" style={{ textAlign: 'center', padding: '12px 16px', borderRadius: '10px', background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem', transition: 'all 0.2s' }}>
              Compare {s.symbol} with Others
            </Link>
            <Link href="/community" className="stock-cta-btn" style={{ textAlign: 'center', padding: '12px 16px', borderRadius: '10px', background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem', transition: 'all 0.2s' }}>
              Discuss in Community
            </Link>
            <Link href="/all-stocks" className="stock-cta-btn" style={{ textAlign: 'center', padding: '12px 16px', borderRadius: '10px', background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem', transition: 'all 0.2s' }}>
              All Stocks A–Z Directory
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function RichStatCard({ label, value, desc, signal = 'neutral', strength = 30 }) {
  const c = signal === 'bullish'
    ? { text: 'var(--green)', bg: 'var(--green-bg, rgba(34,197,94,0.08))', border: 'var(--green-border, rgba(34,197,94,0.2))', bar: 'var(--green)' }
    : signal === 'bearish'
    ? { text: 'var(--red)', bg: 'var(--red-bg, rgba(239,68,68,0.08))', border: 'var(--red-border, rgba(239,68,68,0.2))', bar: 'var(--red)' }
    : { text: 'var(--text-muted)', bg: 'rgba(255,255,255,0.02)', border: 'var(--border-subtle)', bar: 'var(--text-dim)' };
  return (
    <div className="stock-indicator-card" style={{ background: c.bg, borderColor: c.border }}>
      <div className="stock-indicator-name">{label}</div>
      <div className="stock-indicator-signal" style={{ color: c.text }}>{value}</div>
      <div className="stock-indicator-bar">
        <div className="stock-indicator-bar-fill" style={{ width: `${Math.max(5, Math.min(100, strength))}%`, background: c.bar }} />
      </div>
      {desc && <div className="stock-indicator-desc">{desc}</div>}
    </div>
  );
}

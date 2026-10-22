"use client";

import Link from 'next/link';

const PRESET_CARDS = [
  {
    title: 'RSI Oversold Stocks',
    slug: 'rsi-oversold',
    badge: 'Mean Reversion',
    desc: 'Stocks with 14-day RSI below 30 testing institutional support zones for sharp rubber-band bounces.',
    count: '34 Setups',
    metric: 'RSI < 30',
    color: '#10b981',
    sparkline: 'M0,15 Q25,35 50,38 T100,10',
  },
  {
    title: 'Volume Breakouts',
    slug: 'volume-breakouts',
    badge: 'Institutional Flow',
    desc: 'Stocks breaking key resistance on volume greater than 2x their 10-day moving average.',
    count: '18 Setups',
    metric: 'Vol > 2x Avg',
    color: '#00f2fe',
    sparkline: 'M0,35 Q25,32 50,28 T100,5',
  },
  {
    title: 'Golden Cross (50>200 EMA)',
    slug: 'golden-cross',
    badge: 'Macro Trend',
    desc: '50-day EMA breaking decisively above 200-day SMA, confirming structural long-term bullish transition.',
    count: '12 Setups',
    metric: '50 EMA > 200 SMA',
    color: '#a855f7',
    sparkline: 'M0,30 Q30,28 60,18 T100,8',
  },
  {
    title: '52-Week High Leaders',
    slug: '52-week-high',
    badge: 'Relative Strength',
    desc: 'Equities printing fresh 52-week or all-time highs with top-decile momentum scores.',
    count: '27 Setups',
    metric: 'Within 2% of ATH',
    color: '#f59e0b',
    sparkline: 'M0,38 Q35,25 65,12 T100,4',
  },
  {
    title: 'Top Gainers Momentum',
    slug: 'top-gainers',
    badge: 'Intraday Expansion',
    desc: 'Top percentage movers across NSE 500 with confirmed buyer accumulation.',
    count: '42 Setups',
    metric: 'Day Gain > +3%',
    color: '#38bdf8',
    sparkline: 'M0,32 Q30,22 60,14 T100,6',
  },
];

const RIVALRY_PAIRS = [
  {
    pair: 'tcs-vs-infy',
    left: 'TCS',
    right: 'INFY',
    sector: 'IT & Tech',
    winner: 'TCS ⭐',
    delta: '+14% Momentum Delta',
  },
  {
    pair: 'hdfcbank-vs-icicibank',
    left: 'HDFCBANK',
    right: 'ICICIBANK',
    sector: 'Banking Titans',
    winner: 'ICICIBANK ⭐',
    delta: '+8.4% Relative Strength',
  },
  {
    pair: 'tatamotors-vs-m_m',
    left: 'TATAMOTORS',
    right: 'M&M',
    sector: 'Auto & EV',
    winner: 'M&M ⭐',
    delta: '+19.2% Trend Score',
  },
  {
    pair: 'reliance-vs-adanients',
    left: 'RELIANCE',
    right: 'ADANIENTS',
    sector: 'Conglomerates',
    winner: 'RELIANCE ⭐',
    delta: 'Low Volatility Hedge',
  },
];

export default function PresetGrid() {
  return (
    <section className="preset-grid-section">
      <div className="preset-container">

        {/* Section Header */}
        <div className="bento-header">
          <div className="bento-badge">SYSTEM PRESETS & RADARS</div>
          <h2 className="bento-title">
            Programmatic Setups Ready in 1-Click.<br />
            <span className="bento-title-accent">No Code. Zero Guesswork.</span>
          </h2>
          <p className="bento-subtitle">
            Instantly scan the exact market setups professional swing traders execute every morning.
          </p>
        </div>

        {/* 5 Preset Cards Grid */}
        <div className="presets-cards-grid">
          {PRESET_CARDS.map((p, idx) => (
            <Link
              key={idx}
              href={`/screener/${p.slug}`}
              className="preset-interactive-card"
            >
              <div className="pic-top">
                <span className="pic-badge" style={{ borderColor: p.color, color: p.color }}>
                  {p.badge}
                </span>
                <span className="pic-count">{p.count}</span>
              </div>

              <h3 className="pic-title">{p.title}</h3>
              <p className="pic-desc">{p.desc}</p>

              <div className="pic-metric-strip">
                <span className="pic-metric-label">Rule: <strong>{p.metric}</strong></span>
                <svg width="60" height="24" viewBox="0 0 100 40" className="pic-sparkline">
                  <path d={p.sparkline} fill="none" stroke={p.color} strokeWidth="2.5" />
                </svg>
              </div>

              <div className="pic-bottom-action">
                <span>Launch Scanner</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* Stock Rivalries Sub-Section */}
        <div className="rivalries-container">
          <div className="rivalries-header">
            <div>
              <h3 className="rivalries-title">Head-to-Head Sector Rivalries</h3>
              <p className="rivalries-sub">Compare peers side-by-side to deploy capital only into the sector leader.</p>
            </div>
            <Link href="/compare" className="hero-secondary-btn" style={{ fontSize: '0.82rem', padding: '8px 16px' }}>
              <span>All Comparisons →</span>
            </Link>
          </div>

          <div className="rivalries-grid">
            {RIVALRY_PAIRS.map((r, i) => (
              <Link key={i} href={`/compare/${r.pair}`} className="rivalry-card">
                <div className="rc-sector">{r.sector}</div>
                <div className="rc-matchup">
                  <span className="rc-sym">{r.left}</span>
                  <span className="rc-vs">VS</span>
                  <span className="rc-sym">{r.right}</span>
                </div>
                <div className="rc-footer">
                  <span className="rc-winner">Leader: {r.winner}</span>
                  <span className="rc-delta">{r.delta}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

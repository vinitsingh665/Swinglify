"use client";

import { useState, useRef } from 'react';
import Link from 'next/link';

// Rich candle and indicator datasets for the interactive terminal
const STOCKS_DATA = [
  {
    id: 'tatamotors',
    symbol: 'TATAMOTORS',
    name: 'Tata Motors Ltd',
    exchange: 'NSE',
    category: 'Auto · Mean Reversion',
    badge: 'RSI Oversold Bounce',
    price: '₹984.60',
    change: '+3.45%',
    isPos: true,
    score: 92,
    winProb: '84%',
    rrRatio: '3.8 : 1',
    profitProj: '+₹42,800 (+14.2%)',
    riskProj: '-₹11,200 (-3.7%)',
    stopLoss: '₹948.00',
    target1: '₹1,020.00',
    target2: '₹1,085.00',
    fiboGolden: '₹970.20 (0.618)',
    aiSignal: 'STRONG BUY',
    aiAnalysis: 'RSI printed a clean divergence at 28.2 right at the institutional 200 SMA demand zone. High probability mean-reversion swing toward 20 EMA.',
    // 12 candles: { o, h, l, c, vol, date }
    candles: [
      { o: 1040, h: 1048, l: 1025, c: 1028, vol: 65, date: 'Oct 04' },
      { o: 1028, h: 1032, l: 998, c: 1002, vol: 78, date: 'Oct 07' },
      { o: 1002, h: 1010, l: 975, c: 980, vol: 92, date: 'Oct 08' },
      { o: 980, h: 985, l: 955, c: 958, vol: 110, date: 'Oct 09' },
      { o: 958, h: 965, l: 948, c: 952, vol: 145, date: 'Oct 10' },
      { o: 952, h: 968, l: 946, c: 962, vol: 130, date: 'Oct 11' }, // Hammer
      { o: 962, h: 975, l: 958, c: 972, vol: 125, date: 'Oct 14' },
      { o: 972, h: 988, l: 968, c: 984, vol: 140, date: 'Oct 15' },
    ],
    rsiPoints: [42, 36, 31, 26, 24, 28, 33, 39],
    fiboLevels: [
      { ratio: '0.236', price: 1030, y: 35 },
      { ratio: '0.382', price: 1005, y: 70 },
      { ratio: '0.500', price: 985, y: 105 },
      { ratio: '0.618', price: 965, y: 140 },
    ]
  },
  {
    id: 'trent',
    symbol: 'TRENT',
    name: 'Trent Ltd (Tata Group)',
    exchange: 'NSE',
    category: 'Retail · Institutional Surge',
    badge: 'Volume Breakout',
    price: '₹5,420.00',
    change: '+5.82%',
    isPos: true,
    score: 95,
    winProb: '89%',
    rrRatio: '4.2 : 1',
    profitProj: '+₹68,500 (+18.5%)',
    riskProj: '-₹16,300 (-4.4%)',
    stopLoss: '₹5,180.00',
    target1: '₹5,850.00',
    target2: '₹6,400.00',
    fiboGolden: '₹5,210.00 (0.618)',
    aiSignal: 'STRONG BUY',
    aiAnalysis: 'Fresh all-time high breakout backed by 4.1x institutional volume surge. Upper Bollinger Band expansion confirms stage-2 continuation.',
    candles: [
      { o: 4850, h: 4920, l: 4810, c: 4890, vol: 50, date: 'Oct 04' },
      { o: 4890, h: 4980, l: 4870, c: 4960, vol: 62, date: 'Oct 07' },
      { o: 4960, h: 5050, l: 4940, c: 5020, vol: 75, date: 'Oct 08' },
      { o: 5020, h: 5120, l: 5000, c: 5110, vol: 88, date: 'Oct 09' },
      { o: 5110, h: 5190, l: 5080, c: 5150, vol: 95, date: 'Oct 10' },
      { o: 5150, h: 5280, l: 5140, c: 5250, vol: 130, date: 'Oct 11' },
      { o: 5250, h: 5360, l: 5220, c: 5320, vol: 180, date: 'Oct 14' },
      { o: 5320, h: 5460, l: 5300, c: 5420, vol: 240, date: 'Oct 15' }, // Big green breakout
    ],
    rsiPoints: [58, 61, 64, 67, 69, 73, 76, 81],
    fiboLevels: [
      { ratio: '0.236', price: 5350, y: 40 },
      { ratio: '0.382', price: 5200, y: 75 },
      { ratio: '0.500', price: 5080, y: 110 },
      { ratio: '0.618', price: 4950, y: 145 },
    ]
  },
  {
    id: 'reliance',
    symbol: 'RELIANCE',
    name: 'Reliance Industries',
    exchange: 'NSE',
    category: 'Conglomerate · Trend Follow',
    badge: 'Golden Cross (50>200)',
    price: '₹2,940.50',
    change: '+1.65%',
    isPos: true,
    score: 88,
    winProb: '81%',
    rrRatio: '3.2 : 1',
    profitProj: '+₹31,200 (+10.6%)',
    riskProj: '-₹9,750 (-3.3%)',
    stopLoss: '₹2,845.00',
    target1: '₹3,120.00',
    target2: '₹3,250.00',
    fiboGolden: '₹2,880.00 (0.618)',
    aiSignal: 'BUY',
    aiAnalysis: '50-day EMA confirmed decisive bullish crossover above 200-day SMA. Structural trend shifted to institutional accumulation mode.',
    candles: [
      { o: 2840, h: 2870, l: 2820, c: 2855, vol: 60, date: 'Oct 04' },
      { o: 2855, h: 2880, l: 2840, c: 2870, vol: 65, date: 'Oct 07' },
      { o: 2870, h: 2895, l: 2860, c: 2885, vol: 70, date: 'Oct 08' },
      { o: 2885, h: 2910, l: 2875, c: 2900, vol: 80, date: 'Oct 09' },
      { o: 2900, h: 2915, l: 2880, c: 2895, vol: 75, date: 'Oct 10' },
      { o: 2895, h: 2930, l: 2890, c: 2915, vol: 90, date: 'Oct 11' },
      { o: 2915, h: 2945, l: 2905, c: 2930, vol: 110, date: 'Oct 14' },
      { o: 2930, h: 2955, l: 2920, c: 2940, vol: 135, date: 'Oct 15' },
    ],
    rsiPoints: [50, 52, 54, 57, 56, 59, 62, 65],
    fiboLevels: [
      { ratio: '0.236', price: 2930, y: 40 },
      { ratio: '0.382', price: 2900, y: 75 },
      { ratio: '0.500', price: 2875, y: 110 },
      { ratio: '0.618', price: 2850, y: 145 },
    ]
  },
  {
    id: 'zomato',
    symbol: 'ZOMATO',
    name: 'Zomato Limited',
    exchange: 'NSE',
    category: 'New-Age Tech · Momentum',
    badge: '52-Week High Breakout',
    price: '₹274.20',
    change: '+4.12%',
    isPos: true,
    score: 91,
    winProb: '86%',
    rrRatio: '3.5 : 1',
    profitProj: '+₹38,000 (+13.8%)',
    riskProj: '-₹10,800 (-3.9%)',
    stopLoss: '₹263.50',
    target1: '₹295.00',
    target2: '₹318.00',
    fiboGolden: '₹266.00 (0.618)',
    aiSignal: 'STRONG BUY',
    aiAnalysis: 'Clean stage-2 base breakout reaching fresh ATH. Relative strength in the 96th percentile among Indian mid-and-large caps.',
    candles: [
      { o: 245, h: 252, l: 242, c: 250, vol: 80, date: 'Oct 04' },
      { o: 250, h: 255, l: 248, c: 253, vol: 85, date: 'Oct 07' },
      { o: 253, h: 260, l: 251, c: 258, vol: 95, date: 'Oct 08' },
      { o: 258, h: 264, l: 256, c: 262, vol: 110, date: 'Oct 09' },
      { o: 262, h: 266, l: 259, c: 264, vol: 105, date: 'Oct 10' },
      { o: 264, h: 270, l: 263, c: 268, vol: 130, date: 'Oct 11' },
      { o: 268, h: 272, l: 266, c: 270, vol: 140, date: 'Oct 14' },
      { o: 270, h: 278, l: 269, c: 274, vol: 190, date: 'Oct 15' },
    ],
    rsiPoints: [60, 62, 66, 68, 67, 72, 74, 78],
    fiboLevels: [
      { ratio: '0.236', price: 272, y: 40 },
      { ratio: '0.382', price: 266, y: 75 },
      { ratio: '0.500', price: 260, y: 110 },
      { ratio: '0.618', price: 254, y: 145 },
    ]
  }
];

export default function HeroDeck() {
  const [activeStockIndex, setActiveStockIndex] = useState(0);
  
  // Interactive Indicator Toggles
  const [showFibo, setShowFibo] = useState(true);
  const [showRsi, setShowRsi] = useState(true);
  const [showVolume, setShowVolume] = useState(true);
  const [showTargets, setShowTargets] = useState(true);

  // Hover crosshair state
  const [hoveredCandle, setHoveredCandle] = useState(null);
  const [crosshairPos, setCrosshairPos] = useState({ x: 0, y: 0, visible: false });
  const chartSvgRef = useRef(null);

  const stock = STOCKS_DATA[activeStockIndex];

  // Price calculations for SVG mapping
  const minPrice = Math.min(...stock.candles.map(c => c.l)) * 0.985;
  const maxPrice = Math.max(...stock.candles.map(c => c.h)) * 1.015;
  const priceRange = maxPrice - minPrice;

  // SVG dimensions
  const svgWidth = 620;
  const svgHeight = 220;
  const candleSpacing = svgWidth / (stock.candles.length + 1);

  const getY = (val) => {
    return svgHeight - ((val - minPrice) / priceRange) * (svgHeight - 40) - 20;
  };

  const handleMouseMove = (e) => {
    if (!chartSvgRef.current) return;
    const rect = chartSvgRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    // Find nearest candle
    const index = Math.round(clientX / candleSpacing) - 1;
    if (index >= 0 && index < stock.candles.length) {
      setHoveredCandle(stock.candles[index]);
      setCrosshairPos({
        x: (index + 1) * candleSpacing,
        y: clientY,
        visible: true,
      });
    }
  };

  const handleMouseLeave = () => {
    setCrosshairPos(prev => ({ ...prev, visible: false }));
    setHoveredCandle(null);
  };

  return (
    <section className="hero-section">
      {/* Background ambient lighting effects */}
      <div className="hero-ambient-glow"></div>
      <div className="hero-radial-cyan"></div>
      <div className="hero-radial-emerald"></div>
      <div className="hero-grid-pattern"></div>

      <div className="hero-container">

        {/* Top Floating Badge */}
        <div className="hero-pill-badge">
          <span className="hero-beacon-dot"></span>
          <span className="hero-pill-text">Indian Stock Market (NSE & BSE) · Live Quant Signals</span>
          <span className="hero-pill-divider">/</span>
          <span className="hero-pill-highlight">Zero Cost · Instant Access</span>
        </div>

        {/* Hero Title */}
        <h1 className="hero-main-title">
          Master The Markets.<br />
          <span className="hero-title-gradient">Engineered with Mathematical Edge.</span>
        </h1>

        {/* Hero Subtitle */}
        <p className="hero-lead-text">
          Institutional swing trading signals, automated Fibonacci confluence, real-time volume breakout radar, and asymmetric risk/reward execution — built for disciplined traders.
        </p>

        {/* Action CTAs */}
        <div className="hero-actions-row">
          <Link href="/screener" className="hero-primary-btn">
            <span>Launch Live Screener</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
          <a href="#interactive-radar" className="hero-secondary-btn">
            <span>Explore Signals Below</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M19 12l-7 7-7-7"/>
            </svg>
          </a>
        </div>

        {/* Key Metrics Strip */}
        <div className="hero-stats-strip">
          <div className="hero-stat-card">
            <span className="hero-stat-num">3,000+</span>
            <span className="hero-stat-label">NSE & BSE Equities</span>
          </div>
          <div className="hero-stat-card">
            <span className="hero-stat-num">40+</span>
            <span className="hero-stat-label">Technical Indicators</span>
          </div>
          <div className="hero-stat-card">
            <span className="hero-stat-num">3.8 : 1</span>
            <span className="hero-stat-label">Avg Setup R:R Ratio</span>
          </div>
          <div className="hero-stat-card">
            <span className="hero-stat-num">&lt; 15 ms</span>
            <span className="hero-stat-label">Scan Speed</span>
          </div>
        </div>

        {/* ─── 3D PERSPECTIVE HYBRID QUANT COMMAND DECK ─── */}
        <div id="interactive-radar" className="quant-deck-wrapper">
          <div className="quant-deck-glow-halo"></div>

          {/* FLOATING HOLOGRAPHIC BADGE 1 (Left): AI Signal Telemetry */}
          <div className="holo-badge holo-left-badge">
            <div className="holo-badge-header">
              <span className="holo-signal-pill">{stock.aiSignal}</span>
              <span className="holo-conf-score">Score: {stock.score}/100</span>
            </div>
            <div className="holo-stock-name">{stock.symbol} · 4H Swing</div>
            <div className="holo-win-prob">
              <span>Setup Win Probability</span>
              <strong className="holo-highlight-green">{stock.winProb}</strong>
            </div>
            <div className="holo-spark-track">
              <div className="holo-spark-fill" style={{ width: stock.winProb }}></div>
            </div>
          </div>

          {/* FLOATING HOLOGRAPHIC BADGE 2 (Right): Asymmetric Risk Card */}
          <div className="holo-badge holo-right-badge">
            <div className="holo-rr-title">RISK / REWARD RATIO</div>
            <div className="holo-rr-value">{stock.rrRatio}</div>
            <div className="holo-metrics-pair">
              <div className="holo-metric-item">
                <span className="holo-sub-label">Potential Upside</span>
                <span className="holo-pos-val">{stock.profitProj}</span>
              </div>
              <div className="holo-metric-item">
                <span className="holo-sub-label">Capped Risk</span>
                <span className="holo-neg-val">{stock.riskProj}</span>
              </div>
            </div>
            <div className="holo-status-pill">
              <span>● Stop-Loss Defined at {stock.stopLoss}</span>
            </div>
          </div>

          {/* MAIN DECK TERMINAL WINDOW */}
          <div className="quant-terminal-box">

            {/* Deck Header & Mode Switcher */}
            <div className="terminal-topbar">
              <div className="terminal-dots">
                <span className="term-dot red"></span>
                <span className="term-dot yellow"></span>
                <span className="term-dot green"></span>
              </div>

              {/* Stock Switcher Buttons */}
              <div className="deck-stock-tabs">
                {STOCKS_DATA.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveStockIndex(idx)}
                    className={`deck-tab-btn ${activeStockIndex === idx ? 'active' : ''}`}
                  >
                    <span className="deck-tab-sym">{s.symbol}</span>
                    <span className="deck-tab-tag">{s.badge}</span>
                  </button>
                ))}
              </div>

              <div className="deck-live-status">
                <span className="live-pulsar"></span>
                <span className="live-text">NSE QUANT FEED</span>
              </div>
            </div>

            {/* Interactive Indicator Control Bar */}
            <div className="deck-indicator-toggles">
              <div className="indicator-toggle-label">Interactive Indicator Layers:</div>
              <div className="indicator-buttons-group">
                <button
                  onClick={() => setShowFibo(!showFibo)}
                  className={`ind-toggle-btn ${showFibo ? 'on' : ''}`}
                >
                  <span className="ind-check">{showFibo ? '✓' : '+'}</span>
                  <span>Fibonacci Confluence (0.618)</span>
                </button>

                <button
                  onClick={() => setShowTargets(!showTargets)}
                  className={`ind-toggle-btn ${showTargets ? 'on' : ''}`}
                >
                  <span className="ind-check">{showTargets ? '✓' : '+'}</span>
                  <span>Take-Profit & Stop Bands</span>
                </button>

                <button
                  onClick={() => setShowRsi(!showRsi)}
                  className={`ind-toggle-btn ${showRsi ? 'on' : ''}`}
                >
                  <span className="ind-check">{showRsi ? '✓' : '+'}</span>
                  <span>RSI (14) Momentum Sub-Panel</span>
                </button>

                <button
                  onClick={() => setShowVolume(!showVolume)}
                  className={`ind-toggle-btn ${showVolume ? 'on' : ''}`}
                >
                  <span className="ind-check">{showVolume ? '✓' : '+'}</span>
                  <span>Volume Flow Profile</span>
                </button>
              </div>
            </div>

            {/* Core Workspace Canvas */}
            <div className="deck-workspace-grid">

              {/* Left Column: Interactive Candlestick SVG Viewport */}
              <div className="deck-chart-viewport">
                
                {/* Active stock quick header */}
                <div className="deck-chart-header">
                  <div className="dch-left">
                    <span className="dch-sym">{stock.symbol}</span>
                    <span className="dch-name">{stock.name}</span>
                    <span className="dch-cat">{stock.category}</span>
                  </div>
                  <div className="dch-right">
                    <span className="dch-price">{stock.price}</span>
                    <span className="dch-chg">{stock.change}</span>
                  </div>
                </div>

                {/* Live Tooltip when hovered */}
                {hoveredCandle && (
                  <div className="chart-hover-hud">
                    <span>Date: <strong>{hoveredCandle.date}</strong></span>
                    <span>O: <strong>₹{hoveredCandle.o}</strong></span>
                    <span>H: <strong>₹{hoveredCandle.h}</strong></span>
                    <span>L: <strong>₹{hoveredCandle.l}</strong></span>
                    <span>C: <strong>₹{hoveredCandle.c}</strong></span>
                    <span>Vol: <strong>{hoveredCandle.vol}K</strong></span>
                  </div>
                )}

                {/* SVG Candlestick Engine */}
                <div 
                  className="svg-chart-container"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                >
                  <svg
                    ref={chartSvgRef}
                    viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                    className="candlestick-svg"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="bullGreenGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                      <linearGradient id="bearRedGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ef4444" />
                        <stop offset="100%" stopColor="#b91c1c" />
                      </linearGradient>
                      <linearGradient id="profitZoneGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(16, 185, 129, 0.2)" />
                        <stop offset="100%" stopColor="rgba(16, 185, 129, 0.0)" />
                      </linearGradient>
                      <linearGradient id="riskZoneGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(239, 68, 68, 0.0)" />
                        <stop offset="100%" stopColor="rgba(239, 68, 68, 0.18)" />
                      </linearGradient>
                    </defs>

                    {/* Background Grid Lines */}
                    <line x1="0" y1="50" x2={svgWidth} y2="50" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                    <line x1="0" y1="100" x2={svgWidth} y2="100" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                    <line x1="0" y1="150" x2={svgWidth} y2="150" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                    <line x1="0" y1="200" x2={svgWidth} y2="200" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />

                    {/* Target & Stop Loss Bands Layer */}
                    {showTargets && (
                      <g className="targets-layer">
                        {/* Take Profit Zone */}
                        <rect x="0" y="20" width={svgWidth} height="50" fill="url(#profitZoneGrad)" />
                        <line x1="0" y1="20" x2={svgWidth} y2="20" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 4" />
                        <text x={svgWidth - 110} y="16" fill="#10b981" fontSize="10" fontWeight="600">TARGET: {stock.target1}</text>

                        {/* Stop Loss Line */}
                        <rect x="0" y={svgHeight - 45} width={svgWidth} height="40" fill="url(#riskZoneGrad)" />
                        <line x1="0" y1={svgHeight - 45} x2={svgWidth} y2={svgHeight - 45} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 4" />
                        <text x={svgWidth - 110} y={svgHeight - 32} fill="#ef4444" fontSize="10" fontWeight="600">STOP LOSS: {stock.stopLoss}</text>
                      </g>
                    )}

                    {/* Fibonacci Confluence Overlay */}
                    {showFibo && (
                      <g className="fibo-layer">
                        {stock.fiboLevels.map((fib, fIdx) => (
                          <g key={fIdx}>
                            <line
                              x1="0"
                              y1={fib.y}
                              x2={svgWidth}
                              y2={fib.y}
                              stroke={fib.ratio === '0.618' ? '#00f2fe' : 'rgba(0, 242, 254, 0.35)'}
                              strokeWidth={fib.ratio === '0.618' ? '1.8' : '1'}
                              strokeDasharray={fib.ratio === '0.618' ? 'none' : '3 3'}
                            />
                            <text
                              x="12"
                              y={fib.y - 4}
                              fill={fib.ratio === '0.618' ? '#00f2fe' : 'rgba(0, 242, 254, 0.7)'}
                              fontSize="9"
                              fontWeight={fib.ratio === '0.618' ? '700' : '500'}
                            >
                              Fib {fib.ratio} {fib.ratio === '0.618' ? '★ GOLDEN POCKET' : ''} (₹{fib.price})
                            </text>
                          </g>
                        ))}
                      </g>
                    )}

                    {/* Volume Histogram Profile */}
                    {showVolume && (
                      <g className="volume-layer" opacity="0.45">
                        {stock.candles.map((c, i) => {
                          const x = (i + 1) * candleSpacing;
                          const volHeight = (c.vol / 250) * 45;
                          const isGreen = c.c >= c.o;
                          return (
                            <rect
                              key={`vol-${i}`}
                              x={x - 8}
                              y={svgHeight - volHeight - 5}
                              width="16"
                              height={volHeight}
                              fill={isGreen ? '#10b981' : '#ef4444'}
                              rx="1"
                            />
                          );
                        })}
                      </g>
                    )}

                    {/* Candlesticks (Wicks and Bodies) */}
                    {stock.candles.map((c, i) => {
                      const x = (i + 1) * candleSpacing;
                      const yOpen = getY(c.o);
                      const yClose = getY(c.c);
                      const yHigh = getY(c.h);
                      const yLow = getY(c.l);
                      const isGreen = c.c >= c.o;
                      const bodyTop = Math.min(yOpen, yClose);
                      const bodyHeight = Math.max(Math.abs(yClose - yOpen), 3);

                      return (
                        <g key={`candle-${i}`} className="candle-group">
                          {/* Wick */}
                          <line
                            x1={x}
                            y1={yHigh}
                            x2={x}
                            y2={yLow}
                            stroke={isGreen ? '#10b981' : '#ef4444'}
                            strokeWidth="1.5"
                          />
                          {/* Candle Body */}
                          <rect
                            x={x - 7}
                            y={bodyTop}
                            width="14"
                            height={bodyHeight}
                            fill={isGreen ? 'url(#bullGreenGrad)' : 'url(#bearRedGrad)'}
                            rx="1.5"
                            stroke={isGreen ? '#10b981' : '#ef4444'}
                            strokeWidth="0.8"
                          />
                        </g>
                      );
                    })}

                    {/* Crosshair Lines on Hover */}
                    {crosshairPos.visible && (
                      <g className="crosshair-layer">
                        <line
                          x1={crosshairPos.x}
                          y1="0"
                          x2={crosshairPos.x}
                          y2={svgHeight}
                          stroke="#38bdf8"
                          strokeWidth="1"
                          strokeDasharray="2 2"
                        />
                        <line
                          x1="0"
                          y1={crosshairPos.y}
                          x2={svgWidth}
                          y2={crosshairPos.y}
                          stroke="#38bdf8"
                          strokeWidth="1"
                          strokeDasharray="2 2"
                        />
                        <circle
                          cx={crosshairPos.x}
                          cy={crosshairPos.y}
                          r="3"
                          fill="#38bdf8"
                        />
                      </g>
                    )}
                  </svg>
                </div>

                {/* RSI Momentum Sub-Panel */}
                {showRsi && (
                  <div className="rsi-subpanel">
                    <div className="rsi-header">
                      <span className="rsi-label">RSI (14) OSCILLATOR</span>
                      <span className="rsi-current-val">
                        Value: <strong>{stock.rsiPoints[stock.rsiPoints.length - 1]}</strong>
                        {stock.rsiPoints[stock.rsiPoints.length - 1] < 30 ? ' (Oversold ⚡)' : ''}
                      </span>
                    </div>
                    <div className="rsi-track-visual">
                      <svg viewBox="0 0 600 40" className="rsi-svg" preserveAspectRatio="none">
                        {/* Overbought 70 Line */}
                        <line x1="0" y1="10" x2="600" y2="10" stroke="rgba(239,68,68,0.4)" strokeDasharray="3 3" />
                        {/* Oversold 30 Line */}
                        <line x1="0" y1="30" x2="600" y2="30" stroke="rgba(16,185,129,0.4)" strokeDasharray="3 3" />
                        {/* RSI Points Polyline */}
                        <polyline
                          fill="none"
                          stroke="#00f2fe"
                          strokeWidth="2"
                          points={stock.rsiPoints.map((val, idx) => {
                            const x = (idx + 1) * (600 / (stock.rsiPoints.length + 1));
                            // Map RSI 0-100 to y 40-0
                            const y = 40 - (val / 100) * 40;
                            return `${x},${y}`;
                          }).join(' ')}
                        />
                      </svg>
                    </div>
                  </div>
                )}

              </div>

              {/* Right Column: AI Signal Thesis & Execution Parameters */}
              <div className="deck-thesis-panel">
                <div className="thesis-card">
                  <div className="thesis-header">
                    <span className="thesis-spark-icon">✨</span>
                    <div>
                      <div className="thesis-title">Quantitative Trade Thesis</div>
                      <div className="thesis-model">Llama 3.1 8B · Confluence Scanner</div>
                    </div>
                  </div>

                  <p className="thesis-text">
                    "{stock.aiAnalysis}"
                  </p>

                  <div className="thesis-metrics-list">
                    <div className="thesis-metric-row">
                      <span className="tmr-label">Target 1 (Primary)</span>
                      <span className="tmr-val green">{stock.target1}</span>
                    </div>
                    <div className="thesis-metric-row">
                      <span className="tmr-label">Target 2 (Runner)</span>
                      <span className="tmr-val green">{stock.target2}</span>
                    </div>
                    <div className="thesis-metric-row">
                      <span className="tmr-label">Stop-Loss (Defined Risk)</span>
                      <span className="tmr-val red">{stock.stopLoss}</span>
                    </div>
                    <div className="thesis-metric-row">
                      <span className="tmr-label">Fibonacci Golden Zone</span>
                      <span className="tmr-val cyan">{stock.fiboGolden}</span>
                    </div>
                  </div>

                  <div className="thesis-cta-wrap">
                    <Link href={`/stock/${stock.symbol}`} className="deck-action-primary">
                      <span>Full {stock.symbol} Technicals</span>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="7" y1="17" x2="17" y2="7" />
                        <polyline points="7 7 17 7 17 17" />
                      </svg>
                    </Link>

                    <Link href="/screener" className="deck-action-secondary">
                      Filter Similar Setups →
                    </Link>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

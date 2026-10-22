"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

const INITIAL_SIGNALS = [
  { id: 1, time: 'Just now', symbol: 'TATAMOTORS', name: 'Tata Motors', type: 'RSI Oversold Bounce (28.2)', score: 92, rr: '3.8:1', isUp: true, change: '+3.45%' },
  { id: 2, time: '1m ago', symbol: 'TRENT', name: 'Trent Ltd', type: 'Volume Surge (4.1x ATH Breakout)', score: 95, rr: '4.2:1', isUp: true, change: '+5.82%' },
  { id: 3, time: '3m ago', symbol: 'HDFCBANK', name: 'HDFC Bank', type: 'Support Demand Zone Test', score: 87, rr: '3.1:1', isUp: true, change: '+0.95%' },
  { id: 4, time: '5m ago', symbol: 'RELIANCE', name: 'Reliance Ind', type: 'Golden Cross (50 > 200 EMA)', score: 88, rr: '3.2:1', isUp: true, change: '+1.65%' },
  { id: 5, time: '7m ago', symbol: 'ZOMATO', name: 'Zomato Ltd', type: 'Stage-2 Base Breakout (New ATH)', score: 91, rr: '3.5:1', isUp: true, change: '+4.12%' },
  { id: 6, time: '9m ago', symbol: 'BHARTIARTL', name: 'Bharti Airtel', type: 'Bull Flag Continuation', score: 89, rr: '3.4:1', isUp: true, change: '+1.80%' },
  { id: 7, time: '12m ago', symbol: 'ICICIBANK', name: 'ICICI Bank', type: '20 EMA Pullback Bounce', score: 86, rr: '3.0:1', isUp: true, change: '+1.30%' },
];

const INDICES = [
  { sym: 'NIFTY 50', val: '24,850.20', chg: '+0.45%', isUp: true },
  { sym: 'BANK NIFTY', val: '51,240.60', chg: '+0.82%', isUp: true },
  { sym: 'SENSEX', val: '81,425.10', chg: '+0.38%', isUp: true },
  { sym: 'INDIA VIX', val: '13.25', chg: '-3.10%', isUp: false },
  { sym: 'NIFTY IT', val: '41,890.30', chg: '+1.15%', isUp: true },
  { sym: 'NIFTY AUTO', val: '25,640.10', chg: '+2.10%', isUp: true },
  { sym: 'NIFTY METAL', val: '9,340.50', chg: '+0.75%', isUp: true },
];

export default function LiveScannerFeed() {
  const [filter, setFilter] = useState('all');
  const [signals, setSignals] = useState(INITIAL_SIGNALS);
  const [isLiveActive, setIsLiveActive] = useState(true);

  // Filter signals
  const filteredSignals = signals.filter(s => {
    if (filter === 'all') return true;
    if (filter === 'breakout') return s.type.includes('Breakout') || s.type.includes('Surge');
    if (filter === 'oversold') return s.type.includes('Oversold') || s.type.includes('Support');
    if (filter === 'cross') return s.type.includes('Cross') || s.type.includes('EMA');
    return true;
  });

  return (
    <section className="scanner-feed-section">
      {/* Top Infinite Ticker Marquee */}
      <div className="landing-marquee-wrapper" aria-hidden="true">
        <div className="landing-marquee-track">
          {[...INDICES, ...INDICES, ...INDICES].map((item, idx) => (
            <div key={idx} className="marquee-ticker-pill">
              <span className="marquee-pill-sym">{item.sym}</span>
              <span className="marquee-pill-val">{item.val}</span>
              <span className={`marquee-pill-chg ${item.isUp ? 'pos' : 'neg'}`}>
                {item.isUp ? '▲' : '▼'} {item.chg}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Live Scanner Tape Container */}
      <div className="scanner-container">
        <div className="scanner-header-bar">
          <div className="scanner-title-group">
            <div className="live-feed-badge">
              <span className="pulsing-radar-dot"></span>
              <span>LIVE ALGORITHMIC TAPE</span>
            </div>
            <h2 className="scanner-title">Real-Time Pattern & Setup Scanner</h2>
          </div>

          {/* Filter Pills */}
          <div className="scanner-controls">
            <div className="scanner-filter-pills">
              <button
                className={`scan-pill ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All Setups ({signals.length})
              </button>
              <button
                className={`scan-pill ${filter === 'breakout' ? 'active' : ''}`}
                onClick={() => setFilter('breakout')}
              >
                Breakouts
              </button>
              <button
                className={`scan-pill ${filter === 'oversold' ? 'active' : ''}`}
                onClick={() => setFilter('oversold')}
              >
                RSI Oversold
              </button>
              <button
                className={`scan-pill ${filter === 'cross' ? 'active' : ''}`}
                onClick={() => setFilter('cross')}
              >
                Golden Cross
              </button>
            </div>
          </div>
        </div>

        {/* Live Signal Feed Table */}
        <div className="scanner-tape-box">
          <div className="scanner-tape-head">
            <span>TIMESTAMP</span>
            <span>STOCK / TICKER</span>
            <span>PATTERN TRIGGER</span>
            <span>AI SCORE</span>
            <span>R:R RATIO</span>
            <span>ACTION</span>
          </div>

          <div className="scanner-tape-body">
            {filteredSignals.map((item) => (
              <div key={item.id} className="scanner-tape-row">
                <div className="str-time">
                  <span className="str-clock-icon">🕒</span>
                  <span>{item.time}</span>
                </div>

                <div className="str-stock">
                  <Link href={`/stock/${item.symbol}`} className="str-sym-link">
                    <strong>{item.symbol}</strong>
                    <span className="str-change-badge">{item.change}</span>
                  </Link>
                  <span className="str-name">{item.name}</span>
                </div>

                <div className="str-pattern">
                  <span className="str-pattern-pill">{item.type}</span>
                </div>

                <div className="str-score">
                  <div className="str-score-circle">
                    <strong>{item.score}</strong>
                    <small>/100</small>
                  </div>
                </div>

                <div className="str-rr">
                  <span className="str-rr-badge">{item.rr}</span>
                </div>

                <div className="str-action">
                  <Link href={`/stock/${item.symbol}`} className="str-inspect-btn">
                    <span>Inspect</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Footer note in scanner box */}
          <div className="scanner-tape-footer">
            <div className="stf-left">
              <span>● Scanning 3,000+ NSE & BSE equities on every 1-min & 5-min candle interval.</span>
            </div>
            <Link href="/screener" className="stf-launch-btn">
              Open Full Screener Engine →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

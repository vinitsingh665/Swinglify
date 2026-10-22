"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function BentoFeatures() {
  const [activeFilter, setActiveFilter] = useState('oversold');

  return (
    <section id="features" className="bento-section">
      <div className="bento-container">
        {/* Section Header */}
        <div className="bento-header">
          <div className="bento-badge">SYSTEM ARCHITECTURE</div>
          <h2 className="bento-title">
            The Complete Intelligence Stack<br />
            <span className="bento-title-accent">Built For Modern Traders.</span>
          </h2>
          <p className="bento-subtitle">
            Ditch spreadsheets and delayed tools. Swinglify combines high-frequency technical indicators, algorithmic momentum scoring, and automated breakout detection into one fast workspace.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="bento-grid-modern">

          {/* CARD 1: Advanced Stock Screener (Large Featured Card) */}
          <div className="bento-card-large">
            <div className="bento-card-header">
              <div className="bento-card-tag">CORE ENGINE</div>
              <h3 className="bento-card-h3">40+ Indicator Live Screener</h3>
              <p className="bento-card-p">
                Filter across 3,000+ NSE and BSE stocks instantly. Combine momentum, moving average crossovers, and volume bursts without writing a line of code.
              </p>
            </div>

            {/* Interactive Preview Widget inside Card */}
            <div className="bento-screener-mockup">
              {/* Filter pills switcher */}
              <div className="bsm-filter-bar">
                <button
                  className={`bsm-pill ${activeFilter === 'oversold' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('oversold')}
                >
                  RSI &lt; 30 (Oversold)
                </button>
                <button
                  className={`bsm-pill ${activeFilter === 'breakout' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('breakout')}
                >
                  Volume Surge &gt; 2x
                </button>
                <button
                  className={`bsm-pill ${activeFilter === 'golden' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('golden')}
                >
                  Price &gt; 50 EMA
                </button>
              </div>

              {/* Mini Table Rows */}
              <div className="bsm-table">
                <div className="bsm-row header">
                  <span>STOCK</span>
                  <span>PRICE</span>
                  <span>RSI</span>
                  <span>SIGNAL</span>
                </div>

                {activeFilter === 'oversold' && (
                  <>
                    <div className="bsm-row">
                      <span className="stock-cell"><strong>TATAMOTORS</strong> <small>Auto</small></span>
                      <span>₹984.60</span>
                      <span className="badge-green">28.2 (Oversold)</span>
                      <span className="signal-buy">STRONG BUY</span>
                    </div>
                    <div className="bsm-row">
                      <span className="stock-cell"><strong>HDFCBANK</strong> <small>Bank</small></span>
                      <span>₹1,680.10</span>
                      <span className="badge-green">29.5 (Oversold)</span>
                      <span className="signal-buy">BUY</span>
                    </div>
                    <div className="bsm-row">
                      <span className="stock-cell"><strong>ASIANPAINT</strong> <small>FMCG</small></span>
                      <span>₹2,840.00</span>
                      <span className="badge-green">27.8 (Oversold)</span>
                      <span className="signal-buy">BUY</span>
                    </div>
                  </>
                )}

                {activeFilter === 'breakout' && (
                  <>
                    <div className="bsm-row">
                      <span className="stock-cell"><strong>TRENT</strong> <small>Retail</small></span>
                      <span>₹5,420.00</span>
                      <span className="badge-blue">66.4 (4.1x Vol)</span>
                      <span className="signal-buy">STRONG BUY</span>
                    </div>
                    <div className="bsm-row">
                      <span className="stock-cell"><strong>ZOMATO</strong> <small>Tech</small></span>
                      <span>₹274.20</span>
                      <span className="badge-blue">71.5 (2.8x Vol)</span>
                      <span className="signal-buy">BUY</span>
                    </div>
                    <div className="bsm-row">
                      <span className="stock-cell"><strong>RVNL</strong> <small>Infra</small></span>
                      <span>₹485.00</span>
                      <span className="badge-blue">68.2 (3.5x Vol)</span>
                      <span className="signal-buy">STRONG BUY</span>
                    </div>
                  </>
                )}

                {activeFilter === 'golden' && (
                  <>
                    <div className="bsm-row">
                      <span className="stock-cell"><strong>RELIANCE</strong> <small>Energy</small></span>
                      <span>₹2,940.50</span>
                      <span className="badge-purple">+2.4% above 50 EMA</span>
                      <span className="signal-buy">BUY</span>
                    </div>
                    <div className="bsm-row">
                      <span className="stock-cell"><strong>ICICIBANK</strong> <small>Bank</small></span>
                      <span>₹1,240.80</span>
                      <span className="badge-purple">+3.1% above 50 EMA</span>
                      <span className="signal-buy">BUY</span>
                    </div>
                    <div className="bsm-row">
                      <span className="stock-cell"><strong>BHARTIARTL</strong> <small>Telecom</small></span>
                      <span>₹1,650.00</span>
                      <span className="badge-purple">+1.8% above 50 EMA</span>
                      <span className="signal-buy">BUY</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* CARD 2: Algorithmic Composite Score */}
          <div className="bento-card-regular">
            <div className="bento-card-header">
              <div className="bento-card-tag">ALGORITHMIC ALPHA</div>
              <h3 className="bento-card-h3">Composite Signal Engine</h3>
              <p className="bento-card-p">
                Stop guessing indicator conflicts. Our scoring engine aggregates RSI, MACD, Bollinger Bands, and EMAs into a clear 0–100 probability index.
              </p>
            </div>

            <div className="bento-score-display">
              <div className="score-circular-badge">
                <span className="score-val">88</span>
                <span className="score-denom">/100</span>
              </div>
              <div className="score-label-block">
                <span className="score-rating-text">STRONG BUY SIGNAL</span>
                <span className="score-sub-text">5 Bullish · 0 Bearish Confirmations</span>
              </div>
            </div>

            <div className="score-bars-list">
              <div className="score-bar-row">
                <span>RSI Momentum</span>
                <div className="sbr-track"><div className="sbr-fill" style={{ width: '85%' }}></div></div>
              </div>
              <div className="score-bar-row">
                <span>Moving Averages (EMA 20/50/200)</span>
                <div className="sbr-track"><div className="sbr-fill" style={{ width: '92%' }}></div></div>
              </div>
              <div className="score-bar-row">
                <span>Volume Confirmation</span>
                <div className="sbr-track"><div className="sbr-fill" style={{ width: '80%' }}></div></div>
              </div>
            </div>
          </div>

          {/* CARD 3: Stock Rivalry Comparison */}
          <div className="bento-card-regular">
            <div className="bento-card-header">
              <div className="bento-card-tag">HEAD-TO-HEAD</div>
              <h3 className="bento-card-h3">Side-by-Side Stock Rivalries</h3>
              <p className="bento-card-p">
                Compare sector rivals like TCS vs Infosys or HDFC vs ICICI Bank to instantly spot who has superior momentum.
              </p>
            </div>

            <div className="bento-rivalry-preview">
              <div className="rivalry-col leader">
                <div className="rivalry-sym">TCS</div>
                <div className="rivalry-status">Momentum Leader ⭐</div>
                <div className="rivalry-stat">Score: 84/100</div>
                <div className="rivalry-stat">RSI: 58.2 (Uptrend)</div>
              </div>
              <div className="rivalry-vs">VS</div>
              <div className="rivalry-col">
                <div className="rivalry-sym">INFY</div>
                <div className="rivalry-status">Lagging</div>
                <div className="rivalry-stat">Score: 62/100</div>
                <div className="rivalry-stat">RSI: 44.1 (Consolidating)</div>
              </div>
            </div>

            <Link href="/compare/tcs-vs-infy" className="bento-action-link">
              Try Stock Comparison Tool →
            </Link>
          </div>

          {/* CARD 4: AI Technical Insights (Wide 2-col) */}
          <div className="bento-card-large">
            <div className="bento-card-header">
              <div className="bento-card-tag">AI-POWERED ANALYSIS</div>
              <h3 className="bento-card-h3">Groq Llama 3.1 Setup Breakdown</h3>
              <p className="bento-card-p">
                Get plain-English institutional trading setups generated on-demand for any Indian stock. Understand support, resistance, and risk-reward in seconds.
              </p>
            </div>

            <div className="bento-ai-mockup">
              <div className="ai-chat-bubble">
                <div className="ai-bubble-badge">
                  <span>✨</span>
                  <span>AI Trade Thesis Generator</span>
                </div>
                <p className="ai-bubble-text">
                  <strong>TATAMOTORS Setup:</strong> High-probability mean reversion trade. The 14-day RSI printed an oversold dip at 28.2 while respecting the 200-day SMA at ₹955. With 2.8x volume expansion, probability favors a mean-reverting swing towards the 20 EMA at ₹1,020.
                </p>
                <div className="ai-bubble-meta">
                  <span>Target: ₹1,020 (+3.6%)</span>
                  <span>Stop-Loss: ₹950 (-3.5%)</span>
                  <span>R:R Ratio: 1.05</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

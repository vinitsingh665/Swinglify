"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function RiskCalculator() {
  const [capital, setCapital] = useState(200000); // ₹2,00,000
  const [riskPercent, setRiskPercent] = useState(1.5); // 1.5%
  const [rrRatio, setRrRatio] = useState(3.5); // 3.5 : 1
  const [winRate, setWinRate] = useState(50); // 50% win rate

  // Math calculations
  const riskAmount = Math.round((capital * riskPercent) / 100);
  const rewardAmount = Math.round(riskAmount * rrRatio);

  // Over 20 trades
  const totalTrades = 20;
  const wins = Math.round((totalTrades * winRate) / 100);
  const losses = totalTrades - wins;
  const totalProfit = wins * rewardAmount;
  const totalLoss = losses * riskAmount;
  const netGain = totalProfit - totalLoss;
  const roiPercent = ((netGain / capital) * 100).toFixed(1);

  // Amateur comparison (1:1 R:R with 50% win rate)
  const amateurGain = (wins * riskAmount) - (losses * riskAmount);

  return (
    <section className="risk-calc-section">
      <div className="risk-calc-container">
        
        {/* Section Header */}
        <div className="risk-calc-header">
          <div className="calc-badge">ASYMMETRIC MATHEMATICAL EDGE</div>
          <h2 className="calc-title">
            The Math of Winning Traders.<br />
            <span className="calc-title-accent">Interactive Risk / Reward Simulator.</span>
          </h2>
          <p className="calc-subtitle">
            Most retail traders lose because they accept 1:1 or negative risk-reward. Swinglify screens exclusively for high-confluence setups offering 3:1+ asymmetric payoffs. Test the math yourself below.
          </p>
        </div>

        {/* Calculator Interactive Grid */}
        <div className="calc-box-grid">

          {/* Left Column: Sliders */}
          <div className="calc-inputs-panel">
            <h3 className="cip-title">Customize Your Trade Parameters</h3>

            {/* Slider 1: Trading Capital */}
            <div className="slider-group">
              <div className="slider-header">
                <span className="slider-label">Account Capital:</span>
                <span className="slider-value-display">₹{capital.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="50000"
                max="1000000"
                step="25000"
                value={capital}
                onChange={(e) => setCapital(Number(e.target.value))}
                className="custom-range-slider"
              />
              <div className="slider-ticks">
                <span>₹50K</span>
                <span>₹5L</span>
                <span>₹10L</span>
              </div>
            </div>

            {/* Slider 2: Risk per Trade */}
            <div className="slider-group">
              <div className="slider-header">
                <span className="slider-label">Max Risk Per Trade (% of Capital):</span>
                <span className="slider-value-display">{riskPercent}%</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3.0"
                step="0.5"
                value={riskPercent}
                onChange={(e) => setRiskPercent(Number(e.target.value))}
                className="custom-range-slider"
              />
              <div className="slider-ticks">
                <span>0.5% (Ultra Conservative)</span>
                <span>1.5% (Standard)</span>
                <span>3.0% (Aggressive)</span>
              </div>
            </div>

            {/* Slider 3: Target R:R Ratio */}
            <div className="slider-group">
              <div className="slider-header">
                <span className="slider-label">Target Risk-to-Reward Ratio:</span>
                <span className="slider-value-display highlight-cyan">{rrRatio} : 1</span>
              </div>
              <input
                type="range"
                min="1.5"
                max="5.0"
                step="0.5"
                value={rrRatio}
                onChange={(e) => setRrRatio(Number(e.target.value))}
                className="custom-range-slider"
              />
              <div className="slider-ticks">
                <span>1.5:1</span>
                <span>3.0:1 (Swinglify Avg)</span>
                <span>5.0:1</span>
              </div>
            </div>

            {/* Slider 4: Win Rate Assumption */}
            <div className="slider-group">
              <div className="slider-header">
                <span className="slider-label">Expected Win Rate:</span>
                <span className="slider-value-display">{winRate}%</span>
              </div>
              <input
                type="range"
                min="35"
                max="65"
                step="5"
                value={winRate}
                onChange={(e) => setWinRate(Number(e.target.value))}
                className="custom-range-slider"
              />
              <div className="slider-ticks">
                <span>35% (Coin Flip)</span>
                <span>50% (Disciplined)</span>
                <span>65% (A+ Setups)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Projected Output */}
          <div className="calc-results-panel">
            
            {/* Top Single Trade HUD */}
            <div className="crp-hud-cards">
              <div className="crp-card risk">
                <span className="crp-card-label">Defined Max Risk / Trade</span>
                <span className="crp-card-val neg">-₹{riskAmount.toLocaleString('en-IN')}</span>
                <span className="crp-card-sub">Fixed stop loss protection</span>
              </div>
              <div className="crp-card reward">
                <span className="crp-card-label">Target Gain / Winner</span>
                <span className="crp-card-val pos">+₹{rewardAmount.toLocaleString('en-IN')}</span>
                <span className="crp-card-sub">{rrRatio}x upside multiple</span>
              </div>
            </div>

            {/* Projected Simulation over 20 Trades */}
            <div className="crp-simulation-box">
              <div className="sim-title-row">
                <span className="sim-title">20-Trade Compound Simulation</span>
                <span className="sim-pill">{wins} Wins · {losses} Losses</span>
              </div>

              <div className="sim-net-highlight">
                <div className="sim-net-left">
                  <span className="sim-net-label">Net Projected Profit:</span>
                  <span className="sim-net-val">+₹{netGain.toLocaleString('en-IN')}</span>
                </div>
                <div className="sim-net-right">
                  <span className="sim-roi-badge">+{roiPercent}% ROI</span>
                </div>
              </div>

              {/* Visual comparison bar */}
              <div className="sim-comparison-wrap">
                <div className="sim-comp-row">
                  <span className="scr-label">Swinglify Engine ({rrRatio}:1 R:R)</span>
                  <div className="scr-track">
                    <div className="scr-fill green" style={{ width: '100%' }}>
                      +₹{netGain.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                <div className="sim-comp-row">
                  <span className="scr-label">Amateur Retail (1:1 R:R)</span>
                  <div className="scr-track">
                    <div className="scr-fill muted" style={{ width: '15%' }}>
                      ₹{amateurGain.toLocaleString('en-IN')} (Break-even)
                    </div>
                  </div>
                </div>
              </div>

              <p className="sim-insight-note">
                💡 <strong>The Secret:</strong> Even with only a 50% win rate (losing half your trades), a disciplined 3.5:1 R:R yields a <strong>+{roiPercent}% portfolio expansion</strong>. Swinglify screener is engineered specifically to find these asymmetric setups.
              </p>

              <div className="sim-cta-row">
                <Link href="/screener/volume-breakouts" className="hero-primary-btn" style={{ width: '100%', justifyContent: 'center' }}>
                  <span>Screen High R:R Setups Now →</span>
                </Link>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

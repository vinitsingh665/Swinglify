"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

function MetricBar({ label, value, displayValue, min = 0, max = 100, invertColor = false, explicitCls }) {
  const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  let cls = 'neutral';
  
  if (explicitCls) {
    cls = explicitCls;
  } else if (!invertColor) {
    if (pct >= 60) cls = 'bullish';
    else if (pct <= 40) cls = 'bearish';
  } else {
    if (value < 30) cls = 'bullish';
    else if (value > 70) cls = 'bearish';
  }

  return (
    <div className="qi-metric">
      <div className="qi-metric-header">
        <span className="qi-metric-label">{label}</span>
        <span className={`qi-metric-value ${cls}`}>{displayValue}</span>
      </div>
      <div className="qi-bar">
        <div className={`qi-bar-fill ${cls}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function QuickInsights({ stock }) {
  if (!stock) {
    return (
      <div className="insights-panel">
        <div className="qi-empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
          <div>Click a stock row to see<br />detailed technical insights</div>
        </div>
      </div>
    );
  }

  const s = stock;
  const volRatio = s.avgVolume10d ? ((s.volume / s.avgVolume10d) * 100).toFixed(0) : null;
  
  // Context-aware variables
  const isUptrend = s.price > (s.sma200 || s.sma50 || s.ema20 || s.price);
  const isBullTrend = s.price > (s.sma50 || s.ema20 || s.price);
  
  // RSI Logic
  let rsiCls = 'neutral', rsiDisplay = 'Neutral';
  if (s.rsi != null) {
      if (s.rsi < 30) {
          rsiCls = isUptrend ? 'bullish' : 'neutral';
          rsiDisplay = isUptrend ? 'Dip Buying' : 'Oversold (Downtrend)';
      } else if (s.rsi > 70) {
          rsiCls = isUptrend ? 'neutral' : 'bearish';
          rsiDisplay = isUptrend ? 'Riding Trend' : 'Overbought (Downtrend)';
      } else if (s.rsi < 45) {
          rsiCls = 'bearish'; rsiDisplay = 'Bearish Mo';
      } else if (s.rsi > 55) {
          rsiCls = 'bullish'; rsiDisplay = 'Bullish Mo';
      }
  }

  // ADX Logic
  let adxCls = 'neutral', adxDisplay = 'Sideways';
  if (s.adx != null) {
      if (s.adx > 35) {
          adxCls = isBullTrend ? 'bullish' : 'bearish';
          adxDisplay = `Strong ${isBullTrend ? 'Uptrend' : 'Downtrend'}`;
      } else if (s.adx > 25) {
          adxCls = isBullTrend ? 'bullish' : 'bearish';
          adxDisplay = `${isBullTrend ? 'Uptrending' : 'Downtrending'}`;
      }
  }

  // EMA Logic
  let emaLabel = 'Pending', emaCls = 'neutral', emaValue = 50;
  if (s.ema50 && s.price) {
      const diff50 = ((s.price - s.ema50) / s.ema50) * 100;
      if (diff50 > 8) { emaCls = 'neutral'; emaLabel = 'Overextended Top'; emaValue = 90; } // Caution
      else if (diff50 > 0) { emaCls = 'bullish'; emaLabel = 'Riding Above EMA50'; emaValue = 75; }
      else if (diff50 > -5) { emaCls = 'neutral'; emaLabel = 'Testing Support'; emaValue = 35; }
      else { emaCls = 'bearish'; emaLabel = 'Below EMA50'; emaValue = 15; }
  }

  // Overall verdict
  const score = s.indicatorScore?.score || 50;
  const verdictLabel = s.indicatorScore?.label || 'NEUTRAL';
  const verdictCls = score >= 55 ? 'bullish' : score <= 45 ? 'bearish' : 'neutral';

  return (
    <div className="insights-panel">
      <div className="qi-header">
        <div className="qi-title">Why this stock?</div>
        <div className="qi-stock-name">{s.symbol}</div>
        <div className="qi-stock-price">₹{s.price?.toLocaleString('en-IN')} &nbsp;
          <span style={{ color: (s.change || 0) >= 0 ? 'var(--green-bright)' : 'var(--red-bright)', fontSize: '0.82rem', fontWeight: 600 }}>
            {(s.change || 0) >= 0 ? '+' : ''}{s.change?.toFixed(2)}%
          </span>
        </div>
        <Link
          href={`/stock/${s.symbol}`}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 8, marginTop: 10,
            background: 'var(--accent)', color: '#fff', textDecoration: 'none',
            fontSize: '0.75rem', fontWeight: 700, transition: 'opacity 0.2s',
            border: 'none', cursor: 'pointer', width: '100%',
          }}
          onMouseOver={e => e.currentTarget.style.opacity = '0.85'}
          onMouseOut={e => e.currentTarget.style.opacity = '1'}
        >
          View Full Analysis →
        </Link>
      </div>

      <div className="qi-metrics">
        {/* AI Insight */}
        <AIInsight ticker={s.symbol} s={s} />

        {/* RSI */}
        {s.rsi != null && (
          <MetricBar
            label="RSI"
            value={s.rsi}
            displayValue={`${s.rsi.toFixed(1)} → ${rsiDisplay}`}
            explicitCls={rsiCls}
          />
        )}

        {/* Volume vs Average */}
        {volRatio && (
          <MetricBar
            label="Volume vs 10d Avg"
            value={Number(volRatio)}
            displayValue={`${volRatio}%`}
            min={0}
            max={300}
          />
        )}

        <div className="qi-divider" />

        {/* EMA position */}
        {s.ema50 && (
          <MetricBar
            label="Price vs 50 EMA"
            value={emaValue}
            displayValue={emaLabel}
            explicitCls={emaCls}
          />
        )}

        {/* MACD */}
        {s.macd != null && s.macdSignal != null && (
          <MetricBar
            label="MACD"
            value={s.macd > s.macdSignal ? 75 : 25}
            displayValue={s.macd > s.macdSignal ? 'Bullish Cross' : 'Bearish Cross'}
          />
        )}

        {/* ADX */}
        {s.adx != null && (
          <MetricBar
            label="ADX (Trend Strength)"
            value={s.adx}
            displayValue={`${s.adx.toFixed(1)} → ${adxDisplay}`}
            explicitCls={adxCls}
          />
        )}

        {/* Stochastic */}
        {s.stochK != null && (
          <MetricBar
            label="Stochastic %K"
            value={s.stochK}
            displayValue={`${s.stochK.toFixed(1)}`}
            invertColor
          />
        )}
      </div>

      <div className="qi-divider" style={{ marginTop: 8 }} />

      {/* Verdict */}
      <div className={`qi-verdict ${verdictCls}`}>
        <div className="qi-verdict-label">Overall Signal</div>
        <div className={`qi-verdict-signal ${verdictCls}`}>{verdictLabel}</div>
      </div>
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
        technicalScore: s.indicatorScore?.label || s.recommendation || 'Neutral',
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
    <div className="ai-insight-card" style={{ marginTop: '0', marginBottom: '16px', background: 'transparent', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '12px', boxShadow: 'none' }}>
      <div className="ai-insight-header">
        <span className="ai-param-icon">✨</span> 
        <span className="ai-insight-title">AI Insight</span>
        <span className="ai-insight-badge" style={{ fontSize: '0.6rem', padding: '1px 5px' }}>GPT-OSS</span>
      </div>
      <div className="ai-insight-body">
        {loading ? (
          <div className="ai-skeleton-container">
            <div className="ai-skeleton-line" style={{ width: '95%' }}></div>
            <div className="ai-skeleton-line" style={{ width: '85%' }}></div>
          </div>
        ) : (
          <p className="ai-insight-text" style={{ fontSize: '0.8rem' }}>{insight}</p>
        )}
      </div>
    </div>
  );
}

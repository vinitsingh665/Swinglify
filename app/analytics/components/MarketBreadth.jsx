"use client";

export default function MarketBreadth({ emaBreadth }) {
  if (!emaBreadth) return null;

  const cards = [
    { key: 'ema10', color: '#f59e0b', icon: '⚡' },
    { key: 'ema20', color: '#3b82f6', icon: '📊' },
    { key: 'ema50', color: '#8b5cf6', icon: '📈' },
    { key: 'ema200', color: '#ef4444', icon: '🏔️' },
  ];

  return (
    <div className="mb-section">
      <div className="mb-header">
        <h2 className="mb-title">Market Breadth — EMA Analysis</h2>
        <span className="mb-subtitle">Stocks trading above/below key moving averages</span>
      </div>
      <div className="mb-grid">
        {cards.map(({ key, color, icon }) => {
          const d = emaBreadth[key];
          if (!d) return null;
          const bullish = d.abovePct >= 60;
          const bearish = d.abovePct <= 40;

          return (
            <div key={key} className="mb-card">
              <div className="mb-card-top">
                <div className="mb-card-label">
                  <span className="mb-card-icon">{icon}</span>
                  <span className="mb-card-ema">{d.label}</span>
                </div>
                <span className={`mb-card-badge ${bullish ? 'bullish' : bearish ? 'bearish' : 'neutral'}`}>
                  {bullish ? 'Bullish' : bearish ? 'Bearish' : 'Neutral'}
                </span>
              </div>

              {/* Progress bar */}
              <div className="mb-bar-wrap">
                <div className="mb-bar">
                  <div className="mb-bar-above" style={{ width: `${d.abovePct}%`, background: color }} />
                </div>
                <div className="mb-bar-labels">
                  <span className="mb-bar-above-label" style={{ color }}>{d.abovePct}% Above</span>
                  <span className="mb-bar-below-label">{d.belowPct}% Below</span>
                </div>
              </div>

              {/* Numbers */}
              <div className="mb-card-stats">
                <div className="mb-stat">
                  <span className="mb-stat-val" style={{ color }}>{d.above}</span>
                  <span className="mb-stat-label">Above</span>
                </div>
                <div className="mb-stat-divider" />
                <div className="mb-stat">
                  <span className="mb-stat-val" style={{ color: 'var(--text-dim)' }}>{d.below}</span>
                  <span className="mb-stat-label">Below</span>
                </div>
                <div className="mb-stat-divider" />
                <div className="mb-stat">
                  <span className="mb-stat-val">{d.total}</span>
                  <span className="mb-stat-label">Total</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

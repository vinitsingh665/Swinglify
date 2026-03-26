"use client";

export default function WinnerInsight({ stocks, data }) {
  if (stocks.length < 2) return null;

  const rows = stocks.map(sym => {
    const d = data[sym] || {};
    return {
      sym,
      changePct: d.change ?? 0,
      volatility: d.volatility ?? Math.abs(d.change ?? 0),
      volume: d.volume ?? 0,
      perfW: d.perfWeek ?? 0,
      perfM: d.perfMonth ?? 0,
    };
  });

  // Best performer (highest % change today)
  const best = [...rows].sort((a, b) => b.changePct - a.changePct)[0];
  // Most volatile
  const mostVolatile = [...rows].sort((a, b) => b.volatility - a.volatility)[0];

  // Generate insight
  let insight = '';
  if (best.changePct > 0 && best.perfM > 0) {
    insight = `${best.sym} is leading with +${best.changePct.toFixed(2)}% today and +${best.perfM.toFixed(1)}% this month — showing strong momentum.`;
  } else if (best.changePct > 0) {
    insight = `${best.sym} is outperforming with +${best.changePct.toFixed(2)}% today. Watch for sustained trend confirmation.`;
  } else {
    const leastDown = [...rows].sort((a, b) => b.changePct - a.changePct)[0];
    insight = `All selected stocks are red today. ${leastDown.sym} is holding up best at ${leastDown.changePct.toFixed(2)}%.`;
  }

  return (
    <div className="cmp-insight">
      <div className="cmp-ins-card">
        <span className="cmp-ins-icon">🏆</span>
        <span className="cmp-ins-label">Best Performer</span>
        <span className="cmp-ins-value" style={{ color: 'var(--green-bright)' }}>{best.sym}</span>
        <span className="cmp-ins-detail">{best.changePct >= 0 ? '+' : ''}{best.changePct.toFixed(2)}% today</span>
      </div>

      <div className="cmp-ins-card">
        <span className="cmp-ins-icon">📉</span>
        <span className="cmp-ins-label">Most Volatile</span>
        <span className="cmp-ins-value" style={{ color: 'var(--accent)' }}>{mostVolatile.sym}</span>
        <span className="cmp-ins-detail">Highest intraday swing</span>
      </div>

      <div className="cmp-ins-card">
        <span className="cmp-ins-icon">💡</span>
        <span className="cmp-ins-label">Insight</span>
        <span className="cmp-ins-detail" style={{ marginTop: 4 }}>{insight}</span>
      </div>
    </div>
  );
}

"use client";
import { useMemo } from 'react';

export default function PortfolioSummary({ holdings, quotes }) {
  const summary = useMemo(() => {
    let totalInvested = 0, totalCurrent = 0;
    holdings.forEach(h => {
      const q = quotes[h.symbol];
      const invested = h.qty * h.avgPrice;
      const current = q ? h.qty * q.price : invested;
      totalInvested += invested;
      totalCurrent += current;
    });
    const pnl = totalCurrent - totalInvested;
    const pnlPct = totalInvested > 0 ? ((pnl / totalInvested) * 100).toFixed(2) : 0;
    return { totalInvested, totalCurrent, pnl, pnlPct };
  }, [holdings, quotes]);

  const cards = [
    { label: 'Invested', value: `₹${summary.totalInvested.toLocaleString('en-IN')}`, color: 'var(--text-primary)' },
    { label: 'Current Value', value: `₹${summary.totalCurrent.toLocaleString('en-IN')}`, color: 'var(--text-primary)' },
    { label: 'P&L', value: `₹${summary.pnl.toLocaleString('en-IN')}`, sub: `${summary.pnlPct}%`, color: summary.pnl >= 0 ? 'var(--green)' : 'var(--red)' },
    { label: 'Holdings', value: holdings.length, color: 'var(--accent)' },
  ];

  return (
    <div className="summary-grid">
      {cards.map((c, i) => (
        <div key={i} className="summary-card">
          <span className="sc-label">{c.label}</span>
          <span className="sc-value" style={{ color: c.color }}>{c.value}</span>
          {c.sub && (
            <span className={`sc-sub ${parseInt(c.sub) >= 0 ? 'profit-glow' : 'loss-glow'}`}>
              {parseInt(c.sub) >= 0 ? '↗ ' : '↘ '} {c.sub}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

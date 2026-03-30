"use client";
import { useMemo } from 'react';

export default function PortfolioSummary({ holdings, quotes }) {
  const summary = useMemo(() => {
    let totalInvested = 0, totalCurrent = 0, dayPnl = 0, prevTotal = 0;
    holdings.forEach(h => {
      const q = quotes[h.symbol];
      const invested = h.qty * h.avgPrice;
      const current = q ? h.qty * q.price : invested;
      
      if (q && typeof q.changeAbs === 'number') {
        dayPnl += h.qty * q.changeAbs;
        prevTotal += h.qty * (q.price - q.changeAbs);
      } else {
        prevTotal += current;
      }

      totalInvested += invested;
      totalCurrent += current;
    });
    const pnl = totalCurrent - totalInvested;
    const pnlPct = totalInvested > 0 ? ((pnl / totalInvested) * 100).toFixed(2) : 0;
    const dayPnlPct = prevTotal > 0 ? ((dayPnl / prevTotal) * 100).toFixed(2) : 0;

    return { totalInvested, totalCurrent, pnl, pnlPct, dayPnl, dayPnlPct };
  }, [holdings, quotes]);

  const cards = [
    { label: 'Invested', value: `₹${summary.totalInvested.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, color: 'var(--text-primary)' },
    { label: 'Current Value', value: `₹${summary.totalCurrent.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, color: 'var(--text-primary)' },
    { label: 'Total P&L', value: `₹${summary.pnl.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, sub: `${summary.pnlPct}%`, color: summary.pnl >= 0 ? 'var(--green)' : 'var(--red)' },
    { label: 'Day P&L', value: `₹${summary.dayPnl.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, sub: `${summary.dayPnlPct}%`, color: summary.dayPnl >= 0 ? 'var(--green)' : 'var(--red)' },
  ];

  return (
    <div className="summary-grid">
      {cards.map((c, i) => (
        <div key={i} className="summary-card">
          <span className="sc-label">{c.label}</span>
          <span className="sc-value" style={{ color: c.color }}>{c.value}</span>
          {c.sub && (
            <span className={`sc-sub ${parseFloat(c.sub) >= 0 ? 'profit-glow' : 'loss-glow'}`}>
              {parseFloat(c.sub) >= 0 ? '↗ ' : '↘ '} {c.sub}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

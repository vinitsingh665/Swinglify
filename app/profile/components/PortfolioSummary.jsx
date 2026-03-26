"use client";

const formatCurrency = (val) => {
  if (val == null || isNaN(val)) return '₹0';
  const abs = Math.abs(val);
  const sign = val < 0 ? '-' : '';
  if (abs >= 10000000) return `${sign}₹${(abs/10000000).toFixed(2)}Cr`;
  if (abs >= 100000) return `${sign}₹${(abs/100000).toFixed(2)}L`;
  if (abs >= 1000) return `${sign}₹${(abs/1000).toFixed(1)}K`;
  return `${sign}₹${abs.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
};

export default function PortfolioSummary({ holdings, quotes }) {
  let totalInvested = 0;
  let totalCurrent = 0;
  let todayPL = 0;

  holdings.forEach(h => {
    const invested = h.qty * h.avgPrice;
    totalInvested += invested;

    const quote = quotes[h.symbol];
    if (quote) {
      totalCurrent += h.qty * quote.price;
      todayPL += h.qty * (quote.changeAbs || 0);
    } else {
      totalCurrent += invested;
    }
  });

  const totalPL = totalCurrent - totalInvested;
  const totalPLPct = totalInvested > 0 ? ((totalPL / totalInvested) * 100).toFixed(2) : '0.00';
  const todayPLPct = totalCurrent > 0 ? ((todayPL / totalCurrent) * 100).toFixed(2) : '0.00';

  const cards = [
    { label: 'Total Value', value: formatCurrency(totalCurrent), sub: null },
    { label: 'Total Invested', value: formatCurrency(totalInvested), sub: null },
    { label: 'Total P&L', value: formatCurrency(totalPL), sub: `${totalPL >= 0 ? '+' : ''}${totalPLPct}%`, isProfit: totalPL >= 0 },
    { label: "Today's P&L", value: formatCurrency(todayPL), sub: `${todayPL >= 0 ? '+' : ''}${todayPLPct}%`, isProfit: todayPL >= 0 },
  ];

  return (
    <div className="summary-grid">
      {cards.map((c, i) => (
        <div className="summary-card" key={i}>
          <span className="sc-label">{c.label}</span>
          <span className={`sc-value ${c.sub != null ? (c.isProfit ? 'profit-glow' : 'loss-glow') : ''}`}>
            {c.value}
          </span>
          {c.sub && (
            <span className={`sc-sub ${c.isProfit ? 'profit-glow' : 'loss-glow'}`}>
              {c.isProfit ? '▲' : '▼'} {c.sub}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

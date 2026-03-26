"use client";

const COLORS = [
  '#f97316', '#3b82f6', '#22c55e', '#a855f7', '#ec4899',
  '#06b6d4', '#eab308', '#f43f5e', '#14b8a6', '#8b5cf6',
  '#64748b', '#facc15'
];

export default function AllocationChart({ holdings, quotes }) {
  if (!holdings.length) return null;

  // Calculate each holding's current value
  const items = holdings.map((h, i) => {
    const quote = quotes[h.symbol];
    const currentPrice = quote?.price || h.avgPrice;
    const value = h.qty * currentPrice;
    return { symbol: h.symbol, value, color: COLORS[i % COLORS.length] };
  });

  const total = items.reduce((sum, it) => sum + it.value, 0);
  if (total === 0) return null;

  // Build conic-gradient stops
  let gradientParts = [];
  let cumulative = 0;
  items.forEach(it => {
    const pct = (it.value / total) * 100;
    gradientParts.push(`${it.color} ${cumulative}% ${cumulative + pct}%`);
    cumulative += pct;
  });

  const conicGradient = `conic-gradient(${gradientParts.join(', ')})`;

  const formatVal = (v) => {
    if (v >= 10000000) return `₹${(v/10000000).toFixed(2)}Cr`;
    if (v >= 100000) return `₹${(v/100000).toFixed(2)}L`;
    if (v >= 1000) return `₹${(v/1000).toFixed(1)}K`;
    return `₹${v.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  };

  return (
    <div className="allocation-card">
      <div className="ac-title">Allocation</div>
      
      <div className="donut-wrapper" style={{ background: conicGradient }}>
        <div className="donut-hole">
          <span>Total</span>
          <span>{formatVal(total)}</span>
        </div>
      </div>

      <div className="legend-list">
        {items.map((it, i) => {
          const pct = ((it.value / total) * 100).toFixed(1);
          return (
            <div className="legend-item" key={i}>
              <div className="li-left">
                <div className="li-color" style={{ background: it.color }} />
                <span>{it.symbol}</span>
              </div>
              <span className="li-weight">{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

"use client";

const COLORS = ['#f97316', '#06b6d4', '#a855f7', '#22c55e'];

function fmtCap(val) {
  if (!val) return '—';
  if (val >= 10000000000000) return `₹${(val / 10000000000000).toFixed(2)}L Cr`;
  if (val >= 100000000000) return `₹${(val / 10000000).toFixed(0)} Cr`;
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
  return `₹${val.toLocaleString('en-IN')}`;
}

function fmtVol(n) {
  if (!n) return '—';
  if (n >= 1e7) return `${(n / 1e7).toFixed(2)}Cr`;
  if (n >= 1e5) return `${(n / 1e5).toFixed(1)}L`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return String(n);
}

export default function MetricsTable({ stocks, data }) {
  const rows = stocks.map((sym, i) => {
    const d = data[sym] || {};
    return {
      sym, color: COLORS[i],
      price: d.price ?? 0,
      changePct: d.change ?? 0,
      mktCap: d.marketCap ?? 0,
      volume: d.volume ?? 0,
      pe: d.pe ?? null,
    };
  });

  const bestWorst = (key, higherIsBetter = true) => {
    const vals = rows.map(r => r[key]).filter(v => v !== null && v !== undefined && v !== 0);
    if (vals.length < 2) return { best: null, worst: null };
    return {
      best: higherIsBetter ? Math.max(...vals) : Math.min(...vals),
      worst: higherIsBetter ? Math.min(...vals) : Math.max(...vals),
    };
  };

  const bwChange = bestWorst('changePct');
  const bwMktCap = bestWorst('mktCap');
  const bwVolume = bestWorst('volume');
  const bwPE = bestWorst('pe', false);

  const cls = (val, bw) => {
    if (bw.best === null || val === null || val === 0) return '';
    if (val === bw.best) return 'cmp-best';
    if (val === bw.worst) return 'cmp-worst';
    return '';
  };

  return (
    <div className="cmp-metrics-card">
      <div className="cmp-metrics-title">Key Metrics</div>
      <table className="cmp-table">
        <thead>
          <tr>
            <th>Stock</th>
            <th>Price</th>
            <th>% Change</th>
            <th>Market Cap</th>
            <th>Volume</th>
            <th>P/E Ratio</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.sym}>
              <td>
                <div className="cmp-stock-cell">
                  <span className="cmp-stock-dot" style={{ background: r.color }} />
                  <span className="cmp-stock-sym">{r.sym}</span>
                </div>
              </td>
              <td>₹{r.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
              <td className={cls(r.changePct, bwChange)} style={{ color: !cls(r.changePct, bwChange) ? (r.changePct >= 0 ? 'var(--green-bright)' : 'var(--red-bright)') : undefined }}>
                {r.changePct >= 0 ? '+' : ''}{r.changePct.toFixed(2)}%
              </td>
              <td className={cls(r.mktCap, bwMktCap)}>{fmtCap(r.mktCap)}</td>
              <td className={cls(r.volume, bwVolume)}>{fmtVol(r.volume)}</td>
              <td className={cls(r.pe, bwPE)}>{r.pe ? r.pe.toFixed(1) : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

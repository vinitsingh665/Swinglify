"use client";
import { useState, useMemo } from 'react';

export default function SectorPerformance({ sectors }) {
  const [tf, setTf] = useState('change1D');

  const sorted = useMemo(() => {
    if (!sectors) return [];
    return [...sectors].sort((a, b) => (b[tf] || 0) - (a[tf] || 0));
  }, [sectors, tf]);

  if (!sorted.length) return null;

  // Find max absolute value to scale the bars symmetrically around 0
  const maxAbs = useMemo(() => {
    let max = 1;
    sorted.forEach(s => {
      const val = Math.abs(s[tf] || 0);
      if (val > max) max = val;
    });
    return max;
  }, [sorted, tf]);

  return (
    <div className="sector-perf">
      <div className="sp-header">
        <h2 className="sp-title">Where Money is Flowing</h2>
        <div className="sp-toggles">
          <button className={`sp-tog ${tf === 'change1D' ? 'active' : ''}`} onClick={() => setTf('change1D')}>1D</button>
          <button className={`sp-tog ${tf === 'change1W' ? 'active' : ''}`} onClick={() => setTf('change1W')}>1W</button>
          <button className={`sp-tog ${tf === 'change1M' ? 'active' : ''}`} onClick={() => setTf('change1M')}>1M</button>
        </div>
      </div>

      <div className="sp-bars">
        {sorted.map((sec, i) => {
          const val = sec[tf] || 0;
          const isPos = val >= 0;
          const pct = (Math.abs(val) / maxAbs) * 50; // Max 50% width from center

          let rowClass = 'sp-bar-row';
          if (i === 0 && isPos) rowClass += ' strongest';
          if (i === sorted.length - 1 && !isPos) rowClass += ' weakest';

          return (
            <div key={sec.name} className={rowClass}>
              <div className="sp-bar-label">{sec.name}</div>
              <div className="sp-bar-track">
                {/* Center line */}
                <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'var(--border)', zIndex: 0 }} />

                {/* The bar */}
                <div
                  className={`sp-bar-fill ${isPos ? 'positive' : 'negative'}`}
                  style={{ width: `${pct}%` }}
                />

                <div className={`sp-bar-val ${isPos ? 'positive' : 'negative'}`}>
                  {isPos ? '+' : ''}{val.toFixed(2)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

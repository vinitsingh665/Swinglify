"use client";
import { useState, useEffect } from 'react';

const TIME_KEYS = { '1D': 'perfDay', '1W': 'perfWeek', '1M': 'perfMonth', '1Y': 'perfYear' };
const COLORS = ['#d4af37', '#93c5fd', '#c4b5fd', '#fca5a5']; 

export default function PerformanceChart({ stocks, data }) {
  const [period, setPeriod] = useState('1M');

  useEffect(() => {
    try {
      const prefs = JSON.parse(localStorage.getItem('swinglify_prefs') || '{}');
      if (prefs.timeframe && TIME_KEYS[prefs.timeframe]) {
        setPeriod(prefs.timeframe);
      }
    } catch(e) {}
  }, []);

  const perfKey = TIME_KEYS[period];
  const perfData = stocks.map((sym, i) => {
    const d = data[sym];
    if (!d) return { sym, val: 0, color: COLORS[i] };
    // All perf values from the API are already in percentage form (e.g. -10.05 = -10.05%)
    const val = Number((d[perfKey] ?? 0).toFixed(2));
    return { sym, val, color: COLORS[i] };
  });

  if (perfData.length === 0) return null;

  const maxAbs = Math.max(...perfData.map(p => Math.abs(p.val)), 0.1);
  const chartH = 300;
  const labelZone = 30; // reserved bottom strip for stock names
  const drawH = chartH - labelZone; // bars live in this area
  const barW = Math.min(80, 300 / perfData.length);
  const gap = 20;
  const totalW = perfData.length * (barW + gap) - gap;
  const startX = (600 - totalW) / 2;
  const midY = drawH * 0.4; // 40% from top to give more room below for negative bars
  const maxBarUp = midY - 20;
  const maxBarDown = drawH - midY - 20;

  return (
    <div className="cmp-chart-card">
      <div className="cmp-chart-header">
        <span className="cmp-chart-title">% Performance Comparison</span>
        <div className="cmp-time-tabs">
          {Object.keys(TIME_KEYS).map(t => (
            <button key={t} className={`cmp-time-tab ${period === t ? 'active' : ''}`} onClick={() => setPeriod(t)}>{t}</button>
          ))}
        </div>
      </div>

      <div className="cmp-chart-area">
        <svg className="cmp-chart-svg" viewBox={`0 0 600 ${chartH}`} preserveAspectRatio="xMidYMid meet">
          {/* Zero line */}
          <line x1="0" y1={midY} x2="600" y2={midY} stroke="var(--border)" strokeWidth="1" strokeDasharray="4" />
          <text x="4" y={midY - 6} fill="var(--text-dim)" fontSize="10">0%</text>

          {perfData.map((p, i) => {
            const x = startX + i * (barW + gap);
            const barH = Math.max(2, (Math.abs(p.val) / maxAbs) * (p.val >= 0 ? maxBarUp : maxBarDown));
            const y = p.val >= 0 ? midY - barH : midY;

            return (
              <g key={p.sym}>
                <rect x={x} y={y} width={barW} height={barH} rx={6} fill={p.color} opacity="0.85" />
                {/* Percentage label */}
                <text x={x + barW / 2} y={p.val >= 0 ? y - 8 : y + barH + 16} fill={p.color}
                  fontSize="13" fontWeight="800" textAnchor="middle" fontFamily="var(--font-mono)">
                  {p.val > 0 ? '+' : ''}{p.val}%
                </text>
                {/* Stock name — always in the reserved bottom zone */}
                <text x={x + barW / 2} y={chartH - 6} fill="var(--text-secondary)"
                  fontSize="11" fontWeight="700" textAnchor="middle">
                  {p.sym}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="cmp-chart-legend">
        {perfData.map(p => (
          <div key={p.sym} className="cmp-legend-item">
            <span className="cmp-legend-dot" style={{ background: p.color }} />
            {p.sym}
            <span className="cmp-legend-perf" style={{ color: p.val >= 0 ? 'var(--green-bright)' : 'var(--red-bright)' }}>
              {p.val > 0 ? '+' : ''}{p.val}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

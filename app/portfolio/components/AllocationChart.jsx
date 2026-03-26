"use client";
import { useMemo, useState } from 'react';

// Math helpers for SVG trigonometric paths
const getCoords = (cx, cy, r, deg) => {
  const rad = (deg - 90) * Math.PI / 180.0;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
};

const SVGDonut = ({ segments, totalAssets, size, isFullScreen, onClose }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  
  const cx = size / 2;
  const cy = size / 2;
  // Use a smaller radius relative to size so callouts have room before overflowing too far
  const radius = size * 0.38; 
  const innerRadius = radius * 0.65;

  const forcedAngles = segments.map(s => Math.max(parseFloat(s.pct) * 3.6, 5.4));
  const totalForced = forcedAngles.reduce((sum, a) => sum + a, 0);
  const normalizedAngles = forcedAngles.map(a => (a / totalForced) * 360);

  const paths = [];
  let currentAngle = 0;
  
  normalizedAngles.forEach((angleSpan, i) => {
    const s = segments[i];
    const startAngle = currentAngle;
    const endAngle = currentAngle + angleSpan;
    
    if (segments.length === 1) {
      paths.push({ ...s, isCircle: true, midAngle: 90 });
      return;
    }

    const start = getCoords(cx, cy, radius, startAngle);
    const end = getCoords(cx, cy, radius, endAngle);
    const largeArcFlag = angleSpan > 180 ? 1 : 0;
    
    const d = `M ${cx} ${cy} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y} Z`;
    
    paths.push({ ...s, d, midAngle: startAngle + angleSpan / 2 });
    currentAngle += angleSpan;
  });

  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
      {isFullScreen && (
        <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="h-btn" style={{ position: 'absolute', top: -30, right: -30, width: 40, height: 40 }}>
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      )}
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible' }}>
        {paths.map((p, i) => (
          p.isCircle ? (
             <circle key={i} cx={cx} cy={cy} r={radius} fill={p.color} 
                onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)}
                style={{ cursor: 'pointer', transition: 'all 0.2s', opacity: hoveredIdx === null || hoveredIdx === i ? 1 : 0.4 }}
             />
          ) : (
             <path key={i} d={p.d} fill={p.color}
                onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)}
                style={{ cursor: 'pointer', transition: 'all 0.2s ease', opacity: hoveredIdx === null || hoveredIdx === i ? 1 : 0.4 }}
             />
          )
        ))}
        
        {/* Inner Donut Hole */}
        <circle cx={cx} cy={cy} r={innerRadius} fill={isFullScreen ? "var(--bg-base)" : "var(--bg-card)"} />
        
        {/* Center Text */}
        <text x={cx} y={cy - 4} textAnchor="middle" fill="var(--text-dim)" fontSize={isFullScreen ? "18" : "0.75rem"} fontWeight="500">Assets</text>
        <text x={cx} y={cy + (isFullScreen ? 26 : 14)} textAnchor="middle" fill="var(--text-primary)" fontSize={isFullScreen ? "36" : "1.2rem"} fontWeight="700">{totalAssets}</text>

        {/* Hover Callouts */}
        {hoveredIdx !== null && paths.map((p, i) => {
          if (i !== hoveredIdx) return null;
          const edge = getCoords(cx, cy, radius, p.midAngle);
          const elbow = getCoords(cx, cy, radius + (isFullScreen ? 35 : 15), p.midAngle);
          const isRight = elbow.x >= cx;
          const textPoint = { x: isRight ? elbow.x + (isFullScreen ? 25 : 10) : elbow.x - (isFullScreen ? 25 : 10), y: elbow.y };
          
          return (
            <g key={`callout-${i}`} className="hover-callout" style={{ pointerEvents: 'none', animation: 'fadeIn 0.2s ease-out' }}>
              <polyline points={`${edge.x},${edge.y} ${elbow.x},${elbow.y} ${textPoint.x},${textPoint.y}`} fill="none" stroke={p.color} strokeWidth="2" />
              <circle cx={edge.x} cy={edge.y} r={isFullScreen ? "4" : "3"} fill={isFullScreen ? "var(--bg-base)" : "var(--bg-card)"} stroke={p.color} strokeWidth="2" />
              <text 
                x={isRight ? textPoint.x + 6 : textPoint.x - 6} 
                y={textPoint.y - 4} 
                fill="var(--text-primary)" 
                fontSize={isFullScreen ? "16" : "12"} 
                fontWeight="600"
                textAnchor={isRight ? "start" : "end"}
              >
                {p.symbol}
              </text>
              <text 
                x={isRight ? textPoint.x + 6 : textPoint.x - 6} 
                y={textPoint.y + (isFullScreen ? 18 : 12)} 
                fill="var(--text-dim)" 
                fontSize={isFullScreen ? "14" : "10"} 
                fontWeight="500"
                textAnchor={isRight ? "start" : "end"}
              >
                {parseFloat(p.pct).toFixed(1)}% Alloc
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default function AllocationChart({ holdings, quotes }) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const colors = ['var(--accent)', 'var(--green)', '#3b82f6', '#a855f7', '#ec4899', 'var(--yellow)', '#14b8a6'];

  const segments = useMemo(() => {
    if (holdings.length === 0) return [];
    let total = 0;
    const grouped = {};

    holdings.forEach(h => {
      const q = quotes[h.symbol];
      const value = q ? h.qty * q.price : h.qty * h.avgPrice;
      total += value;
      if (grouped[h.symbol]) {
        grouped[h.symbol] += value;
      } else {
        grouped[h.symbol] = value;
      }
    });

    const data = Object.keys(grouped).map(symbol => ({
      symbol, value: grouped[symbol]
    })).sort((a, b) => b.value - a.value);

    return data.map((d, i) => ({
      ...d,
      pct: total > 0 ? ((d.value / total) * 100).toFixed(1) : 0,
      color: colors[i % colors.length],
    }));
  }, [holdings, quotes]);

  return (
    <>
      <div className="allocation-card">
        <h3 className="ac-title">Allocation</h3>
        
        <div 
          className="donut-wrapper" 
          onClick={() => { if (holdings.length > 0) setIsFullScreen(true); }}
          style={{ cursor: 'zoom-in', background: 'transparent' }}
          title="Click to expand chart"
        >
          {segments.length > 0 ? (
            <SVGDonut segments={segments} totalAssets={holdings.length} size={220} />
          ) : (
             <div className="donut-hole" style={{ width: 140, height: 140 }}>
               <span>Assets</span>
               <span>0</span>
             </div>
          )}
        </div>

        <div className="legend-list">
          {segments.map((s, i) => (
            <div key={`${s.symbol}-${i}`} className="legend-item">
              <div className="li-left">
                <span className="li-color" style={{ background: s.color }} />
                <span>{s.symbol}</span>
              </div>
              <span className="li-weight">{parseFloat(s.pct).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>

      {isFullScreen && (
        <div className="modal-overlay" onClick={() => setIsFullScreen(false)} style={{ zIndex: 1000, backdropFilter: 'blur(8px)' }}>
           <div className="fullscreen-chart-modal" onClick={e => e.stopPropagation()} style={{ background: 'var(--bg-base)', padding: '50px', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', minWidth: '600px' }}>
             <h2 style={{ marginBottom: '40px', color: 'var(--text-primary)', fontSize: '1.8rem' }}>Portfolio Allocation Overview</h2>
             
             <SVGDonut segments={segments} totalAssets={holdings.length} size={450} isFullScreen={true} onClose={() => setIsFullScreen(false)} />
           </div>
        </div>
      )}
    </>
  );
}

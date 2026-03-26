"use client";
import React from 'react';

export default function SectorSnapshot() {
  const sectors = [
    { name: 'IT', change: '+1.2%', isUp: true },
    { name: 'Banking', change: '-0.8%', isUp: false },
    { name: 'Pharma', change: '+2.1%', isUp: true },
    { name: 'Auto', change: '+0.4%', isUp: true },
    { name: 'FMCG', change: '-0.2%', isUp: false },
    { name: 'Energy', change: '+1.5%', isUp: true },
  ];

  return (
    <div className="sect-card">
      <div className="sect-header">
        <h3 className="sect-title">Sector Snapshot</h3>
      </div>
      <div className="sect-grid">
        {sectors.map(s => (
          <div key={s.name} className={`sect-tile ${s.isUp ? 'up' : 'down'}`}>
            <span className="sect-name">{s.name}</span>
            <span className="sect-change">
              {s.isUp ? '↑' : '↓'} {s.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

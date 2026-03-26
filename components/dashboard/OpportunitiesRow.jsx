"use client";
import React from 'react';

export default function OpportunitiesRow() {
  const opps = [
    { title: "Breakout Stocks", value: "4 Stocks", desc: "Volume > 200%", tag: "Breakout", color: "var(--green)" },
    { title: "Oversold (RSI < 30)", value: "7 Stocks", desc: "Swing potential", tag: "Oversold", color: "var(--accent)" },
    { title: "Volume Spike", value: "12 Stocks", desc: "Sudden activity", tag: "Vol Spike", color: "var(--blue)" }
  ];

  return (
    <div className="opp-row">
      {opps.map((o, i) => (
        <div key={i} className="opp-card">
          <div className="opp-header">
            <span className="opp-title">{o.title}</span>
            <span className="opp-tag" style={{ color: o.color, background: `color-mix(in srgb, ${o.color} 15%, transparent)` }}>{o.tag}</span>
          </div>
          <div className="opp-body">
            <div className="opp-val">{o.value}</div>
            <div className="opp-desc">{o.desc}</div>
          </div>
          <div className="opp-sparkline">
            <svg viewBox="0 0 100 30" preserveAspectRatio="none">
              <path d="M0,25 Q15,20 25,22 T50,15 T70,18 T85,5 T100,10" fill="none" stroke={o.color} strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
}

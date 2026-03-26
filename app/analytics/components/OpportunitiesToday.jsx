"use client";
import { useState } from 'react';

const formatVol = (v) => {
  if (!v) return '—';
  if (v >= 10000000) return `${(v / 10000000).toFixed(1)}Cr`;
  if (v >= 100000) return `${(v / 100000).toFixed(1)}L`;
  if (v >= 1000) return `${(v / 1000).toFixed(0)}K`;
  return v.toLocaleString('en-IN');
};

function OppTable({ stocks, showRatio }) {
  if (!stocks || !stocks.length) return <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-dim)' }}>No data available</div>;

  return (
    <table className="opp-table">
      <thead>
        <tr>
          <th>Stock</th>
          <th>Price</th>
          <th>% Change</th>
          <th>Volume</th>
          {showRatio && <th>Spike Ratio</th>}
        </tr>
      </thead>
      <tbody>
        {stocks.map(s => {
          const isUp = (s.change || 0) >= 0;
          return (
            <tr key={s.symbol}>
              <td>
                <div className="opp-stock">
                  {s.logo ? <img src={s.logo} className="opp-logo" alt="" /> : <div className="opp-logo" style={{display:'flex',alignItems:'center',justifyContent:'center',fontSize:'10px',color:'var(--text-dim)',background:'var(--bg-input)'}}>{s.symbol[0]}</div>}
                  <span className="opp-sym">{s.symbol}</span>
                </div>
              </td>
              <td className="opp-price">₹{s.price?.toLocaleString('en-IN')}</td>
              <td>
                <span className={`opp-chg ${isUp ? 'up' : 'down'}`}>
                  {isUp ? '+' : ''}{s.change?.toFixed(2)}%
                </span>
              </td>
              <td className="opp-vol">{formatVol(s.volume)}</td>
              {showRatio && (
                <td className="opp-vol-ratio">{s.volumeRatio}x</td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default function OpportunitiesToday({ opportunities }) {
  const [tab, setTab] = useState('movers');

  if (!opportunities) return null;

  return (
    <div className="opp-section">
      <div className="opp-title">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--accent)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="21.17" y1="8" x2="12" y2="8"/><line x1="3.95" y1="6.06" x2="8.54" y2="14"/></svg>
        Opportunities Today
      </div>

      <div className="opp-tabs">
        <button className={`opp-tab ${tab === 'movers' ? 'active' : ''}`} onClick={() => setTab('movers')}>Top Movers</button>
        <button className={`opp-tab ${tab === 'volume' ? 'active' : ''}`} onClick={() => setTab('volume')}>Volume Spikes</button>
      </div>

      {tab === 'movers' && <OppTable stocks={opportunities.topMovers} />}
      {tab === 'volume' && <OppTable stocks={opportunities.volumeSpikes} showRatio />}
    </div>
  );
}

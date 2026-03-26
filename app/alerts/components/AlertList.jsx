"use client";
import { useMemo } from 'react';

export default function AlertList({ alerts, filter, selectedId, onSelect, onSmartSet }) {
  const filtered = useMemo(() => {
    if (filter === 'all') return alerts;
    if (filter === 'active') return alerts.filter(a => !a.triggered && !a.expired);
    if (filter === 'triggered') return alerts.filter(a => a.triggered);
    if (filter === 'expired') return alerts.filter(a => a.expired);
    return alerts;
  }, [alerts, filter]);

  const suggestions = [
    { 
      symbol: 'HDFCBANK', 
      logo: 'https://s3-symbol-logo.tradingview.com/hdfc-bank--big.svg',
      comparison: 'Above', 
      value: '1500', 
      type: 'price',
      reason: 'High volume breakout approaching key ₹1500 resistance.'
    }
  ];

  return (
    <div className="al-list-panel">
      {/* Smart Suggestion */}
      <div className="al-suggestion">
        <div className="al-sug-maintitle">💡 Smart Suggestions</div>
        {suggestions.map((s, i) => (
          <div key={i} className="al-sug-item" onClick={() => onSmartSet(s)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            
            {/* Left Content Column */}
            <div className="al-sug-content" style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, paddingRight: '16px' }}>
              <div className="al-sug-top" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                   {s.logo ? <img src={s.logo} alt={s.symbol} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)', fontWeight: 800 }}>{s.symbol[0]}</span>}
                </div>
                <span className="al-sug-sym">{s.symbol}</span>
                <span className="al-sug-detail">{s.comparison} ₹{s.value}</span>
              </div>
              <div className="al-sug-reason" style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                {s.reason}
              </div>
            </div>

            {/* Right Action Button */}
            <button className="al-sug-btn">+ Set</button>

          </div>
        ))}
      </div>

      {/* Alert Cards */}
      <div className="al-card-list">
        {filtered.length === 0 && (
          <div className="al-empty-list">
            <div style={{ fontSize: '2rem', marginBottom: 8 }}>🔔</div>
            <div>No alerts yet. Create one to get started.</div>
          </div>
        )}
        {filtered.map(alert => (
          <div
            key={alert.id}
            className={`al-card ${selectedId === alert.id ? 'active-sel' : ''}`}
            onClick={() => onSelect(alert)}
          >
            <div className="al-c-top">
              <div>
                <div className="al-c-sym">{alert.symbol}</div>
                <div className="al-c-cond">{alert.comparison} ₹{alert.value}</div>
              </div>
              <span className={`al-c-badge ${alert.triggered ? 'triggered' : alert.expired ? 'expired' : 'active'}`}>
                {alert.triggered ? 'Triggered' : alert.expired ? 'Expired' : 'Active'}
              </span>
            </div>
            <div className="al-c-time">
              Created: {alert.createdAt ? new Date(alert.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Today'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";
import { useMemo, useState, useEffect } from 'react';

export default function AlertList({ alerts, filter, selectedId, onSelect, onSmartSet }) {
  const filtered = useMemo(() => {
    if (filter === 'all') return alerts;
    if (filter === 'active') return alerts.filter(a => !a.triggered && !a.expired);
    if (filter === 'triggered') return alerts.filter(a => a.triggered);
    if (filter === 'expired') return alerts.filter(a => a.expired);
    return alerts;
  }, [alerts, filter]);

  const [suggestions, setSuggestions] = useState([]);
  const [sugLoading, setSugLoading] = useState(true);

  useEffect(() => {
    setSugLoading(true);
    fetch('/api/alerts/suggestions')
      .then(r => r.json())
      .then(data => {
        if (data.suggestions && data.suggestions.length > 0) {
          setSuggestions(data.suggestions);
        }
        setSugLoading(false);
      })
      .catch(() => setSugLoading(false));
  }, []);

  return (
    <div className="al-list-panel">
      {/* Smart Suggestion */}
      <div className="al-suggestion">
        <div className="al-sug-maintitle">✨ AI Smart Suggestions</div>
        {sugLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '8px 0' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: 1 - (i * 0.15) }}>
                {/* Icon skeleton */}
                <div style={{
                  width: 22, height: 22, borderRadius: '50%',
                  background: 'var(--bg-input)', flexShrink: 0,
                }} />
                {/* Text skeleton */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{
                    height: 10, width: `${70 - i * 10}%`, borderRadius: 4,
                    background: 'var(--bg-input)',
                    position: 'relative', overflow: 'hidden',
                  }}>
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
                      animation: 'ai-shimmer 1.5s infinite',
                    }} />
                  </div>
                  <div style={{
                    height: 8, width: `${90 - i * 8}%`, borderRadius: 4,
                    background: 'var(--bg-input)',
                    position: 'relative', overflow: 'hidden',
                  }}>
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
                      animation: 'ai-shimmer 1.5s infinite',
                      animationDelay: '0.3s',
                    }} />
                  </div>
                </div>
                {/* Button skeleton */}
                <div style={{
                  width: 48, height: 28, borderRadius: 6,
                  background: 'var(--bg-input)', flexShrink: 0,
                  position: 'relative', overflow: 'hidden',
                }}>
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
                    animation: 'ai-shimmer 1.5s infinite',
                    animationDelay: '0.6s',
                  }} />
                </div>
              </div>
            ))}
          </div>
        ) : suggestions.length === 0 ? (
          <div style={{ padding: '12px 0', color: 'var(--text-dim)', fontSize: '0.8rem', textAlign: 'center' }}>
            No suggestions available right now.
          </div>
        ) : (
          suggestions.map((s, i) => (
          <div key={i} className="al-sug-item" onClick={() => onSmartSet(s)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            
            {/* Left Content Column */}
            <div className="al-sug-content" style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, paddingRight: '16px' }}>
              <div className="al-sug-top" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--accent-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                   <span style={{ fontSize: '0.6rem', color: 'var(--accent)', fontWeight: 800 }}>{(s.symbol || '?')[0]}</span>
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
        )))}
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

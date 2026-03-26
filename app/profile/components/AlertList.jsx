"use client";
import AlertCard from './AlertCard';

export default function AlertList({ alerts, filter, selectedId, onSelect, onSmartSet }) {
  
  // Filter alerts
  const displayAlerts = alerts.filter(a => {
    if (filter === 'all') return true;
    return a.status === filter;
  });

  return (
    <div className="al-list">
      {/* Smart Suggestion - The "Killer Feature" driving engagement */}
      {filter === 'all' || filter === 'active' ? (
        <div className="al-suggestion">
          <div className="al-sug-maintitle">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
            Smart Suggestion
          </div>
          <div className="al-sug-title">RELIANCE nearing breakout</div>
          <div className="al-sug-context">Price approaching 52-week high resistance level of ₹2950.</div>
          <button className="al-sug-btn" onClick={() => onSmartSet({
            symbol: 'RELIANCE', name: 'Reliance Industries', logo: '',
            conditionType: 'Price', comparison: 'Above', value: 2950,
            context: 'Price above ₹2950 (Resistance breakout breakout)'
          })}>
            1-Click Set Alert
          </button>
        </div>
      ) : null}

      {/* Alert Feed */}
      {displayAlerts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
          No {filter !== 'all' ? filter : ''} alerts found.
        </div>
      ) : (
        displayAlerts.map(a => (
          <AlertCard 
            key={a.id} 
            alert={a} 
            isSelected={selectedId === a.id} 
            onClick={() => onSelect(a)} 
          />
        ))
      )}
    </div>
  );
}

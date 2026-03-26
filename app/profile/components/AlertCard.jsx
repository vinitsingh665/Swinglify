"use client";

function formatTimestamp(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function AlertCard({ alert, isSelected, onClick }) {
  const { symbol, name, logo, conditionType, comparison, value, status, context, timestamp, triggerTimestamp } = alert;

  // Build the context string if none exists
  let ctxLabel = context;
  if (!ctxLabel) {
    if (conditionType === 'Price') ctxLabel = `Price ${comparison} ₹${value}`;
    else if (conditionType === 'RSI') ctxLabel = `RSI ${comparison} ${value}`;
    else if (conditionType === 'Change') ctxLabel = `Change ${comparison} ${value}%`;
    else if (conditionType === 'Volume') ctxLabel = `Volume Spike > ${value}x`;
  }

  return (
    <div className={`al-card ${isSelected ? 'active-sel' : ''}`} onClick={onClick}>
      <div className="al-c-top">
        <div className="al-c-stock">
          {logo ? <img src={logo} className="al-c-logo" alt="" /> : <div className="al-c-fallback">{symbol[0]}</div>}
          <div>
            <div className="al-c-sym">{symbol}</div>
            <div className="al-c-name">{name?.substring(0, 15)}</div>
          </div>
        </div>
        <div className={`al-c-badge ${status}`}>
          {status}
        </div>
      </div>
      
      <div className="al-c-cond">{conditionType.toUpperCase()} ALERT</div>
      <div className="al-c-ctx">{ctxLabel}</div>
      
      <span className="al-c-time">
        {status === 'active' ? `Created: ${formatTimestamp(timestamp)}` : `Triggered: ${formatTimestamp(triggerTimestamp || timestamp)}`}
      </span>
    </div>
  );
}

"use client";

export default function AlertsTopBar({ filter, setFilter, onCreateNew }) {
  const tabs = ['All', 'Active', 'Triggered', 'Expired'];

  return (
    <div className="al-topbar">
      <div className="al-title-wrap">
        <h1 className="al-title">Alerts</h1>
        <div className="al-tabs">
          {tabs.map(t => (
            <button 
              key={t}
              className={`al-tab ${filter === t.toLowerCase() ? 'active' : ''}`}
              onClick={() => setFilter(t.toLowerCase())}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      
      <button className="al-create-btn" onClick={onCreateNew}>
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        Create Alert
      </button>
    </div>
  );
}

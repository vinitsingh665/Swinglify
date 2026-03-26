"use client";

export default function AlertsTopBar({ filter, setFilter, onCreateNew }) {
  const filters = [
    { id: 'all', label: 'All Alerts' },
    { id: 'active', label: 'Active' },
    { id: 'triggered', label: 'Triggered' },
    { id: 'expired', label: 'Expired' },
  ];

  return (
    <div className="al-topbar">
      <div className="al-title-wrap">
        <h1 className="al-title">Alerts</h1>
        <div className="al-tabs">
          {filters.map(f => (
            <button
              key={f.id}
              className={`al-tab ${filter === f.id ? 'active' : ''}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      <button className="al-create-btn" onClick={onCreateNew}>
        + Create Alert
      </button>
    </div>
  );
}

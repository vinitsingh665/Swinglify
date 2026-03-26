"use client";

export default function FilterPills({ currentFilter, setFilter }) {
  const pills = [
    { id: 'all', label: 'All', icon: null },
    { id: 'gainers', label: 'Gainers 🟢', cls: 'gain' },
    { id: 'losers', label: 'Losers 🔴', cls: 'loss' },
    { id: 'volume', label: 'Volume Spike', icon: '🔥' },
    { id: 'signals', label: 'Signals ⭐', cls: 'signal' }
  ];

  return (
    <div className="wl-pills">
      {pills.map(p => (
        <button
          key={p.id}
          className={`wl-pill ${p.cls || ''} ${currentFilter === p.id ? 'active' : ''}`}
          onClick={() => setFilter(p.id)}
        >
          {p.icon && <span>{p.icon}</span>}
          {p.label}
        </button>
      ))}
    </div>
  );
}

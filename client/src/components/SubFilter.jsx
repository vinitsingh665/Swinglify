import { SUB_FILTERS } from '../utils';

export default function SubFilter({ activeFilter, onFilterChange }) {
  return (
    <div className="sub-filter-bar">
      <span className="sub-filter-label">Filter:</span>
      <div className="sub-filter-tabs">
        {SUB_FILTERS.map(f => (
          <button
            key={f.id}
            className={`sub-tab ${activeFilter === f.id ? 'active' : ''}`}
            onClick={() => onFilterChange(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}

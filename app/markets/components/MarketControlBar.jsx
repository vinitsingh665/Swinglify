"use client";

export default function MarketControlBar({ searchQuery, setSearchQuery, filters, setFilters }) {
  const updateFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));

  const tags = ['Top Gainers', 'Top Losers', 'High Volume', 'Breakouts'];

  return (
    <div className="market-control-bar">
      <div className="mcb-top">
        <div className="mcb-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            placeholder="Search symbol or name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="mcb-toggles">
          <div className="toggle-group">
            {['NSE', 'BSE'].map(ex => (
              <button 
                key={ex} 
                className={`toggle-btn ${filters.exchange === ex ? 'active' : ''}`}
                onClick={() => updateFilter('exchange', ex)}
              >
                {ex}
              </button>
            ))}
          </div>
          
          <div className="toggle-group cap-group">
            {['Large', 'Mid', 'Small', 'All'].map(cap => (
              <button 
                key={cap} 
                className={`toggle-btn ${filters.marketCap === cap ? 'active' : ''}`}
                onClick={() => updateFilter('marketCap', cap)}
              >
                {cap}
              </button>
            ))}
          </div>

          <div className="sort-dropdown">
            <span style={{color:'var(--text-dim)', fontSize:'0.75rem', marginRight: 10, fontWeight:500}}>Sort:</span>
            <select value={filters.sort} onChange={e => updateFilter('sort', e.target.value)}>
              <option value="Volume">Volume ↑</option>
              <option value="% Change">% Change ↑</option>
              <option value="Price">Price ↑</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mcb-bottom">
        {tags.map(tag => (
          <button 
            key={tag}
            className={`quick-chip ${filters.quickTag === tag ? 'active' : ''}`}
            onClick={() => updateFilter('quickTag', filters.quickTag === tag ? null : tag)}
          >
            {tag === 'Top Gainers' ? '🔥' : tag === 'Top Losers' ? '📉' : tag === 'High Volume' ? '🚀' : '💥'} {tag}
          </button>
        ))}
      </div>
    </div>
  );
}

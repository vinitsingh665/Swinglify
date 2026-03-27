"use client";
import { useState } from 'react';

const INDEX_CATEGORIES = [
  {
    group: "Broad Market",
    items: [
      { id: 'nifty50', label: 'Nifty 50' },
      { id: 'niftynext50', label: 'Nifty Next 50' },
      { id: 'nifty100', label: 'Nifty 100' },
      { id: 'nifty200', label: 'Nifty 200' },
      { id: 'nifty500', label: 'Nifty 500' },
    ]
  },
  {
    group: "Size-Based",
    items: [
      { id: 'midcap50', label: 'Midcap 50' },
      { id: 'midcap100', label: 'Midcap 100' },
      { id: 'midcap150', label: 'Midcap 150' },
      { id: 'smallcap50', label: 'Smallcap 50' },
      { id: 'smallcap100', label: 'Smallcap 100' },
      { id: 'smallcap250', label: 'Smallcap 250' },
      { id: 'microcap250', label: 'Microcap 250' },
      { id: 'largemidcap250', label: 'LargeMidcap 250' },
      { id: 'midsmall400', label: 'MidSmall 400' },
    ]
  },
  {
    group: "Sectoral",
    items: [
      { id: 'banknifty', label: 'Bank Nifty' },
      { id: 'financial', label: 'Nifty Financial' },
      { id: 'niftyit', label: 'Nifty IT' },
      { id: 'pharma', label: 'Nifty Pharma' },
      { id: 'auto', label: 'Nifty Auto' },
      { id: 'fmcg', label: 'Nifty FMCG' },
      { id: 'metal', label: 'Nifty Metal' },
      { id: 'realty', label: 'Nifty Realty' },
      { id: 'energy', label: 'Nifty Energy' },
      { id: 'infra', label: 'Nifty Infra' },
      { id: 'healthcare', label: 'Healthcare' },
      { id: 'media', label: 'Nifty Media' },
      { id: 'consumer', label: 'Consumer' },
      { id: 'oilgas', label: 'Oil & Gas' },
    ]
  },
  {
    group: "Performance",
    items: [
      { id: 'gainers', label: 'Top Gainers' },
      { id: 'losers', label: 'Top Losers' },
      { id: 'mostactive', label: 'Most Active' },
    ]
  }
];

export default function FilterPanel({ filters, setFilters, onFindOpportunities, activeCount, sectors, selectedIndex, onSelectIndex }) {
  const [collapsed, setCollapsed] = useState({});

  const toggle = (section) => setCollapsed(p => ({ ...p, [section]: !p[section] }));

  const setPill = (key, val) => {
    setFilters(p => ({ ...p, [key]: p[key] === val ? null : val }));
  };

  const setField = (key, val) => {
    setFilters(p => ({ ...p, [key]: val }));
  };

  return (
    <div className="filter-panel">
      {/* Header */}
      <div className="fp-header">
        <div className="fp-title">
          Filters
          {activeCount > 0 && <span className="fp-count">{activeCount}</span>}
        </div>
        <button className="fp-clear" onClick={() => {
          onSelectIndex?.(null);
          setFilters({
            exchange: 'NSE', priceMin: '', priceMax: '', changeMin: '', volumeMin: '',
            rsiMode: null, emaMode: null, marketCap: null, sector: null, signal: null,
            sortBy: 'volume', sortOrder: 'desc'
          });
        }}>Clear All</button>
      </div>

      {/* Find Opportunities */}
      <button className="fp-opportunity" onClick={onFindOpportunities}>
        🔥 Find Opportunities
      </button>

      {/* ═══ Index Categories ═══ */}
      <div className="fp-section" style={{ marginTop: 16 }}>
        <div className="fps-header" onClick={() => toggle('indices')}>
          <span className="fps-label">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
            Indices
            {selectedIndex && <span className="fp-count">1</span>}
          </span>
          <svg className={`fps-chevron ${collapsed.indices ? 'collapsed' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
        </div>
        <div className={`fps-body ${collapsed.indices ? 'collapsed' : ''}`}>
          {INDEX_CATEGORIES.map((group) => (
            <div key={group.group} className="fp-index-group">
              <div className="fp-index-group-label">{group.group}</div>
              {group.items.map((item) => (
                <button
                  key={item.id}
                  className={`fp-index-item ${selectedIndex === item.id ? 'active' : ''}`}
                  onClick={() => onSelectIndex?.(selectedIndex === item.id ? null : item.id)}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="14" height="14">
                    <path d="M3 3h18v4H3zM3 10h18v4H3zM3 17h18v4H3z" />
                  </svg>
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Price & Volume */}
      <div className="fp-section">
        <div className="fps-header" onClick={() => toggle('price')}>
          <span className="fps-label">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>
            Price & Volume
          </span>
          <svg className={`fps-chevron ${collapsed.price ? 'collapsed' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
        </div>
        <div className={`fps-body ${collapsed.price ? 'collapsed' : ''}`}>
          <div className="fp-range">
            <input type="number" placeholder="Min ₹" value={filters.priceMin || ''} onChange={e => setField('priceMin', e.target.value)} />
            <span>—</span>
            <input type="number" placeholder="Max ₹" value={filters.priceMax || ''} onChange={e => setField('priceMax', e.target.value)} />
          </div>
          <input className="fp-input" type="number" placeholder="Min Volume (e.g. 500000)" value={filters.volumeMin || ''} onChange={e => setField('volumeMin', e.target.value)} />
          <input className="fp-input" type="number" placeholder="Min % Change (e.g. 2)" value={filters.changeMin || ''} onChange={e => setField('changeMin', e.target.value)} />
        </div>
      </div>

      {/* Technical Indicators */}
      <div className="fp-section">
        <div className="fps-header" onClick={() => toggle('tech')}>
          <span className="fps-label">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
            Technical Indicators
          </span>
          <svg className={`fps-chevron ${collapsed.tech ? 'collapsed' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
        </div>
        <div className={`fps-body ${collapsed.tech ? 'collapsed' : ''}`}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 600 }}>RSI</span>
          <div className="fp-pills">
            <button className={`fp-pill ${filters.rsiMode === 'oversold' ? 'active green' : ''}`} onClick={() => setPill('rsiMode', 'oversold')}>&lt;30 Oversold</button>
            <button className={`fp-pill ${filters.rsiMode === 'overbought' ? 'active red' : ''}`} onClick={() => setPill('rsiMode', 'overbought')}>&gt;70 Overbought</button>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 600, marginTop: 4 }}>Moving Average</span>
          <div className="fp-pills">
            <button className={`fp-pill ${filters.emaMode === 'above50' ? 'active' : ''}`} onClick={() => setPill('emaMode', 'above50')}>Price &gt; 50 EMA</button>
            <button className={`fp-pill ${filters.emaMode === 'golden' ? 'active' : ''}`} onClick={() => setPill('emaMode', 'golden')}>Golden Cross</button>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 600, marginTop: 4 }}>Signal</span>
          <div className="fp-pills">
            <button className={`fp-pill ${filters.signal === 'BUY' ? 'active green' : ''}`} onClick={() => setPill('signal', 'BUY')}>Buy</button>
            <button className={`fp-pill ${filters.signal === 'SELL' ? 'active red' : ''}`} onClick={() => setPill('signal', 'SELL')}>Sell</button>
          </div>
        </div>
      </div>

      {/* Fundamentals */}
      <div className="fp-section">
        <div className="fps-header" onClick={() => toggle('fund')}>
          <span className="fps-label">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 3v4M8 3v4" /></svg>
            Fundamentals
          </span>
          <svg className={`fps-chevron ${collapsed.fund ? 'collapsed' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
        </div>
        <div className={`fps-body ${collapsed.fund ? 'collapsed' : ''}`}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 600 }}>Market Cap</span>
          <div className="fp-pills">
            <button className={`fp-pill ${filters.marketCap === 'large' ? 'active' : ''}`} onClick={() => setPill('marketCap', 'large')}>Large</button>
            <button className={`fp-pill ${filters.marketCap === 'mid' ? 'active' : ''}`} onClick={() => setPill('marketCap', 'mid')}>Mid</button>
            <button className={`fp-pill ${filters.marketCap === 'small' ? 'active' : ''}`} onClick={() => setPill('marketCap', 'small')}>Small</button>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 600, marginTop: 4 }}>Sector</span>
          <select className="fp-select" value={filters.sector || ''} onChange={e => setField('sector', e.target.value || null)}>
            <option value="">All Sectors</option>
            {(sectors || []).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}

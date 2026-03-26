"use client";
import { useEffect } from 'react';

const CATEGORIES = [
  { value: 'All', label: 'All Exchanges' },
  { value: 'NSE', label: 'NSE' },
  { value: 'BSE', label: 'BSE' },
];

export default function SmartFiltersPanel({ filters, setFilters }) {
  const updateFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));

  const hasActiveFilters = filters.priceMin || filters.priceMax || filters.minVolume || filters.rsi !== 'All' || filters.signal !== 'All' || filters.exchange !== 'All';

  return (
    <div className="smart-filters-panel border-glass">
      <div className="sfp-header">
        <h3 className="sfp-title">Smart Filters</h3>
        {hasActiveFilters && (
          <button className="sfp-clear" onClick={() => setFilters({
            ...filters, priceMin: '', priceMax: '', minVolume: '', minChange: '', rsi: 'All', signal: 'All'
          })}>Clear</button>
        )}
      </div>
      
      <div className="sfp-section">
        <label>Signal Rating</label>
        <div className="sfp-pills">
          {['All', 'BUY', 'HOLD', 'SELL'].map(sig => (
            <button 
              key={sig} 
              className={`sfp-pill ${filters.signal === sig ? `active ${sig.toLowerCase()}` : ''}`}
              onClick={() => updateFilter('signal', sig)}
            >
              {sig}
            </button>
          ))}
        </div>
      </div>

      <div className="sfp-section">
        <label>Price Range (₹)</label>
        <div className="sfp-inputs">
          <input 
            type="number" 
            placeholder="Min" 
            value={filters.priceMin} 
            onChange={e => updateFilter('priceMin', e.target.value)} 
          />
          <span>-</span>
          <input 
            type="number" 
            placeholder="Max" 
            value={filters.priceMax} 
            onChange={e => updateFilter('priceMax', e.target.value)} 
          />
        </div>
      </div>

      <div className="sfp-section">
        <label>Minimum Volume</label>
        <input 
          type="number" 
          placeholder="e.g. 500k" 
          className="sfp-single-input"
          value={filters.minVolume} 
          onChange={e => updateFilter('minVolume', e.target.value)} 
        />
      </div>

      <div className="sfp-section">
        <label>RSI (Momentum)</label>
        <select 
          className="sfp-select"
          value={filters.rsi} 
          onChange={e => updateFilter('rsi', e.target.value)}
        >
          <option value="All">Any RSI</option>
          <option value="Oversold">Oversold (&lt; 30)</option>
          <option value="Overbought">Overbought (&gt; 70)</option>
        </select>
      </div>

    </div>
  );
}

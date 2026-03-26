"use client";
import { useState, useEffect, useRef } from 'react';

const COLORS = ['#f97316', '#06b6d4', '#a855f7', '#22c55e'];

export default function StockSelector({ symbols, onAdd, onRemove }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const wrapRef = useRef(null);

  useEffect(() => {
    const h = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setResults([]); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!query.trim()) { setResults([]); return; }
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.success) setResults(data.data.slice(0, 5));
      } catch (e) {}
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (s) => {
    let sym = s.symbol.split(':')[1] || s.symbol;
    sym = sym.split('-')[0];
    if (!symbols.includes(sym) && symbols.length < 4) {
      onAdd(sym);
    }
    setQuery('');
    setResults([]);
  };

  return (
    <div className="cmp-selector">
      <span className="cmp-sel-title">Compare</span>

      <div className="cmp-chips">
        {symbols.map((sym, i) => (
          <div key={sym} className="cmp-chip" style={{ background: `${COLORS[i]}15`, borderColor: `${COLORS[i]}40`, color: COLORS[i] }}>
            <span className="cmp-chip-dot" style={{ background: COLORS[i] }} />
            {sym}
            <button className="cmp-chip-remove" onClick={() => onRemove(sym)}>×</button>
          </div>
        ))}
      </div>

      {symbols.length < 4 && (
        <div className="cmp-add-wrap" ref={wrapRef}>
          <input
            className="cmp-add-input"
            placeholder="+ Add stock..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {results.length > 0 && (
            <div className="cmp-add-drop">
              {results.map(s => (
                <div key={s.symbol} className="cmp-add-item" onClick={() => handleSelect(s)}>
                  <div className="cmp-add-item-sym">{s.symbol.split(':')[1] || s.symbol}</div>
                  <div className="cmp-add-item-name">{s.description || s.name}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

"use client";
import { useState, useEffect, useRef } from 'react';
import { useSearch } from '../../../hooks/useStockData';

export default function CreateAlertPanel({ editingAlert, onSave, onCancel, resetKey }) {
  const [symbol, setSymbol] = useState('');
  const [comparison, setComparison] = useState('Above');
  const [value, setValue] = useState('');
  const [type, setType] = useState('price');

  const { results, search, clearResults } = useSearch();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Reset or populate form
  useEffect(() => {
    if (editingAlert) {
      setSymbol(editingAlert.symbol || '');
      setComparison(editingAlert.comparison || 'Above');
      setValue(editingAlert.value || '');
      setType(editingAlert.type || 'price');
    } else {
      setSymbol('');
      setComparison('Above');
      setValue('');
      setType('price');
    }
    setShowDropdown(false);
    clearResults();
  }, [editingAlert, resetKey]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSymbolChange = (e) => {
    const val = e.target.value.toUpperCase();
    setSymbol(val);
    if (val.length > 0) {
      search(val);
      setShowDropdown(true);
    } else {
      clearResults();
      setShowDropdown(false);
    }
  };

  const handleSelectSymbol = (s) => {
    setSymbol(s.symbol);
    if (!value && s.price) {
      const p = typeof s.price === 'string' ? s.price.replace(/,/g, '') : s.price;
      setValue(p.toString());
    }
    setShowDropdown(false);
    clearResults();
  };

  const handleSubmit = () => {
    if (!symbol || !value) return;
    onSave({
      ...(editingAlert?.id ? { id: editingAlert.id, createdAt: editingAlert.createdAt } : { createdAt: new Date().toISOString() }),
      symbol: symbol.toUpperCase(),
      comparison,
      value,
      type,
      triggered: false,
      expired: false,
    });
  };

  const handleDelete = () => {
    if (editingAlert?.id) {
      onSave({ id: editingAlert.id, delete: true });
    }
  };

  return (
    <div className="al-panel alp-form">
      <h2 className="alp-title">{editingAlert?.id ? 'Edit Alert' : 'Create Alert'}</h2>

      <div className="alp-section">
        <label className="alp-label">Stock Symbol</label>
        <div className="alp-search-wrap" ref={dropdownRef}>
          <input
            className="alp-input"
            placeholder="e.g. RELIANCE"
            value={symbol}
            onChange={handleSymbolChange}
            onFocus={() => { if (symbol) setShowDropdown(true); }}
            autoComplete="off"
          />
          {showDropdown && results.length > 0 && (
            <div className="alp-search-drop">
              {results.slice(0, 6).map(s => (
                <div key={s.symbol} className="alp-search-item" onClick={() => handleSelectSymbol(s)}>
                  <span style={{ fontWeight: 800 }}>{s.symbol}</span>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem', marginLeft: '6px' }}>{s.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="alp-section">
        <label className="alp-label">Alert Type</label>
        <div className="alp-pills">
          {['price', 'volume', 'rsi'].map(t => (
            <button key={t} className={`alp-pill ${type === t ? 'active' : ''}`} onClick={() => setType(t)}>
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="alp-section">
        <label className="alp-label">Condition</label>
        <div className="alp-pills">
          {['Above', 'Below', 'Crosses'].map(c => (
            <button key={c} className={`alp-pill ${comparison === c ? 'active' : ''}`} onClick={() => setComparison(c)}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="alp-section">
        <label className="alp-label">Value</label>
        <input
          className="alp-input"
          type="number"
          placeholder="e.g. 2500"
          value={value}
          onChange={e => setValue(e.target.value)}
        />
      </div>

      <div className="alp-actions">
        {editingAlert?.id && (
          <button className="alp-btn ghost" style={{ color: 'var(--red)', borderColor: 'transparent', background: 'var(--red-bg)' }} onClick={handleDelete}>
            🗑 Delete
          </button>
        )}
        <button className="alp-btn ghost" onClick={onCancel}>Cancel</button>
        <button className="alp-btn primary" onClick={handleSubmit}>
          {editingAlert?.id ? 'Update Alert' : 'Create Alert'}
        </button>
      </div>
    </div>
  );
}

"use client";
import { useState, useEffect, useRef } from 'react';
import { useSearch } from '../../../hooks/useStockData';

export default function AddStockModal({ onAdd, onClose, editingHolding, existingSymbols = [], onRequestEdit }) {
  const [symbol, setSymbol] = useState('');
  const [name, setName] = useState('');
  const [qty, setQty] = useState('');
  const [avgPrice, setAvgPrice] = useState('');
  const [logo, setLogo] = useState('');
  const [duplicateWarning, setDuplicateWarning] = useState(false);

  const { results, search, clearResults } = useSearch();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (editingHolding) {
      setSymbol(editingHolding.symbol || '');
      setName(editingHolding.name || '');
      setQty(editingHolding.qty?.toString() || '');
      setAvgPrice(editingHolding.avgPrice?.toString() || '');
      setLogo(editingHolding.logo || '');
    } else {
      setSymbol(''); setName(''); setQty(''); setAvgPrice(''); setLogo('');
    }
  }, [editingHolding]);

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
    setDuplicateWarning(false);
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
    setName(s.name);
    setDuplicateWarning(false);
    if (s.logo) setLogo(s.logo);
    if (!avgPrice && s.price) {
      const p = typeof s.price === 'string' ? s.price.replace(/,/g, '') : s.price;
      setAvgPrice(p.toString());
    }
    setShowDropdown(false);
    clearResults();
  };

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!symbol || !qty || !avgPrice) return;
    
    // Trigger duplicate prompt
    if (!editingHolding && existingSymbols.includes(symbol.toUpperCase()) && !duplicateWarning) {
      setDuplicateWarning(true);
      return;
    }

    onAdd({
      ...(editingHolding ? { id: editingHolding.id } : {}),
      symbol: symbol.toUpperCase(),
      name,
      logo,
      qty: parseFloat(qty),
      avgPrice: parseFloat(avgPrice),
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="add-modal" onClick={e => e.stopPropagation()}>
        <h2>{editingHolding ? 'Edit Holding' : 'Add Stock'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group" ref={dropdownRef}>
            <label>Symbol</label>
            <input 
              placeholder="e.g. RELIANCE" 
              value={symbol} 
              onChange={handleSymbolChange} 
              onFocus={() => { if (symbol) setShowDropdown(true); }}
              autoComplete="off"
            />
            {showDropdown && results.length > 0 && (
              <div className="search-results-dropdown">
                {results.slice(0, 6).map(s => (
                  <div key={s.symbol} className="sr-item" onClick={() => handleSelectSymbol(s)}>
                    <strong>{s.symbol}</strong>
                    <span>{s.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="form-group">
            <label>Company Name (optional)</label>
            <input placeholder="e.g. Reliance Industries" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Quantity</label>
              <input type="number" placeholder="10" value={qty} onChange={e => setQty(e.target.value)} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Avg Price (₹)</label>
              <input type="number" step="any" placeholder="2500" value={avgPrice} onChange={e => setAvgPrice(e.target.value)} />
            </div>
          </div>
          
          {duplicateWarning ? (
            <div className="duplicate-warning" style={{ background: 'var(--bg-card-inner)', padding: '16px', borderRadius: '8px', marginTop: '20px', border: `1px solid var(--accent)` }}>
              <p style={{ color: 'var(--text-primary)', fontSize: '0.85rem', marginBottom: '14px', lineHeight: '1.4' }}>
                You already hold <strong>{symbol.toUpperCase()}</strong>. Would you like to add a separate entry, or edit your existing holdings?
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => onRequestEdit(symbol.toUpperCase())} className="btn-cancel" style={{ flex: 1, borderColor: 'var(--accent)', color: 'var(--accent)' }}>Edit Existing</button>
                <button type="button" onClick={() => { setDuplicateWarning(false); onAdd({
                  ...(editingHolding ? { id: editingHolding.id } : {}),
                  symbol: symbol.toUpperCase(), name, logo, qty: parseFloat(qty), avgPrice: parseFloat(avgPrice)
                }); onClose(); }} className="btn-submit" style={{ flex: 1 }}>Add New Entry</button>
              </div>
            </div>
          ) : (
            <div className="modal-actions" style={{ marginTop: '24px' }}>
              <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn-submit">{editingHolding ? 'Update' : 'Add'}</button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

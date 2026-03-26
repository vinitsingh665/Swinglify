"use client";
import { useState } from 'react';
import { useSearch } from '../../../hooks/useStockData';

export default function AddStockModal({ onAdd, onClose, editingHolding = null }) {
  const { results, search, clearResults } = useSearch();
  const [symbol, setSymbol] = useState(editingHolding?.symbol || '');
  const [name, setName] = useState(editingHolding?.name || '');
  const [qty, setQty] = useState(editingHolding?.qty?.toString() || '');
  const [avgPrice, setAvgPrice] = useState(editingHolding?.avgPrice?.toString() || '');
  const [showResults, setShowResults] = useState(false);

  const handleSearchInput = (val) => {
    setSymbol(val);
    setName('');
    if (val.length >= 1) {
      search(val);
      setShowResults(true);
    } else {
      clearResults();
      setShowResults(false);
    }
  };

  const selectStock = (stock) => {
    setSymbol(stock.symbol || stock.name);
    setName(stock.name || stock.symbol);
    setShowResults(false);
    clearResults();
  };

  const handleSubmit = () => {
    if (!symbol || !qty || !avgPrice) return;
    onAdd({
      symbol: symbol.toUpperCase(),
      name: name || symbol,
      qty: parseInt(qty),
      avgPrice: parseFloat(avgPrice),
      ...(editingHolding ? { id: editingHolding.id } : {})
    });
    onClose();
  };

  const isValid = symbol && qty && parseFloat(qty) > 0 && avgPrice && parseFloat(avgPrice) > 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="add-modal" onClick={e => e.stopPropagation()}>
        <h2>{editingHolding ? 'Edit Holding' : 'Add Stock to Portfolio'}</h2>

        <div className="form-group">
          <label>Stock Symbol</label>
          <input
            type="text"
            placeholder="Search stocks... e.g. RELIANCE"
            value={symbol}
            onChange={e => handleSearchInput(e.target.value)}
            autoFocus
          />
          {showResults && results.length > 0 && (
            <div className="search-results-dropdown">
              {results.slice(0, 6).map((r, i) => (
                <div className="sr-item" key={i} onClick={() => selectStock(r)}>
                  <strong>{r.symbol || r.name}</strong>
                  <span>{r.name || r.description || ''}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Quantity</label>
          <input
            type="number"
            placeholder="e.g. 10"
            value={qty}
            onChange={e => setQty(e.target.value)}
            min="1"
          />
        </div>

        <div className="form-group">
          <label>Average Buy Price (₹)</label>
          <input
            type="number"
            placeholder="e.g. 2450.50"
            value={avgPrice}
            onChange={e => setAvgPrice(e.target.value)}
            min="0"
            step="0.01"
          />
        </div>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-submit" disabled={!isValid} onClick={handleSubmit}>
            {editingHolding ? 'Save Changes' : 'Add to Portfolio'}
          </button>
        </div>
      </div>
    </div>
  );
}

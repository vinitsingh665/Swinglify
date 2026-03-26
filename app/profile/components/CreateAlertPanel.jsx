"use client";
import { useState, useEffect, useRef } from 'react';

const CONDITIONS = ['Price', '% Change', 'Volume Spike', 'RSI'];

export default function CreateAlertPanel({ editingAlert, onSave, onCancel, resetKey }) {
  // Form State
  const [symbolData, setSymbolData] = useState(null); // { symbol, name, logo }
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  const [conditionType, setConditionType] = useState('Price');
  const [comparison, setComparison] = useState('Above');
  const [value, setValue] = useState('');
  
  const [notifyApp, setNotifyApp] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(false);
  const [repeat, setRepeat] = useState(false);

  // Search logic
  const searchRef = useRef(null);
  
  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchResults([]);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!searchQuery.trim() || symbolData) {
        setSearchResults([]);
        return;
      }
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        if (data.success) setSearchResults(data.data.slice(0, 5));
      } catch (e) {}
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, symbolData]);

  // Load editing data OR reset form when resetKey changes (new creation)
  useEffect(() => {
    if (editingAlert) {
      setSymbolData({ symbol: editingAlert.symbol, name: editingAlert.name, logo: editingAlert.logo });
      setConditionType(editingAlert.conditionType || 'Price');
      setComparison(editingAlert.comparison || 'Above');
      setValue(editingAlert.value || '');
      setNotifyApp(editingAlert.notifyApp !== false);
      setNotifyEmail(!!editingAlert.notifyEmail);
      setRepeat(!!editingAlert.repeat);
    } else {
      // Always fully reset when creating a new alert
      setSymbolData(null);
      setSearchQuery('');
      setSearchResults([]);
      setConditionType('Price');
      setComparison('Above');
      setValue('');
      setNotifyApp(true);
      setNotifyEmail(false);
      setRepeat(false);
    }
  }, [editingAlert, resetKey]);

  const handleSelectStock = (s) => {
    let sym = s.symbol.split(':')[1] || s.symbol;
    sym = sym.split('-')[0];
    setSymbolData({ symbol: sym, name: s.description || s.name, logo: s.logo || '' });
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleSave = () => {
    if (!symbolData || !value) return;
    
    // Auto-generate meaning framework contextual string
    let context = '';
    if (conditionType === 'Price') {
      context = `Price ${comparison} ₹${value} (Key Technical Level)`;
    } else if (conditionType === 'RSI') {
      context = `RSI ${comparison} ${value} (${value < 30 ? 'Oversold logic' : value > 70 ? 'Overbought logic' : 'Momentum logic'})`;
    } else if (conditionType === 'Volume Spike') {
      context = `Volume Spike > ${value}x Average`;
    } else {
      context = `${conditionType} ${comparison} ${value}`;
    }

    onSave({
      id: editingAlert?.id,
      ...symbolData,
      conditionType,
      comparison,
      value: Number(value),
      notifyApp,
      notifyEmail,
      repeat,
      context
    });
  };

  // No early return — always show the full form to avoid layout "pop"

  return (
    <div className="al-panel">
      <div className="alp-title">{editingAlert ? 'Edit Alert' : 'Create Alert'}</div>

      {/* 1. Stock Selector */}
      <div className="alp-section">
        <span className="alp-label">1. Stock Definition</span>
        {!symbolData ? (
          <div className="alp-search-wrap" ref={searchRef}>
            <input 
              className="alp-input" 
              placeholder="Search symbol..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchResults.length > 0 && (
              <div className="alp-search-drop">
                {searchResults.map(s => (
                  <div key={s.symbol} className="alp-search-item" onClick={() => handleSelectStock(s)}>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{s.symbol.split(':')[1] || s.symbol}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{s.description || s.name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="alp-stock-sel">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {symbolData.logo ? <img src={symbolData.logo} width="24" height="24" style={{ borderRadius: '50%', background: 'white' }} alt=""/> : <div style={{width: 24, height: 24, borderRadius: '50%', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px'}}>{symbolData.symbol[0]}</div>}
              <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{symbolData.symbol} <span style={{fontSize: 10, color: 'var(--text-dim)', border: '1px solid var(--border)', borderRadius: 4, padding: '2px 4px', marginLeft: 6}}>NSE</span></span>
            </div>
            <button className="alp-stock-clear" onClick={() => setSymbolData(null)} style={{ background: 'none', border: 'none' }}>Change</button>
          </div>
        )}
      </div>

      {/* 2. Condition Type */}
      <div className="alp-section">
        <span className="alp-label">2. Condition Type</span>
        <div className="alp-pills">
          {CONDITIONS.map(c => (
            <button 
              key={c} 
              className={`alp-pill ${conditionType === c ? 'active' : ''}`}
              onClick={() => setConditionType(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Condition Input */}
      <div className="alp-section">
        <span className="alp-label">3. Trigger When</span>
        <div className="alp-cond-row">
          <select className="alp-select" value={comparison} onChange={(e) => setComparison(e.target.value)}>
            <option>Above</option>
            <option>Below</option>
            {conditionType === 'Volume Spike' && <option>Greater Than</option>}
          </select>
          <div className="alp-counter">
            <button type="button" className="alp-counter-btn" onClick={() => {
              const step = conditionType === 'Price' ? 50 : conditionType === 'RSI' ? 5 : conditionType === 'Volume Spike' ? 0.5 : 1;
              setValue(v => String(Math.max(0, (Number(v) || 0) - step)));
            }}>−</button>
            <input 
              type="number" 
              className="alp-counter-input" 
              placeholder={conditionType === 'Price' ? 'e.g. 1500' : conditionType === 'RSI' ? 'e.g. 30 or 70' : 'Value'} 
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <button type="button" className="alp-counter-btn plus" onClick={() => {
              const step = conditionType === 'Price' ? 50 : conditionType === 'RSI' ? 5 : conditionType === 'Volume Spike' ? 0.5 : 1;
              setValue(v => String((Number(v) || 0) + step));
            }}>+</button>
          </div>
        </div>
      </div>

      {/* 4. Notification & Behavior */}
      <div className="alp-section">
        <span className="alp-label">4. Notification & Behavior</span>
        
        <div className="alp-switch-row" onClick={() => setNotifyApp(!notifyApp)}>
          <span className="alp-switch-label">In-App Notification</span>
          <div className={`alp-switch ${notifyApp ? 'on' : ''}`}>
            <div className="alp-switch-thumb" />
          </div>
        </div>

        <div className="alp-switch-row" onClick={() => setNotifyEmail(!notifyEmail)}>
          <span className="alp-switch-label">Email Alert</span>
          <div className={`alp-switch ${notifyEmail ? 'on' : ''}`}>
            <div className="alp-switch-thumb" />
          </div>
        </div>

        <div className="alp-switch-row" onClick={() => setRepeat(!repeat)}>
          <span className="alp-switch-label">Repeat Every Time Triggered</span>
          <div className={`alp-switch ${repeat ? 'on' : ''}`}>
            <div className="alp-switch-thumb" />
          </div>
        </div>

      </div>

      {/* 5. CTA */}
      <div className="alp-actions">
        {editingAlert && (
          <button className="alp-btn danger" onClick={() => onSave({ delete: true, id: editingAlert.id })}>
            Delete Alert
          </button>
        )}
        <button className="alp-btn ghost" onClick={onCancel}>Cancel</button>
        <button className="alp-btn primary" onClick={handleSave} disabled={!symbolData || !value}>
          {editingAlert ? 'Save Changes' : 'Create Alert'}
        </button>
      </div>

    </div>
  );
}

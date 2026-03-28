"use client";
import { useState, useEffect, useCallback } from 'react';

// Lighten a hex color by a percentage (0-100)
function lightenColor(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, (num >> 16) + Math.round(2.55 * percent));
  const g = Math.min(255, ((num >> 8) & 0x00FF) + Math.round(2.55 * percent));
  const b = Math.min(255, (num & 0x0000FF) + Math.round(2.55 * percent));
  return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
}

export default function PreferencesSection({ currentTheme }) {
  const [prefs, setPrefs] = useState({
    market: 'NSE',
    currency: 'INR',
    timeframe: '1D',
    theme: currentTheme || 'dark',
    accent: '#6366f1'
  });

  // Load initial state
  useEffect(() => {
    const savedTheme = localStorage.getItem('swinglify_theme') || localStorage.getItem('theme') || 'dark';
    const savedAccent = localStorage.getItem('swinglify_accent') || '#6366f1';
    const savedMarket = localStorage.getItem('swinglify_market') || 'NSE';
    const savedTimeframe = localStorage.getItem('swinglify_timeframe') || '1D';

    setPrefs({
      market: savedMarket,
      currency: 'INR',
      timeframe: savedTimeframe,
      theme: savedTheme,
      accent: savedAccent
    });

    // Apply accent on initial load
    document.documentElement.style.setProperty('--accent', savedAccent);
    document.documentElement.style.setProperty('--accent-hover', lightenColor(savedAccent, 25));
    document.documentElement.style.setProperty('--accent-bg', savedAccent + '1A');
  }, [currentTheme]);

  const updatePref = useCallback((key, value) => {
    setPrefs(p => ({ ...p, [key]: value }));
    
    // Persist and dispatch instantly
    if (key === 'theme') {
      localStorage.setItem('swinglify_theme', value);
      localStorage.setItem('theme', value); // for sidebar compatibility
    } else if (key === 'accent') {
      localStorage.setItem('swinglify_accent', value);
      document.documentElement.style.setProperty('--accent', value);
      document.documentElement.style.setProperty('--accent-hover', lightenColor(value, 25));
      document.documentElement.style.setProperty('--accent-bg', value + '1A'); // add 10% opacity for backgrounds
    } else if (key === 'market') {
      localStorage.setItem('swinglify_market', value);
    } else if (key === 'timeframe') {
      localStorage.setItem('swinglify_timeframe', value);
    }

    // Dispatch global event instantly
    window.dispatchEvent(new Event('swinglify_settings_update'));
  }, []);

  return (
    <div className="set-card">
      <h2 className="set-card-title">Preferences</h2>
      <div className="set-card-desc">Configure your default trading settings and appearance</div>
      
      <div className="set-row">
        <div className="set-row-info">
          <span className="set-row-label">Default Market</span>
          <span className="set-row-desc">Primary exchange for watchlists and screening</span>
        </div>
        <div className="set-pills">
          {['NSE', 'BSE'].map(m => (
            <button 
              key={m} 
              className={`set-pill ${prefs.market === m ? 'active' : ''}`}
              onClick={() => updatePref('market', m)}
            >{m}</button>
          ))}
        </div>
      </div>

      <div className="set-row">
        <div className="set-row-info">
          <span className="set-row-label">Currency</span>
        </div>
        <div style={{ fontWeight: 800, color: 'var(--text-secondary)' }}>₹ (INR)</div>
      </div>

      <div className="set-row">
        <div className="set-row-info">
          <span className="set-row-label">Default Chart Timeframe</span>
          <span className="set-row-desc">For mini-sparklines and previews</span>
        </div>
        <div className="set-pills">
          {['1D', '1W', '1M'].map(t => (
            <button 
              key={t} 
              className={`set-pill ${prefs.timeframe === t ? 'active' : ''}`}
              onClick={() => updatePref('timeframe', t)}
            >{t}</button>
          ))}
        </div>
      </div>

      <div className="set-row">
        <div className="set-row-info">
          <span className="set-row-label">Theme Mode</span>
          <span className="set-row-desc">Switch between Light and Dark interface</span>
        </div>
        <div className="set-pills">
          {['light', 'dark'].map(t => (
            <button 
              key={t} 
              className={`set-pill ${prefs.theme === t ? 'active' : ''}`}
              onClick={() => updatePref('theme', t)}
              style={{ textTransform: 'capitalize' }}
            >{t}</button>
          ))}
        </div>
      </div>

      <div className="set-row">
        <div className="set-row-info">
          <span className="set-row-label">Accent Color</span>
          <span className="set-row-desc">Personalize your dashboard branding</span>
        </div>
        <div className="set-swatches">
          {[
            { id: 'gold', val: '#d4af37' },
            { id: 'blue', val: '#3b82f6' },
            { id: 'indigo', val: '#6366f1' },
            { id: 'orange', val: '#f97316' },
            { id: 'green', val: '#22c55e' }
          ].map(color => (
            <div 
              key={color.id}
              onClick={() => updatePref('accent', color.val)}
              className={`set-swatch ${prefs.accent === color.val ? 'active' : ''}`}
              style={{ background: color.val }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

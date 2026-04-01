"use client";
import { useState, useEffect } from 'react';

const MARKETS = ['NSE', 'BSE'];
const TIMEFRAMES = ['1D', '1W', '1M', '3M', '1Y'];
const ACCENTS = [
  { name: 'Gold', color: '#d4af37' },
  { name: 'Orange', color: '#f97316' },
  { name: 'Cyan', color: '#06b6d4' },
  { name: 'Purple', color: '#a855f7' },
  { name: 'Green', color: '#22c55e' },
];

export default function PreferencesSection({ theme, setTheme }) {
  const [prefs, setPrefs] = useState({
    market: 'NSE',
    timeframe: '1M',
    accent: '#f97316',
  });
  const [glow, setGlow] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('swinglify_prefs');
    if (saved) setPrefs(JSON.parse(saved));
  }, []);

  const update = (key, val) => {
    const next = { ...prefs, [key]: val };
    setPrefs(next);
    localStorage.setItem('swinglify_prefs', JSON.stringify(next));
    // Instantly apply accent color globally via ThemeProvider
    window.dispatchEvent(new Event('swinglify_settings_update'));
    setGlow(key);
    setTimeout(() => setGlow(null), 500);
  };

  return (
    <div className="set-card">
      <div className="set-card-title">Preferences</div>
      <div className="set-card-desc">Changes apply instantly — no save needed.</div>

      {/* Default Market */}
      <div className={`set-row ${glow === 'market' ? 'set-glow' : ''}`}>
        <div className="set-row-info">
          <span className="set-row-label">Default Market</span>
          <span className="set-row-desc">Select your primary exchange</span>
        </div>
        <div className="set-pills">
          {MARKETS.map(m => (
            <button key={m} className={`set-pill ${prefs.market === m ? 'active' : ''}`} onClick={() => update('market', m)}>{m}</button>
          ))}
        </div>
      </div>

      {/* Chart Timeframe */}
      <div className={`set-row ${glow === 'timeframe' ? 'set-glow' : ''}`}>
        <div className="set-row-info">
          <span className="set-row-label">Default Chart Timeframe</span>
          <span className="set-row-desc">Applies to all chart views</span>
        </div>
        <div className="set-pills">
          {TIMEFRAMES.map(t => (
            <button key={t} className={`set-pill ${prefs.timeframe === t ? 'active' : ''}`} onClick={() => update('timeframe', t)}>{t}</button>
          ))}
        </div>
      </div>

      {/* === THEME — HIDDEN (uncomment to re-enable) ===
      <div className="set-row">
        <div className="set-row-info">
          <span className="set-row-label">Theme</span>
          <span className="set-row-desc">Switch between dark and light mode</span>
        </div>
        <div className="set-pills">
          <button className={`set-pill ${theme === 'dark' ? 'active' : ''}`} onClick={() => setTheme('dark')}>🌙 Dark</button>
          <button className={`set-pill ${theme === 'light' ? 'active' : ''}`} onClick={() => setTheme('light')}>☀️ Light</button>
        </div>
      </div>
      === END THEME === */}

      {/* Accent Color */}
      <div className={`set-row ${glow === 'accent' ? 'set-glow' : ''}`}>
        <div className="set-row-info">
          <span className="set-row-label">Accent Color</span>
          <span className="set-row-desc">Personalize your interface highlights</span>
        </div>
        <div className="set-swatches">
          {ACCENTS.map(a => (
            <button key={a.color} className={`set-swatch ${prefs.accent === a.color ? 'active' : ''}`}
              style={{ background: a.color }} title={a.name}
              onClick={() => update('accent', a.color)} />
          ))}
        </div>
      </div>
    </div>
  );
}

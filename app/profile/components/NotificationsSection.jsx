"use client";
import { useState, useEffect } from 'react';

const NOTIFICATION_KEYS = [
  { key: 'priceAlerts', label: 'Price Alerts', desc: 'Get notified when stocks hit target prices' },
  { key: 'watchlistAlerts', label: 'Watchlist Alerts', desc: 'Alerts for stocks in your watchlist' },
  { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive updates via email' },
  { key: 'rsiAlerts', label: 'RSI Alerts', desc: 'Notify when RSI crosses thresholds (advanced)' },
  { key: 'breakoutAlerts', label: 'Breakout Alerts', desc: 'Volume breakout and trend signals (advanced)' },
];

export default function NotificationsSection() {
  const [notifs, setNotifs] = useState({
    priceAlerts: true,
    watchlistAlerts: true,
    emailNotifications: false,
    rsiAlerts: false,
    breakoutAlerts: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem('swinglify_notifs');
    if (saved) setNotifs(JSON.parse(saved));
  }, []);

  const toggle = (key) => {
    const next = { ...notifs, [key]: !notifs[key] };
    setNotifs(next);
    localStorage.setItem('swinglify_notifs', JSON.stringify(next));
  };

  return (
    <div className="set-card">
      <div className="set-card-title">Notifications</div>
      <div className="set-card-desc">Control what updates you receive.</div>

      {NOTIFICATION_KEYS.map(n => (
        <div key={n.key} className="set-row">
          <div className="set-row-info">
            <span className="set-row-label">{n.label}</span>
            <span className="set-row-desc">{n.desc}</span>
          </div>
          <button className={`set-toggle ${notifs[n.key] ? 'on' : ''}`} onClick={() => toggle(n.key)} />
        </div>
      ))}
    </div>
  );
}

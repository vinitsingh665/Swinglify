"use client";
import { useState, useEffect } from 'react';

export default function NotificationsSection() {
  const [notifs, setNotifs] = useState({
    price: true,
    watchlist: true,
    email: false
  });

  useEffect(() => {
    const saved = localStorage.getItem('swinglify_notifs');
    if (saved) setNotifs(JSON.parse(saved));
  }, []);

  const toggle = (key) => {
    setNotifs(n => {
      const next = { ...n, [key]: !n[key] };
      localStorage.setItem('swinglify_notifs', JSON.stringify(next));
      return next;
    });
  };

  return (
    <div className="set-card">
      <h2 className="set-card-title">Alerts & Notifications</h2>
      <div className="set-card-desc">Control how and when you receive market updates</div>
      
      <div className="set-row">
        <div className="set-row-info">
          <span className="set-row-label">Price Alerts</span>
          <span className="set-row-desc">In-app notifications when targets are hit</span>
        </div>
        <button 
          className={`set-toggle ${notifs.price ? 'on' : ''}`} 
          onClick={() => toggle('price')}
        />
      </div>

      <div className="set-row">
        <div className="set-row-info">
          <span className="set-row-label">Watchlist Triggers</span>
          <span className="set-row-desc">Alerts for unusual volume or rapid moves</span>
        </div>
        <button 
          className={`set-toggle ${notifs.watchlist ? 'on' : ''}`} 
          onClick={() => toggle('watchlist')}
        />
      </div>

      <div className="set-row">
        <div className="set-row-info">
          <span className="set-row-label">Email Notifications</span>
          <span className="set-row-desc">Daily summaries sent to your inbox</span>
        </div>
        <button 
          className={`set-toggle ${notifs.email ? 'on' : ''}`} 
          onClick={() => toggle('email')}
        />
      </div>
    </div>
  );
}

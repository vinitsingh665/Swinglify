"use client";

import { useRef, useEffect } from 'react';

function BentoCard({ className, icon, title, description, badge }) {
  const cardRef = useRef(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      el.style.setProperty('--mouse-x', `${x}px`);
      el.style.setProperty('--mouse-y', `${y}px`);
    };

    el.addEventListener('mousemove', handleMouseMove);
    return () => el.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div ref={cardRef} className={`bento-card ${className || ''}`}>
      {badge && (
        <span style={{
          position: 'absolute', top: 24, right: 24,
          background: 'var(--accent-bg)', color: 'var(--accent)',
          padding: '4px 12px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 600
        }}>
          {badge}
        </span>
      )}
      
      <div className="bento-icon">
        {icon}
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export default function BentoFeatures() {
  return (
    <section id="features" className="landing-features">
      <h2 className="section-title">Everything you need.<br/>Nothing you don't.</h2>
      
      <div className="bento-grid">
        <BentoCard 
          className="bento-wide"
          badge="Live Market"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>}
          title="Advanced Stock Screener"
          description="Filter NSE & BSE stocks in real-time. Combine 40+ technical indicators including RSI, MACD crossovers, Bollinger Bands, and Volume Breakouts to find the perfect swing setup instantly without writing a single line of code."
        />
        
        <BentoCard 
          className="bento-tall"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>}
          title="Instant Alerts"
          description="Never miss a breakout. Set conditional price, volume, and indicator alerts straight to your email."
        />

        <BentoCard 
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>}
          title="Portfolio Sync"
          description="Track your active holdings, monitor daily P&L, and visualize multi-sector asset allocation effortlessly."
        />
        
        <BentoCard 
          badge="Social"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>}
          title="Thriving Trading Community"
          description="Join thousands of Indian swing traders. Share technical chart setups, discuss high-probability momentum bursts, and follow top analysts dominating the NIFTY and BankNIFTY markets."
        />
      </div>
    </section>
  );
}

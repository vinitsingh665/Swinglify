"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function Hero3D() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <section className="landing-hero">
      <div className="hero-pill">
        <span>✨</span> The #1 Swing Trading Platform for India
      </div>
      
      <h1 className="hero-title">
        Command the Market.<br/>Simplified.
      </h1>
      
      <p className="hero-subtitle">
        Swinglify is an elite, free-to-use swing trading platform for NSE & BSE stocks.
        Track your portfolio, screen with 40+ technical indicators, and get real-time price alerts — all wrapped in a beautifully engineered dashboard.
      </p>

      <div className="hero-cta-group">
        <Link href="/dashboard" className="btn-primary">
          Launch App Free
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </Link>
        <a href="#features" className="btn-secondary">
          Explore Features
        </a>
      </div>

      <div className="hero-mockup-wrapper">
        <div className="hero-mockup">
          <div className="mockup-header">
            <div className="mockup-dot"></div>
            <div className="mockup-dot"></div>
            <div className="mockup-dot"></div>
          </div>
          <div className="mockup-body">
            <div className="mockup-sidebar">
              
              <div 
                className={`mockup-sidebar-item ${activeTab === 'dashboard' ? 'active' : ''}`} 
                onClick={() => setActiveTab('dashboard')}
                title="Dashboard"
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: activeTab === 'dashboard' ? 'var(--accent-bg)' : 'rgba(255,255,255,0.03)', color: activeTab === 'dashboard' ? 'var(--accent)' : 'rgba(255,255,255,0.4)', transition: 'all 0.2s' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="14" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect>
                </svg>
              </div>

              <div 
                className={`mockup-sidebar-item ${activeTab === 'screener' ? 'active' : ''}`} 
                onClick={() => setActiveTab('screener')}
                title="Screener"
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: activeTab === 'screener' ? 'var(--accent-bg)' : 'rgba(255,255,255,0.03)', color: activeTab === 'screener' ? 'var(--accent)' : 'rgba(255,255,255,0.4)', transition: 'all 0.2s' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
              </div>

              <div 
                className={`mockup-sidebar-item ${activeTab === 'alerts' ? 'active' : ''}`} 
                onClick={() => setActiveTab('alerts')}
                title="Alerts"
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: activeTab === 'alerts' ? 'var(--accent-bg)' : 'rgba(255,255,255,0.03)', color: activeTab === 'alerts' ? 'var(--accent)' : 'rgba(255,255,255,0.4)', transition: 'all 0.2s' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                   <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
              </div>
              
              <div 
                className={`mockup-sidebar-item ${activeTab === 'portfolio' ? 'active' : ''}`} 
                onClick={() => setActiveTab('portfolio')}
                title="Portfolio"
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: activeTab === 'portfolio' ? 'var(--accent-bg)' : 'rgba(255,255,255,0.03)', color: activeTab === 'portfolio' ? 'var(--accent)' : 'rgba(255,255,255,0.4)', transition: 'all 0.2s' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                   <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </div>

            </div>
            
            <div className="mockup-main">
              {activeTab === 'dashboard' && (
                <>
                  <div className="mockup-card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', margin: 0 }}>Market Dashboard</h3>
                    <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', margin: 0 }}>Get a birds-eye view of the Indian markets. Track NIFTY, BankNIFTY, and top movers at a glance.</p>
                  </div>
                  <div className="mockup-grid">
                    <div className="mockup-card" style={{ flex: 2, padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Top Movers</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ color: '#fff', fontWeight: 500 }}>RELIANCE</span><span style={{ color: '#4ade80' }}>+2.45%</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ color: '#fff', fontWeight: 500 }}>HDFCBANK</span><span style={{ color: '#4ade80' }}>+1.80%</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                        <span style={{ color: '#fff', fontWeight: 500 }}>TCS</span><span style={{ color: '#f87171' }}>-0.72%</span>
                      </div>
                    </div>
                    
                    <div className="mockup-card" style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>NIFTY 50</div>
                      <div style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 800 }}>22,419</div>
                      <div style={{ color: '#4ade80', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span>▲</span> +0.54%
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'screener' && (
                <div className="mockup-card" style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', margin: '0 0 4px 0' }}>Advanced Screener</h3>
                    <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', margin: 0 }}>Filter 2000+ NSE/BSE stocks instantly using technicals like RSI, MACD, and Bollinger Bands.</p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#c7d2fe', fontSize: '0.75rem', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <span>SYMBOL</span><span>PRICE</span><span>RSI</span><span>MACD</span>
                  </div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ color: '#fff', fontWeight: 500 }}>ZOMATO</span><span>₹180.50</span><span style={{ color: '#eab308' }}>68</span><span style={{ color: '#4ade80' }}>Buy</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ color: '#fff', fontWeight: 500 }}>TRENT</span><span>₹3,950</span><span style={{ color: '#f87171' }}>82</span><span style={{ color: '#4ade80' }}>Buy</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', padding: '8px 0' }}>
                    <span style={{ color: '#fff', fontWeight: 500 }}>RVNL</span><span>₹240.10</span><span style={{ color: '#4ade80' }}>55</span><span style={{ color: '#4ade80' }}>Buy</span>
                  </div>
                </div>
              )}

              {activeTab === 'alerts' && (
                <div className="mockup-card" style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', margin: '0 0 4px 0' }}>Real-time Alerts</h3>
                    <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', margin: 0 }}>Never miss a breakout. Set conditional alerts for price thresholds and indicator crossovers.</p>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '12px', background: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #ef4444' }}>
                     <div style={{ fontSize: '0.9rem', color: '#fff' }}>
                       <strong>HDFCBANK</strong> dropped below your target of ₹1,450.
                     </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', background: 'rgba(34, 197, 94, 0.1)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #22c55e' }}>
                     <div style={{ fontSize: '0.9rem', color: '#fff' }}>
                       <strong>TATAMOTORS</strong> RSI crossed above 60. Bullish momentum.
                     </div>
                  </div>
                </div>
              )}

              {activeTab === 'portfolio' && (
                <div className="mockup-card" style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', margin: '0 0 4px 0' }}>Portfolio Analytics</h3>
                    <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', margin: 0 }}>Track your daily P&L and monitor cross-sector asset allocation securely.</p>
                  </div>
                  <div className="mockup-grid" style={{ gap: '40px', flex: 1 }}>
                    {/* Fake Pie Chart */}
                    <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'conic-gradient(var(--accent) 0% 45%, #ec4899 45% 75%, #14b8a6 75% 100%)', boxShadow: '0 0 20px rgba(0,0,0,0.5)' }}></div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                        <div style={{ width: '12px', height: '12px', background: 'var(--accent)', borderRadius: '2px' }}></div>
                        <span style={{ color: '#fff' }}>Financials (45%)</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                        <div style={{ width: '12px', height: '12px', background: '#ec4899', borderRadius: '2px' }}></div>
                        <span style={{ color: '#fff' }}>IT Services (30%)</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                        <div style={{ width: '12px', height: '12px', background: '#14b8a6', borderRadius: '2px' }}></div>
                        <span style={{ color: '#fff' }}>Energy (25%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

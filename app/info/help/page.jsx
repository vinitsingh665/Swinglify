"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../../components/Sidebar';
import TopBar from '../../../components/TopBar';
import '../info.css';

const faqs = [
  {
    category: "Getting Started",
    questions: [
      { q: "What is Swinglify?", a: "Swinglify is a premium technical analysis and swing trading platform designed specifically for the Indian Stock Market (NSE & BSE). It provides live data, screeners, and automated signal detection." },
      { q: "Is Swinglify free?", a: "Currently, yes! We are in early access, and all core features—including the live screener, alerts, and portfolio tracking—are completely free." },
      { q: "How do I add stocks to my Watchlist?", a: "Navigate to the Markets or Screener page. You'll see a star (★) icon next to every stock ticker. Click it to add or remove the stock from your personal Watchlist." }
    ]
  },
  {
    category: "Market Data & Analysis",
    questions: [
      { q: "How real-time is the market data?", a: "Our dashboard processes live ticks during NSE/BSE market hours (9:15 AM to 3:30 PM IST). There may be a standard exchange delay of a few seconds depending on the data provider." },
      { q: "What technical indicators are available?", a: "Our screener supports RSI (Relative Strength Index), MACD, Bollinger Bands, EMA Crossovers, and Volume Breakout detection. We are constantly adding new indicators based on community feedback." },
      { q: "How do Buy/Sell signals work?", a: "Signals are generated using algorithmic composites of multiple momentum and trend indicators. They highlight potential swing setups but should not be taken as direct financial advice." }
    ]
  },
  {
    category: "Alerts & Notifications",
    questions: [
      { q: "Can I get alerts on my phone?", a: "Yes. By configuring alerts on the Alerts page, you can receive email notifications when a stock crosses a specific price, volume threshold, or RSI level." },
      { q: "How many active alerts can I have?", a: "Free tier users can maintain up to 20 active alerts simultaneously." }
    ]
  }
];

export default function HelpCenterPage() {
  const router = useRouter();
  const [theme, setThemeState] = useState('dark');
  const [openIndex, setOpenIndex] = useState(`0-0`); // "categoryIndex-questionIndex"
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved) setThemeState(saved);
  }, []);

  const setTheme = (t) => { setThemeState(t); localStorage.setItem('theme', t); };
  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); }, [theme]);

  const toggleAccordion = (id) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
      q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="app-layout" data-theme={theme}>
      <Sidebar theme={theme} setTheme={setTheme} />
      <div className="main-area">
        <TopBar />
        <div className="info-page">
          <button className="info-back" onClick={() => router.push('/settings?tab=about')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back to Settings
          </button>
          
          <h1 className="info-title">Help Center 📖</h1>
          <p className="info-subtitle">Find answers, tutorials, and guides to master Swinglify.</p>

          <div className="info-search-bar" style={{ marginBottom: '2rem' }}>
            <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', width: 20, height: 20, color: 'var(--text-secondary)' }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input 
                type="text" 
                placeholder="Search for answers (e.g. 'Alerts', 'Screener', 'RSI')..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '16px 20px 16px 48px',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--surface-color)',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                }}
              />
            </div>
          </div>

          <div className="info-card">
            {filteredFaqs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
                <h3>No results found for "{searchQuery}"</h3>
                <p>Try different keywords or contact support.</p>
                <button 
                  className="info-submit-btn" 
                  onClick={() => router.push('/info/contact')}
                  style={{ width: 'auto', padding: '10px 24px', marginTop: 20 }}
                >
                  Contact Support
                </button>
              </div>
            ) : (
              filteredFaqs.map((category, catIdx) => (
                <div key={catIdx} style={{ marginBottom: catIdx !== filteredFaqs.length - 1 ? 32 : 0 }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--primary)', marginBottom: 16, borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
                    {category.category}
                  </h2>
                  <div className="faq-list">
                    {category.questions.map((faq, qIdx) => {
                      const id = `${catIdx}-${qIdx}`;
                      const isOpen = openIndex === id;
                      return (
                        <div key={qIdx} style={{ 
                          border: '1px solid var(--border)', 
                          borderRadius: 8, 
                          marginBottom: 12,
                          overflow: 'hidden',
                          backgroundColor: isOpen ? 'var(--surface-hover)' : 'transparent',
                          transition: 'background-color 0.2s ease'
                        }}>
                          <button 
                            onClick={() => toggleAccordion(id)}
                            style={{ 
                              width: '100%', 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center',
                              padding: '16px 20px',
                              background: 'none',
                              border: 'none',
                              color: 'var(--text-primary)',
                              fontSize: '1rem',
                              fontWeight: 500,
                              cursor: 'pointer',
                              textAlign: 'left'
                            }}
                          >
                            <span>{faq.q}</span>
                            <svg 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="2" 
                              style={{ 
                                width: 20, 
                                height: 20, 
                                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.3s ease',
                                color: 'var(--text-secondary)'
                              }}
                            >
                              <polyline points="6 9 12 15 18 9"/>
                            </svg>
                          </button>
                          <div style={{
                            maxHeight: isOpen ? '500px' : '0px',
                            opacity: isOpen ? 1 : 0,
                            overflow: 'hidden',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            padding: isOpen ? '0 20px 20px 20px' : '0 20px',
                            color: 'var(--text-secondary)',
                            lineHeight: 1.6
                          }}>
                            {faq.a}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
            
            <div style={{ marginTop: 40, paddingTop: 30, borderTop: '1px solid var(--border)', textAlign: 'center' }}>
              <h3 style={{ marginBottom: 10, color: 'var(--text-primary)' }}>Still Need Help?</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>If you couldn't find the answer to your question, our support team is ready to help.</p>
              <button 
                className="info-submit-btn" 
                onClick={() => router.push('/info/contact')}
                style={{ width: 'auto', padding: '12px 32px' }}
              >
                Reach Out to Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

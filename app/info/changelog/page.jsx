"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../../components/Sidebar';
import TopBar from '../../../components/TopBar';
import '../info.css';

const CHANGELOG = [
  {
    version: '1.0.0',
    date: 'March 25, 2026',
    title: 'Public Beta Launch 🚀',
    items: [
      { type: 'new', text: 'Full-featured Dashboard with portfolio overview & market indices' },
      { type: 'new', text: 'Markets page with real-time stock data, sorting, and filtering' },
      { type: 'new', text: 'Advanced Screener with technical indicator filters and inline insights' },
      { type: 'new', text: 'Portfolio tracker with holdings management and allocation charts' },
      { type: 'new', text: 'Price Alerts system with customizable conditions' },
      { type: 'new', text: 'Stock comparison tool with side-by-side analytics' },
      { type: 'new', text: 'Settings panel with theme customization and preferences' },
      { type: 'new', text: 'Mobile-first responsive design with bottom navigation' },
    ],
  },
  {
    version: '0.9.0',
    date: 'March 18, 2026',
    title: 'Pre-release — Core Features',
    items: [
      { type: 'new', text: 'Implemented Midnight Quantum design system with glassmorphism' },
      { type: 'new', text: 'Real-time market data integration via NSE/BSE APIs' },
      { type: 'new', text: 'Technical indicators: RSI, MACD, Bollinger Bands, Volume analysis' },
      { type: 'improve', text: 'Optimized API response caching for faster load times' },
      { type: 'fix', text: 'Fixed chart rendering issues on Safari browsers' },
    ],
  },
  {
    version: '0.8.0',
    date: 'March 10, 2026',
    title: 'Analytics & Comparison',
    items: [
      { type: 'new', text: 'Stock detail page with comprehensive analytics' },
      { type: 'new', text: 'Compare tool for side-by-side stock analysis' },
      { type: 'new', text: 'Sector heatmap visualization for market overview' },
      { type: 'improve', text: 'Enhanced table sorting with multi-column support' },
      { type: 'fix', text: 'Resolved portfolio calculation rounding errors' },
    ],
  },
  {
    version: '0.7.0',
    date: 'March 1, 2026',
    title: 'Foundation & Architecture',
    items: [
      { type: 'new', text: 'Next.js 16 project setup with Turbopack' },
      { type: 'new', text: 'Design system tokens and CSS custom properties' },
      { type: 'new', text: 'Sidebar navigation with icon-based layout' },
      { type: 'new', text: 'Light/Dark theme toggle with instant switching' },
      { type: 'improve', text: 'SEO meta tags and semantic HTML structure' },
    ],
  },
];

export default function ChangelogPage() {
  const router = useRouter();
  const [theme, setThemeState] = useState('dark');

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved) setThemeState(saved);
  }, []);

  const setTheme = (t) => { setThemeState(t); localStorage.setItem('theme', t); };
  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); }, [theme]);

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

          <h1 className="info-title">Changelog</h1>
          <p className="info-subtitle">Track every update, feature, and fix we ship.</p>

          <div className="changelog-timeline">
            {CHANGELOG.map(entry => (
              <div key={entry.version} className="changelog-entry">
                <div className="changelog-version">
                  <span className="changelog-version-tag">v{entry.version}</span>
                  <span className="changelog-date">{entry.date}</span>
                </div>
                <div className="changelog-title">{entry.title}</div>
                <ul className="changelog-list">
                  {entry.items.map((item, i) => (
                    <li key={i}>
                      <span className={`changelog-badge ${item.type}`}>
                        {item.type === 'new' ? 'NEW' : item.type === 'fix' ? 'FIX' : 'IMPROVED'}
                      </span>
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

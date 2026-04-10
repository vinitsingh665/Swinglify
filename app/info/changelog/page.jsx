"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../../components/Sidebar';
import TopBar from '../../../components/TopBar';
import '../info.css';

const CHANGELOG = [
  {
    version: '1.3.0',
    date: 'April 10, 2026',
    title: 'SEO & Performance Overhaul ⚡',
    items: [
      { type: 'new', text: 'Dynamic stock pages with Server-Side Rendering (SSR) for over 3,000 NSE/BSE stocks' },
      { type: 'new', text: 'Auto-generating XML sitemap to ensure all 2,000+ stock pages are indexed by Google' },
      { type: 'improve', text: 'Screener page converted to Hybrid SSR architecture, ensuring search engines can read the initial stock table' },
      { type: 'improve', text: 'Major image compression: optimized logos and OG images to reduce load times by over 90%' },
      { type: 'fix', text: 'Resolved chart layout shift: Stock charts no longer jump when hovering over tooltips' },
      { type: 'fix', text: 'Screener default state updated to clear all filters automatically on first visit' }
    ],
  },
  {
    version: '1.2.0',
    date: 'March 28, 2026',
    title: 'Live Charts, Notifications & AI Preview ✨',
    items: [
      { type: 'new', text: 'Live Market Overview chart powered by real market data with 30-second auto-refresh' },
      { type: 'new', text: 'Interactive Notification bell with dropdown showing recent alerts, pulse indicator for new alerts' },
      { type: 'new', text: 'Quick Lookup now connects to Market Overview — search any stock to see its live chart instantly' },
      { type: 'new', text: 'Period selector (1D / 1W / 1Y / Max) on chart with time-appropriate axis labels' },
      { type: 'new', text: 'Chart supports NIFTY 50, Bank NIFTY, MidCap 100, SmallCap 100 indices and individual stocks' },
      { type: 'new', text: 'Green/Red chart line dynamically reflects whether the stock/index is up or down' },
      { type: 'new', text: 'SwinglifyAI — intelligent chatbot assistant for market queries, stock analysis, and trading guidance' },
      { type: 'new', text: 'AI Insight on Screener — get AI-powered analysis for any stock directly from the screener results' },
      { type: 'wip', text: 'AI Predicted chart overlay — coming soon! Will show AI-powered market forecasts' },
    ],
  },
  {
    version: '1.1.0',
    date: 'March 27, 2026',
    title: 'Community Trading Hub 🧠',
    items: [
      { type: 'new', text: 'Community redesigned into a 3-panel Trading Insights Hub with structured insight cards' },
      { type: 'new', text: 'Left panel with Strategy Tags, Timeframe, Sentiment, and Watchlist filters' },
      { type: 'new', text: 'Right panel with Most Discussed Stocks, Strong Signals, Market Sentiment Gauge, and Top Analysts' },
      { type: 'new', text: 'Structured post creation requiring stock ticker, strategy tag, timeframe, sentiment, and confidence' },
      { type: 'new', text: 'Nested threaded comment replies with inline reply forms' },
      { type: 'new', text: 'Watchlist filter connects your saved stocks to community posts' },
      { type: 'improve', text: 'Post detail page redesigned with insight card styling and live indicator' },
      { type: 'improve', text: 'Enhanced Create Insight placeholder with larger, more inviting layout' },
      { type: 'fix', text: 'Mobile filter/insights drawers can now be closed by tapping outside' },
      { type: 'fix', text: 'Fixed critical syntax error in community posts API route' },
      { type: 'fix', text: 'Resolved MongoDB connection issues with IP whitelist guidance' },
    ],
  },
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
                        {item.type === 'new' ? 'NEW' : item.type === 'fix' ? 'FIX' : item.type === 'wip' ? 'WIP' : 'IMPROVED'}
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

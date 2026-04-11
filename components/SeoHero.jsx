import Link from 'next/link';
import './seo-hero.css';

/**
 * Server-rendered SEO hero section.
 * This is a Next.js Server Component (no "use client") — its HTML
 * is fully visible to Googlebot without JavaScript execution.
 * 
 * Contains keyword-rich, crawlable text about Swinglify's features.
 */
export default function SeoHero() {
  return (
    <section className="seo-hero" id="seo-hero">
      <div className="seo-hero-inner">

        <h1>Free Swing Trading Screener for NSE &amp; BSE Stocks</h1>

        <p className="seo-hero-subtitle">
          Swinglify is a free swing trading platform for Indian stocks. Screen stocks with
          RSI, MACD, Bollinger Bands, and 40+ technical indicators. Track your portfolio, 
          set real-time price alerts, and discover the best swing trading opportunities on 
          NSE &amp; BSE — all in one place.
        </p>

        <div className="seo-features-grid">
          <Link href="/screener" className="seo-feature-card">
            <span className="seo-feature-icon">📊</span>
            <h2>Stock Screener</h2>
            <p>Filter NSE &amp; BSE stocks by RSI, MACD, volume breakout, EMA crossovers, and market cap with real-time data.</p>
          </Link>

          <Link href="/markets" className="seo-feature-card">
            <span className="seo-feature-icon">📈</span>
            <h2>Live Market Data</h2>
            <p>Real-time stock prices, buy/sell signals, mini charts, and sector heatmaps for Nifty 50, 200, and all listed stocks.</p>
          </Link>

          <Link href="/portfolio" className="seo-feature-card">
            <span className="seo-feature-icon">💼</span>
            <h2>Portfolio Tracker</h2>
            <p>Track your holdings with live P&amp;L, daily gains, allocation charts, and unrealized profit analytics.</p>
          </Link>

          <Link href="/community" className="seo-feature-card">
            <span className="seo-feature-icon">💬</span>
            <h2>Trading Community</h2>
            <p>Share trading insights, discuss strategies, follow trending stocks, and see what other traders are watching.</p>
          </Link>
        </div>

        <div className="seo-cta-row">
          <Link href="/screener" className="seo-cta-primary">
            Open Stock Screener →
          </Link>
          <Link href="/markets" className="seo-cta-secondary">
            View Live Markets
          </Link>
        </div>

        <div className="seo-hero-bottom">
          Swinglify provides free stock screening tools, portfolio management, and community-driven trading insights 
          for the Indian stock market. Track Nifty 50, Nifty 200, Nifty 500—all NSE and BSE listed stocks 
          with technical analysis indicators including RSI, MACD, Bollinger Bands, EMA 20/50/200, Stochastic, 
          ADX, and volume analysis. Compare stocks side-by-side, set price alerts, and manage your watchlist — 
          completely free with no login required.
        </div>

      </div>
    </section>
  );
}

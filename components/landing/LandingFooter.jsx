import Link from 'next/link';

export default function LandingFooter() {
  return (
    <footer className="landing-footer">
      <div className="footer-glow"></div>
      
      <h2 className="footer-main-title">Stop Guessing. Start Swinging.</h2>
      <p className="footer-subtitle">
        Join forward-thinking Indian stock traders building their edge with data.<br />
        No credit card required. Free forever early access.
      </p>

      <div style={{ marginBottom: '40px' }}>
        <Link href="/dashboard" className="hero-primary-btn" style={{ display: 'inline-flex' }}>
          <span>Launch Application Free</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </div>

      <div className="footer-links-row">
        <span className="footer-group-label">Popular Screeners:</span>
        <Link href="/screener/rsi-oversold">RSI Oversold Stocks</Link>
        <Link href="/screener/volume-breakouts">Volume Breakouts</Link>
        <Link href="/screener/golden-cross">Golden Cross</Link>
        <Link href="/screener/52-week-high">52-Week High Leaders</Link>
        <Link href="/screener/top-gainers">Top Gainers</Link>
      </div>

      <div className="footer-links-row">
        <span className="footer-group-label">Stock Comparisons:</span>
        <Link href="/compare/tcs-vs-infy">TCS vs Infosys</Link>
        <Link href="/compare/hdfcbank-vs-icicibank">HDFC vs ICICI Bank</Link>
        <Link href="/compare/tatamotors-vs-m_m">Tata Motors vs M&M</Link>
        <Link href="/compare/reliance-vs-adanients">Reliance vs Adani</Link>
        <Link href="/compare/sbi-vs-hdfcbank">SBI vs HDFC Bank</Link>
      </div>

      <div className="footer-links-row" style={{ marginTop: '16px' }}>
        <Link href="/all-stocks">A-Z Stock Directory</Link>
        <Link href="/info/privacy">Privacy Policy</Link>
        <Link href="/info/terms">Terms of Service</Link>
        <Link href="/info/contact">Contact Support</Link>
        <Link href="/info/help">Help Center & FAQ</Link>
      </div>
      
      <div className="footer-disclaimer">
        © {new Date().getFullYear()} Swinglify. All rights reserved. Real-time and delayed data provided for NSE & BSE equities. 
        Disclaimer: Market analysis and indicator scores provided on Swinglify are strictly for educational and analytical purposes, not SEBI-registered investment advice.
      </div>
    </footer>
  );
}

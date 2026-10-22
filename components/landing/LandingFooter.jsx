import Link from 'next/link';

export default function LandingFooter() {
  return (
    <footer className="landing-footer">
      <div className="footer-glow"></div>
      
      <h2>Stop Guessing. Start Swinging.</h2>
      <p>
        Join forward-thinking Indian stock traders building their edge with data.<br/>
        No credit card required. Free forever access for early adopters.
      </p>

      <Link href="/dashboard" className="btn-primary" style={{ display: 'inline-flex', margin: '0 auto' }}>
        Launch Application
      </Link>

      <div className="footer-links" style={{ marginBottom: '10px', flexWrap: 'wrap', gap: '14px' }}>
        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: 600 }}>Screeners:</span>
        <Link href="/screener/rsi-oversold">RSI Oversold Stocks</Link>
        <Link href="/screener/volume-breakouts">Volume Breakouts</Link>
        <Link href="/screener/golden-cross">Golden Cross</Link>
        <Link href="/screener/52-week-high">52-Week High Leaders</Link>
        <Link href="/screener/top-gainers">Top Gainers</Link>
      </div>

      <div className="footer-links" style={{ marginBottom: '10px', flexWrap: 'wrap', gap: '14px' }}>
        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: 600 }}>Compare:</span>
        <Link href="/compare/tcs-vs-infy">TCS vs Infosys</Link>
        <Link href="/compare/hdfcbank-vs-icicibank">HDFC vs ICICI Bank</Link>
        <Link href="/compare/tatamotors-vs-m_m">Tata Motors vs M&M</Link>
        <Link href="/compare/reliance-vs-adanients">Reliance vs Adani</Link>
        <Link href="/compare/sbi-vs-hdfcbank">SBI vs HDFC Bank</Link>
      </div>

      <div className="footer-links">
        <Link href="/all-stocks">A-Z Stock Directory</Link>
        <Link href="/info/privacy">Privacy Policy</Link>
        <Link href="/info/terms">Terms of Service</Link>
        <Link href="/info/contact">Contact Us</Link>
        <Link href="/info/help">Help Center</Link>
      </div>
      
      <div style={{ marginTop: '20px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)' }}>
        © {new Date().getFullYear()} Swinglify. All rights reserved. Data provided by NSE/BSE. Note: Market data is delayed and meant for educational analysis, not financial advice.
      </div>
    </footer>
  );
}

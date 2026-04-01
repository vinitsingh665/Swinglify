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

      <div className="footer-links">
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

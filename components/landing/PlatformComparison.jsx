"use client";

import Link from 'next/link';

export default function PlatformComparison() {
  const comparisons = [
    {
      feature: "NSE & BSE Screener Scope",
      swinglify: "✓ 3,000+ Equities & 40+ Indicators",
      legacy: "Basic 5-10 filters, clunky syntax",
      portal: "Fundamental-heavy, no swing charts"
    },
    {
      feature: "Live Setup Confluence & Scoring",
      swinglify: "✓ 0-100 Composite Score (RSI, EMA, Vol)",
      legacy: "✗ Disjointed single indicator views",
      portal: "✗ No quantitative setup scoring"
    },
    {
      feature: "AI Quantitative Setup Breakdown",
      swinglify: "✓ Instant Groq Llama 3.1 Trade Thesis",
      legacy: "✗ Not available",
      portal: "✗ Not available"
    },
    {
      feature: "Head-to-Head Sector Rivalries",
      swinglify: "✓ Side-by-side momentum leadership",
      legacy: "✗ Single chart only",
      portal: "✗ Static balance sheet comparison"
    },
    {
      feature: "Defined Risk/Reward Framework",
      swinglify: "✓ Automated Target 1, Target 2 & Stop-Loss",
      legacy: "✗ Manual eyeball calculation",
      portal: "✗ None"
    },
    {
      feature: "Pricing & Accessibility",
      swinglify: "✨ 100% Free Forever Early Access",
      legacy: "₹780 - ₹1,500 / month paywall",
      portal: "₹2,000+/mo for Pro Terminal"
    }
  ];

  return (
    <section className="comparison-section">
      <div className="comparison-container">

        {/* Section Header */}
        <div className="bento-badge">THE ARCHITECTURAL DIFFERENCE</div>
        <h2 className="bento-title">
          Why Discerning Traders<br />
          <span className="bento-title-accent">Switch to Swinglify.</span>
        </h2>
        <p className="bento-subtitle">
          Compare the traditional retail trading chaos with Swinglify's disciplined quantitative system.
        </p>

        {/* High-Impact Visual Contrast Split */}
        <div className="contrast-split-grid">
          
          {/* Card 1: The Retail Trap */}
          <div className="contrast-card retail-trap">
            <div className="contrast-tag red">THE RETAIL TRAP</div>
            <h3 className="contrast-title">How 90% of Traders Lose</h3>
            <ul className="contrast-list">
              <li>
                <span className="contrast-icon red">✗</span>
                <span><strong>25+ Browser Tabs Open:</strong> Juggling separate charting tools, news feeds, and noisy social forums.</span>
              </li>
              <li>
                <span className="contrast-icon red">✗</span>
                <span><strong>Lagging Telegram/Twitter Tips:</strong> Entering after institutional smart money is already distributing.</span>
              </li>
              <li>
                <span className="contrast-icon red">✗</span>
                <span><strong>Negative Risk-to-Reward:</strong> Risking ₹5,000 to make ₹2,000. One bad loss wipes out 3 weeks of gains.</span>
              </li>
              <li>
                <span className="contrast-icon red">✗</span>
                <span><strong>Emotional Overtrading:</strong> Revenge trading without mathematical confluence or defined exits.</span>
              </li>
            </ul>
          </div>

          {/* Card 2: The Swinglify Edge */}
          <div className="contrast-card swinglify-edge">
            <div className="contrast-tag green">THE SWINGLIFY EDGE</div>
            <h3 className="contrast-title">How Disciplined Traders Win</h3>
            <ul className="contrast-list">
              <li>
                <span className="contrast-icon green">✓</span>
                <span><strong>Unified Algorithmic Screener:</strong> Filter 3,000+ Indian stocks by mathematical criteria in &lt;1 second.</span>
              </li>
              <li>
                <span className="contrast-icon green">✓</span>
                <span><strong>Institutional Volume Confluence:</strong> Catch explosive stage-2 breakouts as big volume enters.</span>
              </li>
              <li>
                <span className="contrast-icon green">✓</span>
                <span><strong>Asymmetric 3:1+ R:R Built-in:</strong> Pre-calculated Target 1, Target 2, and hard Stop-Loss before entry.</span>
              </li>
              <li>
                <span className="contrast-icon green">✓</span>
                <span><strong>Instant AI Trade Thesis:</strong> Get objective, data-backed setups without emotional bias.</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Detailed Feature Comparison Table */}
        <div className="comparison-table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Capability / Feature</th>
                <th className="th-highlight">
                  <div className="th-badge">RECOMMENDED</div>
                  <span>Swinglify</span>
                </th>
                <th>Legacy Screeners</th>
                <th>Financial Portals</th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((row, i) => (
                <tr key={i}>
                  <td className="td-feature">{row.feature}</td>
                  <td className="td-highlight">{row.swinglify}</td>
                  <td className="td-muted">{row.legacy}</td>
                  <td className="td-muted">{row.portal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom CTA Banner */}
        <div className="comparison-cta-box">
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', margin: '0 0 6px 0' }}>
              Stop leaving your trades to guesswork.
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.65)', margin: 0 }}>
              Build an asymmetric trading edge with 100% free institutional-grade screener tools.
            </p>
          </div>
          <Link href="/screener" className="hero-primary-btn" style={{ padding: '14px 30px' }}>
            <span>Launch Free Screener</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
}

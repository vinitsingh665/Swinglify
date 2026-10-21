"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../../components/Sidebar';
import TopBar from '../../../components/TopBar';
import '../info.css';

export default function TermsPage() {
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

          <h1 className="info-title">Terms of Service</h1>
          <p className="info-subtitle">Please read these terms carefully before using Swinglify.</p>

          <div className="info-legal">
            <div className="info-legal-updated">Last updated: March 25, 2026</div>

            <h2>1. Acceptance of Terms</h2>
            <p>By accessing and using Swinglify ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use the Platform.</p>

            <h2>2. Description of Service</h2>
            <p>Swinglify is a stock market analytics and swing trading platform that provides:</p>
            <ul>
              <li>Real-time and delayed market data for NSE and BSE listed securities</li>
              <li>Technical analysis tools and screening capabilities</li>
              <li>Portfolio tracking and management features</li>
              <li>Price alerts and notification services</li>
              <li>Market analytics and comparative tools</li>
            </ul>

            <h2>3. User Accounts</h2>
            <p>To access certain features of the Platform, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
            <p>You agree to provide accurate and complete information during registration and to keep your account information updated.</p>

            <h2>4. Investment Disclaimer</h2>
            <p><strong>Swinglify does not provide financial advice.</strong> All data, analysis, screener results, and insights provided on this Platform are for informational and educational purposes only. They should not be considered as investment advice, recommendations, or endorsements.</p>
            <p>Past performance does not guarantee future results. Stock market investments are subject to market risks. Always consult a qualified financial advisor before making investment decisions.</p>

            <h2>5. Data Accuracy</h2>
            <p>While we strive to provide accurate and timely market data, Swinglify makes no guarantees regarding the accuracy, completeness, or timeliness of any data displayed. Market data may be delayed by 15 minutes or more depending on exchange policies.</p>

            <h2>6. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use the Platform for any unlawful purpose</li>
              <li>Scrape, crawl, or use automated tools to extract data</li>
              <li>Attempt to gain unauthorized access to the Platform or its systems</li>
              <li>Redistribute market data obtained through the Platform</li>
              <li>Interfere with the proper working of the Platform</li>
            </ul>

            <h2>7. Intellectual Property</h2>
            <p>All content, features, and functionality of the Platform, including but not limited to text, graphics, logos, and software, are the property of Swinglify and are protected by copyright, trademark, and other intellectual property laws.</p>

            <h2>8. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, Swinglify shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or other intangible losses resulting from your use of the Platform.</p>

            <h2>9. Modifications</h2>
            <p>Swinglify reserves the right to modify these Terms of Service at any time. We will notify users of significant changes via email or in-app notification. Continued use of the Platform after changes constitutes acceptance of the modified terms.</p>

            <h2>10. Contact</h2>
            <p>For questions about these Terms, please contact us at <strong>swinglify@gmail.com</strong>.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

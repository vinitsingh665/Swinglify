"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../../components/Sidebar';
import TopBar from '../../../components/TopBar';
import '../info.css';

export default function PrivacyPolicyPage() {
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

          <h1 className="info-title">Privacy Policy</h1>
          <p className="info-subtitle">Your privacy matters to us. Learn how we handle your data.</p>

          <div className="info-legal">
            <div className="info-legal-updated">Last updated: March 25, 2026</div>

            <h2>1. Information We Collect</h2>
            <p>We collect information you provide directly to us:</p>
            <ul>
              <li><strong>Account Information:</strong> Name, email address, and authentication provider details when you create an account</li>
              <li><strong>Portfolio Data:</strong> Stock holdings, quantities, and purchase prices you manually enter</li>
              <li><strong>Preferences:</strong> Theme settings, default exchange, chart timeframes, and notification preferences</li>
              <li><strong>Alert Configurations:</strong> Price alerts and conditions you set up</li>
            </ul>

            <h2>2. Information Collected Automatically</h2>
            <p>When you use our Platform, we may automatically collect:</p>
            <ul>
              <li>Device information (browser type, operating system)</li>
              <li>Usage data (pages visited, features used, session duration)</li>
              <li>IP address and approximate geographic location</li>
              <li>Performance and diagnostic data</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, maintain, and improve the Platform</li>
              <li>Personalize your experience (themes, preferences, default markets)</li>
              <li>Send notifications and price alerts you've configured</li>
              <li>Analyze usage patterns to improve features</li>
              <li>Respond to your support requests</li>
              <li>Protect against fraud and unauthorized access</li>
            </ul>

            <h2>4. Data Storage</h2>
            <p>Your portfolio and alert data is stored locally in your browser's localStorage. We do not store your portfolio holdings on our servers unless you explicitly opt in to cloud sync (if available).</p>
            <p>Market data is fetched in real-time from third-party API providers and is not stored permanently on our servers.</p>

            <h2>5. Data Sharing</h2>
            <p>We do <strong>not</strong> sell, rent, or trade your personal information. We may share information only in the following limited circumstances:</p>
            <ul>
              <li>With your explicit consent</li>
              <li>To comply with legal obligations or court orders</li>
              <li>To protect the rights and safety of Swinglify, our users, or the public</li>
              <li>With service providers who assist in operating the Platform (under strict data protection agreements)</li>
            </ul>

            <h2>6. Cookies & Local Storage</h2>
            <p>We use browser localStorage to save your preferences, theme settings, portfolio data, and authentication state. We use minimal cookies for essential functionality only.</p>

            <h2>7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li><strong>Access</strong> your personal data stored on the Platform</li>
              <li><strong>Correct</strong> inaccurate or incomplete information</li>
              <li><strong>Delete</strong> your account and all associated data</li>
              <li><strong>Export</strong> your portfolio and alert data</li>
              <li><strong>Withdraw consent</strong> for optional data processing</li>
            </ul>

            <h2>8. Data Security</h2>
            <p>We implement industry-standard security measures to protect your information, including HTTPS encryption, secure authentication practices, and access controls. However, no method of transmission over the internet is 100% secure.</p>

            <h2>9. Third-Party Services</h2>
            <p>The Platform may integrate with third-party services for market data, authentication (Google OAuth), and analytics. These services have their own privacy policies, and we encourage you to review them.</p>

            <h2>10. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of any material changes through the Platform or via email. Your continued use constitutes acceptance of the updated policy.</p>

            <h2>11. Contact Us</h2>
            <p>For any privacy-related questions or requests, contact us at <strong>team@swinglify.online</strong>.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

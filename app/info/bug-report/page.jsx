"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../../components/Sidebar';
import TopBar from '../../../components/TopBar';
import '../info.css';

export default function ReportBugPage() {
  const router = useRouter();
  const [theme, setThemeState] = useState('dark');
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', title: '', severity: 'medium', page: '', steps: '', expected: '', actual: '' });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved) setThemeState(saved);
  }, []);

  const setTheme = (t) => { setThemeState(t); localStorage.setItem('theme', t); };
  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); }, [theme]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.steps || !form.email) return;
    
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'bug',
          name: form.name || 'Anonymous User',
          email: form.email,
          subject: `Bug: ${form.title}`,
          message: form.actual || 'No actual behavior provided',
          extraData: {
            severity: form.severity,
            affectedPage: form.page,
            steps: form.steps,
            expected: form.expected,
          }
        }),
      });
      if (!res.ok) throw new Error('Failed');
      setSubmitted(true);
    } catch (err) {
      setErrorMsg('Failed to submit bug report. Please configure SMTP settings in .env.local');
    } finally {
      setLoading(false);
    }
  };

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

          <h1 className="info-title">Report a Bug 🐛</h1>
          <p className="info-subtitle">Found something broken? Help us fix it by providing details below.</p>

          {submitted ? (
            <div className="info-success">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <div className="info-success-title">Bug Report Submitted!</div>
              <div className="info-success-desc">Thank you! Our engineering team will investigate this issue.</div>
              <button className="info-submit-btn" onClick={() => { setSubmitted(false); setForm({ title: '', severity: 'medium', page: '', steps: '', expected: '', actual: '' }); }}>Report Another</button>
            </div>
          ) : (
            <div className="info-card">
              <form className="info-form" onSubmit={handleSubmit}>
                <div className="info-form-row">
                  <div className="info-form-group">
                    <label className="info-form-label">Your Name (Optional)</label>
                    <input className="info-form-input" placeholder="e.g. Rahul Sharma" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
                  </div>
                  <div className="info-form-group">
                    <label className="info-form-label">Email (Required for updates)</label>
                    <input className="info-form-input" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} required />
                  </div>
                </div>

                <div className="info-form-group">
                  <label className="info-form-label">Bug Title</label>
                  <input className="info-form-input" placeholder="e.g. Chart not loading on Markets page" value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} required />
                </div>

                <div className="info-form-row">
                  <div className="info-form-group">
                    <label className="info-form-label">Severity</label>
                    <select className="info-form-input info-form-select" value={form.severity} onChange={e => setForm(f => ({...f, severity: e.target.value}))}>
                      <option value="low">Low — Cosmetic issue</option>
                      <option value="medium">Medium — Feature partially broken</option>
                      <option value="high">High — Feature completely broken</option>
                      <option value="critical">Critical — App crashes</option>
                    </select>
                  </div>
                  <div className="info-form-group">
                    <label className="info-form-label">Affected Page</label>
                    <select className="info-form-input info-form-select" value={form.page} onChange={e => setForm(f => ({...f, page: e.target.value}))}>
                      <option value="">Select page...</option>
                      <option value="dashboard">Dashboard</option>
                      <option value="markets">Markets</option>
                      <option value="screener">Screener</option>
                      <option value="community">Community</option>
                      <option value="portfolio">Portfolio</option>
                      <option value="alerts">Alerts</option>
                      <option value="watchlist">Watchlist</option>
                      <option value="compare">Compare</option>
                      <option value="feed">Feed</option>
                      <option value="profile">Profile</option>
                      <option value="settings">Settings</option>
                      <option value="help-center">Help Center</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="info-form-group">
                  <label className="info-form-label">Steps to Reproduce</label>
                  <textarea className="info-form-input info-form-textarea" placeholder="1. Go to Markets page&#10;2. Click on RELIANCE&#10;3. Scroll down to chart section&#10;4. Chart shows blank" value={form.steps} onChange={e => setForm(f => ({...f, steps: e.target.value}))} />
                </div>

                <div className="info-form-row">
                  <div className="info-form-group">
                    <label className="info-form-label">Expected Behavior</label>
                    <textarea className="info-form-input info-form-textarea" style={{ minHeight: 80 }} placeholder="What should happen?" value={form.expected} onChange={e => setForm(f => ({...f, expected: e.target.value}))} />
                  </div>
                  <div className="info-form-group">
                    <label className="info-form-label">Actual Behavior</label>
                    <textarea className="info-form-input info-form-textarea" style={{ minHeight: 80 }} placeholder="What actually happened?" value={form.actual} onChange={e => setForm(f => ({...f, actual: e.target.value}))} />
                  </div>
                </div>
                {errorMsg && <div style={{color: 'var(--red)', marginBottom: 16, fontSize: '0.85rem'}}>{errorMsg}</div>}
                <button type="submit" className="info-submit-btn" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Bug Report'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

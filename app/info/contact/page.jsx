"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../../components/Sidebar';
import TopBar from '../../../components/TopBar';
import '../info.css';

export default function ContactSupportPage() {
  const router = useRouter();
  const [theme, setThemeState] = useState('dark');
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', category: 'general', message: '' });
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
    if (!form.name || !form.email || !form.message) return;
    
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'contact', 
          name: form.name, 
          email: form.email, 
          subject: `Support: ${form.category}`, 
          message: form.message 
        }),
      });
      if (!res.ok) throw new Error('Failed to send message');
      setSubmitted(true);
    } catch (err) {
      setErrorMsg('Failed to send message. Please configure SMTP settings in .env.local');
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

          <h1 className="info-title">Contact Support</h1>
          <p className="info-subtitle">We're here to help. Reach out via any channel below or send us a message.</p>

          <div className="contact-methods">
            <div className="contact-method" onClick={() => window.open('mailto:swinglify@gmail.com', '_blank')} style={{ cursor: 'pointer' }}>
              <div className="contact-method-icon">📧</div>
              <div className="contact-method-label">Email</div>
              <div className="contact-method-desc">swinglify@gmail.com</div>
            </div>
            <div className="contact-method contact-method-disabled" title="Live Chat is currently disabled" aria-disabled="true">
              <div className="contact-method-icon">💬</div>
              <div className="contact-method-label">
                Live Chat <span className="contact-disabled-badge">Disabled</span>
              </div>
              <div className="contact-method-desc">Currently Unavailable</div>
            </div>
            <div className="contact-method">
              <div className="contact-method-icon">🐦</div>
              <div className="contact-method-label">Twitter / X</div>
              <div className="contact-method-desc">@swinglify</div>
            </div>
            <div className="contact-method" onClick={() => router.push('/info/help')} style={{ cursor: 'pointer' }}>
              <div className="contact-method-icon">📖</div>
              <div className="contact-method-label">Help Center</div>
              <div className="contact-method-desc" style={{ color: 'var(--primary)' }}>Browse FAQs & Guides →</div>
            </div>
          </div>

          {submitted ? (
            <div className="info-success">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <div className="info-success-title">Message Sent!</div>
              <div className="info-success-desc">We'll get back to you within 24 hours.</div>
              <button className="info-submit-btn" onClick={() => { setSubmitted(false); setForm({ name: '', email: '', category: 'general', message: '' }); }}>Send Another</button>
            </div>
          ) : (
            <div className="info-card">
              <div className="info-card-title" style={{ marginBottom: 18 }}>Send a Message</div>
              <form className="info-form" onSubmit={handleSubmit}>
                <div className="info-form-row">
                  <div className="info-form-group">
                    <label className="info-form-label">Your Name</label>
                    <input className="info-form-input" placeholder="e.g. Rahul Sharma" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
                  </div>
                  <div className="info-form-group">
                    <label className="info-form-label">Email</label>
                    <input className="info-form-input" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} />
                  </div>
                </div>
                <div className="info-form-group">
                  <label className="info-form-label">Category</label>
                  <select className="info-form-input info-form-select" value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))}>
                    <option value="general">General Question</option>
                    <option value="account">Account Issue</option>
                    <option value="business">Business / Partnership</option>
                    <option value="feature">Feature Request</option>
                  </select>
                </div>
                <div className="info-form-group">
                  <label className="info-form-label">Message</label>
                  <textarea className="info-form-input info-form-textarea" placeholder="Describe your issue or question..." value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))} />
                </div>
                {errorMsg && <div style={{color: 'var(--red)', marginBottom: 16, fontSize: '0.85rem'}}>{errorMsg}</div>}
                <button type="submit" className="info-submit-btn" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

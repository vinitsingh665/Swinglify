"use client";
import { useRouter } from 'next/navigation';

export default function AboutSection() {
  const router = useRouter();

  return (
    <div className="set-card" style={{ alignItems: 'center', textAlign: 'center', padding: '40px 20px' }}>
      <div style={{ width: 64, height: 64, background: '#ffffff', borderRadius: 16, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
      </div>
      
      <h2 style={{ fontSize: '1.75rem', fontWeight: 700, fontFamily: '"Quicksand", sans-serif', letterSpacing: '0.5px', marginBottom: 8 }}>Swinglify</h2>
      
      <div className="set-about-version" style={{ marginBottom: 32 }}>
        v1.3.0
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 40 }}>
        <button className="set-btn" onClick={() => router.push('/info/contact')}>Contact Support</button>
        <button className="set-btn" onClick={() => router.push('/info/bug-report')}>Report a Bug</button>
      </div>

      <div className="set-about-links" style={{ flexDirection: 'row', gap: 24, justifyContent: 'center' }}>
        <button className="set-about-link" onClick={() => router.push('/info/terms')}>Terms of Service</button>
        <button className="set-about-link" onClick={() => router.push('/info/privacy')}>Privacy Policy</button>
        <button className="set-about-link" onClick={() => router.push('/info/changelog')}>Changelog</button>
      </div>
    </div>
  );
}


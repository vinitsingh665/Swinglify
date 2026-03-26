"use client";

export default function DataPrivacySection() {
  return (
    <>
      <div className="set-card">
        <div className="set-card-title">Data & Privacy</div>

        <div className="set-row">
          <div className="set-row-info">
            <span className="set-row-label">Login Method</span>
            <span className="set-row-desc">Your account authentication provider</span>
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.3h6.47a5.53 5.53 0 01-2.4 3.63v3h3.88c2.27-2.09 3.54-5.17 3.54-8.66z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.07.72-2.44 1.14-4.05 1.14-3.12 0-5.76-2.11-6.7-4.94H1.29v3.09A11.99 11.99 0 0012 24z"/><path fill="#FBBC05" d="M5.3 14.29A7.2 7.2 0 014.92 12c0-.8.14-1.57.38-2.29V6.62H1.29A11.99 11.99 0 000 12c0 1.94.46 3.77 1.29 5.38l4.01-3.09z"/><path fill="#EA4335" d="M12 4.77c1.76 0 3.34.6 4.58 1.79l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.29 6.62l4.01 3.09c.94-2.83 3.58-4.94 6.7-4.94z"/></svg>
            Google
          </span>
        </div>

        <div className="set-row">
          <div className="set-row-info">
            <span className="set-row-label">Download My Data</span>
            <span className="set-row-desc">Export your watchlists, alerts, and preferences</span>
          </div>
          <button className="set-btn" onClick={() => {
            const data = {
              watchlist: JSON.parse(localStorage.getItem('watchlist') || '[]'),
              alerts: JSON.parse(localStorage.getItem('swinglify_alerts') || '[]'),
              preferences: JSON.parse(localStorage.getItem('swinglify_prefs') || '{}'),
              notifications: JSON.parse(localStorage.getItem('swinglify_notifs') || '{}'),
            };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = 'swinglify-data.json'; a.click();
            URL.revokeObjectURL(url);
          }}>⬇ Download</button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="set-danger">
        <span className="set-danger-title">⚠ Danger Zone</span>
        <div className="set-row" style={{ borderBottom: 'none' }}>
          <div className="set-row-info">
            <span className="set-row-label">Delete Account</span>
            <span className="set-row-desc">Permanently delete your account and all data. This cannot be undone.</span>
          </div>
          <button className="set-danger-btn" onClick={() => {
            if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
              localStorage.clear();
              alert('Account data cleared.');
            }
          }}>Delete Account</button>
        </div>
      </div>
    </>
  );
}

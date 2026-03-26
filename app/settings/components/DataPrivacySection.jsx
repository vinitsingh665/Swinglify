"use client";

export default function DataPrivacySection() {
  return (
    <>
      <div className="set-card">
        <h2 className="set-card-title">Data & Privacy</h2>
        <div className="set-card-desc">Manage your account connections and information</div>
        
        <div className="set-row">
          <div className="set-row-info">
            <span className="set-row-label">Login Method</span>
            <span className="set-row-desc">Your account is connected via Google SSO</span>
          </div>
          <button className="set-btn">Manage Access</button>
        </div>

        <div className="set-row">
          <div className="set-row-info">
            <span className="set-row-label">Export Data</span>
            <span className="set-row-desc">Download your watchlists, alerts, and portfolio</span>
          </div>
          <button className="set-btn">Download .CSV</button>
        </div>
      </div>

      <div className="set-danger" style={{ marginTop: 20 }}>
        <h2 className="set-danger-title">Danger Zone</h2>
        <div className="set-row-desc" style={{ color: 'var(--text-secondary)' }}>
          Once you delete your account, there is no going back. Please be certain.
        </div>
        <button className="set-danger-btn">Delete Account</button>
      </div>
    </>
  );
}

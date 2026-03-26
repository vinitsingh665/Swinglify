"use client";

export default function ApiSection() {
  return (
    <div className="sc-section">
      <div className="sc-card">
        <h2 className="sc-card-title">Broker Integrations (Beta)</h2>
        
        <div className="sc-field">
          <div className="sc-info">
            <span className="sc-label">Connect Broker</span>
            <span className="sc-desc">Execute trades directly from the dashboard</span>
          </div>
          <select className="sc-btn ghost" style={{ background: 'var(--bg-surface)' }}>
            <option>Select Broker...</option>
            <option>Zerodha (Kite)</option>
            <option>Upstox</option>
            <option>Angel One</option>
          </select>
        </div>
      </div>

      <div className="sc-card">
        <h2 className="sc-card-title">API Keys</h2>
        <div className="sc-field">
          <div className="sc-info">
            <span className="sc-label">Developer Access</span>
            <span className="sc-desc">Generate an API key for custom scripts and webhooks</span>
          </div>
          <button className="sc-btn primary">Generate Key</button>
        </div>
      </div>
    </div>
  );
}

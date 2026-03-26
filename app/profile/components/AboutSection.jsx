"use client";

export default function AboutSection() {
  return (
    <div className="set-card">
      <div className="set-card-title">About</div>

      <div className="set-row">
        <div className="set-row-info">
          <span className="set-row-label">Version</span>
          <span className="set-row-desc">Current release</span>
        </div>
        <span className="set-about-version">v1.0.0</span>
      </div>

      <div className="set-row">
        <div className="set-row-info">
          <span className="set-row-label">Built by</span>
          <span className="set-row-desc">Vinit Singh</span>
        </div>
      </div>

      <div className="set-about-links">
        <button className="set-about-link">📧 Contact & Support</button>
        <button className="set-about-link">📄 Terms of Service</button>
        <button className="set-about-link">🔒 Privacy Policy</button>
        <button className="set-about-link">⭐ Rate Swinglify</button>
      </div>
    </div>
  );
}

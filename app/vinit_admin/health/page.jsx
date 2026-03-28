"use client";

import { useState, useEffect } from 'react';

export default function HealthAdminPage() {
  const [stats, setStats] = useState(null);

  // Poll system vitals every 3 seconds
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        const json = await res.json();
        if (json.success) {
          setStats({
            databaseLoad: json.data.databaseLoad,
            cacheHitRate: json.data.cacheHitRate,
            apiLatency: json.data.systemHealth?.apiLatency || 0
          });
        }
      } catch(e) {}
    };
    fetchStats();
    const interval = setInterval(fetchStats, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="ad-header">
        <h1 className="ad-title">System Health & Vitals</h1>
        <p className="ad-subtitle">Monitor server load, database health, and API latency.</p>
      </div>

      <div className="ad-grid">
        <div className="ad-panel col-span-2">
          <h2 style={{ fontSize: '1rem', marginBottom: '20px', color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>Live Vitals</h2>
          
          <div className="ad-health-item">
            <div className="ad-health-header">
              <span>Primary Database Load</span>
              <span className="ad-health-val">{stats?.databaseLoad || 0}%</span>
            </div>
            <div className="ad-health-track">
              <div 
                className={`ad-health-fill ${stats?.databaseLoad > 80 ? 'critical' : stats?.databaseLoad > 50 ? 'warning' : 'excellent'}`} 
                style={{ width: `${stats?.databaseLoad || 0}%`, transition: 'width 1s ease-out' }}
              />
            </div>
          </div>

          <div className="ad-health-item">
            <div className="ad-health-header">
              <span>Redis Cache Hit Rate</span>
              <span className="ad-health-val">{stats?.cacheHitRate || 0}%</span>
            </div>
            <div className="ad-health-track">
              <div 
                className={`ad-health-fill ${stats?.cacheHitRate < 60 ? 'critical' : stats?.cacheHitRate < 85 ? 'warning' : 'excellent'}`} 
                style={{ width: `${stats?.cacheHitRate || 0}%`, transition: 'width 1s ease-out' }}
              />
            </div>
          </div>

          <div className="ad-health-item">
            <div className="ad-health-header">
              <span>Background Workers</span>
              <span className="ad-health-val">Running Normally</span>
            </div>
            <div className="ad-health-track">
              <div className="ad-health-fill excellent" style={{ width: '100%' }} />
            </div>
          </div>
        </div>

        <div className="ad-panel">
          <h2 style={{ fontSize: '1rem', marginBottom: '16px', color: '#fff' }}>Global Latency</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <div style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: '4px solid rgba(255,255,255,0.05)' }}>
              <div style={{ position: 'absolute', inset: -4, borderRadius: '50%', border: '4px solid #10b981', borderRightColor: 'transparent', borderBottomColor: 'transparent', transform: 'rotate(45deg)' }}></div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#10b981' }}>{stats?.apiLatency || 0}</div>
                <div style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>ms</div>
              </div>
            </div>
            <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#aaa', lineHeight: 1.5 }}>
              Average response time<br/>across all endpoints API.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

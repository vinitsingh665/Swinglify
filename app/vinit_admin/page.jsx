"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Skeleton from '../../components/Skeleton';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data
  const fetchDashboardData = async () => {
    try {
      const [statsRes, fbRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/feedback')
      ]);
      const statsData = await statsRes.json();
      const fbData = await fbRes.json();

      if (statsData.success) setStats(statsData.data);
      if (fbData.success) setFeedback(fbData.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load admin data:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // Poll stats every 5 seconds for "live" feel
    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return;
      fetch('/api/admin/stats').then(r=>r.json()).then(d => {
        if(d.success) setStats(d.data);
      });
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Update clock
  useEffect(() => {
    const clock = document.getElementById('admin-live-time');
    if (!clock) return;
    const interval = setInterval(() => {
      clock.innerText = new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST';
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleResolve = async (id) => {
    try {
      const res = await fetch('/api/admin/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'resolve' })
      });
      const data = await res.json();
      if (data.success) {
        // Update local state instead of full refetch
        setFeedback(prev => prev.map(f => f._id === id ? { ...f, status: 'resolved' } : f));
      }
    } catch (e) {
      console.error('Failed to resolve', e);
    }
  };

  if (loading || !stats) {
    return (
      <div>
        <div className="ad-header">
          <Skeleton width="200px" height="32px" style={{ marginBottom: 8 }} />
          <Skeleton width="300px" height="20px" />
        </div>
        <div className="ad-stats-row">
          {[1,2,3,4].map(i => (
            <div key={i} className="ad-stat-card" style={{ padding: 16 }}>
              <Skeleton width="32px" height="32px" borderRadius="8px" style={{ marginBottom: 12 }} />
              <Skeleton width="60%" height="28px" style={{ marginBottom: 8 }} />
              <Skeleton width="80%" height="16px" style={{ marginBottom: 8 }} />
              <Skeleton width="50%" height="16px" />
            </div>
          ))}
        </div>
        <div className="ad-grid">
          <div className="ad-panel" style={{ padding: 16 }}>
            <Skeleton width="150px" height="24px" style={{ marginBottom: 20 }} />
            {[1,2,3,4].map(i => (
              <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <Skeleton width="60px" height="24px" borderRadius="6px" />
                <div style={{ flex: 1 }}>
                  <Skeleton width="40%" height="18px" style={{ marginBottom: 8 }} />
                  <Skeleton width="100%" height="14px" />
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div className="ad-panel" style={{ padding: 16, minHeight: 200 }}>
              <Skeleton width="150px" height="24px" style={{ marginBottom: 20 }} />
              <Skeleton width="100%" height="40px" style={{ marginBottom: 16 }} />
              <Skeleton width="100%" height="40px" style={{ marginBottom: 16 }} />
              <Skeleton width="100%" height="40px" />
            </div>
            <div className="ad-panel" style={{ padding: 16, minHeight: 200 }}>
              <Skeleton width="150px" height="24px" style={{ marginBottom: 20 }} />
              <Skeleton width="100%" height="24px" style={{ marginBottom: 12 }} />
              <Skeleton width="100%" height="24px" style={{ marginBottom: 12 }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const pendingFeedback = feedback.filter(f => f.status === 'new').length;

  return (
    <div>
      <div className="ad-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="ad-title">Overview</h1>
          <p className="ad-subtitle">Live platform metrics and user feedback.</p>
        </div>
        <Link href="/vinit_admin/users" className="ad-action-btn" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width: 14, height: 14}}>
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          Manage Users
        </Link>
      </div>

      {/* Top Stats Cards */}
      <div className="ad-stats-row">
        
        {/* Live Users */}
        <div className="ad-stat-card" style={{ '--stat-color': '#10b981', '--stat-bg': 'rgba(16,185,129,0.1)' }}>
          <div className="ad-sc-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div className="ad-sc-value">{stats.liveUsers}</div>
          <div className="ad-sc-label">Live Active Visitors</div>
          <div className="ad-sc-trend up">
            <span className="live-dot" style={{ display: 'inline-block' }}></span>
            {stats.liveMembers !== undefined ? `${stats.liveMembers} registered user${stats.liveMembers === 1 ? '' : 's'} online` : 'Active on site'}
          </div>
        </div>


        {/* Pending Tickets */}
        <div className="ad-stat-card" style={{ '--stat-color': '#f97316', '--stat-bg': 'rgba(249,115,22,0.1)' }}>
          <div className="ad-sc-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </div>
          <div className="ad-sc-value">{pendingFeedback}</div>
          <div className="ad-sc-label">Unresolved Tickets</div>
          <div className="ad-sc-trend down">
            Action Required
          </div>
        </div>

        {/* Active Alerts */}
        <div className="ad-stat-card" style={{ '--stat-color': '#6366f1', '--stat-bg': 'rgba(99,102,241,0.1)' }}>
          <div className="ad-sc-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </div>
          <div className="ad-sc-value">{stats.activeAlerts.toLocaleString()}</div>
          <div className="ad-sc-label">Active User Alerts</div>
          <div className="ad-sc-trend up">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:14, height:14}}>
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
              <polyline points="17 6 23 6 23 12"></polyline>
            </svg>
            Growing steadily
          </div>
        </div>

        {/* System Health */}
        <div className="ad-stat-card" style={{ '--stat-color': stats.systemHealth.status === 'Operational' ? '#10b981' : '#f59e0b', '--stat-bg': 'rgba(16,185,129,0.1)' }}>
          <div className="ad-sc-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          </div>
          <div className="ad-sc-value">{stats.systemHealth.apiLatency}</div>
          <div className="ad-sc-label">Global API Latency</div>
          <div className="ad-sc-trend up" style={{ color: stats.systemHealth.status === 'Operational' ? '#10b981' : '#f59e0b' }}>
            {stats.systemHealth.status}
          </div>
        </div>

      </div>

      {/* Main Grid: Feedback (Left) & Widgets (Right) */}
      <div className="ad-grid">
        
        {/* Left: Feedback Inbox */}
        <div className="ad-panel">
          <div className="ad-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="ad-panel-title" style={{ margin: 0 }}>
              User Inbox
              {pendingFeedback > 0 && <span className="ad-badge">{pendingFeedback} New</span>}
            </h2>
            <Link href="/vinit_admin/feedback" style={{ fontSize: '0.8rem', color: 'var(--accent)', textDecoration: 'none' }}>
              View full inbox →
            </Link>
          </div>

          <table className="ad-table">
            <thead>
              <tr>
                <th style={{ width: '15%' }}>Status</th>
                <th style={{ width: '25%' }}>Sender</th>
                <th style={{ width: '45%' }}>Message</th>
                <th style={{ width: '15%', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {feedback.slice(0, 4).map(item => (
                <tr key={item._id}>
                  <td>
                    <span className={`ad-status ${item.status}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <span className="ad-sender-name">{item.senderName}</span>
                    <span className="ad-sender-email">{item.senderEmail}</span>
                  </td>
                  <td>
                    <div className="ad-msg-subject">
                      {item.type === 'bug' ? '🐛 ' : '✉️ '}{item.subject}
                    </div>
                    {item.status === 'new' ? (
                      <div className="ad-msg-full">{item.body}</div>
                    ) : (
                      <div className="ad-msg-body">{item.body}</div>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {item.status === 'new' ? (
                      <button className="ad-action-btn" onClick={() => handleResolve(item._id)}>
                        Resolve
                      </button>
                    ) : (
                      <Link href="/vinit_admin/feedback" style={{ fontSize: '0.75rem', color: '#666', textDecoration: 'none' }}>
                        View
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
              {feedback.length === 0 && (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: '#666' }}>Inbox is empty</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Right Column Widgets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* System Vitals Widget */}
          <div className="ad-panel">
            <div className="ad-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className="ad-panel-title" style={{ margin: 0 }}>System Vitals</h2>
              <Link href="/vinit_admin/health" style={{ fontSize: '0.8rem', color: 'var(--accent)', textDecoration: 'none' }}>
                Details →
              </Link>
            </div>
            
            <div className="ad-health-item">
              <div className="ad-health-header">
                <span>Database Load</span>
                <span className="ad-health-val">34%</span>
              </div>
              <div className="ad-health-track">
                <div className="ad-health-fill excellent" style={{ width: '34%' }}></div>
              </div>
            </div>

            <div className="ad-health-item">
              <div className="ad-health-header">
                <span>Redis Cache Hit Rate</span>
                <span className="ad-health-val">94.2%</span>
              </div>
              <div className="ad-health-track">
                <div className="ad-health-fill excellent" style={{ width: '94.2%' }}></div>
              </div>
            </div>

            <div className="ad-health-item">
              <div className="ad-health-header">
                <span>Error Rate</span>
                <span className="ad-health-val">{stats.systemHealth.errorRate}</span>
              </div>
              <div className="ad-health-track">
                {/* Visual mock - tiny fill since error rate is low */}
                <div className="ad-health-fill warning" style={{ width: `${Math.max(2, parseFloat(stats.systemHealth.errorRate)*10)}%` }}></div>
              </div>
            </div>
          </div>

          {/* Trending Searches Widget */}
          <div className="ad-panel">
            <div className="ad-panel-header">
              <h2 className="ad-panel-title" style={{ margin: 0 }}>Top Searched Stocks</h2>
            </div>
            <div className="ad-trend-list">
              {stats.trendingSearches.map((item, idx) => (
                <div className="ad-trend-item" key={idx}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ color: '#666', fontWeight: 800, fontSize: '0.8rem' }}>0{idx+1}</span>
                    <span className="ad-ti-sym">{item.symbol}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="ad-ti-chart"></div>
                    <span className="ad-ti-count">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

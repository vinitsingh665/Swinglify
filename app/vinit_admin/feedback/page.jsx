"use client";

import { useState, useEffect } from 'react';

import Skeleton from '../../../components/Skeleton';

export default function FeedbackAdminPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch feedback data
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await fetch('/api/admin/feedback');
        const data = await res.json();
        if (data.success) {
          setTickets(data.data);
        } else {
          setTickets([]);
        }
      } catch(e) {
        console.error("Failed to load feedback", e);
        setTickets([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, []);

  const handleResolve = (id) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'resolved' } : t));
  };

  const toggleExpand = (id) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, expanded: !t.expanded } : t));
  };

  if (loading) {
    return (
      <div>
        <div className="ad-header">
          <Skeleton width="260px" height="32px" style={{ marginBottom: 8 }} />
          <Skeleton width="380px" height="20px" />
        </div>
        <div className="ad-panel" style={{ padding: 16 }}>
          {[1,2,3,4,5].map(i => (
            <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.05)', alignItems: 'center' }}>
              <Skeleton width="60px" height="24px" borderRadius="12px" />
              <div style={{ flex: 1.5 }}>
                <Skeleton width="60%" height="20px" style={{ marginBottom: 4 }} />
                <Skeleton width="40%" height="14px" />
              </div>
              <div style={{ flex: 3 }}>
                <Skeleton width="40%" height="18px" style={{ marginBottom: 6 }} />
                <Skeleton width="100%" height="14px" />
              </div>
              <div style={{ width: '80px', flexShrink: 0, textAlign: 'right' }}>
                <Skeleton width="100%" height="24px" borderRadius="6px" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="ad-header">
        <h1 className="ad-title">User Inbox & Feedback</h1>
        <p className="ad-subtitle">Read contact messages, bug reports, and resolve user issues.</p>
      </div>

      <div className="ad-panel" style={{ overflowX: 'auto' }}>
        <table className="ad-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>User</th>
              <th style={{ width: '40%' }}>Message</th>
              <th>Type</th>
              <th>Date</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map(t => (
              <tr key={t.id}>
                <td>
                  <span className={`ad-status ${t.status}`}>{t.status}</span>
                </td>
                <td>
                  <span className="ad-sender-name">{t.senderName}</span>
                  <span className="ad-sender-email">{t.senderEmail}</span>
                </td>
                <td style={{ cursor: 'pointer' }} onClick={() => toggleExpand(t.id)}>
                  <div className="ad-msg-subject">{t.type === 'bug' ? '🐛 ' : '✉️ '}{t.subject}</div>
                  {!t.expanded && <div className="ad-msg-body">{t.body}</div>}
                  {t.expanded && <div className="ad-msg-full">{t.body}</div>}
                </td>
                <td>
                  <span className="ad-badge" style={{ 
                    background: t.type === 'bug' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255,255,255,0.05)',
                    color: t.type === 'bug' ? '#ef4444' : '#fff'
                  }}>
                    {t.type}
                  </span>
                </td>
                <td style={{ color: '#888' }}>{new Date().toLocaleDateString()}</td>
                <td style={{ textAlign: 'right' }}>
                  {t.status === 'new' ? (
                    <button className="ad-action-btn" onClick={() => handleResolve(t.id)}>
                      Resolve
                    </button>
                  ) : (
                    <button className="ad-action-btn" onClick={() => toggleExpand(t.id)} style={{ background: 'transparent', color: '#888', border: '1px solid rgba(255,255,255,0.05)' }}>
                      {t.expanded ? 'Close' : 'View'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {tickets.length === 0 && (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#666' }}>No messages found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

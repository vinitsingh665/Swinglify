"use client";

import { useState, useEffect } from 'react';

import Skeleton from '../../../components/Skeleton';

export default function FeedbackAdminPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

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

  const handleResolve = async (id) => {
    try {
      await fetch('/api/admin/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'resolve' })
      });
      setTickets(prev => prev.map(t => t._id === id ? { ...t, status: 'resolved' } : t));
    } catch(e) {
      console.error("Failed to resolve ticket", e);
    }
  };

  const toggleExpand = (id) => {
    setTickets(prev => prev.map(t => t._id === id ? { ...t, expanded: !t.expanded } : t));
  };

  const severityColors = {
    low: { bg: 'rgba(34, 197, 94, 0.15)', color: '#22c55e' },
    medium: { bg: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24' },
    high: { bg: 'rgba(249, 115, 22, 0.15)', color: '#f97316' },
    critical: { bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' },
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

  const filteredTickets = tickets.filter(t => {
    if (filter === 'all') return true;
    if (filter === 'bug') return t.type === 'bug';
    if (filter === 'contact') return t.type === 'contact';
    if (filter === 'resolved') return t.status === 'resolved';
    if (filter === 'new') return t.status === 'new';
    return true;
  });

  const counts = {
    all: tickets.length,
    bug: tickets.filter(t => t.type === 'bug').length,
    contact: tickets.filter(t => t.type === 'contact').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    new: tickets.filter(t => t.status === 'new').length,
  };

  const filters = [
    { key: 'all', label: 'All', icon: '📋' },
    { key: 'bug', label: 'Bugs', icon: '🐛' },
    { key: 'contact', label: 'Contact', icon: '✉️' },
    { key: 'resolved', label: 'Resolved', icon: '✅' },
    { key: 'new', label: 'Not Resolved', icon: '🔴' },
  ];

  return (
    <div>
      <div className="ad-header">
        <h1 className="ad-title">User Inbox & Feedback</h1>
        <p className="ad-subtitle">Read contact messages, bug reports, and resolve user issues.</p>
      </div>

      {/* Filter Bar */}
      <div style={{
        display: 'flex',
        gap: 8,
        marginBottom: 16,
        flexWrap: 'wrap'
      }}>
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              padding: '8px 16px',
              borderRadius: '100px',
              border: filter === f.key ? '1px solid var(--accent, #6366f1)' : '1px solid rgba(255,255,255,0.08)',
              background: filter === f.key ? 'var(--accent-bg, rgba(99,102,241,0.15))' : 'rgba(255,255,255,0.03)',
              color: filter === f.key ? 'var(--accent, #6366f1)' : '#888',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: filter === f.key ? 600 : 400,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.2s ease',
            }}
          >
            <span>{f.icon}</span>
            <span>{f.label}</span>
            <span style={{
              background: filter === f.key ? 'var(--accent, #6366f1)' : 'rgba(255,255,255,0.08)',
              color: filter === f.key ? '#fff' : '#666',
              padding: '1px 8px',
              borderRadius: '100px',
              fontSize: '0.75rem',
              fontWeight: 600,
              minWidth: 20,
              textAlign: 'center'
            }}>
              {counts[f.key]}
            </span>
          </button>
        ))}
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
            {filteredTickets.map(t => (
              <tr key={t._id}>
                <td>
                  <span className={`ad-status ${t.status}`}>{t.status}</span>
                </td>
                <td>
                  <span className="ad-sender-name">{t.senderName}</span>
                  <span className="ad-sender-email">{t.senderEmail}</span>
                </td>
                <td style={{ cursor: 'pointer' }} onClick={() => toggleExpand(t._id)}>
                  <div className="ad-msg-subject">{t.type === 'bug' ? '🐛 ' : '✉️ '}{t.subject}</div>
                  
                  {!t.expanded && <div className="ad-msg-body">{t.body}</div>}
                  
                  {t.expanded && (
                    <div className="ad-msg-full" style={{ marginTop: 8 }}>
                      {/* Bug-specific details */}
                      {t.type === 'bug' && (
                        <div style={{ 
                          padding: '12px', 
                          borderRadius: '8px', 
                          background: 'rgba(255,255,255,0.03)', 
                          border: '1px solid rgba(255,255,255,0.08)',
                          marginBottom: 10,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 10
                        }}>
                          {/* Severity & Affected Page Row */}
                          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                            {t.severity && (
                              <div>
                                <span style={{ color: '#888', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Severity</span>
                                <div style={{ marginTop: 4 }}>
                                  <span style={{
                                    padding: '3px 10px',
                                    borderRadius: '12px',
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    background: (severityColors[t.severity] || severityColors.medium).bg,
                                    color: (severityColors[t.severity] || severityColors.medium).color,
                                    textTransform: 'capitalize'
                                  }}>
                                    {t.severity}
                                  </span>
                                </div>
                              </div>
                            )}
                            {t.affectedPage && (
                              <div>
                                <span style={{ color: '#888', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Affected Page</span>
                                <div style={{ marginTop: 4, color: '#e2e8f0', fontSize: '0.9rem' }}>{t.affectedPage}</div>
                              </div>
                            )}
                          </div>

                          {/* Steps to Reproduce */}
                          {t.stepsToReproduce && (
                            <div>
                              <span style={{ color: '#888', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Steps to Reproduce</span>
                              <div style={{ marginTop: 4, color: '#e2e8f0', fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>{t.stepsToReproduce}</div>
                            </div>
                          )}

                          {/* Expected Behavior */}
                          {t.expectedBehavior && (
                            <div>
                              <span style={{ color: '#888', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Expected Behavior</span>
                              <div style={{ marginTop: 4, color: '#22c55e', fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>{t.expectedBehavior}</div>
                            </div>
                          )}

                          {/* Actual Behavior */}
                          {t.actualBehavior && (
                            <div>
                              <span style={{ color: '#888', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actual Behavior</span>
                              <div style={{ marginTop: 4, color: '#ef4444', fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>{t.actualBehavior}</div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Full message body */}
                      {t.type !== 'bug' && (
                        <div style={{ color: '#cbd5e1', whiteSpace: 'pre-wrap' }}>{t.body}</div>
                      )}
                    </div>
                  )}
                </td>
                <td>
                  <span className="ad-badge" style={{ 
                    background: t.type === 'bug' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255,255,255,0.05)',
                    color: t.type === 'bug' ? '#ef4444' : '#fff'
                  }}>
                    {t.type}
                  </span>
                </td>
                <td style={{ color: '#888' }}>{new Date(t.createdAt).toLocaleDateString()}</td>
                <td style={{ textAlign: 'right' }}>
                  {t.status === 'new' ? (
                    <button className="ad-action-btn" onClick={() => handleResolve(t._id)}>
                      Resolve
                    </button>
                  ) : (
                    <button className="ad-action-btn" onClick={() => toggleExpand(t._id)} style={{ background: 'transparent', color: '#888', border: '1px solid rgba(255,255,255,0.05)' }}>
                      {t.expanded ? 'Close' : 'View'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filteredTickets.length === 0 && (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#666' }}>No {filter === 'all' ? '' : filter} messages found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

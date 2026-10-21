"use client";

import { useState, useEffect, useRef, useMemo } from 'react';
import Skeleton from '../../../components/Skeleton';

function formatTimeAgo(dateString) {
  if (!dateString) return null;
  const now = new Date();
  const date = new Date(dateString);
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (isNaN(diffSec) || diffSec < 0) return null;
  if (diffSec < 60) return 'Just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function UsersAdminPage() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [counts, setCounts] = useState({ total: 0, online: 0, offline: 0 });
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'ONLINE' | 'OFFLINE'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Edit State
  const [editUserId, setEditUserId] = useState(null);
  const [editUsernameVal, setEditUsernameVal] = useState('');
  const [savingUsername, setSavingUsername] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isFirstLoad = useRef(true);

  const fetchUsers = async (silent = false) => {
    if (!silent && isFirstLoad.current) {
      setLoading(true);
    }
    try {
      const res = await fetch('/api/vinit_admin/users');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setUsers(json.data);
        if (json.meta) {
          setCounts(json.meta);
        } else {
          const online = json.data.filter(u => u.isOnline).length;
          setCounts({
            total: json.data.length,
            online,
            offline: json.data.length - online
          });
        }
      }
    } catch (e) {
      console.error('Failed to load users', e);
    } finally {
      if (isFirstLoad.current) {
        setLoading(false);
        isFirstLoad.current = false;
      }
    }
  };

  useEffect(() => {
    fetchUsers(false);

    // Auto poll presence status every 10 seconds for real-time updates (like Journal)
    const interval = setInterval(() => {
      fetchUsers(true);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const startEdit = (user) => {
    setErrorMsg('');
    setEditUserId(user._id);
    setEditUsernameVal(user.username || '');
  };

  const cancelEdit = () => {
    setErrorMsg('');
    setEditUserId(null);
    setEditUsernameVal('');
  };

  const saveUsername = async (userId) => {
    setErrorMsg('');
    setSavingUsername(true);
    try {
      const res = await fetch(`/api/vinit_admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: editUsernameVal })
      });
      const data = await res.json();

      if (data.success) {
        setUsers(users.map(u => u._id === userId ? { ...u, username: data.user.username } : u));
        setEditUserId(null);
      } else {
        setErrorMsg(data.error || 'Failed to update username');
      }
    } catch (err) {
      setErrorMsg('Server error. Please try again.');
    } finally {
      setSavingUsername(false);
    }
  };

  // Filter and search computation
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      // 1. Presence filter
      if (filter === 'ONLINE' && !u.isOnline) return false;
      if (filter === 'OFFLINE' && u.isOnline) return false;

      // 2. Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = u.name && u.name.toLowerCase().includes(q);
        const matchesEmail = u.email && u.email.toLowerCase().includes(q);
        const matchesUsername = u.username && u.username.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesUsername) {
          return false;
        }
      }

      return true;
    });
  }, [users, filter, searchQuery]);

  if (loading) {
    return (
      <div>
        <div className="ad-header">
          <Skeleton width="220px" height="32px" style={{ marginBottom: 8 }} />
          <Skeleton width="340px" height="20px" />
        </div>
        <div className="ad-panel" style={{ padding: 16 }}>
          {[1,2,3,4,5].map(i => (
            <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.05)', alignItems: 'center' }}>
              <Skeleton width="40px" height="20px" borderRadius="4px" />
              <div style={{ flex: 1.5 }}>
                <Skeleton width="60%" height="20px" style={{ marginBottom: 4 }} />
              </div>
              <div style={{ flex: 2 }}>
                <Skeleton width="80%" height="16px" />
              </div>
              <div style={{ flex: 1 }}>
                <Skeleton width="80px" height="16px" />
              </div>
              <div style={{ flex: 1 }}>
                <Skeleton width="60px" height="24px" borderRadius="12px" />
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
      {/* Header & Live Badges */}
      <div className="ad-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 className="ad-title">User Management</h1>
            <p className="ad-subtitle">Monitor registered users, live presence, and account usernames.</p>
          </div>

          <button 
            onClick={() => fetchUsers(false)} 
            className="ad-action-btn"
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            title="Refresh status"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14 }}>
              <polyline points="23 4 23 10 17 10"></polyline>
              <polyline points="1 20 1 14 7 14"></polyline>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </svg>
            Refresh
          </button>
        </div>

        {/* Presence Summary Badges */}
        <div className="admin-summary-badge-group">
          <div className="admin-summary-badge">
            <span style={{ color: '#aaa' }}>Total Registered:</span>
            <strong>{counts.total}</strong>
          </div>
          
          <div className="admin-summary-badge" style={{ borderColor: 'rgba(16, 185, 129, 0.3)', background: 'rgba(16, 185, 129, 0.08)' }}>
            <span className="admin-user-status-dot online"></span>
            <span style={{ color: '#10b981', fontWeight: 700 }}>Live Online:</span>
            <strong style={{ color: '#10b981' }}>{counts.online}</strong>
          </div>

          <div className="admin-summary-badge">
            <span className="admin-user-status-dot offline"></span>
            <span style={{ color: '#888' }}>Offline:</span>
            <strong style={{ color: '#ccc' }}>{counts.offline}</strong>
          </div>
        </div>

        {errorMsg && (
          <div style={{ marginTop: '12px', color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '8px 12px', borderLeft: '3px solid #ef4444', borderRadius: '4px', fontSize: '0.85rem' }}>
            {errorMsg}
          </div>
        )}
      </div>

      {/* Filter and Search Controls */}
      <div className="admin-user-controls">
        <div className="admin-filter-tabs">
          <button 
            className={`admin-filter-btn ${filter === 'ALL' ? 'active' : ''}`}
            onClick={() => setFilter('ALL')}
          >
            All Users
            <span className="admin-filter-count">{users.length}</span>
          </button>
          <button 
            className={`admin-filter-btn ${filter === 'ONLINE' ? 'active' : ''}`}
            onClick={() => setFilter('ONLINE')}
          >
            <span className="admin-user-status-dot online" style={{ width: 6, height: 6 }}></span>
            Online
            <span className="admin-filter-count">{counts.online}</span>
          </button>
          <button 
            className={`admin-filter-btn ${filter === 'OFFLINE' ? 'active' : ''}`}
            onClick={() => setFilter('OFFLINE')}
          >
            <span className="admin-user-status-dot offline" style={{ width: 6, height: 6 }}></span>
            Offline
            <span className="admin-filter-count">{counts.offline}</span>
          </button>
        </div>

        <div className="admin-search-input-wrap">
          <svg className="admin-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            className="admin-search-input"
            placeholder="Search name, username, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="ad-panel" style={{ overflowX: 'auto', padding: 0 }}>
        <table className="ad-table">
          <thead>
            <tr>
              <th style={{ paddingLeft: 24 }}>User</th>
              <th>Username</th>
              <th>Email</th>
              <th>Date Joined</th>
              <th>Status</th>
              <th style={{ textAlign: 'right', paddingRight: 24 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '40px 0', color: '#888' }}>
                  {searchQuery 
                    ? `No users match "${searchQuery}"`
                    : filter === 'ONLINE'
                      ? 'No users currently online.'
                      : 'No users found.'}
                </td>
              </tr>
            )}
            {filteredUsers.map(u => {
              const dateObj = new Date(u.createdAt);
              const formattedDate = !isNaN(dateObj) 
                ? dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) 
                : 'Unknown';

              const isEditing = editUserId === u._id;
              const lastSeenText = formatTimeAgo(u.lastSeen);

              // Avatar fallback
              const avatarSrc = u.image || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.name || 'User')}&backgroundColor=27272a&textColor=ffffff`;

              return (
                <tr key={u._id}>
                  {/* User (Avatar + Name) */}
                  <td style={{ paddingLeft: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '1px solid rgba(255,255,255,0.1)' }}>
                        <img 
                          src={avatarSrc} 
                          alt={u.name} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.name || 'User')}&backgroundColor=27272a&textColor=ffffff`;
                          }}
                        />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', gap: 6 }}>
                          {u.name}
                          {u.isCurrentUser && (
                            <span style={{ 
                              background: 'rgba(99, 102, 241, 0.15)', 
                              color: '#818cf8', 
                              border: '1px solid rgba(99, 102, 241, 0.3)', 
                              fontSize: '0.65rem', 
                              padding: '1px 6px', 
                              borderRadius: 4, 
                              fontWeight: 700 
                            }}>
                              YOU
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Username */}
                  <td>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={editUsernameVal} 
                        onChange={(e) => setEditUsernameVal(e.target.value)}
                        placeholder="Enter username"
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid var(--accent)',
                          color: '#fff',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          width: '120px',
                          outline: 'none',
                          fontSize: '0.85rem'
                        }}
                        autoFocus
                      />
                    ) : (
                      <span style={u.username ? { color: 'var(--accent)', fontWeight: 600 } : { color: '#666', fontStyle: 'italic' }}>
                        {u.username ? `@${u.username}` : 'Not set'}
                      </span>
                    )}
                  </td>
                  
                  {/* Email */}
                  <td style={{ color: '#aaa', fontSize: '0.82rem' }}>{u.email}</td>

                  {/* Date Joined */}
                  <td style={{ color: '#888', fontSize: '0.82rem' }}>{formattedDate}</td>
                  
                  {/* Status: Online vs Offline (Just like Journal) */}
                  <td>
                    {u.isOnline ? (
                      <div className="admin-presence-pill online">
                        <span className="admin-user-status-dot online"></span>
                        <span>Online</span>
                      </div>
                    ) : (
                      <div className="admin-presence-pill offline" title={u.lastSeen ? `Last active: ${new Date(u.lastSeen).toLocaleString()}` : 'No recent activity'}>
                        <span className="admin-user-status-dot offline"></span>
                        <span>Offline</span>
                        {lastSeenText && (
                          <span style={{ color: '#52525b', fontSize: '0.7rem', marginLeft: 2 }}>
                            ({lastSeenText})
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                  
                  {/* Actions */}
                  <td style={{ textAlign: 'right', whiteSpace: 'nowrap', paddingRight: 24 }}>
                    {isEditing ? (
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button 
                          className="ad-action-btn" 
                          style={{ background: 'var(--green, #10b981)', color: '#fff', borderColor: 'var(--green, #10b981)' }}
                          onClick={() => saveUsername(u._id)}
                          disabled={savingUsername}
                        >
                          {savingUsername ? '...' : 'Save'}
                        </button>
                        <button 
                          className="ad-action-btn" 
                          onClick={cancelEdit}
                          disabled={savingUsername}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button className="ad-action-btn" onClick={() => startEdit(u)}>Edit Username</button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

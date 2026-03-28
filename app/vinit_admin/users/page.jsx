"use client";

import { useState, useEffect } from 'react';
import Skeleton from '../../../components/Skeleton';

export default function UsersAdminPage() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  
  // Edit State
  const [editUserId, setEditUserId] = useState(null);
  const [editUsernameVal, setEditUsernameVal] = useState('');
  const [savingUsername, setSavingUsername] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/vinit_admin/users');
      const json = await res.json();
      if (json.success) {
        setUsers(json.data);
      }
    } catch (e) {
      console.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

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
        // Update local state
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
      <div className="ad-header">
        <h1 className="ad-title">User Management</h1>
        <p className="ad-subtitle">Manage registered users, set usernames, and monitor activity.</p>
        {errorMsg && (
          <div style={{ marginTop: '12px', color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '8px 12px', borderLeft: '3px solid #ef4444', borderRadius: '4px', fontSize: '0.85rem' }}>
            {errorMsg}
          </div>
        )}
      </div>

      <div className="ad-panel" style={{ overflowX: 'auto' }}>
        <table className="ad-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Date Joined</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '30px 0', color: '#888' }}>
                  No users found.
                </td>
              </tr>
            )}
            {users.map(u => {
              const isActive = u.isProfileComplete;
              const dateObj = new Date(u.createdAt);
              const formattedDate = !isNaN(dateObj) ? dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown';

              const isEditing = editUserId === u._id;

              return (
                <tr key={u._id}>
                  <td style={{ fontWeight: 600, color: '#fff' }}>{u.name}</td>
                  
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
                  
                  <td>{u.email}</td>
                  <td>{formattedDate}</td>
                  
                  <td>
                    <span className="live-dot" style={{ display: 'inline-block', marginRight: 8, background: isActive ? '#10b981' : '#f59e0b', boxShadow: 'none', animation: 'none' }}></span>
                    <span style={{ color: isActive ? '#fff' : '#aaa' }}>{isActive ? 'Active' : 'Incomplete'}</span>
                  </td>
                  
                  <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                    {isEditing ? (
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button 
                          className="ad-action-btn" 
                          style={{ background: 'var(--green)', color: '#fff', borderColor: 'var(--green)' }}
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

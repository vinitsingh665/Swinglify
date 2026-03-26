"use client";

import { useState, useEffect } from 'react';

import Skeleton from '../../../components/Skeleton';

export default function UsersAdminPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const mockUsers = [
    { id: 1, name: 'Rahul Verma', email: 'rahul.v88@gmail.com', joined: 'Mar 26, 2026', status: 'Active', plan: 'Pro' },
    { id: 2, name: 'Priya Sharma', email: 'priya.finance@yahoo.com', joined: 'Mar 25, 2026', status: 'Active', plan: 'Free' },
    { id: 3, name: 'Amit Patel', email: 'amitp_trader@outlook.com', joined: 'Mar 22, 2026', status: 'Inactive', plan: 'Free' },
    { id: 4, name: 'Neha Desai', email: 'neha.desai1995@gmail.com', joined: 'Mar 18, 2026', status: 'Active', plan: 'Pro' },
    { id: 5, name: 'Vikram Singh', email: 'vsingh.invest@gmail.com', joined: 'Mar 15, 2026', status: 'Active', plan: 'Free' },
    { id: 6, name: 'Sneha Gupta', email: 'snehag12@yahoo.in', joined: 'Mar 12, 2026', status: 'Active', plan: 'Pro' },
  ];

  if (loading) {
    return (
      <div>
        <div className="ad-header">
          <Skeleton width="220px" height="32px" style={{ marginBottom: 8 }} />
          <Skeleton width="340px" height="20px" />
        </div>
        <div className="ad-panel" style={{ padding: 16 }}>
          {[1,2,3,4,5,6].map(i => (
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
        <p className="ad-subtitle">Manage registered users, subscriptions, and activity.</p>
      </div>

      <div className="ad-panel" style={{ overflowX: 'auto' }}>
        <table className="ad-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Date Joined</th>
              <th>Plan</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockUsers.map(u => (
              <tr key={u.id}>
                <td style={{ fontFamily: 'var(--font-mono)' }}>#{u.id}</td>
                <td style={{ fontWeight: 600, color: '#fff' }}>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.joined}</td>
                <td>
                  <span className={`ad-badge ${u.plan === 'Pro' ? '' : 'free'}`} style={u.plan === 'Free' ? { backgroundColor: 'rgba(255,255,255,0.05)', color: '#aaa' } : {}}>
                    {u.plan}
                  </span>
                </td>
                <td>
                  <span className="live-dot" style={{ display: 'inline-block', marginRight: 8, background: u.status === 'Active' ? '#10b981' : '#666', boxShadow: 'none', animation: 'none' }}></span>
                  {u.status}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button className="ad-action-btn">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";
import { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

const typeConfig = {
  price: {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2v20M17 7l-5-5-5 5M7 17l5 5 5-5" />
      </svg>
    ),
    label: 'Price',
    color: 'var(--accent)',
    bg: 'var(--accent-bg)',
  },
  volume: {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="4" y="14" width="4" height="6" rx="1" />
        <rect x="10" y="8" width="4" height="12" rx="1" />
        <rect x="16" y="4" width="4" height="16" rx="1" />
      </svg>
    ),
    label: 'Volume',
    color: 'var(--green)',
    bg: 'var(--green-bg)',
  },
  rsi: {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 12h4l3-9 4 18 3-9h4" />
      </svg>
    ),
    label: 'RSI',
    color: '#a78bfa',
    bg: 'rgba(167, 139, 250, 0.1)',
  },
};

export default function NotificationDropdown() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasNew, setHasNew] = useState(false);
  const dropdownRef = useRef(null);
  const lastSeenRef = useRef(null);

  const fetchAlerts = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    try {
      const res = await fetch('/api/alerts');
      const data = await res.json();
      if (data.success) {
        setAlerts(data.data.slice(0, 5));

        // Check for new alerts since last seen
        const lastSeen = localStorage.getItem('swinglify_notif_seen');
        if (data.data.length > 0 && lastSeen) {
          const newest = new Date(data.data[0].createdAt).getTime();
          if (newest > parseInt(lastSeen)) {
            setHasNew(true);
          }
        } else if (data.data.length > 0 && !lastSeen) {
          setHasNew(true);
        }
      }
    } catch (e) {
      console.warn('Failed to fetch notifications:', e);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(prev => !prev);
    if (!isOpen) {
      // Mark as seen
      localStorage.setItem('swinglify_notif_seen', Date.now().toString());
      setHasNew(false);
      fetchAlerts();
    }
  };

  const triggeredAlerts = alerts.filter(a => a.triggered);
  const activeAlerts = alerts.filter(a => !a.triggered && !a.expired);

  return (
    <div className="notif-wrapper" ref={dropdownRef}>
      <button
        className={`topbar-icon-btn ${isOpen ? 'notif-active' : ''}`}
        title="Notifications"
        onClick={handleToggle}
        aria-label="Notifications"
        id="notification-bell"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 01-3.46 0" />
        </svg>
        {hasNew && <span className="notif-dot" />}
      </button>

      {isOpen && (
        <div className="notif-dropdown">
          {/* Header */}
          <div className="notif-header">
            <span className="notif-title">Notifications</span>
            <span className="notif-count">{alerts.length}</span>
          </div>

          {/* Body */}
          <div className="notif-body">
            {!session ? (
              <div className="notif-empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 01-3.46 0" />
                </svg>
                <p>Sign in to see your alerts</p>
              </div>
            ) : loading ? (
              <div className="notif-loading">
                <div className="notif-skeleton" />
                <div className="notif-skeleton" />
                <div className="notif-skeleton" />
              </div>
            ) : alerts.length === 0 ? (
              <div className="notif-empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 01-3.46 0" />
                </svg>
                <p>No alerts yet</p>
                <span>Create alerts to get notified about price changes</span>
              </div>
            ) : (
              <>
                {/* Triggered alerts section */}
                {triggeredAlerts.length > 0 && (
                  <>
                    <div className="notif-section-label">
                      <span className="notif-section-dot triggered" />
                      Triggered
                    </div>
                    {triggeredAlerts.map(alert => {
                      const config = typeConfig[alert.type] || typeConfig.price;
                      return (
                        <Link
                          key={alert.id || alert._id}
                          href={`/alerts`}
                          className="notif-item triggered"
                          onClick={() => setIsOpen(false)}
                        >
                          <div className="notif-item-icon" style={{ color: config.color, background: config.bg }}>
                            {config.icon}
                          </div>
                          <div className="notif-item-content">
                            <div className="notif-item-title">
                              <span className="notif-symbol">{alert.symbol}</span>
                              <span className="notif-condition">
                                {alert.type} {alert.comparison?.toLowerCase()} {alert.value}
                              </span>
                            </div>
                            <div className="notif-item-meta">
                              <span className="notif-tag triggered">Triggered</span>
                              <span className="notif-time">{timeAgo(alert.createdAt)}</span>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </>
                )}

                {/* Active alerts section */}
                {activeAlerts.length > 0 && (
                  <>
                    <div className="notif-section-label">
                      <span className="notif-section-dot active" />
                      Active
                    </div>
                    {activeAlerts.map(alert => {
                      const config = typeConfig[alert.type] || typeConfig.price;
                      return (
                        <Link
                          key={alert.id || alert._id}
                          href={`/alerts`}
                          className="notif-item"
                          onClick={() => setIsOpen(false)}
                        >
                          <div className="notif-item-icon" style={{ color: config.color, background: config.bg }}>
                            {config.icon}
                          </div>
                          <div className="notif-item-content">
                            <div className="notif-item-title">
                              <span className="notif-symbol">{alert.symbol}</span>
                              <span className="notif-condition">
                                {alert.type} {alert.comparison?.toLowerCase()} {alert.value}
                              </span>
                            </div>
                            <div className="notif-item-meta">
                              <span className="notif-tag active">Watching</span>
                              <span className="notif-time">{timeAgo(alert.createdAt)}</span>
                            </div>
                          </div>
                          <div className="notif-item-chevron">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M9 18l6-6-6-6" />
                            </svg>
                          </div>
                        </Link>
                      );
                    })}
                  </>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          {session && (
            <div className="notif-footer">
              <Link href="/alerts" className="notif-view-all" onClick={() => setIsOpen(false)}>
                View All Alerts
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

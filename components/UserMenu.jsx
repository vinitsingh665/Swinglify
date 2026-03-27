"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";

export default function UserMenu() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  if (status === "loading") {
    return (
      <div className="sidebar-icon" style={{ opacity: 0.4 }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </div>
    );
  }

  if (!session) {
    return (
      <button
        className="sidebar-icon"
        onClick={() => window.location.href = '/auth/signin'}
        title="Sign in with Google"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </button>
    );
  }

  const user = session?.user;
  const currentImage = user?.profilePic || user?.image;
  const currentDisplayName = user?.displayName || user?.name;

  return (
    <div className="user-menu" ref={menuRef}>
      <button
        className="sidebar-icon user-avatar-btn"
        onClick={() => setOpen(!open)}
        title={currentDisplayName}
      >
        {currentImage ? (
          <img
            src={currentImage}
            alt={currentDisplayName}
            className="user-avatar"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="user-avatar-fallback">
            {currentDisplayName?.charAt(0)?.toUpperCase()}
          </div>
        )}
      </button>

      {open && (
        <div className="user-dropdown">
          <div className="user-dropdown-header">
            {currentImage && (
              <img
                src={currentImage}
                alt=""
                className="user-dropdown-avatar"
                referrerPolicy="no-referrer"
              />
            )}
            <div>
              <div className="user-dropdown-name">{currentDisplayName}</div>
              {user?.username && <div style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600 }}>@{user.username}</div>}
              <div className="user-dropdown-email">{user?.email}</div>
            </div>
          </div>
          <div className="user-dropdown-divider" />
          <button className="user-dropdown-item" onClick={() => signOut()}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

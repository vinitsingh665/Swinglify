"use client";
import { useSession, signIn, signOut } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';

export default function ProfileSection() {
  const { data: session, status } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  useEffect(() => {
    if (session?.user) {
      setDisplayName(session.user.displayName || session.user.name || "");
      setProfilePic(session.user.profilePic || session.user.image || "");
    }
  }, [session]);

  // Not signed in — show a Sign In card
  if (status !== 'authenticated') {
    return (
      <div className="set-card">
        <h2 className="set-card-title">Profile</h2>

        <div className="set-profile-header" style={{ flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '32px 16px' }}>
          <div className="set-avatar" style={{ width: 64, height: 64, fontSize: '1.4rem' }}>?</div>
          <div style={{ textAlign: 'center' }}>
            <div className="set-profile-name" style={{ marginBottom: 4 }}>Not Signed In</div>
            <div className="set-profile-email">Sign in to sync your watchlist, portfolio & alerts across devices</div>
          </div>
          <button
            className="set-google-signin-btn"
            onClick={() => signIn('google')}
            disabled={status === 'loading'}
          >
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  const user = session.user;
  const username = user.username ? `@${user.username}` : "";
  const currentDisplayName = user.displayName || user.name;
  const currentImage = user.profilePic || user.image;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be under 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setProfilePic(event.target.result);
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user.username, // Keep the same username (can't be easily changed in this UI yet, but could be added later)
          displayName,
          profilePic: profilePic !== currentImage ? profilePic : undefined,
        }),
      });

      if (!res.ok) throw new Error("Failed to save");
      
      // Reload completely to update session globally
      window.location.reload();
    } catch (err) {
      setError("Failed to update profile");
      setSaving(false);
    }
  };

  return (
    <div className="set-card">
      <h2 className="set-card-title">Profile</h2>

      <div className="set-profile-header">
        <label className={`set-avatar-wrapper ${isEditing ? 'editing' : ''}`} style={{ cursor: isEditing ? 'pointer' : 'default' }}>
          {isEditing ? (
             <div className="set-avatar-overlay" style={{ opacity: 1, background: 'rgba(0,0,0,0.5)' }}>
               <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" width="20" height="20">
                 <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                 <circle cx="12" cy="13" r="4" />
               </svg>
             </div>
          ) : null}

          {isEditing && profilePic ? (
             <img src={profilePic} alt="Preview" className="set-avatar-img" referrerPolicy="no-referrer" />
          ) : currentImage ? (
            <img src={currentImage} alt={currentDisplayName} className="set-avatar-img" referrerPolicy="no-referrer" />
          ) : (
            <div className="set-avatar">{currentDisplayName?.charAt(0)?.toUpperCase()}</div>
          )}
          
          <input type="file" ref={fileRef} hidden accept="image/*" onChange={handleFileChange} disabled={!isEditing} />
        </label>

        <div className="set-profile-info" style={{ flex: 1 }}>
          {isEditing ? (
            <input 
              type="text" 
              className="set-profile-name-input" 
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value.slice(0, 30))}
              autoFocus
              style={{ width: '100%', maxWidth: '250px' }}
            />
          ) : (
            <>
              <div className="set-profile-name">{currentDisplayName}</div>
              {username && <div style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 600, marginTop: '-2px' }}>{username}</div>}
            </>
          )}
          
          <div className="set-profile-email" style={{ marginTop: 4 }}>
            {user.email}
            <span className="set-google-badge">Google</span>
          </div>
        </div>

        {error && <div style={{ color: '#ef4444', fontSize: '0.8rem' }}>{error}</div>}

        {isEditing ? (
          <div style={{ display: 'flex', gap: '8px', alignSelf: 'flex-start' }}>
            <button className="set-btn" onClick={() => setIsEditing(false)} disabled={saving} style={{ background: 'transparent' }}>Cancel</button>
            <button className="set-edit-btn" onClick={handleSave} disabled={saving} style={{ background: 'var(--accent)', color: 'white', borderColor: 'var(--accent)' }}>
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        ) : (
          <button className="set-edit-btn" onClick={() => setIsEditing(true)}>
            Edit Profile
          </button>
        )}
      </div>

      <div className="set-row">
        <div className="set-row-info">
          <span className="set-row-label">Account</span>
          <span className="set-row-desc">Signed in with Google</span>
        </div>
        <button className="set-signout-btn" onClick={() => signOut()}>
          Sign Out
        </button>
      </div>
    </div>
  );
}

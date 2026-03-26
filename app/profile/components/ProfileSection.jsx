"use client";
import { useState, useEffect, useRef } from 'react';

export default function ProfileSection() {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Vinit Singh',
    email: 'vinit@gmail.com',
    avatar: null, // base64 string or null
  });
  const fileRef = useRef(null);

  // Load saved profile from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('swinglify_profile');
      if (saved) setProfile(JSON.parse(saved));
    } catch (e) {}
  }, []);

  const save = (updates) => {
    const next = { ...profile, ...updates };
    setProfile(next);
    localStorage.setItem('swinglify_profile', JSON.stringify(next));
  };

  const handleAvatarClick = () => {
    fileRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      save({ avatar: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const getInitials = (name) => {
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <>
      <div className="set-card">
        <div className="set-card-title">Profile</div>
        <div className="set-profile-header">
          {/* Avatar with upload */}
          <div className="set-avatar-wrapper" onClick={handleAvatarClick} title="Click to change avatar">
            {profile.avatar ? (
              <img src={profile.avatar} alt="Avatar" className="set-avatar-img" />
            ) : (
              <div className="set-avatar">{getInitials(profile.name)}</div>
            )}
            <div className="set-avatar-overlay">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
          </div>

          <div className="set-profile-info">
            {editing ? (
              <input
                className="set-profile-name-input"
                value={profile.name}
                onChange={e => save({ name: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && setEditing(false)}
                autoFocus
              />
            ) : (
              <span className="set-profile-name">{profile.name}</span>
            )}
            <span className="set-profile-email">
              {profile.email}
              <span className="set-google-badge">Google</span>
            </span>
            <span className="set-profile-meta">Joined March 2026</span>
            <span className="set-profile-plan">Free Plan</span>
          </div>
        </div>

        {/* Edit button */}
        <button className="set-btn set-edit-btn" onClick={() => setEditing(!editing)}>
          {editing ? '✓ Done' : '✏️ Edit Profile'}
        </button>
      </div>
    </>
  );
}

"use client";
import { useState, useEffect } from 'react';

export default function ProfileSection() {
  const [isEditing, setIsEditing] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [profile, setProfile] = useState({
    name: "Swing Trader",
    email: "trader@swinglify.com",
    joined: "March 2024",
    plan: "Free Tier"
  });

  // Load from local storage if exists
  useEffect(() => {
    const saved = localStorage.getItem('swinglify_profile');
    if (saved) setProfile(JSON.parse(saved));
    const savedAvatar = localStorage.getItem('swinglify_avatar');
    if (savedAvatar) setAvatar(savedAvatar);
  }, []);

  const handleSave = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      localStorage.setItem('swinglify_profile', JSON.stringify(profile));
      window.dispatchEvent(new Event('swinglify_settings_update'));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatar(event.target.result);
        localStorage.setItem('swinglify_avatar', event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="set-card">
      <h2 className="set-card-title">Profile</h2>
      
      <div className="set-profile-header">
        <label className="set-avatar-wrapper" htmlFor="avatar-upload">
          {avatar ? (
            <img src={avatar} alt="Profile Picture" className="set-avatar-img" />
          ) : (
            <div className="set-avatar">{profile.name.charAt(0)}</div>
          )}
          <div className="set-avatar-overlay">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
            </svg>
          </div>
          <input type="file" id="avatar-upload" hidden accept="image/*" onChange={handleAvatarChange} />
        </label>
        
        <div className="set-profile-info" style={{ flex: 1 }}>
          {isEditing ? (
            <input 
              type="text" 
              className="set-profile-name-input" 
              value={profile.name}
              onChange={(e) => setProfile({...profile, name: e.target.value})}
              autoFocus
            />
          ) : (
            <div className="set-profile-name">{profile.name}</div>
          )}
          <div className="set-profile-email">
            {profile.email}
            <span className="set-google-badge">Google</span>
          </div>
        </div>
        <button className="set-edit-btn" onClick={handleSave}>
          {isEditing ? 'Save Profile' : 'Edit Profile'}
        </button>
      </div>

      <div className="set-row">
        <div className="set-row-info">
          <span className="set-row-label">Member Since</span>
        </div>
        <div style={{ fontWeight: 700 }}>{profile.joined}</div>
      </div>

      <div className="set-row">
        <div className="set-row-info">
          <span className="set-row-label">Current Plan</span>
          <span className="set-row-desc">Upgrade for real-time data and API limits</span>
        </div>
        <div className="set-profile-plan">{profile.plan}</div>
      </div>
    </div>
  );
}

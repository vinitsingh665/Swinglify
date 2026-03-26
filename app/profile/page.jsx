"use client";
import './settings.css';
import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';

import ProfileSection from './components/ProfileSection';
import PreferencesSection from './components/PreferencesSection';
import NotificationsSection from './components/NotificationsSection';
import DataPrivacySection from './components/DataPrivacySection';
import AboutSection from './components/AboutSection';

const SECTIONS = [
  { id: 'profile', label: 'Profile', icon: <g><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></g> },
  { id: 'preferences', label: 'Preferences', icon: <g><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" /></g> },
  { id: 'notifications', label: 'Notifications', icon: <g><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></g> },
  { id: 'privacy', label: 'Data & Privacy', icon: <g><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></g> },
  { id: 'about', label: 'About', icon: <g><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></g> }
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const syncTheme = () => {
      const saved = localStorage.getItem('swinglify_theme') || 'dark';
      setTheme(saved);
    };
    syncTheme();
    window.addEventListener('swinglify_settings_update', syncTheme);
    return () => window.removeEventListener('swinglify_settings_update', syncTheme);
  }, []);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('swinglify_theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    window.dispatchEvent(new Event('swinglify_settings_update'));
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-area">
        <TopBar />
        <div className="settings-layout">
          <div className="settings-header">Settings</div>
          
          <div className="settings-body">
            {/* Left Side: Vertical Navigation */}
            <div className="settings-tabs">
              {SECTIONS.map(s => (
                <button key={s.id} className={`set-tab ${activeTab === s.id ? 'active' : ''}`} onClick={() => setActiveTab(s.id)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {s.icon}
                  </svg>
                  {s.label}
                </button>
              ))}
            </div>

            {/* Right Side: Content Area */}
            <div className="settings-content">
              {activeTab === 'profile' && <ProfileSection />}
              {activeTab === 'preferences' && <PreferencesSection theme={theme} setTheme={handleThemeChange} />}
              {activeTab === 'notifications' && <NotificationsSection />}
              {activeTab === 'privacy' && <DataPrivacySection />}
              {activeTab === 'about' && <AboutSection />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

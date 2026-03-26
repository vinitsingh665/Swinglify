"use client";
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import './settings.css';

// Settings Sections
import ProfileSection from './components/ProfileSection';
import PreferencesSection from './components/PreferencesSection';
import NotificationsSection from './components/NotificationsSection';
import DataPrivacySection from './components/DataPrivacySection';
import AboutSection from './components/AboutSection';

const SETTINGS_SECTIONS = [
  { id: 'profile', label: 'Profile' },
  { id: 'preferences', label: 'Preferences' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'privacy', label: 'Data & Privacy' },
  { id: 'about', label: 'About' },
];

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const [theme, setThemeState] = useState('dark');
  const [activeSection, setActiveSection] = useState(() => {
    return searchParams.get('tab') || 'profile';
  });

  // Sync theme
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved) setThemeState(saved);

    const syncTheme = () => {
      const globalSaved = localStorage.getItem('swinglify_theme');
      if (globalSaved) setThemeState(globalSaved);
    };
    syncTheme();
    window.addEventListener('swinglify_settings_update', syncTheme);
    return () => window.removeEventListener('swinglify_settings_update', syncTheme);
  }, []);

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Render current section
  const renderSection = () => {
    switch (activeSection) {
      case 'profile': return <ProfileSection />;
      case 'preferences': return <PreferencesSection currentTheme={theme} />;
      case 'notifications': return <NotificationsSection />;
      case 'privacy': return <DataPrivacySection />;
      case 'about': return <AboutSection />;
      default: return null;
    }
  };

  return (
    <div className="app-layout" data-theme={theme}>
      <Sidebar theme={theme} setTheme={setTheme} />
      
      <div className="main-area">
        <TopBar />
        
        <div className="settings-layout">
          <div className="settings-header">
            Settings
          </div>

          <div className="settings-body">
            {/* Left Nav Tabs */}
            <div className="settings-tabs">
              {SETTINGS_SECTIONS.map(sec => (
                <button
                  key={sec.id}
                  className={`set-tab ${activeSection === sec.id ? 'active' : ''}`}
                  onClick={() => setActiveSection(sec.id)}
                >
                  {sec.label}
                </button>
              ))}
            </div>

            {/* Right Content Panel */}
            <div className="settings-content">
              {renderSection()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

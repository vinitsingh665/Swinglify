"use client";

import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function AppShell({ children }) {
  const [theme, setThemeState] = useState('dark');

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

  // Handle mobile sidebar toggle
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="app-layout" data-theme={theme}>
      <Sidebar 
        theme={theme} 
        setTheme={setTheme} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
      />

      <div className="main-area">
        <TopBar onMenuClick={() => setIsSidebarOpen(true)} />

        <div className="content">
          <div className="content-inner">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

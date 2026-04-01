"use client";
import { useEffect } from 'react';
import MobileBottomNav from './MobileBottomNav';

// Converts hex to rgba for the accent background (e.g. #f97316 -> rgba(249,115,22,0.1))
function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Lighten a hex color by a percentage (0-100)
function lightenHex(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, (num >> 16) + Math.round(2.55 * percent));
  const g = Math.min(255, ((num >> 8) & 0x00FF) + Math.round(2.55 * percent));
  const b = Math.min(255, (num & 0x0000FF) + Math.round(2.55 * percent));
  return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
}

export default function ThemeProvider({ children }) {
  useEffect(() => {
    const applyTheme = () => {
      // 1. Force Dark Theme (light theme disabled)
      const theme = 'dark';
      document.documentElement.setAttribute('data-theme', theme);

      // 2. Read Accent Color
      try {
        let accent = localStorage.getItem('swinglify_accent');
        if (!accent) {
          const prefsStr = localStorage.getItem('swinglify_prefs');
          if (prefsStr) {
            const prefs = JSON.parse(prefsStr);
            if (prefs.accent) accent = prefs.accent;
          }
        }
        if (accent) {
          document.documentElement.style.setProperty('--accent', accent);
          document.documentElement.style.setProperty('--accent-hover', lightenHex(accent, 25));
          document.documentElement.style.setProperty('--accent-bg', hexToRgba(accent, 0.1));
        }
      } catch (e) {
        console.error('Failed to parse swinglify_prefs for ThemeProvider', e);
      }
    };

    // Apply on initial mount
    applyTheme();

    // Re-apply whenever the Settings page fires this event
    window.addEventListener('swinglify_settings_update', applyTheme);

    // Also listen to storage events (if user changes settings in another tab)
    window.addEventListener('storage', applyTheme);

    return () => {
      window.removeEventListener('swinglify_settings_update', applyTheme);
      window.removeEventListener('storage', applyTheme);
    };
  }, []);

  return (
    <>
      {children}
      <MobileBottomNav />
    </>
  );
}

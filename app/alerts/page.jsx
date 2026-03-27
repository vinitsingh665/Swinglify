"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import './alerts.css';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';

import AlertsTopBar from './components/AlertsTopBar';
import AlertList from './components/AlertList';
import CreateAlertPanel from './components/CreateAlertPanel';
import Toast from './components/Toast';

import { useAlerts } from '../../hooks/useAlerts';

export default function AlertsPage() {
  const searchParams = useSearchParams();
  const urlSymbol = searchParams.get('symbol');

  const [theme, setThemeState] = useState('dark');
  const [filter, setFilter] = useState('all');
  
  const [isCreating, setIsCreating] = useState(false);
  const [editingAlert, setEditingAlert] = useState(null);
  const [formResetKey, setFormResetKey] = useState(0);
  
  const [toastMessage, setToastMessage] = useState('');

  const { alerts, isLoaded, addAlert, updateAlert, removeAlert } = useAlerts();

  // Auto-open create panel if ?symbol=XYZ
  useEffect(() => {
    if (isLoaded && urlSymbol && !isCreating && !editingAlert) {
      setEditingAlert({ symbol: urlSymbol.toUpperCase(), comparison: 'ABOVE', value: '' });
      setIsCreating(true);
    }
  }, [isLoaded, urlSymbol]);

  // Theme persistence
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved) setThemeState(saved);
  }, []);

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleCreateNew = () => {
    setEditingAlert(null);
    setFormResetKey(k => k + 1); // Force form state reset
    setIsCreating(true);
  };

  const handleSelectAlert = (alert) => {
    setEditingAlert(alert);
    setIsCreating(true);
  };

  const handleSaveAlert = (alertData) => {
    if (alertData.delete) {
      removeAlert(alertData.id);
      setToastMessage(`Alert deleted successfully.`);
      setEditingAlert(null);
      setIsCreating(false);
      return;
    }

    if (alertData.id) {
      updateAlert(alertData.id, alertData);
      setToastMessage(`Alert updated for ${alertData.symbol}.`);
    } else {
      addAlert(alertData);
      setToastMessage(`Alert set for ${alertData.symbol} ${alertData.comparison.toLowerCase()} ${alertData.value}`);
    }
    
    setEditingAlert(null);
    setIsCreating(false);
  };

  const handleSmartSet = (suggestionData) => {
    handleCreateNew();
    // Simulate passing the suggestion into the form by using the editingState hack initially
    setEditingAlert(suggestionData);
  };

  return (
    <div className="app-layout" data-theme={theme}>
      <Sidebar theme={theme} setTheme={setTheme} />
      <div className="main-area">
        <TopBar />
        
        <div className="alerts-layout">
          <AlertsTopBar 
            filter={filter} 
            setFilter={setFilter} 
            onCreateNew={handleCreateNew} 
          />
          
          <div className="al-body">
            {/* 30% LEFT PANEL */}
            <AlertList 
               alerts={alerts}
               filter={filter}
               selectedId={editingAlert?.id}
               onSelect={handleSelectAlert}
               onSmartSet={handleSmartSet}
            />

            {/* 70% RIGHT PANEL */}
            {(isCreating || editingAlert) ? (
              <CreateAlertPanel 
                editingAlert={editingAlert}
                onSave={handleSaveAlert}
                onCancel={() => { setIsCreating(false); setEditingAlert(null); }}
                resetKey={formResetKey}
              />
            ) : (
              <div className="al-panel alp-empty">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                  <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zM12 8v4" />
                  <path d="M12 16h.01" />
                </svg>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>No alert selected</div>
                <div>Select an alert from the left or create a new one to view details here.</div>
              </div>
            )}
          </div>
        </div>

      </div>

      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
    </div>
  );
}

"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
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

  const { alerts, isLoaded, addAlert, updateAlert, removeAlert, markTriggered } = useAlerts();

  // ── Client-side alert checker: fetches live prices every 30s and evaluates conditions ──
  const checkerRef = useRef(null);

  const checkAlerts = useCallback(async () => {
    // Get active (non-triggered) alerts
    const activeAlerts = alerts.filter(a => !a.triggered && !a.expired);
    if (activeAlerts.length === 0) return;

    // Collect unique symbols
    const uniqueSymbols = [...new Set(activeAlerts.map(a => a.symbol.toUpperCase()))];

    try {
      // Fetch live prices via portfolio-quotes API (batch)
      const res = await fetch('/api/portfolio-quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbols: uniqueSymbols })
      });
      const data = await res.json();
      if (!data.success || !data.data) return;

      // Build symbol → stock data lookup
      const priceMap = {};
      for (const stock of data.data) {
        priceMap[stock.symbol.toUpperCase()] = stock;
      }

      // Evaluate each active alert
      for (const alert of activeAlerts) {
        const stock = priceMap[alert.symbol.toUpperCase()];
        if (!stock) continue;

        let currentValue;
        if (alert.type === 'volume') {
          currentValue = stock.volume;
        } else if (alert.type === 'rsi') {
          currentValue = stock.rsi;
        } else {
          currentValue = stock.price; // default: price
        }

        if (currentValue === null || currentValue === undefined) continue;

        const targetValue = parseFloat(alert.value);
        if (isNaN(targetValue)) continue;

        let isTriggered = false;

        switch (alert.comparison) {
          case 'Above':
            isTriggered = currentValue >= targetValue;
            break;
          case 'Below':
            isTriggered = currentValue <= targetValue;
            break;
          case 'Crosses':
            // Trigger if price is within 1% of target
            isTriggered = Math.abs(currentValue - targetValue) / targetValue <= 0.01;
            break;
          default:
            isTriggered = currentValue >= targetValue;
        }

        if (isTriggered) {
          await markTriggered(alert.id, currentValue);
          const label = alert.type === 'price' ? '₹' : '';
          setToastMessage(`🔔 Alert triggered! ${alert.symbol} ${alert.type} is now ${label}${currentValue} (${alert.comparison} ${label}${targetValue})`);
        }
      }
    } catch (e) {
      console.warn('Alert check failed:', e);
    }
  }, [alerts, markTriggered]);

  // Run checker every 30 seconds
  useEffect(() => {
    if (!isLoaded) return;

    // Run once immediately
    checkAlerts();

    checkerRef.current = setInterval(checkAlerts, 30000);
    return () => clearInterval(checkerRef.current);
  }, [isLoaded, checkAlerts]);

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

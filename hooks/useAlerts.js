"use client";
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'swinglify_alerts';

export function useAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setAlerts(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Failed to load alerts from local storage");
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const saveAlerts = (newAlerts) => {
    setAlerts(newAlerts);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newAlerts));
  };

  const addAlert = (alert) => {
    const newAlert = {
      ...alert,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      status: 'active'
    };
    saveAlerts([newAlert, ...alerts]);
  };

  const updateAlert = (id, updates) => {
    saveAlerts(alerts.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const removeAlert = (id) => {
    saveAlerts(alerts.filter(a => a.id !== id));
  };

  const markTriggered = (id, triggerPrice) => {
    saveAlerts(alerts.map(a => a.id === id ? { 
      ...a, 
      status: 'triggered', 
      triggerPrice,
      triggerTimestamp: new Date().toISOString() 
    } : a));
  };

  return { alerts, isLoaded, addAlert, updateAlert, removeAlert, markTriggered };
}

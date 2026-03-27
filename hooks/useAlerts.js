"use client";
import { useState, useEffect, useCallback } from 'react';

export function useAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Fetch alerts from MongoDB on mount
  const fetchAlerts = useCallback(async () => {
    try {
      const res = await fetch('/api/alerts');
      const data = await res.json();
      if (data.success) {
        setAlerts(data.data);
      }
    } catch (e) {
      console.warn("Failed to load alerts from server:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const addAlert = async (alert) => {
    try {
      const res = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alert)
      });
      const data = await res.json();
      if (data.success) {
        setAlerts(prev => [data.data, ...prev]);
      }
    } catch (e) {
      console.error('Failed to create alert:', e);
    }
  };

  const updateAlert = async (id, updates) => {
    try {
      const res = await fetch(`/api/alerts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (data.success) {
        setAlerts(prev => prev.map(a => a.id === id ? data.data : a));
      }
    } catch (e) {
      console.error('Failed to update alert:', e);
    }
  };

  const removeAlert = async (id) => {
    try {
      const res = await fetch(`/api/alerts/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setAlerts(prev => prev.filter(a => a.id !== id));
      }
    } catch (e) {
      console.error('Failed to delete alert:', e);
    }
  };

  const markTriggered = async (id, triggerPrice) => {
    await updateAlert(id, { triggered: true, triggerPrice });
  };

  return { alerts, isLoaded, addAlert, updateAlert, removeAlert, markTriggered };
}

"use client";
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const STORAGE_KEY = 'swinglify_watchlist';

export function useWatchlist() {
  const { data: session, status } = useSession();
  const [watchedSymbols, setWatchedSymbols] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. Initial Load from LocalStorage (fastest for UX)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setWatchedSymbols(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Failed to load watchlist from local storage");
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // 2. Hydrate from MongoDB once authenticated
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      fetch('/api/user/sync')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data && data.data.watchlist) {
            // Server data takes priority; overwrite local state
            setWatchedSymbols(data.data.watchlist);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data.data.watchlist));
          }
        })
        .catch(err => console.error("Failed to sync watchlist from db:", err));
    }
  }, [status, session]);

  // 3. Save function that mutates both local and server
  const saveSymbols = (newSymbols) => {
    // Keep unique elements
    const unique = [...new Set(newSymbols)];
    setWatchedSymbols(unique);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(unique));

    // Fire & Forget DB Update
    if (status === 'authenticated') {
      fetch('/api/user/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ watchlist: unique })
      }).catch(err => console.error("Background sync failed:", err));
    }
  };

  const addStock = (symbol) => {
    if (!watchedSymbols.includes(symbol)) {
      saveSymbols([symbol, ...watchedSymbols]);
    }
  };

  const removeStock = (symbol) => {
    saveSymbols(watchedSymbols.filter(s => s !== symbol));
  };

  const hasStock = (symbol) => {
    return watchedSymbols.includes(symbol);
  };

  const clearAll = () => {
    saveSymbols([]);
  };

  return { watchedSymbols, isLoaded, addStock, removeStock, hasStock, clearAll };
}

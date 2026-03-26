"use client";
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'swinglify_watchlist';

export function useWatchlist() {
  const [watchedSymbols, setWatchedSymbols] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

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

  const saveSymbols = (newSymbols) => {
    // Keep unique elements
    const unique = [...new Set(newSymbols)];
    setWatchedSymbols(unique);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(unique));
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

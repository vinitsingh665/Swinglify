"use client";
import { useState, useEffect, useCallback } from 'react';

import { useSession } from 'next-auth/react';

export function usePortfolio() {
  const { data: session, status } = useSession();
  const [holdings, setHoldings] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. Initial Load from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('swinglify_portfolio');
      if (saved) {
        setHoldings(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Failed to load portfolio from local storage");
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
          if (data.success && data.data && data.data.portfolio) {
            setHoldings(data.data.portfolio);
            localStorage.setItem('swinglify_portfolio', JSON.stringify(data.data.portfolio));
          }
        })
        .catch(err => console.error("Failed to sync portfolio from db:", err));
    }
  }, [status, session]);

  // 3. Save function that mutates both local and server
  const saveHoldings = (newHoldings) => {
    setHoldings(newHoldings);
    localStorage.setItem('swinglify_portfolio', JSON.stringify(newHoldings));

    if (status === 'authenticated') {
      fetch('/api/user/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ portfolio: newHoldings })
      }).catch(err => console.error("Background sync failed:", err));
    }
  };

  const addHolding = (holding) => {
    const newHoldings = [...holdings, { 
      ...holding, 
      id: Date.now().toString(),
      dateAdded: new Date().toISOString()
    }];
    saveHoldings(newHoldings);
  };

  const removeHolding = (id) => {
    saveHoldings(holdings.filter(h => h.id !== id));
  };

  const updateHolding = (id, updated) => {
    saveHoldings(holdings.map(h => h.id === id ? { ...h, ...updated } : h));
  };

  return { holdings, isLoaded, addHolding, removeHolding, updateHolding };
}

export function usePortfolioQuotes(symbols, refreshInterval = 10) {
  const [quotes, setQuotes] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchQuotes = useCallback(async () => {
    if (!symbols || symbols.length === 0) return;
    try {
      setLoading(true);
      const res = await fetch('/api/portfolio-quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbols })
      });
      const data = await res.json();
      if (data.success) {
        const quoteMap = {};
        data.data.forEach(stock => {
           // TradingView might return symbol, we map it
           quoteMap[stock.symbol] = stock;
        });
        setQuotes(quoteMap);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(symbols)]);

  useEffect(() => {
    fetchQuotes();
    const interval = setInterval(fetchQuotes, refreshInterval * 1000);
    return () => clearInterval(interval);
  }, [fetchQuotes, refreshInterval]);

  return { quotes, loading, refresh: fetchQuotes };
}

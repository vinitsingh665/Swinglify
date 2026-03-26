"use client";
import { useState, useEffect, useCallback } from 'react';

export function usePortfolio() {
  const [holdings, setHoldings] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

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

  const saveHoldings = (newHoldings) => {
    setHoldings(newHoldings);
    localStorage.setItem('swinglify_portfolio', JSON.stringify(newHoldings));
  };

  const addHolding = (holding) => {
    // Requires: symbol, name, qty, avgPrice
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

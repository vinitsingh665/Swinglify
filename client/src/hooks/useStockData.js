import { useState, useEffect, useCallback, useRef } from 'react';

export function useStockData(category, refreshInterval = 10) {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [totalCount, setTotalCount] = useState(0);
    const [countdown, setCountdown] = useState(refreshInterval);
    const timerRef = useRef(null);
    const countdownRef = useRef(null);

    const fetchStocks = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch(`/api/stocks/${category}`);
            const data = await res.json();
            if (data.success) {
                setStocks(data.data);
                setTotalCount(data.totalCount || data.count);
                setLastUpdated(data.lastUpdated);
            } else {
                setError(data.error || 'Failed to fetch stocks');
            }
        } catch (err) {
            setError('Failed to connect to API');
        } finally {
            setLoading(false);
        }
    }, [category]);

    const refresh = useCallback(() => {
        setCountdown(refreshInterval);
        fetchStocks();
    }, [fetchStocks, refreshInterval]);

    useEffect(() => {
        fetchStocks();
        setCountdown(refreshInterval);

        // Auto-refresh timer
        timerRef.current = setInterval(() => {
            fetchStocks();
            setCountdown(refreshInterval);
        }, refreshInterval * 1000);

        // Countdown timer
        countdownRef.current = setInterval(() => {
            setCountdown(prev => (prev <= 1 ? refreshInterval : prev - 1));
        }, 1000);

        return () => {
            clearInterval(timerRef.current);
            clearInterval(countdownRef.current);
        };
    }, [category, fetchStocks, refreshInterval]);

    return { stocks, loading, error, lastUpdated, totalCount, countdown, refresh };
}

export function useMarketStatus() {
    const [status, setStatus] = useState({ isOpen: false, status: 'LOADING' });

    const fetchStatus = useCallback(async () => {
        try {
            const res = await fetch('/api/market-status');
            const data = await res.json();
            if (data.success) setStatus(data);
        } catch (err) { /* ignore */ }
    }, []);

    useEffect(() => {
        fetchStatus();
        const timer = setInterval(fetchStatus, 60000);
        return () => clearInterval(timer);
    }, [fetchStatus]);

    return status;
}

export function useIndices() {
    const [indices, setIndices] = useState([]);

    const fetchIndices = useCallback(async () => {
        try {
            const res = await fetch('/api/indices');
            const data = await res.json();
            if (data.success) setIndices(data.data);
        } catch (err) { /* ignore */ }
    }, []);

    useEffect(() => {
        fetchIndices();
        const timer = setInterval(fetchIndices, 15000);
        return () => clearInterval(timer);
    }, [fetchIndices]);

    return { indices, refreshIndices: fetchIndices };
}

export function useSearch() {
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const timeoutRef = useRef(null);

    const search = useCallback((query) => {
        clearTimeout(timeoutRef.current);
        if (!query || query.length < 1) {
            setResults([]);
            return;
        }
        timeoutRef.current = setTimeout(async () => {
            setSearching(true);
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                const data = await res.json();
                if (data.success) setResults(data.data.slice(0, 50));
                else setResults([]);
            } catch { setResults([]); }
            finally { setSearching(false); }
        }, 300);
    }, []);

    const clearResults = useCallback(() => setResults([]), []);

    return { results, searching, search, clearResults };
}

export function useStockDetail() {
    const [stock, setStock] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchStock = useCallback(async (symbol) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/stock/${symbol}`);
            const data = await res.json();
            if (data.success) setStock(data.data);
            else setStock(null);
        } catch { setStock(null); }
        finally { setLoading(false); }
    }, []);

    const clearStock = useCallback(() => setStock(null), []);

    return { stock, loading, fetchStock, clearStock };
}

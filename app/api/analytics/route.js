import { fetchFromTradingView, parseStockData, getCached, setCache, FIELDS } from '../../../lib/api-core';

const NSE_BASE = [
    { left: 'is_primary', operation: 'equal', right: true },
    { left: 'exchange', operation: 'equal', right: 'NSE' }
];

const SECTOR_CONFIGS = {
    'IT':         { filter: [...NSE_BASE, { left: 'sector', operation: 'in_range', right: ['Technology', 'Technology Services', 'Information Technology'] }, { left: 'market_cap_basic', operation: 'greater', right: 5e9 }], limit: 30 },
    'Banks':      { filter: [...NSE_BASE, { left: 'sector', operation: 'in_range', right: ['Finance', 'Financial Services'] }, { left: 'industry', operation: 'in_range', right: ['Banks—Regional', 'Banks—Diversified', 'Banks - Regional', 'Banks - Diversified', 'Banking Services', 'Major Banks'] }, { left: 'market_cap_basic', operation: 'greater', right: 10e9 }], limit: 20 },
    'Pharma':     { filter: [...NSE_BASE, { left: 'sector', operation: 'in_range', right: ['Health Technology', 'Healthcare', 'Health Services'] }, { left: 'market_cap_basic', operation: 'greater', right: 5e9 }], limit: 25 },
    'Auto':       { filter: [...NSE_BASE, { left: 'sector', operation: 'in_range', right: ['Consumer Durables', 'Producer Manufacturing'] }, { left: 'industry', operation: 'in_range', right: ['Auto Parts: OEM', 'Auto Manufacturing', 'Motor Vehicles', 'Automobile Manufacturers', 'Automotive'] }, { left: 'market_cap_basic', operation: 'greater', right: 5e9 }], limit: 20 },
    'FMCG':       { filter: [...NSE_BASE, { left: 'sector', operation: 'in_range', right: ['Consumer Non-Durables', 'Consumer Staples'] }, { left: 'market_cap_basic', operation: 'greater', right: 5e9 }], limit: 20 },
    'Metal':      { filter: [...NSE_BASE, { left: 'sector', operation: 'in_range', right: ['Non-Energy Minerals', 'Process Industries'] }, { left: 'industry', operation: 'in_range', right: ['Steel', 'Aluminum', 'Other Metals/Minerals', 'Iron/Steel', 'Copper', 'Metal Mining'] }, { left: 'market_cap_basic', operation: 'greater', right: 5e9 }], limit: 20 },
    'Energy':     { filter: [...NSE_BASE, { left: 'sector', operation: 'in_range', right: ['Energy Minerals', 'Utilities', 'Energy'] }, { left: 'market_cap_basic', operation: 'greater', right: 5e9 }], limit: 20 },
    'Realty':     { filter: [...NSE_BASE, { left: 'industry', operation: 'in_range', right: ['Real Estate Development', 'Real Estate', 'Homebuilding', 'Real Estate Services'] }, { left: 'market_cap_basic', operation: 'greater', right: 3e9 }], limit: 15 },
    'Infra':      { filter: [...NSE_BASE, { left: 'sector', operation: 'in_range', right: ['Industrial Services', 'Producer Manufacturing', 'Industrials'] }, { left: 'industry', operation: 'in_range', right: ['Engineering & Construction', 'Construction Materials', 'Building Products'] }, { left: 'market_cap_basic', operation: 'greater', right: 5e9 }], limit: 20 },
    'Media':      { filter: [...NSE_BASE, { left: 'sector', operation: 'in_range', right: ['Consumer Services', 'Communication Services'] }, { left: 'industry', operation: 'in_range', right: ['Broadcasting', 'Movies/Entertainment', 'Media', 'Entertainment'] }, { left: 'market_cap_basic', operation: 'greater', right: 2e9 }], limit: 15 },
};

async function fetchSector(name, config) {
    try {
        const body = {
            filter: config.filter,
            symbols: { query: { types: ['stock'] } },
            columns: FIELDS,
            sort: { sortBy: 'market_cap_basic', sortOrder: 'desc' },
            range: [0, config.limit]
        };
        const tvData = await fetchFromTradingView(body);
        const stocks = parseStockData(tvData);
        const advancing = stocks.filter(s => (s.change || 0) > 0).length;
        const declining = stocks.filter(s => (s.change || 0) < 0).length;
        const avgChange = stocks.length ? stocks.reduce((sum, s) => sum + (s.change || 0), 0) / stocks.length : 0;
        const avgPerfWeek = stocks.length ? stocks.reduce((sum, s) => sum + (s.perfWeek || 0), 0) / stocks.length : 0;
        const avgPerfMonth = stocks.length ? stocks.reduce((sum, s) => sum + (s.perfMonth || 0), 0) / stocks.length : 0;
        return { name, change1D: Math.round(avgChange * 100) / 100, change1W: Math.round(avgPerfWeek * 100) / 100, change1M: Math.round(avgPerfMonth * 100) / 100, advancing, declining, stockCount: stocks.length };
    } catch { return { name, change1D: 0, change1W: 0, change1M: 0, advancing: 0, declining: 0, stockCount: 0 }; }
}

async function fetchBroadMarket() {
    const body = {
        filter: [...NSE_BASE, { left: 'market_cap_basic', operation: 'greater', right: 5e9 }],
        symbols: { query: { types: ['stock'] } },
        columns: FIELDS,
        sort: { sortBy: 'market_cap_basic', sortOrder: 'desc' },
        range: [0, 500]
    };
    const tvData = await fetchFromTradingView(body);
    return parseStockData(tvData);
}

async function fetchIndices() {
    const body = {
        symbols: { tickers: ['NSE:NIFTY', 'NSE:BANKNIFTY', 'BSE:SENSEX', 'NSE:NIFTY_MID_SELECT', 'NSE:INDIA_VIX'], query: { types: [] } },
        columns: ['name', 'description', 'close', 'change', 'change_abs', 'high', 'low', 'open', 'Perf.W', 'Perf.1M', 'Perf.YTD']
    };
    const tvData = await fetchFromTradingView(body);
    return (tvData.data || []).map(item => {
        const d = item.d;
        return { symbol: d[0], name: d[1] || d[0], value: Math.round((d[2] || 0) * 100) / 100, change: Math.round((d[3] || 0) * 100) / 100, changeAbs: Math.round((d[4] || 0) * 100) / 100, perfWeek: Math.round((d[8] || 0) * 100) / 100, perfMonth: Math.round((d[9] || 0) * 100) / 100, perfYTD: Math.round((d[10] || 0) * 100) / 100 };
    });
}

export async function GET() {
    try {
        const cacheKey = 'analytics_full';
        const cached = getCached(cacheKey);
        if (cached) return Response.json(cached);

        // Parallel fetch everything
        const [indices, allStocks, ...sectorResults] = await Promise.all([
            fetchIndices(),
            fetchBroadMarket(),
            ...Object.entries(SECTOR_CONFIGS).map(([name, config]) => fetchSector(name, config))
        ]);

        // Market pulse
        const advancing = allStocks.filter(s => (s.change || 0) > 0).length;
        const declining = allStocks.filter(s => (s.change || 0) < 0).length;
        const unchanged = allStocks.length - advancing - declining;
        const advDecRatio = declining > 0 ? Math.round((advancing / declining) * 100) / 100 : advancing;
        const vix = indices.find(i => i.symbol === 'INDIA_VIX');
        const nifty = indices.find(i => i.symbol === 'NIFTY');

        let sentiment = 'Neutral';
        if (advDecRatio > 1.5 && (vix?.value || 20) < 18) sentiment = 'Bullish';
        else if (advDecRatio > 1.2) sentiment = 'Mildly Bullish';
        else if (advDecRatio < 0.6) sentiment = 'Bearish';
        else if (advDecRatio < 0.8) sentiment = 'Mildly Bearish';

        // Trend signals
        const rsiOversold = allStocks.filter(s => s.rsi != null && s.rsi < 30).sort((a, b) => (a.rsi || 0) - (b.rsi || 0)).slice(0, 8);
        const rsiOverbought = allStocks.filter(s => s.rsi != null && s.rsi > 70).sort((a, b) => (b.rsi || 0) - (a.rsi || 0)).slice(0, 8);
        const emaCrossover = allStocks.filter(s => s.ema50 && s.ema200 && s.ema50 > s.ema200 && s.price > s.ema50).sort((a, b) => (b.change || 0) - (a.change || 0)).slice(0, 8);
        const breakouts = allStocks.filter(s => s.price && s.week52High && s.price >= s.week52High * 0.97).sort((a, b) => (b.change || 0) - (a.change || 0)).slice(0, 8);

        // Opportunities
        const topMovers = [...allStocks].sort((a, b) => Math.abs(b.change || 0) - Math.abs(a.change || 0)).slice(0, 10);
        const volumeSpikes = allStocks.filter(s => s.volume && s.avgVolume10d && s.avgVolume10d > 0 && (s.volume / s.avgVolume10d) > 2).sort((a, b) => (b.volume / b.avgVolume10d) - (a.volume / a.avgVolume10d)).slice(0, 10).map(s => ({ ...s, volumeRatio: Math.round((s.volume / s.avgVolume10d) * 100) / 100 }));

        // EMA Breadth
        const computeEmaBreadth = (emaKey, label) => {
            const valid = allStocks.filter(s => s.price != null && s[emaKey] != null);
            const above = valid.filter(s => s.price > s[emaKey]).length;
            const below = valid.length - above;
            const abovePct = valid.length > 0 ? Math.round((above / valid.length) * 100) : 0;
            return { label, above, below, total: valid.length, abovePct, belowPct: 100 - abovePct };
        };

        const emaBreadth = {
            ema10: computeEmaBreadth('ema10', '10 EMA'),
            ema20: computeEmaBreadth('ema20', '20 EMA'),
            ema50: computeEmaBreadth('ema50', '50 EMA'),
            ema200: computeEmaBreadth('ema200', '200 EMA'),
        };

        const result = {
            success: true,
            lastUpdated: new Date().toISOString(),
            indices,
            marketPulse: { advancing, declining, unchanged, advDecRatio, sentiment, totalStocks: allStocks.length, niftyTrend: (nifty?.change || 0) >= 0 ? 'up' : 'down' },
            sectors: sectorResults.sort((a, b) => b.change1D - a.change1D),
            signals: {
                rsiOversold: { count: allStocks.filter(s => s.rsi != null && s.rsi < 30).length, stocks: rsiOversold },
                rsiOverbought: { count: allStocks.filter(s => s.rsi != null && s.rsi > 70).length, stocks: rsiOverbought },
                emaCrossover: { count: allStocks.filter(s => s.ema50 && s.ema200 && s.ema50 > s.ema200 && s.price > s.ema50).length, stocks: emaCrossover },
                breakouts: { count: allStocks.filter(s => s.price && s.week52High && s.price >= s.week52High * 0.97).length, stocks: breakouts }
            },
            emaBreadth,
            opportunities: { topMovers, volumeSpikes }
        };

        setCache(cacheKey, result);
        return Response.json(result);
    } catch (error) {
        console.error('[Analytics API Error]', error);
        return Response.json({ success: false, error: 'Failed to fetch analytics' }, { status: 500 });
    }
}

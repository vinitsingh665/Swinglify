import { fetchFromTradingView, parseStockData, getCached, setCache, FIELDS } from '../../../lib/api-core';

const NSE_BASE = [
    { left: 'is_primary', operation: 'equal', right: true },
    { left: 'exchange', operation: 'equal', right: 'NSE' }
];

const BSE_BASE = [
    { left: 'is_primary', operation: 'equal', right: true },
    { left: 'exchange', operation: 'equal', right: 'BSE' }
];

// Sector list for dropdown
const SECTORS = [
    'Technology', 'Finance', 'Health Technology', 'Consumer Non-Durables',
    'Energy Minerals', 'Process Industries', 'Producer Manufacturing',
    'Consumer Durables', 'Consumer Services', 'Industrial Services',
    'Utilities', 'Non-Energy Minerals', 'Communications',
    'Distribution Services', 'Transportation', 'Retail Trade',
    'Commercial Services', 'Electronic Technology', 'Health Services',
    'Miscellaneous'
];

export async function POST(request) {
    try {
        const body = await request.json();
        const {
            exchange = 'NSE',
            priceMin, priceMax,
            changeMin,
            volumeMin,
            rsiMode,       // 'oversold' | 'overbought' | null
            emaMode,       // 'above50' | 'golden' | null
            marketCap,     // 'large' | 'mid' | 'small' | null
            sector,        // string | null
            signal,        // 'BUY' | 'SELL' | null
            sortBy = 'volume',
            sortOrder = 'desc',
            limit = 200
        } = body;

        // Build cache key
        const cacheKey = `screener_${JSON.stringify(body)}`;
        const cached = getCached(cacheKey);
        if (cached) {
            return Response.json(cached);
        }

        // Build dynamic filter
        const filters = exchange === 'BSE' ? [...BSE_BASE] : [...NSE_BASE];

        // Always require some market cap minimum to filter noise
        filters.push({ left: 'market_cap_basic', operation: 'greater', right: 1000000000 });

        // Price range
        if (priceMin) filters.push({ left: 'close', operation: 'greater', right: Number(priceMin) });
        if (priceMax) filters.push({ left: 'close', operation: 'less', right: Number(priceMax) });

        // Change filter
        if (changeMin) filters.push({ left: 'change', operation: 'greater', right: Number(changeMin) });

        // Volume filter
        if (volumeMin) filters.push({ left: 'volume', operation: 'greater', right: Number(volumeMin) });

        // RSI filter
        if (rsiMode === 'oversold') filters.push({ left: 'RSI', operation: 'less', right: 30 });
        if (rsiMode === 'overbought') filters.push({ left: 'RSI', operation: 'greater', right: 70 });

        // EMA filter
        if (emaMode === 'above50') {
            // Price above 50 EMA — the scanner can compare fields
            filters.push({ left: 'close', operation: 'greater', right: 'EMA50' });
        }
        if (emaMode === 'golden') {
            // Golden cross: EMA50 > EMA200
            filters.push({ left: 'EMA50', operation: 'greater', right: 'EMA200' });
        }

        // Market cap filter
        if (marketCap === 'large') filters.push({ left: 'market_cap_basic', operation: 'greater', right: 80000000000 });
        if (marketCap === 'mid') filters.push({ left: 'market_cap_basic', operation: 'in_range', right: [10000000000, 80000000000] });
        if (marketCap === 'small') filters.push({ left: 'market_cap_basic', operation: 'less', right: 10000000000 });

        // Sector filter
        if (sector) filters.push({ left: 'sector', operation: 'in_range', right: [sector] });

        // Signal filter
        if (signal === 'BUY') filters.push({ left: 'Recommend.All', operation: 'greater', right: 0.1 });
        if (signal === 'SELL') filters.push({ left: 'Recommend.All', operation: 'less', right: -0.1 });

        // Sort mapping
        const sortMap = {
            'volume': 'volume',
            'change': 'change',
            'price': 'close',
            'marketcap': 'market_cap_basic',
            'rsi': 'RSI',
            'name': 'name'
        };

        const tvBody = {
            filter: filters,
            symbols: { query: { types: ['stock'] } },
            columns: FIELDS,
            sort: { sortBy: sortMap[sortBy] || 'volume', sortOrder: sortOrder || 'desc' },
            range: [0, Math.min(Number(limit), 500)]
        };

        const tvData = await fetchFromTradingView(tvBody);
        const stocks = parseStockData(tvData);

        const result = {
            success: true,
            data: stocks,
            count: stocks.length,
            totalCount: tvData.totalCount || stocks.length,
            sectors: SECTORS
        };

        setCache(cacheKey, result);
        return Response.json(result);

    } catch (error) {
        console.error('[Screener API Error]', error);
        return Response.json({ success: false, error: 'Failed to fetch screener data' }, { status: 500 });
    }
}

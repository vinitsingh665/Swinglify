import { NextResponse } from 'next/server';
import { getCached, setCache, fetchFromTradingView, parseStockData, FIELDS } from '../../../../lib/api-core';

export async function GET(request, { params }) {
    try {
        const p = await params;
        const symbol = p.symbol.toUpperCase();
        
        const cacheKey = `stock_${symbol}`;
        const cached = getCached(cacheKey);
        if (cached) return NextResponse.json({ ...cached, cached: true });

        const body = {
            filter: [
                { left: 'name,logoid,description', operation: 'match', right: symbol }
            ],
            symbols: { query: { types: ['stock'] } },
            columns: FIELDS,
            sort: { sortBy: 'volume', sortOrder: 'desc' },
            range: [0, 5],
            options: { lang: 'en' }
        };

        const tvData = await fetchFromTradingView(body);
        const stocks = parseStockData(tvData);

        if (stocks.length === 0) {
            return NextResponse.json({ success: false, error: `Stock "${symbol}" not found` }, { status: 404 });
        }

        const result = {
            success: true,
            lastUpdated: new Date().toISOString(),
            data: stocks[0]
        };

        setCache(cacheKey, result);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch stock detail', details: error.message }, { status: 500 });
    }
}

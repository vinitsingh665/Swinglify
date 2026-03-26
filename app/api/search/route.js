import { NextResponse } from 'next/server';
import { getCached, setCache, fetchFromTradingView, parseStockData, FIELDS } from '../../../lib/api-core';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = (searchParams.get('q') || '').trim().toUpperCase();
        
        if (!query || query.length < 1) {
            return NextResponse.json({ success: false, error: 'Query parameter "q" is required' }, { status: 400 });
        }

        // Log search query for Admin Dashboard
        try {
            const dataFile = path.join(process.cwd(), 'data', 'searches.json');
            let searchesData = [];
            try {
                const fileContent = await fs.readFile(dataFile, 'utf8');
                searchesData = JSON.parse(fileContent);
            } catch (e) {}
            
            // Append and trim to last 1000 searches to prevent huge file size
            searchesData.unshift({ query, timestamp: new Date().toISOString() });
            if (searchesData.length > 1000) searchesData = searchesData.slice(0, 1000);
            
            await fs.writeFile(dataFile, JSON.stringify(searchesData, null, 2), 'utf8');
        } catch (dbErr) {
            console.error('Failed to log search:', dbErr);
        }

        const cacheKey = `search_${query}`;
        const cached = getCached(cacheKey);
        if (cached) return NextResponse.json({ ...cached, cached: true });

        const body = {
            filter: [
                { left: 'is_primary', operation: 'equal', right: true },
                { left: 'exchange', operation: 'equal', right: 'NSE' },
                { left: 'name,description', operation: 'match', right: query }
            ],
            symbols: { query: { types: ['stock'] } },
            columns: FIELDS,
            sort: { sortBy: 'volume', sortOrder: 'desc' },
            range: [0, 50],
            options: { lang: 'en' }
        };

        const tvData = await fetchFromTradingView(body);
        const stocks = parseStockData(tvData);

        const result = {
            success: true,
            query,
            count: stocks.length,
            lastUpdated: new Date().toISOString(),
            data: stocks
        };

        setCache(cacheKey, result);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Search failed', details: error.message }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import { getCached, setCache, CATEGORY_FILTERS, fetchFromTradingView, parseStockData, FIELDS } from '../../../../lib/api-core';

export async function GET(request, { params }) {
    try {
        const p = await params;
        const category = p.category.toLowerCase();
        const config = CATEGORY_FILTERS[category];

        if (!config) {
            return NextResponse.json({
                success: false,
                error: `Invalid category. Available: ${Object.keys(CATEGORY_FILTERS).join(', ')}`
            }, { status: 400 });
        }

        const { searchParams } = new URL(request.url);
        const exchange = searchParams.get('exchange')?.toUpperCase() || 'NSE';
        const limit = parseInt(searchParams.get('limit')) || config.limit;

        const cacheKey = `stocks_${category}_${exchange}_${limit}`;
        const cached = getCached(cacheKey);
        if (cached) return NextResponse.json({ ...cached, cached: true });

        // Deep copy filter to safely modify the exchange logic per-request
        const customFilter = JSON.parse(JSON.stringify(config.filter));
        const exFilter = customFilter.find(f => f.left === 'exchange');
        if (exFilter) exFilter.right = exchange;

        const body = {
            filter: customFilter,
            symbols: { query: { types: ['stock'] } },
            columns: FIELDS,
            sort: config.sort,
            range: [0, limit],
            options: { lang: 'en' }
        };

        const tvData = await fetchFromTradingView(body);
        const stocks = parseStockData(tvData);

        const result = {
            success: true,
            category,
            count: stocks.length,
            totalCount: tvData.totalCount || stocks.length,
            lastUpdated: new Date().toISOString(),
            data: stocks
        };

        setCache(cacheKey, result);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch stock data', details: error.message }, { status: 500 });
    }
}

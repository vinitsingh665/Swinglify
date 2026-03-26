import { NextResponse } from 'next/server';
import { fetchFromTradingView, parseStockData, FIELDS } from '../../../lib/api-core';

export async function POST(request) {
    try {
        const { symbols } = await request.json(); 
        if (!symbols || !symbols.length) {
            return NextResponse.json({ success: true, data: [] });
        }

        // TradingView requires explicit exchange mapping: "NSE:RELIANCE"
        const tickers = symbols.map(s => s.includes(':') ? s.toUpperCase() : `NSE:${s.toUpperCase()}`);

        const body = {
            symbols: { tickers },
            columns: FIELDS,
            options: { lang: 'en' }
        };

        const tvData = await fetchFromTradingView(body);
        const stocks = parseStockData(tvData);
        
        return NextResponse.json({ success: true, data: stocks });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch portfolio quotes', details: error.message }, { status: 500 });
    }
}

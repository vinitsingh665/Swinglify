import { NextResponse } from 'next/server';
import { getCached, setCache } from '../../../lib/api-core';

export async function GET() {
    try {
        const cached = getCached('indices');
        if (cached) return NextResponse.json({ ...cached, cached: true });

        const body = {
            symbols: {
                tickers: ['NSE:NIFTY', 'NSE:BANKNIFTY', 'BSE:SENSEX', 'NSE:NIFTY_MID_SELECT', 'NSE:INDIA_VIX'],
                query: { types: [] }
            },
            columns: ['name', 'description', 'close', 'change', 'change_abs', 'high', 'low', 'open', 'Perf.W', 'Perf.1M', 'Perf.YTD']
        };

        const response = await fetch('https://scanner.tradingview.com/india/scan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0'
            },
            body: JSON.stringify(body)
        });

        const tvData = await response.json();

        const indices = (tvData.data || []).map(item => {
            const d = item.d;
            return {
                symbol: d[0],
                name: d[1] || d[0],
                value: d[2] ? Math.round(d[2]*100)/100 : null,
                change: d[3] ? Math.round(d[3]*100)/100 : null,
                changeAbs: d[4] ? Math.round(d[4]*100)/100 : null,
                high: d[5] ? Math.round(d[5]*100)/100 : null,
                low: d[6] ? Math.round(d[6]*100)/100 : null,
                open: d[7] ? Math.round(d[7]*100)/100 : null,
                perfWeek: d[8] ? Math.round(d[8]*100)/100 : null,
                perfMonth: d[9] ? Math.round(d[9]*100)/100 : null,
                perfYTD: d[10] ? Math.round(d[10]*100)/100 : null
            };
        });

        const result = {
            success: true,
            lastUpdated: new Date().toISOString(),
            data: indices
        };

        setCache('indices', result);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch indices', details: error.message }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import { getNextOpenTime } from '../../../lib/api-core';

export async function GET() {
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const ist = new Date(now.getTime() + istOffset);
    const hours = ist.getUTCHours();
    const minutes = ist.getUTCMinutes();
    const day = ist.getUTCDay();
    const timeInMinutes = hours * 60 + minutes;

    const isWeekday = day >= 1 && day <= 5;
    const marketOpen = 9 * 60 + 15;
    const marketClose = 15 * 60 + 30;
    const timeIsOpen = isWeekday && timeInMinutes >= marketOpen && timeInMinutes <= marketClose;
    
    const preMarketOpen = 9 * 60;
    const isPreMarket = isWeekday && timeInMinutes >= preMarketOpen && timeInMinutes < marketOpen;

    let isTradingDay = isWeekday; // Base assumption
    let tvIsOpen = null;

    // Fetch market status dynamically from TradingView via NIFTY update time
    // Used ONLY to detect holidays — not to override the time-based open/closed check
    try {
        const response = await fetch('https://scanner.tradingview.com/india/scan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0'
            },
            body: JSON.stringify({
                symbols: { tickers: ["NSE:NIFTY"] },
                columns: ["update_time"]
            }),
            next: { revalidate: 30 }
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data?.data?.[0]?.d?.[0]) {
                const updateTime = data.data[0].d[0];
                const currentUnix = Math.floor(Date.now() / 1000);
                const staleness = currentUnix - updateTime;
                
                // Holiday detection: If it's been 4+ hours since NIFTY last updated,
                // AND we're well past market open (45+ min), it's likely a holiday
                const minutesSinceOpen = timeInMinutes - marketOpen;
                const wellPastOpen = minutesSinceOpen >= 45;
                
                if (timeIsOpen && staleness > 14400 && wellPastOpen) {
                    // NIFTY hasn't updated in 4+ hours during market hours — holiday
                    isTradingDay = false;
                }
            }
        }
    } catch (err) {
        console.error('TradingView status fetch error:', err);
    }

    // Time-based check is the primary source of truth
    // Only mark closed if we've confirmed it's not a trading day (holiday)
    const isOpen = timeIsOpen && isTradingDay;

    return NextResponse.json({
        success: true,
        isOpen,
        isPreMarket: isPreMarket && isTradingDay,
        isTradingDay,
        status: isOpen ? 'OPEN' : (isPreMarket && isTradingDay) ? 'PRE_MARKET' : 'CLOSED',
        currentTimeIST: ist.toISOString().replace('Z', '+05:30'),
        tradingHours: '9:15 AM - 3:30 PM IST (Mon-Fri)',
        nextOpen: !isOpen ? getNextOpenTime(ist) : null
    });
}

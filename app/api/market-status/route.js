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

    const marketOpen = 9 * 60 + 15;
    const marketClose = 15 * 60 + 30;
    const isWeekday = day >= 1 && day <= 5;
    const isOpen = isWeekday && timeInMinutes >= marketOpen && timeInMinutes <= marketClose;

    const preMarketOpen = 9 * 60;
    const isPreMarket = isWeekday && timeInMinutes >= preMarketOpen && timeInMinutes < marketOpen;

    return NextResponse.json({
        success: true,
        isOpen,
        isPreMarket,
        status: isOpen ? 'OPEN' : isPreMarket ? 'PRE_MARKET' : 'CLOSED',
        currentTimeIST: ist.toISOString().replace('Z', '+05:30'),
        tradingHours: '9:15 AM - 3:30 PM IST (Mon-Fri)',
        nextOpen: !isOpen ? getNextOpenTime(ist) : null
    });
}

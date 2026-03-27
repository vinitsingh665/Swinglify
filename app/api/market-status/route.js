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

    const dateString = ist.toISOString().split('T')[0];
    
    // Add known NSE market holidays here (Format: 'YYYY-MM-DD')
    const TRADING_HOLIDAYS = [
      '2026-01-26', // Republic Day
      '2026-03-20', // Example Festival
      '2026-05-01', // Maharashtra Day
      '2026-08-15', // Independence Day
      '2026-10-02', // Gandhi Jayanti
      '2026-11-09', // Diwali
      '2026-12-25', // Christmas
    ];

    const isWeekday = day >= 1 && day <= 5;
    const isTradingDay = isWeekday && !TRADING_HOLIDAYS.includes(dateString);

    const marketOpen = 9 * 60 + 15;
    const marketClose = 15 * 60 + 30;
    const isOpen = isTradingDay && timeInMinutes >= marketOpen && timeInMinutes <= marketClose;

    const preMarketOpen = 9 * 60;
    const isPreMarket = isTradingDay && timeInMinutes >= preMarketOpen && timeInMinutes < marketOpen;

    return NextResponse.json({
        success: true,
        isOpen,
        isPreMarket,
        isTradingDay,
        status: isOpen ? 'OPEN' : isPreMarket ? 'PRE_MARKET' : 'CLOSED',
        currentTimeIST: ist.toISOString().replace('Z', '+05:30'),
        tradingHours: '9:15 AM - 3:30 PM IST (Mon-Fri)',
        nextOpen: !isOpen ? getNextOpenTime(ist) : null
    });
}

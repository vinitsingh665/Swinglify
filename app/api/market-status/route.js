import { NextResponse } from 'next/server';
import { getNextOpenTime } from '../../../lib/api-core';

// NSE holidays for 2026 (date strings in IST: YYYY-MM-DD)
const NSE_HOLIDAYS_2026 = [
    '2026-01-26', // Republic Day
    '2026-02-19', // Chhatrapati Shivaji Maharaj Jayanti  
    '2026-03-14', // Holi
    '2026-03-31', // Idul Fitr (Ramadan Eid)
    '2026-04-02', // Good Friday
    '2026-04-06', // Shri Ram Navami
    '2026-04-14', // Dr. Baba Saheb Ambedkar Jayanti
    '2026-05-01', // May Day / Maharashtra Day
    '2026-06-07', // Eid-Ul-Adha (Bakri Eid)
    '2026-07-07', // Muharram
    '2026-08-15', // Independence Day
    '2026-08-26', // Janmashtami
    '2026-09-05', // Milad-un-Nabi
    '2026-10-02', // Mahatma Gandhi Jayanti
    '2026-10-20', // Dussehra
    '2026-11-09', // Diwali (Laxmi Pujan)
    '2026-11-10', // Diwali (Balipratipada)
    '2026-11-30', // Guru Nanak Jayanti
    '2026-12-25', // Christmas
];

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

    // Check if today is a known NSE holiday
    const todayIST = ist.toISOString().slice(0, 10); // YYYY-MM-DD
    const isHoliday = NSE_HOLIDAYS_2026.includes(todayIST);
    const isTradingDay = isWeekday && !isHoliday;

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

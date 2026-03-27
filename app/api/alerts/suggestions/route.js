import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import InsightCache from '../../../../models/InsightCache';
import { generateSmartSuggestions } from '../../../../lib/ai';

export async function GET() {
  try {
    await dbConnect();

    // 1. Check daily cache
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(now.getTime() + istOffset);
    const todayStr = istDate.toISOString().split('T')[0];

    const cached = await InsightCache.findOne({ ticker: '__SMART_SUGGESTIONS__', dateString: todayStr });
    if (cached && cached.insightText) {
      try {
        return NextResponse.json({ suggestions: JSON.parse(cached.insightText), cached: true });
      } catch { /* fallthrough to generate fresh */ }
    }

    // 2. Fetch top movers from the screener API
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3050';
    const body = {
      symbols: { query: { types: ['stock'], exchanges: ['NSE'] } },
      columns: ['name', 'close', 'change', 'volume', 'RSI', 'Recommend.All'],
      sort: { sortBy: 'volume', sortOrder: 'desc' },
      range: [0, 8]
    };

    const tvRes = await fetch('https://scanner.tradingview.com/india/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0' },
      body: JSON.stringify(body)
    });
    const tvData = await tvRes.json();

    const topMovers = (tvData.data || []).map(item => {
      const d = item.d;
      const sym = item.s?.replace('NSE:', '') || '';
      return {
        symbol: sym,
        price: d[1] ? Math.round(d[1] * 100) / 100 : 0,
        change: d[2] ? Math.round(d[2] * 100) / 100 : 0,
        volume: d[3],
        rsi: d[4] ? Math.round(d[4] * 10) / 10 : null,
        recommendation: d[5] >= 0.5 ? 'STRONG_BUY' : d[5] >= 0.1 ? 'BUY' : d[5] <= -0.5 ? 'STRONG_SELL' : d[5] <= -0.1 ? 'SELL' : 'NEUTRAL'
      };
    }).filter(s => s.symbol && s.price > 0);

    if (topMovers.length === 0) {
      return NextResponse.json({ suggestions: [], error: 'No market data available.' });
    }

    // 3. Generate AI suggestions
    const suggestions = await generateSmartSuggestions(topMovers);

    // 4. Cache for the day
    if (suggestions.length > 0) {
      await InsightCache.findOneAndUpdate(
        { ticker: '__SMART_SUGGESTIONS__' },
        { insightText: JSON.stringify(suggestions), dateString: todayStr, createdAt: Date.now() },
        { upsert: true, new: true }
      );
    }

    return NextResponse.json({ suggestions, cached: false });
  } catch (error) {
    console.error('Smart Suggestions API Error:', error);
    return NextResponse.json({ suggestions: [], error: 'Failed to generate suggestions' }, { status: 500 });
  }
}

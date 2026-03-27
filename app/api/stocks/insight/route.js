import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import InsightCache from '../../../../models/InsightCache';
import { generateStockInsight } from '../../../../lib/ai';

// Removed 'edge' runtime because Mongoose/MongoDB connection requires Node environment.

export async function POST(req) {
  try {
    const body = await req.json();
    const { ticker, currentPrice, rsi, technicalScore } = body;

    if (!ticker || !currentPrice) {
      return NextResponse.json({ error: 'Missing required stock data' }, { status: 400 });
    }

    await dbConnect();

    // 1. Generate today's date string based on IST
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(now.getTime() + istOffset);
    const todayStr = istDate.toISOString().split('T')[0]; // "YYYY-MM-DD"

    // 2. Check Database Cache First
    const cachedEntry = await InsightCache.findOne({ ticker, dateString: todayStr });
    if (cachedEntry && cachedEntry.insightText) {
      return NextResponse.json({ insight: cachedEntry.insightText, cached: true });
    }

    // 3. Generate Fresh AI Insight from Groq
    const insight = await generateStockInsight(ticker, currentPrice, rsi, technicalScore);

    // 4. Save to Database Cache
    if (insight && !insight.includes('currently unavailable')) {
      // Upsert to ensure we only keep one entry per ticker
      await InsightCache.findOneAndUpdate(
        { ticker },
        { insightText: insight, dateString: todayStr, createdAt: Date.now() },
        { upsert: true, new: true }
      );
    }

    return NextResponse.json({ insight, cached: false });
  } catch (error) {
    console.error('API /stocks/insight error:', error);
    return NextResponse.json({ error: 'Failed to generate insight' }, { status: 500 });
  }
}

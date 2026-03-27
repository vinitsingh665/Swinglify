import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Signal from '../../../../models/Signal';

// GET — Aggregated signals for today (or a specific date)
export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
    const limit = parseInt(searchParams.get('limit') || '10');

    const signals = await Signal.find({ date })
      .sort({ totalPosts: -1 })
      .limit(limit)
      .lean();

    // Compute confidence level for each signal
    const enriched = signals.map(s => {
      const total = s.bullishCount + s.bearishCount + s.neutralCount;
      const dominant = Math.max(s.bullishCount, s.bearishCount, s.neutralCount);
      const dominantSentiment = s.bullishCount >= s.bearishCount ? 'Bullish' : 'Bearish';
      const agreement = total > 0 ? (dominant / total) * 100 : 0;
      let confidence = 'Low';
      if (agreement >= 75 && total >= 3) confidence = 'High';
      else if (agreement >= 55 && total >= 2) confidence = 'Medium';

      return {
        ...s,
        dominantSentiment,
        agreement: Math.round(agreement),
        confidence,
        contributorCount: s.contributors?.length || 0
      };
    });

    return NextResponse.json({ success: true, data: enriched });
  } catch (error) {
    console.error('Signals GET Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

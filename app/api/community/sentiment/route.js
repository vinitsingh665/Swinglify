import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Post from '../../../../models/Post';

// GET — Overall market sentiment from recent posts
export async function GET() {
  try {
    await dbConnect();
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const result = await Post.aggregate([
      { $match: { 
        createdAt: { $gte: oneDayAgo },
        stockName: { $exists: true, $ne: '' }
      } },
      {
        $group: {
          _id: null,
          totalPosts: { $sum: 1 },
          bullish: {
            $sum: { $cond: [{ $eq: ['$sentiment', 'Bullish'] }, 1, 0] }
          },
          bearish: {
            $sum: { $cond: [{ $eq: ['$sentiment', 'Bearish'] }, 1, 0] }
          },
          neutral: {
            $sum: { $cond: [{ $eq: ['$sentiment', 'Neutral'] }, 1, 0] }
          }
        }
      }
    ]);

    const data = result[0] || { totalPosts: 0, bullish: 0, bearish: 0, neutral: 0 };
    const total = data.totalPosts || 1;

    return NextResponse.json({
      success: true,
      data: {
        totalPosts: data.totalPosts,
        bullish: data.bullish,
        bearish: data.bearish,
        neutral: data.neutral,
        bullishPercent: Math.round((data.bullish / total) * 100),
        bearishPercent: Math.round((data.bearish / total) * 100),
        neutralPercent: Math.round((data.neutral / total) * 100)
      }
    });
  } catch (error) {
    console.error('Sentiment GET Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

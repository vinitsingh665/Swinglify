import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Post from '../../../../models/Post';

// GET — Most discussed stocks in last 24 hours
export async function GET() {
  try {
    await dbConnect();
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const trending = await Post.aggregate([
      { $match: { 
        createdAt: { $gte: oneDayAgo },
        stockName: { $exists: true, $ne: '' }
      } },
      {
        $group: {
          _id: '$stockName',
          postCount: { $sum: 1 },
          bullishCount: {
            $sum: { $cond: [{ $eq: ['$sentiment', 'Bullish'] }, 1, 0] }
          },
          bearishCount: {
            $sum: { $cond: [{ $eq: ['$sentiment', 'Bearish'] }, 1, 0] }
          },
          topStrategies: { $addToSet: '$strategyTag' },
          latestPost: { $max: '$createdAt' }
        }
      },
      { $sort: { postCount: -1 } },
      { $limit: 10 },
      {
        $project: {
          stockName: '$_id',
          postCount: 1,
          bullishCount: 1,
          bearishCount: 1,
          topStrategies: 1,
          latestPost: 1,
          _id: 0
        }
      }
    ]);

    return NextResponse.json({ success: true, data: trending });
  } catch (error) {
    console.error('Trending GET Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

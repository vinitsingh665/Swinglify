import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Post from '../../../../models/Post';

// GET — Top analysts by post count and engagement
export async function GET() {
  try {
    await dbConnect();

    const analysts = await Post.aggregate([
      { $match: { stockName: { $exists: true, $ne: '' } } },
      {
        $group: {
          _id: '$author',
          authorName: { $first: '$authorName' },
          authorUsername: { $first: '$authorUsername' },
          authorImage: { $first: '$authorImage' },
          totalPosts: { $sum: 1 },
          totalUpvotes: { $sum: { $size: { $ifNull: ['$upvotes', []] } } },
          totalDownvotes: { $sum: { $size: { $ifNull: ['$downvotes', []] } } },
          bullishCalls: {
            $sum: { $cond: [{ $eq: ['$sentiment', 'Bullish'] }, 1, 0] }
          },
          bearishCalls: {
            $sum: { $cond: [{ $eq: ['$sentiment', 'Bearish'] }, 1, 0] }
          },
          strategies: { $addToSet: '$strategyTag' },
          latestPost: { $max: '$createdAt' }
        }
      },
      { $match: { totalPosts: { $gte: 1 } } },
      {
        $addFields: {
          engagementScore: {
            $add: [
              { $multiply: ['$totalUpvotes', 3] },
              { $multiply: ['$totalPosts', 2] },
              { $multiply: ['$totalDownvotes', -1] }
            ]
          },
          accuracyScore: {
            $cond: {
              if: { $gt: [{ $add: ['$totalUpvotes', '$totalDownvotes'] }, 0] },
              then: {
                $round: [{
                  $multiply: [
                    { $divide: ['$totalUpvotes', { $add: ['$totalUpvotes', '$totalDownvotes'] }] },
                    100
                  ]
                }, 0]
              },
              else: 50
            }
          }
        }
      },
      { $sort: { engagementScore: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: 0,
          authorId: '$_id',
          authorName: 1,
          authorUsername: 1,
          authorImage: 1,
          totalPosts: 1,
          totalUpvotes: 1,
          engagementScore: 1,
          accuracyScore: 1,
          bullishCalls: 1,
          bearishCalls: 1,
          strategies: 1,
          latestPost: 1
        }
      }
    ]);

    return NextResponse.json({ success: true, data: analysts });
  } catch (error) {
    console.error('Analysts GET Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

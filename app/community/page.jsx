import dbConnect from '../../lib/mongodb';
import Post from '../../models/Post';
import Signal from '../../models/Signal';
import CommunityClient from './CommunityClient';

// Force dynamic so data is always fresh on each request
export const dynamic = 'force-dynamic';

export default async function CommunityPage() {
  let initialPosts = [];
  let initialTrending = [];
  let initialSignals = [];
  let initialSentiment = { bullish: 0, bearish: 0, neutral: 0, totalPosts: 0 };
  let initialAnalysts = [];

  try {
    await dbConnect();

    // ─── Fetch initial posts (newest 20) ───
    const postsRaw = await Post.find({})
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();
    initialPosts = JSON.parse(JSON.stringify(postsRaw));

    // ─── Fetch trending stocks (last 24h) ───
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const trendingRaw = await Post.aggregate([
      {
        $match: {
          createdAt: { $gte: oneDayAgo },
          stockName: { $exists: true, $ne: '' },
          authorUsername: { $ne: 'SwinglifyAI' },
        },
      },
      {
        $group: {
          _id: '$stockName',
          postCount: { $sum: 1 },
          bullishCount: {
            $sum: { $cond: [{ $eq: ['$sentiment', 'Bullish'] }, 1, 0] },
          },
          bearishCount: {
            $sum: { $cond: [{ $eq: ['$sentiment', 'Bearish'] }, 1, 0] },
          },
          topStrategies: { $addToSet: '$strategyTag' },
          latestPost: { $max: '$createdAt' },
        },
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
          _id: 0,
        },
      },
    ]);
    initialTrending = JSON.parse(JSON.stringify(trendingRaw));

    // ─── Fetch sentiment (last 24h) ───
    const sentimentRaw = await Post.aggregate([
      {
        $match: {
          createdAt: { $gte: oneDayAgo },
          stockName: { $exists: true, $ne: '' },
        },
      },
      {
        $group: {
          _id: null,
          totalPosts: { $sum: 1 },
          bullish: {
            $sum: { $cond: [{ $eq: ['$sentiment', 'Bullish'] }, 1, 0] },
          },
          bearish: {
            $sum: { $cond: [{ $eq: ['$sentiment', 'Bearish'] }, 1, 0] },
          },
          neutral: {
            $sum: { $cond: [{ $eq: ['$sentiment', 'Neutral'] }, 1, 0] },
          },
        },
      },
    ]);
    if (sentimentRaw[0]) {
      initialSentiment = {
        totalPosts: sentimentRaw[0].totalPosts,
        bullish: sentimentRaw[0].bullish,
        bearish: sentimentRaw[0].bearish,
        neutral: sentimentRaw[0].neutral,
      };
    }

    // ─── Fetch signals for today ───
    const today = new Date().toISOString().split('T')[0];
    const signalsRaw = await Signal.find({ date: today })
      .sort({ totalPosts: -1 })
      .limit(10)
      .lean();
    initialSignals = signalsRaw.map((s) => {
      const total = s.bullishCount + s.bearishCount + s.neutralCount;
      const dominant = Math.max(s.bullishCount, s.bearishCount, s.neutralCount);
      const dominantSentiment =
        s.bullishCount >= s.bearishCount ? 'Bullish' : 'Bearish';
      const agreement = total > 0 ? (dominant / total) * 100 : 0;
      let confidence = 'Low';
      if (agreement >= 75 && total >= 3) confidence = 'High';
      else if (agreement >= 55 && total >= 2) confidence = 'Medium';
      return {
        ...s,
        dominantSentiment,
        agreement: Math.round(agreement),
        confidence,
        contributorCount: s.contributors?.length || 0,
      };
    });
    initialSignals = JSON.parse(JSON.stringify(initialSignals));

    // ─── Fetch top analysts ───
    const analystsRaw = await Post.aggregate([
      { $match: { stockName: { $exists: true, $ne: '' } } },
      {
        $group: {
          _id: '$author',
          authorName: { $first: '$authorName' },
          authorUsername: { $first: '$authorUsername' },
          authorImage: { $first: '$authorImage' },
          totalPosts: { $sum: 1 },
          totalUpvotes: {
            $sum: { $size: { $ifNull: ['$upvotes', []] } },
          },
          totalDownvotes: {
            $sum: { $size: { $ifNull: ['$downvotes', []] } },
          },
          bullishCalls: {
            $sum: { $cond: [{ $eq: ['$sentiment', 'Bullish'] }, 1, 0] },
          },
          bearishCalls: {
            $sum: { $cond: [{ $eq: ['$sentiment', 'Bearish'] }, 1, 0] },
          },
          strategies: { $addToSet: '$strategyTag' },
          latestPost: { $max: '$createdAt' },
        },
      },
      { $match: { totalPosts: { $gte: 1 } } },
      {
        $addFields: {
          engagementScore: {
            $add: [
              { $multiply: ['$totalUpvotes', 3] },
              { $multiply: ['$totalPosts', 2] },
              { $multiply: ['$totalDownvotes', -1] },
            ],
          },
          accuracyScore: {
            $cond: {
              if: {
                $gt: [{ $add: ['$totalUpvotes', '$totalDownvotes'] }, 0],
              },
              then: {
                $round: [
                  {
                    $multiply: [
                      {
                        $divide: [
                          '$totalUpvotes',
                          { $add: ['$totalUpvotes', '$totalDownvotes'] },
                        ],
                      },
                      100,
                    ],
                  },
                  0,
                ],
              },
              else: 50,
            },
          },
        },
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
          latestPost: 1,
        },
      },
    ]);
    initialAnalysts = JSON.parse(JSON.stringify(analystsRaw));
  } catch (error) {
    console.error('[Community SSR] Error fetching data:', error);
  }

  return (
    <CommunityClient
      initialPosts={initialPosts}
      initialTrending={initialTrending}
      initialSignals={initialSignals}
      initialSentiment={initialSentiment}
      initialAnalysts={initialAnalysts}
    />
  );
}

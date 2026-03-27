import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import dbConnect from '../../../../lib/mongodb';
import Post from '../../../../models/Post';
import User from '../../../../models/User';
import Signal from '../../../../models/Signal';

// GET — List posts with filtering
export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const sort = searchParams.get('sort') || 'new';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 20;
    const skip = (page - 1) * limit;

    // Build filter query
    const filter = {};
    const stockName = searchParams.get('stockName');
    const strategyTag = searchParams.get('strategyTag');
    const timeframe = searchParams.get('timeframe');
    const sentiment = searchParams.get('sentiment');
    const watchlist = searchParams.get('watchlist'); // comma-separated stock names

    if (stockName) filter.stockName = stockName.toUpperCase();
    if (strategyTag) filter.strategyTag = strategyTag;
    if (timeframe) filter.timeframe = timeframe;
    if (sentiment) filter.sentiment = sentiment;
    if (watchlist) {
      const stocks = watchlist.split(',').map(s => s.trim().toUpperCase());
      filter.stockName = { $in: stocks };
    }

    let sortQuery = {};
    if (sort === 'new') sortQuery = { createdAt: -1 };
    else if (sort === 'hot') sortQuery = { commentCount: -1, createdAt: -1 };
    else sortQuery = { createdAt: -1 };

    const posts = await Post.find(filter)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit)
      .lean();

    // For 'best' sort, sort by net score in memory
    if (sort === 'best') {
      posts.sort((a, b) => {
        const scoreA = (a.upvotes?.length || 0) - (a.downvotes?.length || 0);
        const scoreB = (b.upvotes?.length || 0) - (b.downvotes?.length || 0);
        return scoreB - scoreA;
      });
    }

    const total = await Post.countDocuments(filter);

    return NextResponse.json({
      success: true,
      data: posts,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error('Community GET Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST — Create a new structured insight post
export async function POST(request) {
  try {
    // 1. Check Auth
    let session;
    try {
      session = await getServerSession(authOptions);
    } catch (e) {
      console.error('[COMMUNITY POST] Session error:', e);
      return NextResponse.json({ error: 'Auth session error' }, { status: 500 });
    }

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Sign in to create a post' }, { status: 401 });
    }

    // 2. Connect DB
    await dbConnect();

    // 3. Parse Body
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    // Validate required fields based on whether this is a structured insight
    const isInsight = body.stockName && body.stockName.trim().length > 0;
    
    if (isInsight) {
      if (!body.strategyTag) {
        return NextResponse.json({ error: 'Strategy tag is required for insights' }, { status: 400 });
      }
      if (!body.title || body.title.trim().length === 0) {
        return NextResponse.json({ error: 'Analysis reason is required for insights' }, { status: 400 });
      }
    } else {
      if (!body.title || body.title.trim().length === 0) {
        return NextResponse.json({ error: 'Title is required' }, { status: 400 });
      }
    }

    // 4. Get User
    const dbUser = await User.findOne({ email: session.user.email }).lean();
    if (!dbUser) {
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 });
    }

    // 5. Create Post
    const postObj = {
      author: dbUser._id,
      authorName: dbUser.displayName || dbUser.name || 'Anonymous User',
      authorUsername: dbUser.username || '',
      authorImage: dbUser.profilePic || dbUser.image || '',
      title: body.title.trim(),
      body: body.body?.trim() || '',
      flair: body.flair || 'Strategy'
    };

    if (isInsight) {
      postObj.stockName = body.stockName.trim().toUpperCase();
      postObj.strategyTag = body.strategyTag;
      postObj.timeframe = body.timeframe || 'Swing';
      postObj.sentiment = body.sentiment || 'Bullish';
      postObj.confidence = body.confidence || 'Medium';
      postObj.targetPrice = body.targetPrice || null;
      postObj.stopLoss = body.stopLoss || null;
    }

    const post = await Post.create(postObj);

    // 6. Update Signal aggregation (only if it's a structured insight with a stockName)
    if (isInsight && post.stockName) {
      const today = new Date().toISOString().split('T')[0];
      try {
      await Signal.findOneAndUpdate(
        { stockName: post.stockName, date: today },
        {
          $inc: {
            totalPosts: 1,
            ...(post.sentiment === 'Bullish' ? { bullishCount: 1 } : {}),
            ...(post.sentiment === 'Bearish' ? { bearishCount: 1 } : {}),
            ...(post.sentiment === 'Neutral' ? { neutralCount: 1 } : {})
          },
          $push: { posts: post._id, contributors: dbUser._id },
          $addToSet: { topStrategies: post.strategyTag },
          $set: { updatedAt: new Date() }
        },
        { upsert: true, new: true }
      );
    } catch (signalErr) {
      console.error('Signal update error (non-critical):', signalErr);
    }
    }

    return NextResponse.json({ success: true, data: post }, { status: 201 });
  } catch (error) {
    console.error('[COMMUNITY POST] Unexpected Error:', error.message, error.stack);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

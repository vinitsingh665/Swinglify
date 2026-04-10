import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Post from '../../../../models/Post';
import User from '../../../../models/User';
import { generateSectorAnalysis, generateMoversAnalysis, generateSensexUpdate, generateTomorrowForecast } from '../../../../lib/ai';
import { GET as getAnalytics } from '../../analytics/route';

// Security: accepts Bearer token (Vercel cron) OR ?secret= query param (external cron services)
const CRON_SECRET = process.env.CRON_SECRET || 'swinglify_cron_run';

// Allow highest timeout since we run 4 AI parallel queries
export const maxDuration = 60; 

export async function GET(req) {
  try {
    const authHeader = req.headers.get('authorization');
    const { searchParams } = new URL(req.url);
    const querySecret = searchParams.get('secret');

    // Auth
    const isAuthorized = authHeader === `Bearer ${CRON_SECRET}` || querySecret === CRON_SECRET;
    if (!isAuthorized && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Weekend Check
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const ist = new Date(now.getTime() + istOffset);
    if (ist.getUTCDay() < 1 || ist.getUTCDay() > 5) {
        return NextResponse.json({ message: 'Market is closed today. No posts generated.' }, { status: 200 });
    }

    // Duplicate Check
    await dbConnect();
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);
    const existingPosts = await Post.find({ authorUsername: 'SwinglifyAI', createdAt: { $gte: todayStart } });
    // Require that all 4 scripts haven't run today
    if (existingPosts.length >= 4) {
      return NextResponse.json({ message: 'Market bots already posted all 4 updates today.' }, { status: 200 });
    }

    // 1. Fetch Analytics Intelligence internally
    const analyticsRes = await getAnalytics();
    const analyticsData = await analyticsRes.json();
    
    if (!analyticsData || !analyticsData.success) {
      return NextResponse.json({ error: 'Failed to access internal Analytics API' }, { status: 500 });
    }

    // Format Data for AI Contexts
    const sectorsString = analyticsData.sectors.map(s => `${s.name}: ${s.change1D}% (${s.advancing} Adv, ${s.declining} Dec)`).join('\n');
    const moversString = (analyticsData.opportunities?.topMovers || []).slice(0,3).map(s => `${s.symbol}: ${s.change}% (Price: ${s.price}, RSI: ${s.rsi})`).join('\n');
    const indicesString = analyticsData.indices.map(i => `${i.symbol}: ${i.change}% (Abs: ${i.changeAbs})`).join('\n');
    const breadthString = `Advancing: ${analyticsData.marketPulse.advancing}, Declining: ${analyticsData.marketPulse.declining}`;
    const emaString = `Prices above 50 EMA: ${analyticsData.emaBreadth?.ema50?.abovePct}%`;

    // 2. Parallel Generation (Massive performance boost)
    const [sectorBody, moversBody, sensexBody, forecastBody] = await Promise.all([
      generateSectorAnalysis(sectorsString),
      generateMoversAnalysis(moversString),
      generateSensexUpdate(indicesString),
      generateTomorrowForecast(breadthString, emaString)
    ]);

    // Ensure AI User Exists
    let aiUser = await User.findOne({ email: 'ai@swinglify.online' });
    if (!aiUser) {
      aiUser = await User.create({
        name: 'Swinglify AI Analyst', displayName: 'Swinglify AI 🤖', username: 'swinglifyai',
        email: 'ai@swinglify.online', googleId: 'ai_bot_001', isProfileComplete: true,
        image: 'https://api.dicebear.com/7.x/bottts/svg?seed=SwinglifyAI&backgroundColor=6366f1'
      });
    }

    // 3. Save ALL 4 Posts
    const dateStr = new Date().toLocaleDateString('en-IN');
    const postsToInsert = [];

    if (sectorBody) postsToInsert.push({ author: aiUser._id, authorName: aiUser.displayName, authorImage: aiUser.image, authorUsername: 'SwinglifyAI', flair: 'Discussion', title: `Sector Money Flow: ${dateStr}`, body: sectorBody, stockName: 'SECTOR FLOW', strategyTag: 'Momentum', timeframe: 'Swing', confidence: 'High', sentiment: analyticsData.sectors[0]?.change1D > 0 ? 'Bullish' : 'Bearish' });
    if (moversBody) postsToInsert.push({ author: aiUser._id, authorName: aiUser.displayName, authorImage: aiUser.image, authorUsername: 'SwinglifyAI', flair: 'News', title: `Top Momentum Gainers: ${dateStr}`, body: moversBody, stockName: 'TOP GAINERS', strategyTag: 'Breakout', timeframe: 'Intraday', confidence: 'Medium', sentiment: 'Bullish' });
    if (sensexBody) postsToInsert.push({ author: aiUser._id, authorName: aiUser.displayName, authorImage: aiUser.image, authorUsername: 'SwinglifyAI', flair: 'News', title: `Sensex & Nifty Breakdown: ${dateStr}`, body: sensexBody, stockName: 'INDEX UPDATE', strategyTag: 'Reversal', timeframe: 'Swing', confidence: 'Medium', sentiment: analyticsData.marketPulse?.niftyTrend === 'up' ? 'Bullish' : 'Bearish' });
    if (forecastBody) postsToInsert.push({ author: aiUser._id, authorName: aiUser.displayName, authorImage: aiUser.image, authorUsername: 'SwinglifyAI', flair: 'Strategy', title: `Tomorrow's Forecast: Prep for the Open`, body: forecastBody, stockName: 'FORECAST', strategyTag: 'SupportBounce', timeframe: 'Swing', confidence: 'High', sentiment: (analyticsData.marketPulse?.sentiment || '').includes('Bullish') ? 'Bullish' : 'Bearish' });

    if (postsToInsert.length === 0) return NextResponse.json({ error: 'All AI generations failed' }, { status: 500 });

    const inserted = await Post.insertMany(postsToInsert);

    return NextResponse.json({ success: true, postsGenerated: inserted.length });
  } catch (error) {
    console.error('Multi-Post Cron Error:', error);
    return NextResponse.json({ error: 'Failed to run market wrap cron', details: error.message }, { status: 500 });
  }
}

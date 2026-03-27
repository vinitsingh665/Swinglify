import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Post from '../../../../models/Post';
import User from '../../../../models/User';
import { generateMarketWrapUp } from '../../../../lib/ai';

// Optional: Security to ensure only a cron job can trigger this
const CRON_SECRET = process.env.CRON_SECRET || 'swinglify_cron_run';

export async function GET(req) {
  try {
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${CRON_SECRET}` && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Fetch Today's Market Data
    // We use absolute URL for fetch inside API routes or directly call the logic. For simplicity, we fetch our own route.
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3050';
    const indicesRes = await fetch(`${baseUrl}/api/indices`);
    const indicesData = await indicesRes.json();
    
    if (!indicesData || !indicesData.data) {
      return NextResponse.json({ error: 'Failed to fetch indices' }, { status: 500 });
    }

    const nifty = indicesData.data.find(i => i.symbol === 'NIFTY') || { change: 0, value: 0 };
    const bankNifty = indicesData.data.find(i => i.symbol === 'BANKNIFTY') || { change: 0, value: 0 };
    const vix = indicesData.data.find(i => i.symbol === 'INDIA_VIX') || { change: 0, value: 0 };

    // 1b. Fetch Top Volume Movers (so the AI can talk about individual stocks)
    const tvBody = {
      symbols: { query: { types: ['stock'], exchanges: ['NSE'] } },
      columns: ['name', 'change', 'volume', 'RSI'],
      sort: { sortBy: 'volume', sortOrder: 'desc' },
      range: [0, 5]
    };
    const tvRes = await fetch('https://scanner.tradingview.com/india/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0' },
      body: JSON.stringify(tvBody)
    });
    const tvData = await tvRes.json();
    const topMoversText = (tvData.data || []).filter(item => item.d && item.d.length >= 4).map(item => {
      const sym = item.s?.replace('NSE:', '') || '';
      return `${sym}: ${Math.round(item.d[1] * 100) / 100}%, RSI ${Math.round(item.d[3] * 10) / 10}`;
    }).join('\n');

    // 2. Generate AI Wrap-up
    const article = await generateMarketWrapUp(nifty.change, bankNifty.change, `VIX at ${vix.value}`, topMoversText);

    if (!article) {
      return NextResponse.json({ error: 'AI generation failed' }, { status: 500 });
    }

    // 3. Save to Database as AI Analyst
    await dbConnect();

    // Find or create the AI Analyst User
    let aiUser = await User.findOne({ email: 'ai@swinglify.online' });
    if (!aiUser) {
      aiUser = await User.create({
        name: 'Swinglify AI Analyst',
        displayName: 'Swinglify AI 🤖',
        username: 'swinglifyai',
        email: 'ai@swinglify.online',
        googleId: 'ai_bot_001',
        isProfileComplete: true,
        image: 'https://api.dicebear.com/7.x/bottts/svg?seed=SwinglifyAI&backgroundColor=6366f1'
      });
    } else if (!aiUser.username) {
      // Ensure username is set on existing AI user
      aiUser.username = 'swinglifyai';
      await aiUser.save();
    }

    const newPost = await Post.create({
      author: aiUser._id,
      authorName: aiUser.displayName,
      authorImage: aiUser.image,
      authorUsername: 'SwinglifyAI',
      title: `Daily Market Wrap-Up: ${new Date().toLocaleDateString('en-IN')}`,
      body: article,
      flair: 'News',
      stockName: 'NIFTY50',
      sentiment: nifty.change >= 0 ? 'Bullish' : 'Bearish',
    });

    return NextResponse.json({ success: true, post: newPost._id });
  } catch (error) {
    console.error('Cron Market Wrap Error:', error);
    return NextResponse.json({ error: 'Failed to run market wrap cron' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Post from '../../../../models/Post';
import User from '../../../../models/User';
import { generateMarketWrapUp } from '../../../../lib/ai';

// Security: accepts Bearer token (Vercel cron) OR ?secret= query param (external cron services)
const CRON_SECRET = process.env.CRON_SECRET || 'swinglify_cron_run';

export const maxDuration = 60; // Allow up to 60s for AI generation

function round2(value) {
  if (value === null || value === undefined) return null;
  return Math.round(value * 100) / 100;
}

export async function GET(req) {
  try {
    const authHeader = req.headers.get('authorization');
    const { searchParams } = new URL(req.url);
    const querySecret = searchParams.get('secret');

    // Auth: accept either Bearer header (Vercel) or ?secret= query param (external cron)
    const isAuthorized =
      authHeader === `Bearer ${CRON_SECRET}` ||
      querySecret === CRON_SECRET;

    if (!isAuthorized && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 0. Native Market Status Logic
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const ist = new Date(now.getTime() + istOffset);
    const day = ist.getUTCDay();
    const isTradingDay = (day >= 1 && day <= 5);
    
    if (!isTradingDay) {
        return NextResponse.json({ message: 'Market is closed today (Weekend/Holiday). No market wrap-up generated.' }, { status: 200 });
    }

    // 0b. Duplicate protection: check if a wrap-up was already posted today
    await dbConnect();
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);
    const existingPost = await Post.findOne({
      authorUsername: 'SwinglifyAI',
      flair: 'News',
      createdAt: { $gte: todayStart },
    });
    if (existingPost) {
      return NextResponse.json({ message: 'Market wrap-up already posted today.', postId: existingPost._id }, { status: 200 });
    }

    // 1. Fetch Today's Market Data directly from TradingView
    const indicesBody = {
      symbols: { tickers: ['NSE:NIFTY', 'NSE:BANKNIFTY', 'BSE:SENSEX', 'NSE:NIFTY_MID_SELECT', 'NSE:INDIA_VIX'], query: { types: [] } },
      columns: ['name', 'description', 'close', 'change', 'change_abs']
    };

    const indicesRes = await fetch('https://scanner.tradingview.com/india/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0' },
      body: JSON.stringify(indicesBody)
    });

    const indicesData = await indicesRes.json();
    if (!indicesData || !indicesData.data) {
      return NextResponse.json({ error: 'Failed to fetch indices from TV' }, { status: 500 });
    }

    // Map indices Data
    const mappedIndices = indicesData.data.map(item => {
      const d = item.d || [];
      return {
        symbol: d[0],
        name: d[1] || d[0],
        value: round2(d[2]),
        change: round2(d[3]),
        changeAbs: round2(d[4])
      };
    });
    const nifty = mappedIndices.find(i => i.symbol === 'NIFTY') || { change: 0 };
    const bankNifty = mappedIndices.find(i => i.symbol === 'BANKNIFTY') || { change: 0 };
    const vix = mappedIndices.find(i => i.symbol === 'INDIA_VIX') || { change: 0 };

    // 1a. Fetch broad market breadth so the AI gets actual A/D data, not proxy text
    const breadthBody = {
      filter: [
        { left: 'is_primary', operation: 'equal', right: true },
        { left: 'exchange', operation: 'equal', right: 'NSE' },
        { left: 'market_cap_basic', operation: 'greater', right: 5000000000 }
      ],
      symbols: { query: { types: ['stock'] } },
      columns: ['change'],
      sort: { sortBy: 'market_cap_basic', sortOrder: 'desc' },
      range: [0, 500]
    };
    const breadthRes = await fetch('https://scanner.tradingview.com/india/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0' },
      body: JSON.stringify(breadthBody)
    });
    const breadthData = await breadthRes.json();
    const breadthChanges = (breadthData.data || [])
      .map(item => item?.d?.[0])
      .filter(change => change !== null && change !== undefined);
    const advancing = breadthChanges.filter(change => change > 0).length;
    const declining = breadthChanges.filter(change => change < 0).length;
    const unchanged = breadthChanges.length - advancing - declining;
    const advDecRatio = declining > 0 ? round2(advancing / declining) : advancing;
    const breadthSummary = `${advancing} advancing / ${declining} declining / ${unchanged} unchanged (A/D Ratio: ${advDecRatio})`;

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
      return `${sym}: ${round2(item.d[1])}%, RSI ${Math.round((item.d[3] || 0) * 10) / 10}`;
    }).join('\n');

    // 2. Generate AI Wrap-up
    const article = await generateMarketWrapUp(nifty.change ?? 0, bankNifty.change ?? 0, breadthSummary, topMoversText);

    if (!article) {
      return NextResponse.json({ error: 'AI generation failed' }, { status: 500 });
    }

    // 3. Save to Database as AI Analyst
    // dbConnect() already called above for duplicate check

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
    return NextResponse.json({ error: 'Failed to run market wrap cron', details: error.message, stack: error.stack }, { status: 500 });
  }
}

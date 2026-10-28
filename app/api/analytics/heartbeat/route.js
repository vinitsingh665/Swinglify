import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Visitor from '../../../../models/Visitor';
import User from '../../../../models/User';

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { sessionId, path: currentPath, userId, userEmail } = body;

    if (!sessionId) {
      return NextResponse.json({ success: false, error: 'Session ID required' }, { status: 400 });
    }

    // Gracefully handle local dev when MONGODB_URI is not yet configured
    if (!process.env.MONGODB_URI || !process.env.MONGODB_URI.trim()) {
      return NextResponse.json({ success: true, activeCount: 1 });
    }

    await dbConnect();

    const now = new Date();
    const updateFields = {
      lastActive: now,
      path: currentPath || 'unknown'
    };

    if (userId) updateFields.userId = userId;
    if (userEmail) updateFields.userEmail = userEmail;

    // 1. Fast atomic upsert without returning the document (saves network bandwidth & CPU)
    await Visitor.updateOne(
      { sessionId },
      { $set: updateFields },
      { upsert: true }
    );

    // 2. Persist lastSeen asynchronously without blocking
    if (userId) {
      User.updateOne({ _id: userId }, { $set: { lastSeen: now } }).catch(() => {});
    } else if (userEmail) {
      User.updateOne({ email: userEmail }, { $set: { lastSeen: now } }).catch(() => {});
    }

    // 3. Probabilistic Cleanup (run cleanup ~2% of requests instead of every request to eliminate 98% of delete queries)
    if (Math.random() < 0.02) {
      const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);
      Visitor.deleteMany({ lastActive: { $lt: tenMinutesAgo } }).catch(() => {});
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Heartbeat Tracker Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to process heartbeat' }, { status: 500 });
  }
}

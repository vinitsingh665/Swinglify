import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/auth';
import dbConnect from '../../../../lib/mongodb';
import Visitor from '../../../../models/Visitor';
import User from '../../../../models/User';

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    let { sessionId, path: currentPath, userId, userEmail } = body;

    if (!sessionId) {
      return NextResponse.json({ success: false, error: 'Session ID required' }, { status: 400 });
    }

    // Gracefully handle local dev when MONGODB_URI is not yet configured
    if (!process.env.MONGODB_URI || !process.env.MONGODB_URI.trim()) {
      return NextResponse.json({ success: true, activeCount: 1 });
    }

    await dbConnect();


    // Verify or retrieve server-side NextAuth session if available
    if (!userId || !userEmail) {
      try {
        const session = await getServerSession(authOptions);
        if (session?.user) {
          userEmail = userEmail || session.user.email;
          userId = userId || session.user.dbId;
        }
      } catch (e) {
        // Silently proceed
      }
    }

    // If userEmail is present but not userId, find user ID
    if (!userId && userEmail) {
      try {
        const found = await User.findOne({ email: userEmail }).select('_id');
        if (found) userId = found._id;
      } catch (e) {}
    }

    const now = new Date();

    const updateFields = {
      lastActive: now,
      path: currentPath || 'unknown'
    };

    if (userId) updateFields.userId = userId;
    if (userEmail) updateFields.userEmail = userEmail;

    // 1. Update the current visitor session (Upsert)
    await Visitor.findOneAndUpdate(
      { sessionId },
      { $set: updateFields },
      { upsert: true, new: true }
    );

    // 2. Persist lastSeen on User model for offline indicators
    if (userId) {
      User.updateOne({ _id: userId }, { $set: { lastSeen: now } }).catch(() => {});
    } else if (userEmail) {
      User.updateOne({ email: userEmail }, { $set: { lastSeen: now } }).catch(() => {});
    }

    // 3. Periodic Cleanup: Delete visitors inactive for more than 10 minutes
    const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);
    Visitor.deleteMany({ lastActive: { $lt: tenMinutesAgo } }).catch(() => {});

    // 4. Count total active visitors in last 2 minutes
    const twoMinutesAgo = new Date(now.getTime() - 120000);
    const activeCount = await Visitor.countDocuments({ lastActive: { $gt: twoMinutesAgo } });

    return NextResponse.json({ success: true, activeCount });

  } catch (error) {
    console.error('Heartbeat Tracker Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to process heartbeat' }, { status: 500 });
  }
}


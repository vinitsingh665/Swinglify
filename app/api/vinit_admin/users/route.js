import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/auth';
import dbConnect from '../../../../lib/mongodb';
import User from '../../../../models/User';
import Visitor from '../../../../models/Visitor';

export async function GET() {
  try {
    await dbConnect();

    // Check current admin session
    let currentUserId = '';
    let currentUserEmail = '';
    try {
      const session = await getServerSession(authOptions);
      if (session?.user) {
        currentUserId = session.user.dbId || session.user.id || '';
        currentUserEmail = session.user.email || '';
      }
    } catch (e) {}

    // Fetch all users, sorted by newest first
    const users = await User.find({})
      .sort({ createdAt: -1 })
      .select('name username email image profilePic createdAt isProfileComplete lastSeen');

    // Online cutoff: 2 minutes (120000 ms), matching Journal
    const twoMinutesAgo = new Date(Date.now() - 120000);

    const activeVisitors = await Visitor.find({
      lastActive: { $gt: twoMinutesAgo },
      $or: [
        { userId: { $ne: null } },
        { userEmail: { $ne: null } }
      ]
    }).select('userId userEmail lastActive');

    const activeUserIds = new Set();
    const activeUserEmails = new Set();
    const lastActiveMap = new Map();

    for (const v of activeVisitors) {
      if (v.userId) {
        const uid = v.userId.toString();
        activeUserIds.add(uid);
        if (!lastActiveMap.has(uid) || lastActiveMap.get(uid) < v.lastActive) {
          lastActiveMap.set(uid, v.lastActive);
        }
      }
      if (v.userEmail) {
        const emailLower = v.userEmail.toLowerCase();
        activeUserEmails.add(emailLower);
        if (!lastActiveMap.has(emailLower) || lastActiveMap.get(emailLower) < v.lastActive) {
          lastActiveMap.set(emailLower, v.lastActive);
        }
      }
    }

    let onlineCount = 0;

    const usersWithPresence = users.map(u => {
      const uIdStr = u._id.toString();
      const uEmailLower = u.email ? u.email.toLowerCase() : '';

      const isOnline = activeUserIds.has(uIdStr) || (uEmailLower && activeUserEmails.has(uEmailLower));
      if (isOnline) onlineCount++;

      const effectiveLastSeen = 
        lastActiveMap.get(uIdStr) || 
        (uEmailLower ? lastActiveMap.get(uEmailLower) : null) || 
        u.lastSeen || 
        null;

      return {
        _id: u._id,
        name: u.name,
        username: u.username,
        email: u.email,
        image: u.profilePic || u.image,
        createdAt: u.createdAt,
        isProfileComplete: u.isProfileComplete,
        isOnline: Boolean(isOnline),
        lastSeen: effectiveLastSeen,
        isCurrentUser: Boolean(
          (currentUserId && uIdStr === currentUserId) || 
          (currentUserEmail && uEmailLower === currentUserEmail.toLowerCase())
        )
      };
    });

    return NextResponse.json({
      success: true,
      data: usersWithPresence,
      meta: {
        total: users.length,
        online: onlineCount,
        offline: users.length - onlineCount
      },
      currentUserId
    });
  } catch (err) {
    console.error('Failed to fetch admin users:', err);
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}


import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import dbConnect from '../../../../lib/mongodb';
import User from '../../../../models/User';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const dbUser = await User.findOne({ email: session.user.email }).lean();
    
    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return the profile data needed
    return NextResponse.json({
      success: true,
      watchlist: dbUser.watchlist || [],
      profilePic: dbUser.profilePic || dbUser.image || '',
      displayName: dbUser.displayName || dbUser.name || '',
      username: dbUser.username || ''
    });

  } catch (error) {
    console.error('User Profile GET Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

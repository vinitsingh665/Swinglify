import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import dbConnect from '../../../../lib/mongodb';
import User from '../../../../models/User';

// GET — Fetch the current user's synced watchlist and portfolio
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const dbUser = await User.findOne({ email: session.user.email }).select('watchlist portfolio').lean();
    
    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        watchlist: dbUser.watchlist || [],
        portfolio: dbUser.portfolio || []
      }
    });
  } catch (error) {
    console.error('Data Sync GET Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST — Update the user's watchlist or portfolio
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    
    // Build update object based on what was provided in the payload
    const updateData = {};
    if (body.watchlist !== undefined) {
      updateData.watchlist = body.watchlist;
    }
    if (body.portfolio !== undefined) {
      updateData.portfolio = body.portfolio;
    }

    // Only update if there's actually data to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ success: true, message: 'Nothing to update' });
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: updateData },
      { new: true, strict: false }
    );

    return NextResponse.json({ 
      success: true, 
      data: {
        watchlist: updatedUser?.watchlist || [],
        portfolio: updatedUser?.portfolio || []
      }
    });
  } catch (error) {
    console.error('Data Sync POST Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

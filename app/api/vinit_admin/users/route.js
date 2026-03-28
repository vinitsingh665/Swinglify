import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import User from '../../../../models/User';

export async function GET() {
  try {
    await dbConnect();

    // Fetch all users, sorted by newest first
    const users = await User.find({}).sort({ createdAt: -1 }).select('name username email createdAt isProfileComplete');
    
    return NextResponse.json({
      success: true,
      data: users
    });
  } catch (err) {
    console.error('Failed to fetch admin users:', err);
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}

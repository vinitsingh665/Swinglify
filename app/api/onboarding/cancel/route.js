import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import dbConnect from '../../../../lib/mongodb';
import User from '../../../../models/User';

// POST — Cancel registration and delete user data
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Only delete if profile is NOT complete (still in onboarding)
    const result = await User.findOneAndDelete({
      email: session.user.email,
      isProfileComplete: { $ne: true }
    });

    if (!result) {
      return NextResponse.json({ error: 'User not found or already completed profile' }, { status: 404 });
    }

    console.log('Registration cancelled and user deleted:', session.user.email);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cancel registration error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

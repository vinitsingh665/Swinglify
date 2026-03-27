import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';

// POST — Save onboarding profile
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    const { username, displayName, profilePic } = body;

    // Validate username
    if (!username || username.length < 3 || username.length > 20) {
      return NextResponse.json({ error: 'Username must be 3-20 characters' }, { status: 400 });
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return NextResponse.json({ error: 'Username can only contain letters, numbers, and underscores' }, { status: 400 });
    }

    // Check if username is taken by another user
    const existingUser = await User.findOne({
      username: username.toLowerCase(),
      email: { $ne: session.user.email }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Username is already taken' }, { status: 409 });
    }

    // Using explicit object to avoid undefined keys
    const updateData = {
      $set: {
        username: username.toLowerCase(),
        displayName: displayName || session.user.name,
        isProfileComplete: true,
      }
    };
    if (profilePic) {
      updateData.$set.profilePic = profilePic;
    }

    // Update the user
    // Using strict: false because Next.js dev server caches Mongoose schemas,
    // which causes it to silently drop new fields like 'isProfileComplete'
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      updateData,
      { new: true, strict: false }
    );

    console.log("Successfully onboarded user:", updatedUser?.email);

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Onboarding error details:', error);
    return NextResponse.json({ error: 'Server error: ' + error.message }, { status: 500 });
  }
}

// GET — Check if username is available
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json({ available: false });
    }

    await dbConnect();
    const exists = await User.findOne({ username: username.toLowerCase() });

    return NextResponse.json({ available: !exists });
  } catch (error) {
    return NextResponse.json({ available: false });
  }
}

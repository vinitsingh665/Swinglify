import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/mongodb';
import User from '../../../../../models/User';

export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    const { username } = await req.json();

    if (!username || typeof username !== 'string') {
      return NextResponse.json({ success: false, error: 'Valid username required' }, { status: 400 });
    }

    const cleanUsername = username.trim().toLowerCase();

    // Enforce basic validation: 3-20 chars, alphanumeric/underscore
    const usernameRegex = /^[a-z0-9_]{3,20}$/;
    if (!usernameRegex.test(cleanUsername)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Username must be 3-20 characters long and can only contain lowercase letters, numbers, and underscores.' 
      }, { status: 400 });
    }

    await dbConnect();

    // Check if another user already has this username
    const existing = await User.findOne({ username: cleanUsername, _id: { $ne: id } });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Username is already taken' }, { status: 409 });
    }

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { username: cleanUsername },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: updatedUser });

  } catch (err) {
    console.error('Update username error:', err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

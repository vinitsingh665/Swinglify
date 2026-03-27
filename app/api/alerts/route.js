import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import dbConnect from '../../../lib/mongodb';
import Alert from '../../../models/Alert';
import User from '../../../models/User';

// GET — Fetch all alerts for the authenticated user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const dbUser = await User.findOne({ email: session.user.email }).lean();
    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const alerts = await Alert.find({ userId: dbUser._id }).sort({ createdAt: -1 }).lean();

    // Map _id to id for frontend compatibility
    const mapped = alerts.map(a => ({ ...a, id: a._id.toString() }));

    return NextResponse.json({ success: true, data: mapped });
  } catch (error) {
    console.error('Alerts GET Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST — Create a new alert
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const dbUser = await User.findOne({ email: session.user.email }).lean();
    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();

    if (!body.symbol || !body.value) {
      return NextResponse.json({ error: 'Symbol and value are required' }, { status: 400 });
    }

    const alert = await Alert.create({
      userId: dbUser._id,
      symbol: body.symbol.trim().toUpperCase(),
      comparison: body.comparison || 'Above',
      value: body.value,
      type: body.type || 'price',
      triggered: false,
      expired: false
    });

    return NextResponse.json({
      success: true,
      data: { ...alert.toObject(), id: alert._id.toString() }
    }, { status: 201 });
  } catch (error) {
    console.error('Alerts POST Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import dbConnect from '../../../../lib/mongodb';
import Alert from '../../../../models/Alert';
import User from '../../../../models/User';

// PUT — Update an alert
export async function PUT(request, { params }) {
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

    const { id } = await params;
    const body = await request.json();

    const alert = await Alert.findOneAndUpdate(
      { _id: id, userId: dbUser._id },
      {
        $set: {
          symbol: body.symbol?.trim().toUpperCase(),
          comparison: body.comparison,
          value: body.value,
          type: body.type,
          triggered: body.triggered ?? false,
          expired: body.expired ?? false
        }
      },
      { new: true }
    ).lean();

    if (!alert) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: { ...alert, id: alert._id.toString() }
    });
  } catch (error) {
    console.error('Alert PUT Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE — Remove an alert
export async function DELETE(request, { params }) {
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

    const { id } = await params;

    const result = await Alert.findOneAndDelete({ _id: id, userId: dbUser._id });

    if (!result) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Alert DELETE Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

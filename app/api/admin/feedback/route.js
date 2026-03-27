import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Feedback from '../../../../models/Feedback';

export async function GET() {
  try {
    await dbConnect();
    // Fetch all feedback, sorted by newest first
    const data = await Feedback.find({}).sort({ createdAt: -1 });
    return NextResponse.json({
      success: true,
      data
    });
  } catch(e) {
    return NextResponse.json({ success: false, data: [] });
  }
}

// Resolve a ticket
export async function POST(req) {
  try {
    const { id, action } = await req.json();
    await dbConnect();

    if (action === 'resolve') {
      await Feedback.findByIdAndUpdate(id, { status: 'resolved' });
      return NextResponse.json({ success: true, message: 'Ticket resolved' });
    }
    
    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

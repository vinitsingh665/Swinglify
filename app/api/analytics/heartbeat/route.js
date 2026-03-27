import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Visitor from '../../../../models/Visitor';

export async function POST(req) {
    try {
        const body = await req.json();
        const { sessionId, path: currentPath } = body;

        if (!sessionId) {
            return NextResponse.json({ success: false, error: 'Session ID required' }, { status: 400 });
        }

        await dbConnect();
        const now = new Date();

        // 1. Update the current visitor (Upsert = create if not exists)
        await Visitor.findOneAndUpdate(
            { sessionId },
            { 
                lastActive: now, 
                path: currentPath || 'unknown' 
            },
            { upsert: true, new: true }
        );

        // 2. Periodic Cleanup: Delete visitors inactive for more than 2 minutes
        // (This keeps the "Active Now" count accurate)
        const twoMinutesAgo = new Date(now.getTime() - 120000);
        await Visitor.deleteMany({ lastActive: { $lt: twoMinutesAgo } });

        // 3. Count total active users
        const activeCount = await Visitor.countDocuments({});

        return NextResponse.json({ success: true, activeCount });

    } catch (error) {
        console.error('Heartbeat Tracker Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to process heartbeat' }, { status: 500 });
    }
}

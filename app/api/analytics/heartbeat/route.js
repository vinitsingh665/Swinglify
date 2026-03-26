import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req) {
    try {
        const body = await req.json();
        const { sessionId, path: currentPath } = body;

        if (!sessionId) {
            return NextResponse.json({ success: false, error: 'Session ID required' }, { status: 400 });
        }

        const dataFile = path.join(process.cwd(), 'data', 'visitors.json');
        let visitorsData = [];
        
        try {
            const fileContent = await fs.readFile(dataFile, 'utf8');
            visitorsData = JSON.parse(fileContent);
        } catch (e) {
            // File doesn't exist yet, which is fine
        }

        const now = Date.now();
        const THRESHOLD = 30000; // 30 seconds

        // 1. Filter out stale visitors (older than 30s)
        let activeVisitors = visitorsData.filter(v => (now - v.lastSeen) < THRESHOLD);

        // 2. Find and update the current visitor, or add them
        const existingIndex = activeVisitors.findIndex(v => v.sessionId === sessionId);
        if (existingIndex >= 0) {
            activeVisitors[existingIndex].lastSeen = now;
            if (currentPath) activeVisitors[existingIndex].path = currentPath;
        } else {
            activeVisitors.push({
                sessionId,
                lastSeen: now,
                path: currentPath || 'unknown',
                joinedAt: now
            });
        }

        // 3. Save back to disk
        await fs.writeFile(dataFile, JSON.stringify(activeVisitors, null, 2), 'utf8');

        // Allow frontend to optionally know how many people are online
        return NextResponse.json({ success: true, activeCount: activeVisitors.length });

    } catch (error) {
        console.error('Heartbeat Tracker Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to process heartbeat' }, { status: 500 });
    }
}

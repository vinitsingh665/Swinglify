import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFile = path.join(process.cwd(), 'data', 'feedback.json');

async function getFeedback() {
  try {
    const data = await fs.readFile(dataFile, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

async function saveFeedback(data) {
  try {
    await fs.writeFile(dataFile, JSON.stringify(data, null, 2), 'utf8');
  } catch(e) {
    console.error('Failed to save feedback:', e);
  }
}

export async function GET() {
  const data = await getFeedback();
  return NextResponse.json({
    success: true,
    data
  });
}

// Resolve a ticket
export async function POST(req) {
  try {
    const { id, action } = await req.json();
    
    if (action === 'resolve') {
      let data = await getFeedback();
      data = data.map(f => 
        f.id === id ? { ...f, status: 'resolved' } : f
      );
      await saveFeedback(data);
      return NextResponse.json({ success: true, message: 'Ticket resolved' });
    }
    
    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

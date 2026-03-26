import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const body = await req.json();
        const { password } = body;
        
        // Match against environment variable
        // Fallback to strict hardcoded default only if ENV is completely missing
        const validPassword = process.env.ADMIN_PASSWORD || 'SwinglifyAdmin123!';

        if (password === validPassword) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Auth check failed' }, { status: 500 });
    }
}

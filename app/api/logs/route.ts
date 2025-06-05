import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    console.log('API log entry:', payload);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error while logging entry:', err);
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    try {
      logger.info(payload, 'API log entry');
    } catch (logErr) {
      logger.error(logErr, 'Failed to write log entry');
      return NextResponse.json({ success: false }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    logger.error(err, 'Error while logging entry');
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

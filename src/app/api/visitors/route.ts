import { NextResponse } from 'next/server';
import { getVisitorStats, recordVisit, saveVisitorStats, getSiteConfig } from '@/lib/data-store';

export async function GET() {
  const stats = getVisitorStats();
  return NextResponse.json(stats);
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({ action: 'record' }));

    if (body.action === 'set' && body.stats) {
      // Admin update
      const currentConfig = getSiteConfig();
      const providedPass = request.headers.get('x-admin-pass');
      const expectedPass = process.env.ADMIN_PASSWORD || currentConfig.adminPassword || 'admin';

      if (providedPass !== expectedPass) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      saveVisitorStats(body.stats);
      return NextResponse.json({ success: true, stats: body.stats });
    }

    // Default action: Record a visit
    const updated = recordVisit();
    return NextResponse.json({ success: true, stats: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process visitor update', details: String(error) }, { status: 500 });
  }
}

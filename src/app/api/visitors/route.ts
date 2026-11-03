import { NextResponse } from 'next/server';
import { getVisitorStats, recordVisit, saveVisitorStats, getSiteConfig } from '@/lib/data-store';

export async function GET() {
  const stats = await getVisitorStats();
  return NextResponse.json(stats, {
    headers: {
      'Cache-Control': 'no-store, max-age=0'
    }
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({ action: 'record' }));

    if (body.action === 'reset') {
      const currentConfig = await getSiteConfig();
      const providedPass = request.headers.get('x-admin-pass');
      const expectedPass = process.env.ADMIN_PASSWORD || currentConfig.adminPassword || 'admin';

      if (providedPass !== expectedPass) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const now = new Date();
      const resetStats = {
        today: 0,
        thisWeek: 0,
        thisMonth: 0,
        total: 0,
        lastDateStr: now.toISOString().slice(0, 10),
        lastWeekNum: 0,
        lastMonthNum: now.getMonth(),
        lastYearNum: now.getFullYear()
      };
      await saveVisitorStats(resetStats);
      return NextResponse.json({ success: true, stats: resetStats });
    }

    if (body.action === 'set' && body.stats) {
      // Admin update
      const currentConfig = await getSiteConfig();
      const providedPass = request.headers.get('x-admin-pass');
      const expectedPass = process.env.ADMIN_PASSWORD || currentConfig.adminPassword || 'admin';

      if (providedPass !== expectedPass) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      await saveVisitorStats(body.stats);
      return NextResponse.json({ success: true, stats: body.stats });
    }

    // Default action: Record a real live visit
    const updated = await recordVisit();
    return NextResponse.json({ success: true, stats: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process visitor update', details: String(error) }, { status: 500 });
  }
}

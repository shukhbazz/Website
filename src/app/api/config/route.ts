import { NextResponse } from 'next/server';
import { getSiteConfig, saveSiteConfig } from '@/lib/data-store';

export async function GET() {
  const config = getSiteConfig();
  // Strip admin password before sending to public client
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { adminPassword, ...publicConfig } = config;
  return NextResponse.json(publicConfig);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const currentConfig = getSiteConfig();

    // Verify admin authorization
    const authHeader = request.headers.get('authorization');
    const providedPass = request.headers.get('x-admin-pass');
    const expectedPass = process.env.ADMIN_PASSWORD || currentConfig.adminPassword || 'admin';

    if (providedPass !== expectedPass && authHeader !== `Bearer ${expectedPass}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { newConfig, newPassword } = body;
    const updated = {
      ...currentConfig,
      ...newConfig,
      adminPassword: newPassword || currentConfig.adminPassword
    };

    saveSiteConfig(updated);
    return NextResponse.json({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update configuration', details: String(error) }, { status: 500 });
  }
}

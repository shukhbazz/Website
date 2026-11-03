import { NextResponse } from 'next/server';
import { getSiteConfig } from '@/lib/data-store';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const config = getSiteConfig();
    const expectedPassword = config.adminPassword || 'admin';

    if (password === expectedPassword) {
      return NextResponse.json({
        success: true,
        message: 'Authentication successful',
        token: expectedPassword // simple token for local/admin operations
      });
    }

    return NextResponse.json(
      { success: false, error: 'ভুল পাসওয়ার্ড! আবার চেষ্টা করুন।' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication error', details: String(error) },
      { status: 500 }
    );
  }
}

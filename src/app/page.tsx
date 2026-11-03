import { getSiteConfig } from '@/lib/data-store';
import MainLanding from '@/components/MainLanding';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [config, headerList] = await Promise.all([
    getSiteConfig(),
    headers()
  ]);

  // Automatically detect visitor's local country timezone from Vercel edge network (e.g. Asia/Dhaka, America/New_York, Europe/London)
  const visitorTimezone = headerList.get('x-vercel-ip-timezone') || undefined;

  // Strip adminPassword
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { adminPassword, ...safeConfig } = config;

  return <MainLanding initialConfig={safeConfig} visitorTimezone={visitorTimezone} />;
}

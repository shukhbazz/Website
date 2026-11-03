import { getSiteConfig } from '@/lib/data-store';
import MainLanding from '@/components/MainLanding';

export default async function HomePage() {
  const config = getSiteConfig();
  // Strip adminPassword
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { adminPassword, ...safeConfig } = config;

  return <MainLanding initialConfig={safeConfig} />;
}

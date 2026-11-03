import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const allKeys = Object.keys(process.env);
  const relevantKeys = allKeys.filter(
    (k) =>
      k.includes('REDIS') ||
      k.includes('KV') ||
      k.includes('UPSTASH') ||
      k.includes('STORAGE') ||
      k.includes('DATABASE') ||
      k.includes('ADMIN') ||
      k.includes('POSTGRES')
  );

  return NextResponse.json({
    matchingKeys: relevantKeys,
    hasUpstashUrl: Boolean(process.env.UPSTASH_REDIS_REST_URL),
    hasKvUrl: Boolean(process.env.KV_REST_API_URL),
    totalEnvCount: allKeys.length
  });
}
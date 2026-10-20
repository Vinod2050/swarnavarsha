import { NextResponse } from 'next/server'

import { getLatestRates } from '@/lib/rates'

/** GET /api/rates — the latest rates as JSON, cached for five minutes. */
export async function GET() {
  const rates = await getLatestRates()
  return NextResponse.json(rates, {
    status: rates ? 200 : 404,
    headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60' },
  })
}

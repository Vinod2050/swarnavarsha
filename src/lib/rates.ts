import { unstable_cache } from 'next/cache'

import { ratesSeed } from '@/seed/data'

import { getPayloadClient, hasDatabase } from './payload'

export type RateRow = {
  gold24k999: number
  gold22k: number
  gold18k: number
  silverKg: number
}

export type LatestRates = {
  /** true while the sample numbers from the seed file are in use (no database) */
  isSample: boolean
  updatedAt: string
  buying: RateRow
}

const loadLatestBuying = unstable_cache(
  async (): Promise<LatestRates | null> => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'daily-rates',
      where: { type: { equals: 'buying' } },
      sort: '-rateDate',
      limit: 1,
      depth: 0,
    })
    const row = docs[0]
    if (!row) return null
    return {
      isSample: false,
      updatedAt: row.updatedAt,
      buying: {
        gold24k999: row.gold24k999,
        gold22k: row.gold22k,
        gold18k: row.gold18k,
        silverKg: row.silverKg,
      },
    }
  },
  ['latest-rates'],
  { tags: ['rates'] },
)

/**
 * Latest buying rates entered by the client in /admin, or null when none are entered yet.
 * Cached with the tag 'rates'; the Rates afterChange hook expires it, so a new rate is on
 * the site within seconds.
 *
 * Without a database (design phase) this returns the sample row from the seed file.
 */
export async function getLatestRates(): Promise<LatestRates | null> {
  return hasDatabase() ? loadLatestBuying() : ratesSeed
}

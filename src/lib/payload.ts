import type { Payload } from 'payload'

/** False in the design phase, when DATABASE_URI is empty and content comes from src/seed/data.ts. */
export function hasDatabase(): boolean {
  return Boolean(process.env.DATABASE_URI)
}

/**
 * Payload Local API client (CLAUDE.md Section 9.2). Call only when `hasDatabase()` is true.
 *
 * Payload and its config are loaded on demand so the public site builds and runs without a
 * database in the design phase. Payload caches the instance, so repeated calls are cheap.
 */
export async function getPayloadClient(): Promise<Payload> {
  const [{ getPayload }, { default: config }] = await Promise.all([
    import('payload'),
    import('@payload-config'),
  ])
  return getPayload({ config })
}

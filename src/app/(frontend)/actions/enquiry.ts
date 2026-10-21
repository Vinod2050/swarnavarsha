'use server'

import { createHash } from 'crypto'
import { headers } from 'next/headers'
import { hasLocale } from 'next-intl'

import { routing } from '@/i18n/routing'
import { getPayloadClient, hasDatabase } from '@/lib/payload'
import { enquirySchema, type EnquiryField } from '@/lib/schemas'

export type EnquiryResult =
  | { ok: true }
  | {
      ok: false
      error: 'invalid' | 'rate_limited' | 'server'
      /** field → translation key under `enquiry.errors` */
      fieldErrors?: Partial<Record<EnquiryField, string>>
    }

const MAX_PER_HOUR = 5

async function hashedIp(): Promise<string> {
  const h = await headers()
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown'
  return createHash('sha256')
    .update(`${process.env.IP_HASH_SALT || ''}:${ip}`)
    .digest('hex')
}

export async function submitEnquiry(raw: unknown, localeRaw: string): Promise<EnquiryResult> {
  const locale = hasLocale(routing.locales, localeRaw) ? localeRaw : routing.defaultLocale

  // Honeypot: bots fill the hidden field. Answer "ok" so they learn nothing.
  if (typeof raw === 'object' && raw !== null && 'website' in raw && raw.website) {
    return { ok: true }
  }

  const parsed = enquirySchema.safeParse(raw)
  if (!parsed.success) {
    const fieldErrors: Partial<Record<EnquiryField, string>> = {}
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as EnquiryField
      fieldErrors[field] ??= field
    }
    return { ok: false, error: 'invalid', fieldErrors }
  }

  const { name, mobile, service, preferredTime, message } = parsed.data
  const enquiry = { name, mobile, service, preferredTime, message, locale }
  const stored = hasDatabase()

  try {
    if (stored) {
      const payload = await getPayloadClient()
      const ipHash = await hashedIp()

      const recent = await payload.count({
        collection: 'enquiries',
        where: {
          ipHash: { equals: ipHash },
          createdAt: { greater_than: new Date(Date.now() - 60 * 60 * 1000).toISOString() },
        },
      })
      if (recent.totalDocs >= MAX_PER_HOUR) return { ok: false, error: 'rate_limited' }

      await payload.create({
        collection: 'enquiries',
        data: { ...enquiry, ipHash, status: 'new' },
        overrideAccess: true,
      })
    }

    if (!stored) {
      // Nowhere to store the enquiry. Fine while designing; never lose one in production.
      if (process.env.NODE_ENV === 'production') return { ok: false, error: 'server' }
      console.info('[enquiry] design phase — not stored:', enquiry)
    }

    return { ok: true }
  } catch (error) {
    console.error('[enquiry] failed', error)
    return { ok: false, error: 'server' }
  }
}

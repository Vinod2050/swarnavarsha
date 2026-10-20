import { Gutter } from '@payloadcms/ui'
import type { ListViewServerProps } from 'payload'

import { VIDEO_LIMITS } from '@/lib/content'
import type { Media } from '@/payload-types'

import { type VideoKind, type VideoRow, VideosTable } from './VideosTable'

const posterOf = (poster: unknown): string | null => {
  if (!poster || typeof poster !== 'object') return null
  const media = poster as Media
  return media.sizes?.thumb?.url ?? media.url ?? null
}

/**
 * Video lists (2026-10-20), for advertisements and customer feedback: one table with every
 * video, which ones the home page shows (the newest switched on; feedback also needs the
 * customer's consent), and the actions in the row: play, edit, show or hide, delete.
 * Replaces Payload's own list for `videos` and `feedback-videos`.
 */
export async function VideosListView({
  payload,
  user,
  locale,
  collectionConfig,
}: ListViewServerProps) {
  const kind: VideoKind = collectionConfig.slug === 'feedback-videos' ? 'feedback' : 'advert'
  const { docs } = await payload.find({
    collection: kind === 'feedback' ? 'feedback-videos' : 'videos',
    sort: '-createdAt',
    limit: 200,
    depth: 1,
    locale: locale?.code === 'mr' ? 'mr' : 'en',
    fallbackLocale: 'en',
    overrideAccess: false,
    user,
  })

  const rows: VideoRow[] = docs.map((doc) => ({
    id: doc.id,
    title: doc.title ?? '',
    filename: doc.filename ?? null,
    filesize: doc.filesize ?? null,
    url: doc.url ?? null,
    mimeType: doc.mimeType ?? null,
    poster: posterOf(doc.poster),
    active: Boolean(doc.active),
    createdAt: doc.createdAt,
    ...('consentConfirmed' in doc && {
      customerName: doc.customerName ?? null,
      consent: Boolean(doc.consentConfirmed),
    }),
  }))

  return (
    <Gutter className="sg-products">
      <VideosTable
        rows={rows}
        adminRoute={payload.config.routes.admin}
        limit={kind === 'feedback' ? VIDEO_LIMITS.feedback : VIDEO_LIMITS.advert}
        kind={kind}
      />
    </Gutter>
  )
}

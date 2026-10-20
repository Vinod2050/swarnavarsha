import { revalidateTag } from 'next/cache'
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'

export type CacheTag =
  | 'rates'
  | 'faqs'
  | 'services'
  | 'testimonials'
  | 'videos'
  | 'products'
  | 'offer'
  | 'settings'
  | 'navigation'

function revalidate(tag: CacheTag): void {
  try {
    // Expire immediately so a rate update is visible on the next page load
    revalidateTag(tag, { expire: 0 })
  } catch {
    // Called outside a Next.js request (for example from a seed script): nothing to revalidate
  }
}

export const revalidateCollection =
  (tag: CacheTag): CollectionAfterChangeHook =>
  ({ doc }) => {
    revalidate(tag)
    return doc
  }

export const revalidateCollectionDelete =
  (tag: CacheTag): CollectionAfterDeleteHook =>
  ({ doc }) => {
    revalidate(tag)
    return doc
  }

export const revalidateGlobal =
  (tag: CacheTag): GlobalAfterChangeHook =>
  ({ doc }) => {
    revalidate(tag)
    return doc
  }

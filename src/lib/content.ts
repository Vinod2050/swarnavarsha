import { unstable_cache } from 'next/cache'

import type { Locale } from '@/i18n/routing'
import {
  faqsSeed,
  offerSeed,
  productsSeed,
  servicesSeed,
  siteSeed,
  testimonialsSeed,
  type FaqCategory,
  type ProductCategory,
  type ServiceSlug,
} from '@/seed/data'

import { getPayloadClient, hasDatabase } from './payload'

/**
 * Content access for pages and components.
 *
 * With DATABASE_URI set, content comes from Payload through the Local API. Each read is
 * cached and tagged ('settings', 'services', 'faqs', 'testimonials', 'videos', 'offer'); the
 * afterChange hooks in src/hooks/revalidate.ts expire the tag when staff save a change.
 *
 * Without a database (design phase) the same functions read `src/seed/data.ts`.
 */

export type SiteSettings = {
  name: string
  legalName: string
  phones: { display: string; tel: string }[]
  whatsapp: string
  address: string
  addressParts: typeof siteSeed.addressParts
  mapEmbedUrl: string
  mapLinkUrl: string
  openingHours: string | null
  social: { label: string; url: string }[]
  showSilver: boolean
}

export type Service = {
  slug: ServiceSlug
  icon: 'coins' | 'landmark' | 'gem'
  title: string
  summary: string
}

export type Faq = { id: string; category: FaqCategory; question: string; answer: string }

export type Testimonial = { id: string; name: string; area: string; text: string; rating: number }

export type Offer = { active: boolean; text: string }

const loadSettings = unstable_cache(
  async (locale: Locale) => {
    const payload = await getPayloadClient()
    return payload.findGlobal({ slug: 'site-settings', locale, depth: 0 })
  },
  ['site-settings'],
  { tags: ['settings'] },
)

export async function getSiteSettings(locale: Locale): Promise<SiteSettings> {
  const seed: SiteSettings = {
    ...siteSeed,
    name: siteSeed.name[locale],
    legalName: siteSeed.legalName[locale],
    address: siteSeed.address[locale],
    openingHours: siteSeed.openingHours ? siteSeed.openingHours[locale] : null,
  }
  if (!hasDatabase()) return seed

  // Anything staff have not filled in yet keeps its value from the seed file
  const doc = await loadSettings(locale)
  return {
    ...seed,
    phones: doc.phones?.length
      ? doc.phones.map(({ display, tel }) => ({ display, tel }))
      : seed.phones,
    whatsapp: doc.whatsapp || seed.whatsapp,
    address: doc.address || seed.address,
    mapEmbedUrl: doc.mapEmbedUrl || seed.mapEmbedUrl,
    mapLinkUrl: doc.mapLinkUrl || seed.mapLinkUrl,
    openingHours: doc.openingHours || seed.openingHours,
    social: doc.social?.length ? doc.social.map(({ label, url }) => ({ label, url })) : seed.social,
    showSilver: doc.showSilver ?? seed.showSilver,
  }
}

export type Product = {
  code: string
  category: ProductCategory
  weightGrams: number
  price: number
  image: string
  name: string
  description: string
  /** A dummy product from the seed file, shown with a "Sample" badge */
  sample: boolean
}

function sampleProducts(locale: Locale): Product[] {
  return productsSeed.map((p) => ({
    code: p.code,
    category: p.category,
    weightGrams: p.weightGrams,
    price: p.price,
    image: p.image,
    name: p.name[locale],
    description: p.description[locale],
    sample: true,
  }))
}

type MediaDoc = { url?: string | null; sizes?: { card?: { url?: string | null } } }

const loadProducts = unstable_cache(
  async (locale: Locale) => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'products',
      locale,
      // A product not yet written in Marathi shows its English name and description there
      fallbackLocale: 'en',
      // The Local API skips access control, so the "switched on" rule is repeated here
      where: { active: { equals: true } },
      sort: 'order',
      pagination: false,
      depth: 1,
    })
    return docs.map((doc) => {
      const image = doc.image as MediaDoc | number | null
      const photo = image && typeof image === 'object' ? image : null
      return {
        code: doc.code,
        category: doc.category,
        weightGrams: doc.weightGrams,
        price: doc.price,
        image: photo?.sizes?.card?.url ?? photo?.url ?? '',
        name: doc.name ?? '',
        description: doc.description ?? '',
        sample: false,
      }
    })
  },
  ['products'],
  { tags: ['products'] },
)

/**
 * Store products added in /admin (Store products). Until the first one is added, the dummy
 * products from the seed file are shown, each with a "Sample" badge.
 */
export async function getProducts(locale: Locale): Promise<Product[]> {
  if (!hasDatabase()) return sampleProducts(locale)

  const products = (await loadProducts(locale)).filter((p) => p.image && p.name)
  return products.length > 0 ? products : sampleProducts(locale)
}

const SERVICE_SLUGS: readonly string[] = servicesSeed.map((s) => s.slug)

const loadServices = unstable_cache(
  async (locale: Locale) => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'services',
      locale,
      sort: 'order',
      limit: 20,
      depth: 0,
    })
    return docs.map(({ slug, icon, title, summary }) => ({ slug, icon, title, summary }))
  },
  ['services'],
  { tags: ['services'] },
)

export async function getServices(locale: Locale): Promise<Service[]> {
  if (!hasDatabase()) {
    return servicesSeed.map((s) => ({
      slug: s.slug,
      icon: s.icon,
      title: s.title[locale],
      summary: s.summary[locale],
    }))
  }

  const docs = await loadServices(locale)
  // Cards link to /<slug>, so only services with a page, and translated in this language
  return docs.filter(
    (s): s is Service => SERVICE_SLUGS.includes(s.slug) && Boolean(s.title && s.summary),
  )
}

const loadFaqs = unstable_cache(
  async (locale: Locale) => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'faqs',
      locale,
      sort: 'order',
      pagination: false,
      depth: 0,
    })
    return docs.map(({ id, category, question, answer, showOnHome }) => ({
      id: String(id),
      category,
      question,
      answer,
      showOnHome: Boolean(showOnHome),
    }))
  },
  ['faqs'],
  { tags: ['faqs'] },
)

export async function getFaqs(
  locale: Locale,
  filter: { homeOnly?: boolean; categories?: FaqCategory[] } = {},
): Promise<Faq[]> {
  const all = hasDatabase()
    ? // Skip questions not yet translated into this language
      (await loadFaqs(locale)).filter((f) => f.question && f.answer)
    : faqsSeed.map((f) => ({
        id: f.id,
        category: f.category,
        showOnHome: f.showOnHome,
        question: f.question[locale],
        answer: f.answer[locale],
      }))

  return all
    .filter((f) => (filter.homeOnly ? f.showOnHome : true))
    .filter((f) => (filter.categories ? filter.categories.includes(f.category) : true))
    .map(({ id, category, question, answer }) => ({ id, category, question, answer }))
}

const loadTestimonials = unstable_cache(
  async (locale: Locale) => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'testimonials',
      locale,
      // The Local API skips access control, so the consent rule is repeated here
      where: { consentConfirmed: { equals: true } },
      sort: '-createdAt',
      limit: 20,
      depth: 0,
    })
    return docs.map(({ id, name, area, text, rating }) => ({
      id: String(id),
      name,
      area: area ?? '',
      text,
      rating,
    }))
  },
  ['testimonials'],
  { tags: ['testimonials'] },
)

export async function getTestimonials(locale: Locale): Promise<Testimonial[]> {
  if (!hasDatabase()) {
    return testimonialsSeed.map((t) => ({
      id: t.id,
      name: t.name,
      area: t.area[locale],
      text: t.text[locale],
      rating: t.rating,
    }))
  }
  return (await loadTestimonials(locale)).filter((t) => t.text)
}

/** How many videos of each kind the website shows; the rest stay in the panel. */
export const VIDEO_LIMITS = { advert: 4, feedback: 6 } as const

export type Video = {
  id: string
  title: string
  customerName: string
  url: string
  mimeType: string
  poster: string | null
}

type VideoDoc = {
  id: number | string
  title?: string | null
  customerName?: string | null
  url?: string | null
  mimeType?: string | null
  poster?: unknown
}

function toVideo({ id, title, customerName, url, mimeType, poster }: VideoDoc): Video {
  const cover = poster as { url?: string | null; sizes?: { card?: { url?: string | null } } }
  return {
    id: String(id),
    title: title ?? '',
    customerName: customerName ?? '',
    url: url ?? '',
    mimeType: mimeType ?? 'video/mp4',
    poster:
      cover && typeof cover === 'object' ? (cover.sizes?.card?.url ?? cover.url ?? null) : null,
  }
}

const loadVideos = unstable_cache(
  async (locale: Locale) => {
    const payload = await getPayloadClient()
    // The Local API skips access control, so the "switched on" and consent rules are repeated
    const [adverts, feedback] = await Promise.all([
      payload.find({
        collection: 'videos',
        locale,
        where: { active: { equals: true } },
        // Newest first (2026-10-20): advertisements have no order number to fill in
        sort: '-createdAt',
        limit: 50,
        depth: 1,
      }),
      payload.find({
        collection: 'feedback-videos',
        locale,
        where: { and: [{ active: { equals: true } }, { consentConfirmed: { equals: true } }] },
        sort: '-createdAt',
        limit: 50,
        depth: 1,
      }),
    ])
    return { adverts: adverts.docs.map(toVideo), feedback: feedback.docs.map(toVideo) }
  },
  ['videos'],
  { tags: ['videos'] },
)

/** Videos uploaded in /admin, already cut to the number the website shows of each kind. */
export async function getVideos(locale: Locale): Promise<{ adverts: Video[]; feedback: Video[] }> {
  if (!hasDatabase()) return { adverts: [], feedback: [] }

  // Skip videos with no file or no title in this language
  const shown = (video: Video) => video.url && video.title
  const { adverts, feedback } = await loadVideos(locale)
  return {
    adverts: adverts.filter(shown).slice(0, VIDEO_LIMITS.advert),
    feedback: feedback.filter(shown).slice(0, VIDEO_LIMITS.feedback),
  }
}

const loadOffer = unstable_cache(
  async (locale: Locale) => {
    const payload = await getPayloadClient()
    const { active, text } = await payload.findGlobal({ slug: 'offer', locale, depth: 0 })
    return { active: Boolean(active), text: text ?? '' }
  },
  ['offer'],
  { tags: ['offer'] },
)

export async function getOffer(locale: Locale): Promise<Offer> {
  if (!hasDatabase()) return { active: offerSeed.active, text: offerSeed.text[locale] }

  const offer = await loadOffer(locale)
  // Never show an empty band in a language the offer is not written in
  return { active: offer.active && offer.text !== '', text: offer.text }
}

export function whatsappUrl(whatsapp: string, message: string): string {
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`
}

import type { Metadata } from 'next'

import { routing, type Locale } from '@/i18n/routing'

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(
  /\/$/,
  '',
)

/** Site paths without locale prefix. '' is the home page. */
export const PAGE_PATHS = [
  '',
  '/services',
  '/sell-gold',
  '/release-pledged-gold',
  '/buy-gold',
  '/store',
  '/how-it-works',
  '/about',
  '/faq',
  '/contact',
  '/privacy-policy',
  '/terms',
] as const

export type PagePath = (typeof PAGE_PATHS)[number]

/** The `meta` messages key holding each page's title and description. */
export const PAGE_META_KEY = {
  '': 'home',
  '/services': 'services',
  '/sell-gold': 'sell',
  '/release-pledged-gold': 'pledged',
  '/buy-gold': 'buy',
  '/store': 'store',
  '/how-it-works': 'how',
  '/about': 'about',
  '/faq': 'faq',
  '/contact': 'contact',
  '/privacy-policy': 'privacy',
  '/terms': 'terms',
} as const satisfies Record<PagePath, string>

/** Service pages: they also get a `Service` entry in the structured data. */
export const SERVICE_PATHS = ['/sell-gold', '/release-pledged-gold', '/buy-gold'] as const

/**
 * Other spellings customers type. Used only in structured data (`alternateName`), never as
 * visible or hidden page text. Approved by Finixsoft 2026-10-19.
 */
export const BRAND_ALTERNATE_NAMES = [
  'Suvarnavarsha Gold',
  'सुवर्णवर्षा गोल्ड',
  'Suvarnavarsha',
  'Swarnvarsha',
  'Swarnavarsha',
  'Suvarnvarsha',
  'Swarna Varsha',
  'स्वर्णवर्षा',
]

/** Areas around the branch, for `areaServed` in structured data (Finixsoft, 2026-10-19). */
export const AREAS_SERVED = {
  cities: ['Pune', 'Pimpri-Chinchwad'],
  localities: ['Dange Chowk', 'Wakad', 'Thergaon', 'Hinjewadi', 'Pimple Saudagar', 'Chinchwad'],
}

/**
 * Search engines may index this deployment. Set SITE_INDEXING=off on staging or preview
 * servers: robots.txt then disallows everything and every response carries `noindex`.
 */
export const INDEXING_ENABLED = process.env.SITE_INDEXING !== 'off'

/** Search engines and AI assistants that fetch pages to answer people's searches. */
export const SEARCH_BOTS = [
  'Googlebot',
  'Bingbot',
  'Applebot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'PerplexityBot',
  'Claude-SearchBot',
  'Claude-User',
]

/**
 * Crawlers that collect pages to train AI models. Allowed by default (visibility is the
 * goal); set ROBOTS_BLOCK_AI_TRAINING=true to block them without blocking the search bots.
 */
export const AI_TRAINING_BOTS = ['GPTBot', 'ClaudeBot', 'Google-Extended', 'Applebot-Extended']

export function localeUrl(locale: Locale, path: string): string {
  const prefix = locale === routing.defaultLocale ? '' : `/${locale}`
  return `${SITE_URL}${prefix}${path}`
}

export function languageAlternates(path: string): Record<string, string> {
  return {
    'en-IN': localeUrl('en', path),
    'mr-IN': localeUrl('mr', path),
    'x-default': localeUrl(routing.defaultLocale, path),
  }
}

const OG_LOCALE: Record<Locale, string> = { en: 'en_IN', mr: 'mr_IN' }
const OG_IMAGE = '/og/og-default.jpg'

/** Search engines may index the page and show a large image and a full-length snippet. */
export const INDEXABLE: Metadata['robots'] = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
  },
}

export function buildMetadata({
  locale,
  path,
  title,
  description,
  keywords,
  siteName,
  imageAlt,
}: {
  locale: Locale
  path: PagePath
  title: string
  description: string
  /** Comma-separated search phrases for this page */
  keywords?: string
  siteName: string
  imageAlt: string
}): Metadata {
  const url = localeUrl(locale, path)
  return {
    title,
    description,
    keywords: keywords?.split(',').map((keyword) => keyword.trim()),
    alternates: { canonical: url, languages: languageAlternates(path) },
    robots: INDEXING_ENABLED ? INDEXABLE : { index: false, follow: false },
    openGraph: {
      title,
      description,
      url,
      siteName,
      type: 'website',
      locale: OG_LOCALE[locale],
      alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: imageAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [{ url: OG_IMAGE, alt: imageAlt }],
    },
  }
}

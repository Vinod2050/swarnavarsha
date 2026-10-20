import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { routing, type Locale } from '@/i18n/routing'

import { buildMetadata, type PagePath } from './seo'

export type PageProps = { params: Promise<{ locale: string }> }

type MetaKey =
  | 'home'
  | 'services'
  | 'store'
  | 'sell'
  | 'pledged'
  | 'buy'
  | 'how'
  | 'about'
  | 'faq'
  | 'contact'
  | 'privacy'
  | 'terms'

/** Validates the locale segment and enables static rendering for the page. */
export async function resolveLocale(params: PageProps['params']): Promise<Locale> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  return locale
}

/** Title, description, keywords, canonical, hreflang, robots and social tags for a page. */
export async function pageMetadata(
  params: PageProps['params'],
  key: MetaKey,
  path: PagePath,
): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) return {}
  const t = await getTranslations({ locale, namespace: 'meta' })
  return buildMetadata({
    locale,
    path,
    title: t(`${key}.title`),
    description: t(`${key}.description`),
    keywords: t(`${key}.keywords`),
    siteName: t('siteName'),
    imageAlt: t('ogImageAlt'),
  })
}

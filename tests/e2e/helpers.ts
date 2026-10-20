import { readFileSync } from 'node:fs'
import path from 'node:path'

type Messages = {
  common: { language: string; callNow: string; whatsappChat: string }
  nav: { main: string; menu: string; close: string; sellGold: string }
  enquiry: { submit: string; errors: { name: string; mobile: string; consent: string } }
  notFound: { title: string }
}

function messages(locale: string): Messages {
  const file = path.join(process.cwd(), 'messages', `${locale}.json`)
  return JSON.parse(readFileSync(file, 'utf8')) as Messages
}

/**
 * Keep in step with src/i18n/routing.ts: the default locale has no URL prefix
 * (`localePrefix: 'as-needed'`).
 */
export const LOCALES = [
  { code: 'en', prefix: '', switchLabel: 'English', messages: messages('en') },
  { code: 'mr', prefix: '/mr', switchLabel: 'मराठी', messages: messages('mr') },
] as const

/** Keep in step with PAGE_PATHS in src/lib/seo.ts. '' is the home page. */
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

export function url(prefix: string, pagePath: string): string {
  return `${prefix}${pagePath}` || '/'
}

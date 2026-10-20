import { GoogleAnalytics } from '@next/third-parties/google'
import type { Metadata, Viewport } from 'next'
import { Mukta, Playfair_Display, Tiro_Devanagari_Marathi } from 'next/font/google'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import type { ReactNode } from 'react'

import { FloatingActions } from '@/components/layout/FloatingActions'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { NavigationLoader } from '@/components/layout/NavigationLoader'
import { TopBar } from '@/components/layout/TopBar'
import { SiteJsonLd } from '@/components/seo/JsonLd'
import { routing } from '@/i18n/routing'
import { getServices, getSiteSettings } from '@/lib/content'
import { SITE_URL } from '@/lib/seo'

import '../globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-playfair',
  display: 'swap',
})

// Devanagari files stay preloaded: without it Marathi headings shift when the font arrives
// (Lighthouse CLS 0.075 on /mr, measured 2026-10-19)
const tiro = Tiro_Devanagari_Marathi({
  subsets: ['devanagari', 'latin'],
  weight: '400',
  variable: '--font-tiro',
  display: 'swap',
})

const mukta = Mukta({
  subsets: ['latin', 'devanagari'],
  weight: ['400', '600', '700'],
  variable: '--font-mukta',
  display: 'swap',
})

type Props = { children: ReactNode; params: Promise<{ locale: string }> }

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export const viewport: Viewport = {
  themeColor: '#2E2327',
  width: 'device-width',
  initialScale: 1,
}

export async function generateMetadata({ params }: Pick<Props, 'params'>): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) return {}
  const t = await getTranslations({ locale, namespace: 'meta' })
  const company = 'Suvarnavarsha Gold Ventures Pvt. Ltd.'
  // Search Console and Bing Webmaster Tools "HTML tag" codes; each tag is left out until
  // its code is set
  const googleVerification = process.env.GOOGLE_SITE_VERIFICATION
  const bingVerification = process.env.BING_SITE_VERIFICATION
  return {
    metadataBase: new URL(SITE_URL),
    applicationName: t('siteName'),
    authors: [{ name: company, url: SITE_URL }],
    creator: company,
    publisher: company,
    category: 'Jewelry',
    formatDetection: { telephone: false },
    verification: {
      ...(googleVerification && { google: googleVerification }),
      ...(bingVerification && { other: { 'msvalidate.01': bingVerification } }),
    },
    // Local-search hints: the branch is in Pune, Maharashtra.
    // [CLIENT TO PROVIDE: exact map coordinates] then add geo.position and ICBM here.
    other: { 'geo.region': 'IN-MH', 'geo.placename': 'Pune' },
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const [messages, t, settings, services] = await Promise.all([
    getMessages(),
    getTranslations('common'),
    getSiteSettings(locale),
    getServices(locale),
  ])

  // Only the namespaces used by client components are sent to the browser
  const clientMessages = { enquiry: messages.enquiry }
  const gaId = process.env.NEXT_PUBLIC_GA_ID

  return (
    <html lang={locale} className={`${playfair.variable} ${tiro.variable} ${mukta.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only z-50 rounded-md bg-gold-300 px-4 py-3 t-label text-plum-800 focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
        >
          {t('skipToContent')}
        </a>
        <NextIntlClientProvider messages={clientMessages}>
          <TopBar settings={settings} />
          <Header settings={settings} />
          <main id="main">{children}</main>
          <Footer settings={settings} services={services} />
          <FloatingActions settings={settings} />
          <NavigationLoader label={t('loading')} />
        </NextIntlClientProvider>
        <SiteJsonLd settings={settings} locale={locale} />
        {gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  )
}

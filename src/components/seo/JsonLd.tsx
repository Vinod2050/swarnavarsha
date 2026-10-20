import { getTranslations } from 'next-intl/server'

import type { Locale } from '@/i18n/routing'
import { getServices, type Faq, type SiteSettings } from '@/lib/content'
import {
  AREAS_SERVED,
  BRAND_ALTERNATE_NAMES,
  PAGE_META_KEY,
  SERVICE_PATHS,
  SITE_URL,
  localeUrl,
  type PagePath,
} from '@/lib/seo'

type Data = Record<string, unknown>

// Stable ids, so the entities on every page point at the same business
const ORGANIZATION_ID = `${SITE_URL}/#organization`
const STORE_ID = `${SITE_URL}/#store`
const WEBSITE_ID = `${SITE_URL}/#website`

const IN_LANGUAGE: Record<Locale, string> = { en: 'en-IN', mr: 'mr-IN' }

function JsonLd({ data }: { data: Data }) {
  return (
    <script
      type="application/ld+json"
      // "<" is escaped so content can never close the script tag
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}

function areaServed(): Data[] {
  return [
    ...AREAS_SERVED.cities.map((name) => ({ '@type': 'City', name })),
    ...AREAS_SERVED.localities.map((name) => ({ '@type': 'Place', name })),
  ]
}

/**
 * The company, the branch (JewelryStore, a LocalBusiness type) and the website — rendered
 * once in the root layout. Opening hours and map coordinates are added only once the client
 * confirms them (CLAUDE.md Section 18).
 */
export function SiteJsonLd({ settings, locale }: { settings: SiteSettings; locale: Locale }) {
  const sameAs = settings.social.map((item) => item.url)
  const alternateName = BRAND_ALTERNATE_NAMES.filter((name) => name !== settings.name)
  const logo = `${SITE_URL}/logo/suvarnavarsha-logo-v2-dark.png`

  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Organization',
            '@id': ORGANIZATION_ID,
            name: settings.legalName,
            alternateName,
            url: SITE_URL,
            logo,
            contactPoint: settings.phones.map((phone) => ({
              '@type': 'ContactPoint',
              telephone: phone.tel,
              contactType: 'customer service',
              areaServed: 'IN',
              availableLanguage: ['English', 'Marathi'],
            })),
            ...(sameAs.length > 0 && { sameAs }),
          },
          {
            '@type': 'JewelryStore',
            '@id': STORE_ID,
            name: settings.name,
            alternateName,
            url: SITE_URL,
            logo,
            image: `${SITE_URL}/og/og-default.jpg`,
            telephone: settings.phones[0]?.tel,
            address: {
              '@type': 'PostalAddress',
              streetAddress: settings.addressParts.street,
              addressLocality: settings.addressParts.locality,
              addressRegion: settings.addressParts.region,
              postalCode: settings.addressParts.postalCode,
              addressCountry: settings.addressParts.country,
            },
            areaServed: areaServed(),
            hasMap: settings.mapLinkUrl,
            currenciesAccepted: 'INR',
            parentOrganization: { '@id': ORGANIZATION_ID },
            // [CLIENT TO PROVIDE: geo coordinates and opening hours] — add `geo` and
            // `openingHoursSpecification` once confirmed
            ...(sameAs.length > 0 && { sameAs }),
          },
          {
            '@type': 'WebSite',
            '@id': WEBSITE_ID,
            name: settings.name,
            url: SITE_URL,
            inLanguage: IN_LANGUAGE[locale],
            publisher: { '@id': ORGANIZATION_ID },
          },
        ],
      }}
    />
  )
}

/**
 * The page itself (WebPage), its breadcrumb (inner pages) and, on service pages, the
 * Service. Names and descriptions come from the page's own meta text and the Services
 * collection, so the markup always matches what visitors see.
 */
export async function PageJsonLd({
  locale,
  path,
  home,
  name,
}: {
  locale: Locale
  path: PagePath
  /** Breadcrumb label of the home page (inner pages only) */
  home?: string
  /** Breadcrumb label of this page (inner pages only) */
  name?: string
}) {
  const t = await getTranslations({ locale, namespace: 'meta' })
  const key = PAGE_META_KEY[path]
  const url = localeUrl(locale, path)
  const hasBreadcrumb = path !== '' && Boolean(home && name)

  const graph: Data[] = [
    {
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
      url,
      name: t(`${key}.title`),
      description: t(`${key}.description`),
      inLanguage: IN_LANGUAGE[locale],
      isPartOf: { '@id': WEBSITE_ID },
      about: { '@id': STORE_ID },
      ...(hasBreadcrumb && { breadcrumb: { '@id': `${url}#breadcrumb` } }),
    },
  ]

  if (hasBreadcrumb) {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: home, item: localeUrl(locale, '') },
        { '@type': 'ListItem', position: 2, name, item: url },
      ],
    })
  }

  if ((SERVICE_PATHS as readonly string[]).includes(path)) {
    const services = await getServices(locale)
    const service = services.find((s) => `/${s.slug}` === path)
    if (service) {
      graph.push({
        '@type': 'Service',
        '@id': `${url}#service`,
        name: service.title,
        serviceType: service.title,
        description: service.summary,
        url,
        provider: { '@id': STORE_ID },
        areaServed: areaServed(),
      })
    }
  }

  return <JsonLd data={{ '@context': 'https://schema.org', '@graph': graph }} />
}

/** FAQPage — only on /faq, so each question is marked up once across the site. */
export function FaqJsonLd({ faqs }: { faqs: Faq[] }) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      }}
    />
  )
}

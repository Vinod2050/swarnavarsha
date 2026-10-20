import { ArrowRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import { ContactBlock } from '@/components/sections/ContactBlock'
import { CtaButtons } from '@/components/sections/CtaButtons'
import { FaqSection } from '@/components/sections/FaqSection'
import { ServiceShowcase } from '@/components/sections/inner/ServiceShowcase'
import { HeroPoints, PageHeroSlides } from '@/components/sections/PageHeroSlides'
import { Process } from '@/components/sections/Process'
import { RateStrip } from '@/components/sections/RateStrip'
import { WhyUs } from '@/components/sections/WhyUs'
import { PageJsonLd } from '@/components/seo/JsonLd'
import { Link } from '@/i18n/navigation'
import { getFaqs, getServices, getSiteSettings } from '@/lib/content'
import { pageMetadata, resolveLocale, type PageProps } from '@/lib/page'
import { getLatestRates } from '@/lib/rates'

const PATH = '/services'

// One hero slide for each service after the first slide, with the photo used for that service
// [CLIENT TO PROVIDE: service photos] Temporary stock photos, see public/images/stock/CREDITS.md
const SERVICE_PHOTOS: Record<string, string | undefined> = {
  'sell-gold': '/images/stock/service-sell-gold.webp',
  'release-pledged-gold': '/images/services/release-pledged-gold.webp',
  'buy-gold': '/images/services/coins-and-bars.webp',
}

export function generateMetadata({ params }: PageProps) {
  return pageMetadata(params, 'services', PATH)
}

export default async function ServicesPage({ params }: PageProps) {
  const locale = await resolveLocale(params)
  const [t, tn, tc, settings, services, rates, faqs] = await Promise.all([
    getTranslations('servicesPage'),
    getTranslations('nav'),
    getTranslations('common'),
    getSiteSettings(locale),
    getServices(locale),
    getLatestRates(),
    getFaqs(locale, { homeOnly: true }),
  ])
  // A service added in /admin without highlights in the messages files gets none
  const highlights = (slug: string) =>
    t.has(`highlights.${slug}`) ? (t.raw(`highlights.${slug}`) as string[]) : []

  return (
    <>
      <PageJsonLd locale={locale} home={tn('home')} name={t('crumb')} path={PATH} />
      <PageHeroSlides
        crumb={t('crumb')}
        photo="small"
        slides={[
          {
            eyebrow: t('eyebrow'),
            title: t('title'),
            text: t('intro'),
            image: '/images/stock/hero-bangles.webp',
            children: (
              <>
                <CtaButtons settings={settings} location="services_hero" inline />
                <HeroPoints items={services.map((service) => service.title)} />
              </>
            ),
          },
          ...services.map((service) => ({
            eyebrow: t('eyebrow'),
            title: service.title,
            text: service.summary,
            image: SERVICE_PHOTOS[service.slug] ?? '/images/stock/hero-bangles.webp',
            children: (
              <>
                <CtaButtons settings={settings} location={`services_hero_${service.slug}`} inline />
                <HeroPoints items={highlights(service.slug)} />
                <Link
                  href={`/${service.slug}`}
                  className="mt-4 inline-flex min-h-11 items-center gap-2 t-label text-accent underline-offset-4 hover:underline xshort:hidden"
                >
                  {tc('learnMore')}
                  {/* Names the service for screen readers and search engines; not shown */}
                  <span className="sr-only">: {service.title}</span>
                  <ArrowRight aria-hidden className="size-4" />
                </Link>
              </>
            ),
          })),
        ]}
      />
      <RateStrip rates={rates} settings={settings} />

      <ServiceShowcase services={services} />
      <WhyUs />
      <Process sunken />
      <FaqSection faqs={faqs} />
      <ContactBlock settings={settings} />
    </>
  )
}

import { Banknote, Calculator, FileText, Gem, Recycle } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import { CardGrid, CheckList, ContentSection, InfoPanel } from '@/components/sections/Content'
import { CtaBand } from '@/components/sections/CtaBand'
import { CtaButtons } from '@/components/sections/CtaButtons'
import { FaqList } from '@/components/sections/FaqList'
import {
  HeroPoints,
  PageHeroSlides,
  type HeroSlideText,
} from '@/components/sections/PageHeroSlides'
import { Process } from '@/components/sections/Process'
import { RateStrip } from '@/components/sections/RateStrip'
import { PageJsonLd } from '@/components/seo/JsonLd'
import { GoldBarsIcon, NecklaceIcon } from '@/components/ui/icons'
import { getFaqs, getSiteSettings } from '@/lib/content'
import { pageMetadata, resolveLocale, type PageProps } from '@/lib/page'
import { getLatestRates } from '@/lib/rates'

const PATH = '/sell-gold'

// Same order as `sell.whatItems` in the messages files
const WHAT_ICONS = [NecklaceIcon, GoldBarsIcon, Recycle, Gem] as const

// Photos for the hero slides after the first, in the order of `sell.heroSlides`
// [CLIENT TO PROVIDE: photos of coins and bars, and of silver] for slides of their own
const HERO_IMAGES = [
  '/images/how/paid-counter.webp',
  '/images/stock/hero-bangles.webp',
]

export function generateMetadata({ params }: PageProps) {
  return pageMetadata(params, 'sell', PATH)
}

export default async function SellGoldPage({ params }: PageProps) {
  const locale = await resolveLocale(params)
  const [t, tn, settings, rates, faqs] = await Promise.all([
    getTranslations('sell'),
    getTranslations('nav'),
    getSiteSettings(locale),
    getLatestRates(),
    getFaqs(locale, { categories: ['selling'] }),
  ])
  const whatItems = t.raw('whatItems') as { title: string; text: string }[]

  return (
    <>
      <PageJsonLd locale={locale} home={tn('home')} name={t('crumb')} path={PATH} />
      <PageHeroSlides
        crumb={t('crumb')}
        slides={[
          {
            eyebrow: t('eyebrow'),
            title: t('title'),
            text: t('intro'),
            image: '/images/stock/service-sell-gold.webp',
            children: (
              <>
                <CtaButtons settings={settings} location="sell_hero" inline />
                <HeroPoints items={t.raw('highlights') as string[]} />
              </>
            ),
          },
          // What we buy, one kind of gold to a slide
          ...(t.raw('heroSlides') as HeroSlideText[]).map((slide, index) => ({
            eyebrow: t('whatTitle'),
            title: slide.title,
            text: slide.text,
            image: HERO_IMAGES[index] ?? HERO_IMAGES[0],
            children: (
              <>
                <CtaButtons settings={settings} location={`sell_hero_${index + 2}`} inline />
                <HeroPoints items={slide.points} />
              </>
            ),
          })),
        ]}
      />
      {/* Sections take their natural height, like the other service pages; ivory and pale
          gold alternate so each reads as its own band */}
      <RateStrip rates={rates} settings={settings} />

      <ContentSection title={t('whatTitle')} intro={t('whatIntro')} centred sunken>
        <CardGrid items={whatItems} columns={4} icons={WHAT_ICONS} compact />
      </ContentSection>

      <Process />

      {/* The price panel has its own band, so the formula reads on one line; documents and
          payment share the next one, side by side from tablet width */}
      <ContentSection sunken>
        <InfoPanel icon={Calculator} title={t('priceTitle')} dark>
          <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-center md:gap-8">
            <p className="rounded-md border border-accent/60 bg-surface-sunken px-4 py-4 text-center t-h3 text-balance text-accent md:px-6 md:py-6">
              {t('priceFormula')}
            </p>
            <p className="text-ink-muted">{t('priceText')}</p>
          </div>
        </InfoPanel>
      </ContentSection>

      <ContentSection>
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          <InfoPanel icon={FileText} title={t('docsTitle')}>
            <CheckList items={t.raw('docsItems') as string[]} />
            <p className="mt-4 border-t border-line pt-3 text-sm text-ink-muted sm:mt-5 sm:pt-4">
              {t('docsNote')}
            </p>
          </InfoPanel>
          <InfoPanel icon={Banknote} title={t('paymentTitle')}>
            <CheckList items={t.raw('paymentItems') as string[]} />
          </InfoPanel>
        </div>
      </ContentSection>

      <ContentSection title={t('faqTitle')} narrow centred sunken>
        <FaqList faqs={faqs} />
      </ContentSection>

      <CtaBand settings={settings} location="sell_cta" />
    </>
  )
}

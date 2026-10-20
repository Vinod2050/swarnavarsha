import {
  ArrowRight,
  BadgeCheck,
  ClipboardCheck,
  Coins,
  Layers,
  Microscope,
  RefreshCw,
  Scale,
} from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import {
  CardGrid,
  ClientPlaceholder,
  ContentSection,
  InfoPanel,
} from '@/components/sections/Content'
import { ContactBlock } from '@/components/sections/ContactBlock'
import { CtaButtons } from '@/components/sections/CtaButtons'
import { FaqList } from '@/components/sections/FaqList'
import { OfferBand } from '@/components/sections/OfferBand'
import {
  HeroPoints,
  PageHeroSlides,
  type HeroSlideText,
} from '@/components/sections/PageHeroSlides'
import { PageJsonLd } from '@/components/seo/JsonLd'
import { Button } from '@/components/ui/button'
import { GoldBarsIcon } from '@/components/ui/icons'
import { Link } from '@/i18n/navigation'
import { getFaqs, getOffer, getSiteSettings } from '@/lib/content'
import { pageMetadata, resolveLocale, type PageProps } from '@/lib/page'

const PATH = '/buy-gold'

// Same order as `buy.products` and `buy.features` in the messages files
const PRODUCT_ICONS = [Coins, GoldBarsIcon, Layers] as const
const FEATURE_ICONS = [BadgeCheck, Microscope, Scale] as const

// Photos for the hero slides after the first, in the order of `buy.heroSlides`
// [CLIENT TO PROVIDE: photos of the shop's own coins and bars] Pictures from Finixsoft
// (images/services) and a stock photo of another mint's product; see each folder's CREDITS.md
const HERO_IMAGES = [
  '/images/services/lakshmi-ganesha-coins.webp',
  '/images/stock/product-biscuit-100g.webp',
]

export function generateMetadata({ params }: PageProps) {
  return pageMetadata(params, 'buy', PATH)
}

export default async function BuyGoldPage({ params }: PageProps) {
  const locale = await resolveLocale(params)
  const [t, tn, settings, offer, faqs] = await Promise.all([
    getTranslations('buy'),
    getTranslations('nav'),
    getSiteSettings(locale),
    getOffer(locale),
    getFaqs(locale, { categories: ['buying'] }),
  ])

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
            image: '/images/services/coins-and-bars.webp',
            children: (
              <>
                <CtaButtons settings={settings} location="buy_hero" inline />
                <HeroPoints items={t.raw('highlights') as string[]} />
              </>
            ),
          },
          // What you can buy, then certification and registration
          ...(t.raw('heroSlides') as HeroSlideText[]).map((slide, index) => ({
            eyebrow: t('eyebrow'),
            title: slide.title,
            text: slide.text,
            image: HERO_IMAGES[index] ?? HERO_IMAGES[0],
            children: (
              <>
                <CtaButtons settings={settings} location={`buy_hero_${index + 2}`} inline />
                <HeroPoints items={slide.points} />
              </>
            ),
          })),
        ]}
      />
      <OfferBand offer={offer} showLink={false} />

      <ContentSection title={t('productsTitle')} centred>
        <CardGrid
          items={t.raw('products') as { title: string; text: string }[]}
          icons={PRODUCT_ICONS}
        />
        <div className="mt-10 text-center">
          <Button asChild variant="secondary">
            <Link href="/store">
              {tn('store')}
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>
      </ContentSection>

      <ContentSection title={t('featuresTitle')} sunken centred>
        <CardGrid
          items={t.raw('features') as { title: string; text: string }[]}
          icons={FEATURE_ICONS}
        />
      </ContentSection>

      <ContentSection>
        <div className="grid gap-6 lg:grid-cols-2">
          <InfoPanel icon={ClipboardCheck} title={t('registerTitle')} dark>
            <p className="t-body-lg">{t('registerText')}</p>
            <CtaButtons settings={settings} location="buy_register" className="mt-6" />
          </InfoPanel>
          <InfoPanel icon={RefreshCw} title={t('buybackTitle')}>
            {/* Wording must come from the client in writing — CLAUDE.md Section 8.2 */}
            <ClientPlaceholder>{t('buybackPlaceholder')}</ClientPlaceholder>
          </InfoPanel>
        </div>
      </ContentSection>

      {faqs.length > 0 && (
        <ContentSection title={t('faqTitle')} sunken narrow centred>
          <FaqList faqs={faqs} />
        </ContentSection>
      )}

      <ContactBlock settings={settings} sunken={faqs.length === 0} />
    </>
  )
}

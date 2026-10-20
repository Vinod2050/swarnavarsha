import {
  ArrowRight,
  BadgeCheck,
  ClipboardCheck,
  Gem,
  MousePointerClick,
  Scale,
  Store,
} from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import { ContentSection } from '@/components/sections/Content'
import { ContactBlock } from '@/components/sections/ContactBlock'
import { CtaButtons } from '@/components/sections/CtaButtons'
import { OfferBand } from '@/components/sections/OfferBand'
import { HeroPoints, PageHeroSlides } from '@/components/sections/PageHeroSlides'
import { ProductCard, type ProductCardLabels } from '@/components/sections/ProductCard'
import { PageJsonLd } from '@/components/seo/JsonLd'
import { WhatsAppIcon } from '@/components/ui/icons'
import { Medallion } from '@/components/ui/ornament'
import { Reveal } from '@/components/ui/reveal'
import { Link } from '@/i18n/navigation'
import { getOffer, getProducts, getSiteSettings, whatsappUrl } from '@/lib/content'
import { formatINR } from '@/lib/format'
import { pageMetadata, resolveLocale, type PageProps } from '@/lib/page'

const PATH = '/store'

// Same order as `store.steps` in the messages files
const STEP_ICONS = [MousePointerClick, WhatsAppIcon, Store] as const

// Same order as `store.trust`: purity, hallmark, weights, registration
const TRUST_ICONS = [Gem, BadgeCheck, Scale, ClipboardCheck] as const

// Photos for the hero slides after the first, one for each of `store.steps`
// [CLIENT TO PROVIDE: product photos] Temporary stock photos, see public/images/stock/CREDITS.md
const HERO_IMAGES = [
  '/images/stock/product-coin-10g.webp',
  '/images/stock/product-bar-20g.webp',
  '/images/stock/product-bar-50g.webp',
]

export function generateMetadata({ params }: PageProps) {
  return pageMetadata(params, 'store', PATH)
}

/*
 * A catalogue, not a shop: no cart or payment (CLAUDE.md Section 2). "Book now" shows the
 * product's details and sends them to the team on WhatsApp.
 */
export default async function StorePage({ params }: PageProps) {
  const locale = await resolveLocale(params)
  const [t, tn, settings, offer, products] = await Promise.all([
    getTranslations('store'),
    getTranslations('nav'),
    getSiteSettings(locale),
    getOffer(locale),
    getProducts(locale),
  ])

  const labels: ProductCardLabels = {
    sample: t('sample'),
    category: t('category'),
    code: t('code'),
    weight: t('weight'),
    price: t('price'),
    priceNote: t('priceNote'),
    book: t('book'),
    dialogIntro: t('dialogIntro'),
    sendWhatsapp: t('sendWhatsapp'),
    close: t('close'),
  }

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
            image: '/images/stock/service-buy-gold.webp',
            children: (
              <>
                <CtaButtons settings={settings} location="store_hero" inline />
                <HeroPoints items={t.raw('highlights') as string[]} />
              </>
            ),
          },
          // How to order, one step to a slide
          ...(t.raw('steps') as { title: string; text: string }[]).map((step, index) => ({
            eyebrow: t('stepsTitle'),
            title: step.title,
            text: step.text,
            image: HERO_IMAGES[index] ?? HERO_IMAGES[0],
            children: (
              <CtaButtons settings={settings} location={`store_hero_${index + 2}`} inline />
            ),
          })),
        ]}
      />
      {/* What every product carries, on a slim plum band under the hero */}
      <section
        aria-label={t('trustLabel')}
        className="theme-dark border-b border-line bg-surface-sunken text-ink"
      >
        <ul className="container-site grid grid-cols-2 gap-x-6 gap-y-5 py-6 md:grid-cols-4 md:py-8">
          {(t.raw('trust') as string[]).map((item, index) => {
            const Icon = TRUST_ICONS[index] ?? BadgeCheck
            return (
              <li key={item}>
                <Reveal delay={index * 0.08} className="group flex items-center gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full border border-accent/50 text-accent transition-colors duration-500 group-hover:bg-accent group-hover:text-on-cta">
                    <Icon aria-hidden className="size-5" strokeWidth={1.5} />
                  </span>
                  <span className="t-label text-ink">{item}</span>
                </Reveal>
              </li>
            )
          })}
        </ul>
      </section>

      <ContentSection title={t('productsTitle')} intro={t('productsIntro')} centred>
        {/* Centred rows, so a short last row sits in the middle instead of leaving a gap */}
        <ul className="flex flex-wrap justify-center gap-6">
          {products.map((product, index) => {
            const category = t(`categories.${product.category}`)
            // Weights stay in Western digits in both languages (CLAUDE.md Section 11)
            const weight = t('weightValue', { weight: String(product.weightGrams) })
            const price = formatINR(product.price)
            const message = t('whatsappMessage', {
              name: product.name,
              category,
              code: product.code,
              weight,
              price,
            })
            return (
              <li
                key={product.code}
                className="w-full sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]"
              >
                <Reveal delay={(index % 3) * 0.1} className="h-full">
                  <ProductCard
                    labels={labels}
                    product={{
                      code: product.code,
                      name: product.name,
                      description: product.description,
                      image: product.image,
                      category,
                      weight,
                      price,
                      whatsappHref: whatsappUrl(settings.whatsapp, message),
                      sample: product.sample,
                    }}
                  />
                </Reveal>
              </li>
            )
          })}
        </ul>
      </ContentSection>

      <OfferBand offer={offer} showLink={false} tone="dark" />

      <ContentSection title={t('stepsTitle')} sunken centred>
        {/* A numbered timeline: a gold line joins the steps from tablet width up */}
        <ol className="relative grid gap-6 md:grid-cols-3 md:gap-8">
          <span
            aria-hidden
            className="absolute top-8 right-[16.67%] left-[16.67%] hidden h-px bg-accent/40 md:block"
          />
          {(t.raw('steps') as { title: string; text: string }[]).map((step, index) => {
            const Icon = STEP_ICONS[index] ?? Store
            return (
              <li key={step.title} className="relative">
                <Reveal delay={index * 0.12} className="group flex h-full flex-col text-center">
                  <span className="relative z-10 mx-auto inline-grid">
                    <Medallion className="bg-surface-sunken">
                      <Icon aria-hidden />
                    </Medallion>
                    <span className="absolute -top-1 -right-1 grid size-7 place-items-center rounded-full bg-cta text-sm font-bold text-on-cta">
                      {index + 1}
                    </span>
                  </span>
                  <div className="mt-5 flex-1 hover-lift rounded-lg border border-t-2 border-line border-t-accent bg-surface-raised p-6 shadow-card">
                    {/* The number is on the medallion, so it is left out of the title here */}
                    <h3 className="t-h3">{step.title.replace(/^\d+\.\s*/, '')}</h3>
                    <p className="mt-2 text-ink-muted">{step.text}</p>
                  </div>
                </Reveal>
              </li>
            )
          })}
        </ol>
        <div className="mt-10 text-center lg:short:mt-4">
          <Link
            href="/buy-gold"
            className="inline-flex min-h-11 items-center gap-2 t-label text-accent hover:underline"
          >
            {t('moreLink')}
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>
      </ContentSection>

      <ContactBlock settings={settings} sunken={false} />
    </>
  )
}

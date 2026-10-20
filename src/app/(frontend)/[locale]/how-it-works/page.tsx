import {
  CreditCard,
  IdCard,
  Info,
  PhoneCall,
  ReceiptText,
  ShieldAlert,
  ShieldX,
  UserX,
} from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import { ContentSection } from '@/components/sections/Content'
import { CtaBand } from '@/components/sections/CtaBand'
import { CtaButtons } from '@/components/sections/CtaButtons'
import { FaqList } from '@/components/sections/FaqList'
import { FactsStrip } from '@/components/sections/inner/FactsStrip'
import { StepsTimeline } from '@/components/sections/inner/StepsTimeline'
import {
  HeroPoints,
  PageHeroSlides,
  type HeroSlide,
  type HeroSlideText,
} from '@/components/sections/PageHeroSlides'
import { SectionHeading } from '@/components/sections/SectionHeading'
import { PageJsonLd } from '@/components/seo/JsonLd'
import { Medallion, ScallopPattern } from '@/components/ui/ornament'
import { Reveal } from '@/components/ui/reveal'
import { TrackedAnchor } from '@/components/ui/tracked-anchor'
import { getFaqs, getSiteSettings } from '@/lib/content'
import { pageMetadata, resolveLocale, type PageProps } from '@/lib/page'

const PATH = '/how-it-works'

// Same order as `how.kycItems`: photo ID, PAN, purchase bill
const KYC_ICONS = [IdCard, CreditCard, ReceiptText] as const

// Same order as `how.rulesItems`: stolen or fake gold, age, indicative rates
const RULE_ICONS = [ShieldX, UserX, Info] as const

// Pictures for the hero slides after the first, in the order of `how.heroSlides`: purity
// test, weighing and pricing (the scale, cut from the counter picture), payment (the
// hand-over, on the counter picture's right). Supplied by Finixsoft, see
// public/images/how/CREDITS.md
const HERO_IMAGES: Pick<HeroSlide, 'image' | 'imageFocus'>[] = [
  { image: '/images/how/purity-test.webp', imageFocus: 'right' },
  { image: '/images/how/weighing-counter.webp' },
  { image: '/images/how/paid-counter.webp', imageFocus: 'right' },
]

export function generateMetadata({ params }: PageProps) {
  return pageMetadata(params, 'how', PATH)
}

export default async function HowItWorksPage({ params }: PageProps) {
  const locale = await resolveLocale(params)
  const [t, tn, settings, faqs] = await Promise.all([
    getTranslations('how'),
    getTranslations('nav'),
    getSiteSettings(locale),
    getFaqs(locale, { categories: ['selling'] }),
  ])
  const phone = settings.phones[0]

  return (
    <>
      <PageJsonLd locale={locale} home={tn('home')} name={t('crumb')} path={PATH} />
      <PageHeroSlides
        crumb={t('crumb')}
        photoMotion="slide"
        slides={[
          {
            eyebrow: t('eyebrow'),
            title: t('title'),
            text: t('intro'),
            // The four steps in one picture: shown whole, see public/images/how/CREDITS.md
            image: '/images/how/process-steps.webp',
            imageFit: 'contain',
            children: (
              <>
                <CtaButtons settings={settings} location="how_hero" inline />
                <HeroPoints items={t.raw('highlights') as string[]} />
              </>
            ),
          },
          // What you see at the counter: testing, weighing and pricing, payment
          ...(t.raw('heroSlides') as HeroSlideText[]).map((slide, index) => ({
            eyebrow: t('eyebrow'),
            title: slide.title,
            text: slide.text,
            ...(HERO_IMAGES[index] ?? HERO_IMAGES[0]),
            children: (
              <>
                <CtaButtons settings={settings} location={`how_hero_${index + 2}`} inline />
                <HeroPoints items={slide.points} />
              </>
            ),
          })),
        ]}
      />

      <StepsTimeline />
      <FactsStrip />

      {/* What to bring (ivory card) beside the rules (plum card) */}
      <section aria-labelledby="docs-title" className="bg-surface-sunken section-y text-ink">
        <div className="container-site">
          <SectionHeading id="docs-title" eyebrow={t('docsEyebrow')} title={t('docsHeading')} />
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <Reveal
              from="left"
              className="group h-full rounded-lg border border-line bg-surface-raised p-5 shadow-card sm:p-6 md:p-8"
            >
              <div className="flex items-center gap-4">
                <Medallion className="[&_svg]:stroke-[1.5]">
                  <IdCard />
                </Medallion>
                <div className="min-w-0">
                  <h3 className="t-h3">{t('kycTitle')}</h3>
                  <p className="mt-1 text-ink-muted">{t('kycIntro')}</p>
                </div>
              </div>
              <ul className="mt-6 grid gap-3 sm:grid-cols-3 sm:gap-4">
                {(t.raw('kycItems') as string[]).map((item, index) => {
                  const Icon = KYC_ICONS[index] ?? IdCard
                  return (
                    <li
                      key={item}
                      className="group/doc flex gap-3 rounded-md border border-line bg-surface p-4 transition-colors duration-300 hover:border-accent sm:flex-col"
                    >
                      <span className="grid size-10 shrink-0 place-items-center rounded-full border border-accent/50 text-accent transition-colors duration-300 group-hover/doc:bg-cta group-hover/doc:text-on-cta">
                        <Icon aria-hidden className="size-5" strokeWidth={1.5} />
                      </span>
                      <span>{item}</span>
                    </li>
                  )
                })}
              </ul>
              {/* Call before visiting: the number is one tap away */}
              <div className="mt-6 flex flex-col gap-3 rounded-md border border-dashed border-accent/50 bg-surface-sunken p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-ink-muted">{t('kycNote')}</p>
                {phone && (
                  <TrackedAnchor
                    href={`tel:${phone.tel}`}
                    event="call_click"
                    location="how_docs"
                    className="inline-flex min-h-11 shrink-0 items-center gap-2 t-label whitespace-nowrap text-accent hover:underline"
                  >
                    <PhoneCall aria-hidden className="size-4" />
                    {phone.display}
                  </TrackedAnchor>
                )}
              </div>
            </Reveal>

            <Reveal
              from="right"
              delay={0.1}
              className="group theme-dark relative isolate h-full overflow-hidden rounded-lg border border-line bg-surface p-5 text-ink shadow-card sm:p-6 md:p-8"
            >
              <ScallopPattern className="-z-10 opacity-25" />
              <div aria-hidden className="foil-edge foil-shimmer absolute inset-x-0 top-0" />
              <div className="flex items-center gap-4">
                <Medallion className="[&_svg]:stroke-[1.5]">
                  <ShieldAlert />
                </Medallion>
                <h3 className="min-w-0 t-h3 text-accent">{t('rulesTitle')}</h3>
              </div>
              <ul className="mt-6 divide-y divide-line">
                {(t.raw('rulesItems') as string[]).map((item, index) => {
                  const Icon = RULE_ICONS[index] ?? Info
                  return (
                    <li key={item} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
                      <span className="grid size-9 shrink-0 place-items-center rounded-full border border-accent/50 text-accent">
                        <Icon aria-hidden className="size-4" strokeWidth={1.75} />
                      </span>
                      <span className="pt-1.5">{item}</span>
                    </li>
                  )
                })}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {faqs.length > 0 && (
        <ContentSection title={t('faqTitle')} narrow centred>
          <FaqList faqs={faqs} />
        </ContentSection>
      )}

      <CtaBand settings={settings} location="how_cta" />
    </>
  )
}

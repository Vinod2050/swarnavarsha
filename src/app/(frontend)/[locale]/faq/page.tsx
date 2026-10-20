import { ArrowDown, CircleHelp, Landmark } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import { ContactBlock } from '@/components/sections/ContactBlock'
import { CtaButtons } from '@/components/sections/CtaButtons'
import { FaqList } from '@/components/sections/FaqList'
import { HeroPoints, PageHeroSlides } from '@/components/sections/PageHeroSlides'
import { FaqJsonLd, PageJsonLd } from '@/components/seo/JsonLd'
import { GoldBarsIcon, NecklaceIcon } from '@/components/ui/icons'
import { Medallion, ScallopPattern } from '@/components/ui/ornament'
import { Reveal } from '@/components/ui/reveal'
import { getFaqs, getSiteSettings } from '@/lib/content'
import { pageMetadata, resolveLocale, type PageProps } from '@/lib/page'

const PATH = '/faq'
const CATEGORIES = ['selling', 'pledged', 'buying', 'general'] as const

const CATEGORY_ICONS = {
  selling: NecklaceIcon,
  pledged: Landmark,
  buying: GoldBarsIcon,
  general: CircleHelp,
} as const

// One hero slide for each service's questions, with that service's photo
// [CLIENT TO PROVIDE: page photos] Temporary stock photos, see public/images/stock/CREDITS.md
const HERO_SLIDES = [
  { category: 'selling', image: '/images/stock/service-sell-gold.webp' },
  { category: 'pledged', image: '/images/stock/service-release-pledged-gold.webp' },
  { category: 'buying', image: '/images/stock/service-buy-gold.webp' },
] as const

export function generateMetadata({ params }: PageProps) {
  return pageMetadata(params, 'faq', PATH)
}

export default async function FaqPage({ params }: PageProps) {
  const locale = await resolveLocale(params)
  const [t, tn, tcta, settings, faqs] = await Promise.all([
    getTranslations('faq'),
    getTranslations('nav'),
    getTranslations('cta'),
    getSiteSettings(locale),
    getFaqs(locale),
  ])
  const groups = CATEGORIES.map((category) => ({
    category,
    items: faqs.filter((faq) => faq.category === category),
  })).filter((group) => group.items.length > 0)

  // A link down to a category's answers, under its hero slide
  const readLink = (category: string) => (
    <a
      href={`#faq-${category}`}
      className="mt-5 inline-flex min-h-11 items-center gap-2 t-label text-accent hover:underline max-md:short:hidden xshort:hidden"
    >
      {t('readAnswers')}
      <ArrowDown aria-hidden className="size-4" />
    </a>
  )

  return (
    <>
      <PageJsonLd locale={locale} home={tn('home')} name={t('crumb')} path={PATH} />
      <FaqJsonLd faqs={faqs} />
      <PageHeroSlides
        crumb={t('crumb')}
        slides={[
          {
            eyebrow: t('eyebrow'),
            title: t('pageTitle'),
            text: t('pageIntro'),
            image: '/images/stock/story-necklace.webp',
            children: (
              <>
                <CtaButtons settings={settings} location="faq_hero" inline />
                <HeroPoints items={t.raw('highlights') as string[]} />
              </>
            ),
          },
          // One slide for each service that has questions; its first questions as points
          ...HERO_SLIDES.flatMap(({ category, image }, index) => {
            const items = faqs.filter((faq) => faq.category === category)
            if (items.length === 0) return []
            return [
              {
                eyebrow: t('eyebrow'),
                title: t(`categories.${category}`),
                text: t(`heroSlides.${category}`),
                image,
                children: (
                  <>
                    <CtaButtons settings={settings} location={`faq_hero_${index + 2}`} inline />
                    <HeroPoints items={items.slice(0, 3).map((faq) => faq.question)} />
                    {readLink(category)}
                  </>
                ),
              },
            ]
          }),
        ]}
      />

      <div className="bg-surface section-y text-ink">
        <div className="container-site grid gap-8 lg:grid-cols-[18rem_1fr] lg:gap-14">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            {/* Phones: chips two to a row; tablets: a row of chips; laptops: a list beside the questions */}
            <nav aria-label={t('categoriesLabel')}>
              <ul className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap lg:flex-col">
                {groups.map(({ category, items }) => {
                  const Icon = CATEGORY_ICONS[category]
                  return (
                    <li key={category}>
                      <a
                        href={`#faq-${category}`}
                        className="group flex h-full min-h-11 items-center gap-3 rounded-full border border-line bg-surface-raised py-1.5 pr-4 pl-1.5 font-semibold shadow-card transition-colors duration-300 hover:border-accent hover:text-accent max-sm:gap-2 max-sm:rounded-lg max-sm:pr-2.5 max-sm:text-sm lg:rounded-lg lg:py-2.5 lg:pl-2.5"
                      >
                        <span className="grid size-8 shrink-0 place-items-center rounded-full border border-accent/50 text-accent transition-colors duration-300 group-hover:bg-cta group-hover:text-on-cta lg:size-10">
                          <Icon aria-hidden className="size-4 lg:size-5" strokeWidth={1.5} />
                        </span>
                        <span className="flex-1">{t(`categories.${category}`)}</span>
                        <span className="grid min-w-6 place-items-center rounded-full bg-surface-sunken px-1.5 text-sm text-ink-muted">
                          {items.length}
                        </span>
                      </a>
                    </li>
                  )
                })}
              </ul>
            </nav>

            {/* Talk to us: plum card with faint scallops and a shimmering foil edge */}
            <div className="theme-dark relative isolate mt-8 hidden overflow-hidden rounded-lg border border-line bg-surface text-ink shadow-card lg:block">
              <ScallopPattern className="-z-10 opacity-25" />
              <div aria-hidden className="foil-edge foil-shimmer" />
              <div className="p-6">
                <p className="foil-text t-h3">{tcta('title')}</p>
                <p className="mt-2 text-ink-muted">{tcta('text')}</p>
                <CtaButtons settings={settings} location="faq_aside" className="mt-5 sm:flex-col" />
              </div>
            </div>
          </aside>

          <div className="space-y-12 md:space-y-14">
            {groups.map(({ category, items }) => {
              const Icon = CATEGORY_ICONS[category]
              return (
                <section
                  key={category}
                  id={`faq-${category}`}
                  aria-labelledby={`faq-${category}-title`}
                >
                  <Reveal className="group mb-5 flex items-center gap-4 border-b border-line pb-5">
                    <Medallion className="[&_svg]:stroke-[1.5]">
                      <Icon aria-hidden />
                    </Medallion>
                    <div className="min-w-0">
                      <p className="t-eyebrow">{t('questionsCount', { count: items.length })}</p>
                      <h2 id={`faq-${category}-title`} className="mt-1 t-h2">
                        {t(`categories.${category}`)}
                      </h2>
                    </div>
                  </Reveal>
                  <Reveal delay={0.1}>
                    <FaqList faqs={items} variant="cards" />
                  </Reveal>
                </section>
              )
            })}
          </div>
        </div>
      </div>

      <ContactBlock settings={settings} />
    </>
  )
}

import { Building2, FileText, Info, Landmark, Store } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import { CardGrid, CheckList, ContentSection, InfoPanel } from '@/components/sections/Content'
import { ContactBlock } from '@/components/sections/ContactBlock'
import { CtaButtons } from '@/components/sections/CtaButtons'
import { FaqList } from '@/components/sections/FaqList'
import {
  HeroPoints,
  PageHeroSlides,
  type HeroSlideText,
} from '@/components/sections/PageHeroSlides'
import { PageJsonLd } from '@/components/seo/JsonLd'
import { getFaqs, getSiteSettings } from '@/lib/content'
import { pageMetadata, resolveLocale, type PageProps } from '@/lib/page'

const PATH = '/release-pledged-gold'

// Same order as `pledged.whoItems` in the messages files
const WHO_ICONS = [Landmark, Building2, Store] as const

// Photos for the hero slides after the first, in the order of `pledged.heroSlides`
// [CLIENT TO PROVIDE: page photos] Pictures from Finixsoft (images/services, images/how) and a
// temporary stock photo; see the CREDITS.md file in each folder
const HERO_IMAGES = ['/images/stock/hero-model.webp', '/images/how/paid-counter.webp']

export function generateMetadata({ params }: PageProps) {
  return pageMetadata(params, 'pledged', PATH)
}

export default async function ReleasePledgedGoldPage({ params }: PageProps) {
  const locale = await resolveLocale(params)
  const [t, tn, settings, faqs] = await Promise.all([
    getTranslations('pledged'),
    getTranslations('nav'),
    getSiteSettings(locale),
    getFaqs(locale, { categories: ['pledged'] }),
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
            image: '/images/services/release-pledged-gold.webp',
            children: (
              <>
                <CtaButtons settings={settings} location="pledged_hero" inline />
                <HeroPoints items={t.raw('highlights') as string[]} />
              </>
            ),
          },
          // Who it is for, then how it works
          ...(t.raw('heroSlides') as HeroSlideText[]).map((slide, index) => ({
            eyebrow: t('eyebrow'),
            title: slide.title,
            text: slide.text,
            image: HERO_IMAGES[index] ?? HERO_IMAGES[0],
            children: (
              <>
                <CtaButtons settings={settings} location={`pledged_hero_${index + 2}`} inline />
                <HeroPoints items={slide.points} />
              </>
            ),
          })),
        ]}
      />

      <ContentSection title={t('whoTitle')} centred>
        <CardGrid
          items={t.raw('whoItems') as { title: string; text: string }[]}
          icons={WHO_ICONS}
        />
      </ContentSection>

      <ContentSection title={t('stepsTitle')} sunken centred>
        <CardGrid
          items={t.raw('steps') as { title: string; text: string }[]}
          columns={4}
          numbered
        />
      </ContentSection>

      <ContentSection>
        <div className="grid gap-6 lg:grid-cols-2">
          <InfoPanel icon={FileText} title={t('docsTitle')}>
            <CheckList items={t.raw('docsItems') as string[]} />
          </InfoPanel>
          <InfoPanel icon={Info} title={t('noteTitle')} dark>
            <p className="t-body-lg">{t('noteText')}</p>
          </InfoPanel>
        </div>
      </ContentSection>

      {faqs.length > 0 && (
        <ContentSection title={t('faqTitle')} sunken narrow centred>
          <FaqList faqs={faqs} />
        </ContentSection>
      )}

      <ContactBlock
        settings={settings}

        sunken={faqs.length === 0}
      />
    </>
  )
}

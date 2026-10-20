import { Eye, HeartHandshake, Scale } from 'lucide-react'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

import { CardGrid, ContentSection } from '@/components/sections/Content'
import { CtaBand } from '@/components/sections/CtaBand'
import { FactsStrip } from '@/components/sections/inner/FactsStrip'
import { AboutHero } from '@/components/sections/inner/AboutHero'
import { PageJsonLd } from '@/components/seo/JsonLd'
import { OrnamentDivider } from '@/components/ui/ornament'
import { Reveal } from '@/components/ui/reveal'
import { getSiteSettings } from '@/lib/content'
import { pageMetadata, resolveLocale, type PageProps } from '@/lib/page'

const PATH = '/about'

// Same order as `about.values` in the messages files
const VALUE_ICONS = [Eye, Scale, HeartHandshake] as const

export function generateMetadata({ params }: PageProps) {
  return pageMetadata(params, 'about', PATH)
}

export default async function AboutPage({ params }: PageProps) {
  const locale = await resolveLocale(params)
  const [t, tn, tc, settings] = await Promise.all([
    getTranslations('about'),
    getTranslations('nav'),
    getTranslations('contact'),
    getSiteSettings(locale),
  ])
  const story = t.raw('story') as string[]

  return (
    <>
      <PageJsonLd locale={locale} home={tn('home')} name={t('crumb')} path={PATH} />
      <AboutHero settings={settings} />

      <section
        aria-labelledby="story-title"
        className="bg-surface section-y text-ink lg:short:py-8"
      >
        <div className="container-site grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          {/* Model with folded hands, cut out of her background, standing on the section
              [CLIENT TO PROVIDE: shop or team photo] Temporary stock cutout, see CREDITS.md */}
          <Reveal
            from="left"
            className="relative mx-auto aspect-[926/1200] w-full max-w-xs sm:max-w-sm lg:short:max-w-64"
          >
            <Image
              src="/images/stock/model-namaste.webp"
              alt=""
              fill
              sizes="(min-width: 640px) 384px, 320px"
              // Her cut edge fades out at the bottom instead of ending in a hard line
              className="[mask-image:linear-gradient(to_bottom,black_80%,transparent)] object-contain object-bottom"
            />
          </Reveal>

          <Reveal from="right" delay={0.1}>
            <h2 id="story-title" className="t-h2">
              {t('storyTitle')}
            </h2>
            <OrnamentDivider className="mt-4" />
            <div className="mt-6 measure space-y-4 t-body-lg text-ink-muted lg:short:mt-4 lg:short:space-y-2 lg:short:text-base lg:short:leading-[26px]">
              {story.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <dl className="mt-8 grid gap-6 rounded-lg border border-line bg-surface-raised p-6 shadow-card sm:grid-cols-2 lg:short:mt-4 lg:short:gap-2 lg:short:p-4">
              <div>
                <dt className="t-label text-ink-muted">{tc('phones')}</dt>
                <dd className="mt-1 t-body-lg font-semibold">
                  {settings.phones.map((phone) => (
                    <span key={phone.tel} className="block whitespace-nowrap">
                      {phone.display}
                    </span>
                  ))}
                </dd>
              </div>
              <div>
                <dt className="t-label text-ink-muted">{tc('address')}</dt>
                <dd className="mt-1">{settings.address}</dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </section>

      <FactsStrip />

      <ContentSection eyebrow={t('eyebrow')} title={t('valuesTitle')} sunken centred>
        <CardGrid
          items={t.raw('values') as { title: string; text: string }[]}
          icons={VALUE_ICONS}
        />
      </ContentSection>

      <CtaBand settings={settings} location="about_cta" />
    </>
  )
}

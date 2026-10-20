import {
  ArrowRight,
  ClipboardCheck,
  Coins,
  HandHelping,
  IdCard,
  ListChecks,
  PhoneCall,
} from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import { CtaButtons } from '@/components/sections/CtaButtons'
import { FaqSection } from '@/components/sections/FaqSection'
import { ContactChannels } from '@/components/sections/inner/ContactChannels'
import { VisitMap } from '@/components/sections/inner/VisitMap'
import { HeroPoints, PageHeroSlides } from '@/components/sections/PageHeroSlides'
import { SectionHeading } from '@/components/sections/SectionHeading'
import { PageJsonLd } from '@/components/seo/JsonLd'
import { GoldBarsIcon, NecklaceIcon } from '@/components/ui/icons'
import { Medallion, ScallopPattern } from '@/components/ui/ornament'
import { Reveal } from '@/components/ui/reveal'
import { Link } from '@/i18n/navigation'
import { getFaqs, getSiteSettings } from '@/lib/content'
import { pageMetadata, resolveLocale, type PageProps } from '@/lib/page'

const PATH = '/contact'

// Same order as `contact.visitItems`: identity proof, call first, register for 24K gold
const VISIT_ICONS = [IdCard, PhoneCall, ClipboardCheck] as const

// The services, linked from "How can we help?"
const HELP_LINKS = [
  { href: '/sell-gold', label: 'sellGold', icon: NecklaceIcon },
  { href: '/release-pledged-gold', label: 'releasePledged', icon: Coins },
  { href: '/buy-gold', label: 'buyGold', icon: GoldBarsIcon },
  { href: '/how-it-works', label: 'howItWorks', icon: ListChecks },
] as const

// [CLIENT TO PROVIDE: shop front and counter photos] Temporary stock photos, see
// public/images/stock/CREDITS.md
const HERO_IMAGES = {
  main: '/images/stock/hero-bangles.webp',
  call: '/images/stock/hero-model.webp',
  whatsapp: '/images/stock/story-necklace.webp',
  visit: '/images/stock/service-sell-gold.webp',
}

export function generateMetadata({ params }: PageProps) {
  return pageMetadata(params, 'contact', PATH)
}

export default async function ContactPage({ params }: PageProps) {
  const locale = await resolveLocale(params)
  const [t, tn, settings, faqs] = await Promise.all([
    getTranslations('contact'),
    getTranslations('nav'),
    getSiteSettings(locale),
    getFaqs(locale, { homeOnly: true }),
  ])

  return (
    <>
      <PageJsonLd locale={locale} home={tn('home')} name={t('crumb')} path={PATH} />
      <PageHeroSlides
        crumb={t('crumb')}
        slides={[
          {
            eyebrow: t('eyebrow'),
            title: t('pageTitle'),
            text: t('pageIntro'),
            image: HERO_IMAGES.main,
            children: (
              <>
                <CtaButtons settings={settings} location="contact_hero" inline />
                <HeroPoints items={t.raw('highlights') as string[]} />
              </>
            ),
          },
          {
            eyebrow: t('eyebrow'),
            title: t('channels.call.title'),
            text: t('channels.call.text'),
            image: HERO_IMAGES.call,
            children: (
              <>
                <CtaButtons settings={settings} location="contact_hero_2" inline />
                <HeroPoints items={settings.phones.map((phone) => phone.display)} />
              </>
            ),
          },
          {
            eyebrow: t('eyebrow'),
            title: t('channels.whatsapp.title'),
            text: t('channels.whatsapp.text'),
            image: HERO_IMAGES.whatsapp,
            children: (
              <>
                <CtaButtons settings={settings} location="contact_hero_3" inline />
                <HeroPoints items={t.raw('whatsappTopics') as string[]} />
              </>
            ),
          },
          {
            eyebrow: t('eyebrow'),
            title: t('channels.visit.title'),
            text: settings.address,
            image: HERO_IMAGES.visit,
            children: <CtaButtons settings={settings} location="contact_hero_4" inline />,
          },
        ]}
      />
      <ContactChannels settings={settings} />
      <VisitMap settings={settings} />

      {/* The call-back form was taken off the whole site on 2026-10-14 */}
      <section aria-labelledby="before-title" className="bg-surface-sunken section-y text-ink">
        <div className="container-site">
          <SectionHeading id="before-title" title={t('visitTitle')} />
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <Reveal
              from="left"
              className="h-full rounded-lg border border-line bg-surface-raised p-5 shadow-card sm:p-6 md:p-8"
            >
              <ul className="divide-y divide-line">
                {(t.raw('visitItems') as string[]).map((item, index) => {
                  const Icon = VISIT_ICONS[index] ?? ClipboardCheck
                  return (
                    <li
                      key={item}
                      className="group flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                    >
                      <Medallion className="[&_svg]:stroke-[1.5]">
                        <Icon aria-hidden />
                      </Medallion>
                      <span className="t-body-lg">{item}</span>
                    </li>
                  )
                })}
              </ul>
            </Reveal>

            <Reveal
              from="right"
              delay={0.1}
              className="theme-dark relative isolate flex h-full flex-col justify-center overflow-hidden rounded-lg border border-line bg-surface p-5 text-ink shadow-card sm:p-6 md:p-8"
            >
              <ScallopPattern className="-z-10 opacity-25" />
              <div aria-hidden className="foil-edge foil-shimmer absolute inset-x-0 top-0" />
              <div className="flex items-center gap-4">
                <Medallion className="[&_svg]:stroke-[1.5]">
                  <HandHelping aria-hidden />
                </Medallion>
                <div className="min-w-0">
                  <h3 className="t-h3 text-accent">{t('helpTitle')}</h3>
                  <p className="mt-1 text-ink-muted">{t('helpText')}</p>
                </div>
              </div>
              <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                {HELP_LINKS.map(({ href, label, icon: Icon }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="group/link flex min-h-12 items-center gap-3 rounded-md border border-line px-3 py-2 font-semibold transition-colors duration-300 hover:border-accent hover:text-accent"
                    >
                      <Icon aria-hidden className="size-5 shrink-0 text-accent" strokeWidth={1.5} />
                      <span className="flex-1">{tn(label)}</span>
                      <ArrowRight
                        aria-hidden
                        className="size-4 shrink-0 text-accent transition-transform group-hover/link:translate-x-1"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <FaqSection faqs={faqs} />
    </>
  )
}

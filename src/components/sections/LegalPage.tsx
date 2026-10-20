import {
  ArrowRight,
  BadgePercent,
  Ban,
  CalendarCheck,
  ClipboardList,
  Clock,
  Globe,
  IdCard,
  LockKeyhole,
  PhoneCall,
  Scale,
  ScanSearch,
  ShieldCheck,
  Target,
  TrendingUp,
  UserCog,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { getLocale, getTranslations } from 'next-intl/server'

import { PageJsonLd } from '@/components/seo/JsonLd'
import { Medallion, ScallopPattern } from '@/components/ui/ornament'
import { Reveal } from '@/components/ui/reveal'
import { Link } from '@/i18n/navigation'
import { getSiteSettings } from '@/lib/content'
import type { PagePath } from '@/lib/seo'

import { ClientPlaceholder } from './Content'
import { CtaBand } from './CtaBand'
import { CtaButtons } from './CtaButtons'
import { LegalToc } from './LegalToc'
import { PageHero } from './PageHero'

type LegalNamespace = 'privacy' | 'terms'

// `glance` and `sections` icons follow the order of the page's messages
const PAGES: Record<
  LegalNamespace,
  {
    path: PagePath
    icon: LucideIcon
    other: LegalNamespace
    glance: LucideIcon[]
    sections: LucideIcon[]
  }
> = {
  privacy: {
    path: '/privacy-policy',
    icon: ShieldCheck,
    other: 'terms',
    glance: [ClipboardList, Ban, LockKeyhole, UserCog],
    sections: [ClipboardList, Target, Users, Clock, UserCog, PhoneCall],
  },
  terms: {
    path: '/terms',
    icon: Scale,
    other: 'privacy',
    glance: [TrendingUp, ScanSearch, Ban, IdCard],
    sections: [TrendingUp, BadgePercent, Ban, IdCard, Globe],
  },
}

/**
 * Beside the title from tablet width up: a gold coin bearing the page's icon. It breathes
 * with a soft glow inside a fine dotted ring turning slowly, and rings ripple out from it.
 */
function Emblem({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <div
      aria-hidden
      className="relative mx-auto grid aspect-square w-full max-w-sm place-items-center text-accent max-md:hidden md:short:max-w-64 md:xshort:max-w-44"
    >
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-[4%] animate-ring-turn opacity-50"
        fill="none"
        stroke="currentColor"
      >
        <circle cx="50" cy="50" r="49" strokeWidth="0.3" strokeDasharray="0.6 2.4" />
      </svg>
      <span className="absolute inset-[24%] animate-glow-pulse rounded-full bg-accent/25 blur-3xl" />
      {[0, 2].map((delay) => (
        <span
          key={delay}
          className="absolute inset-[22%] animate-ripple rounded-full border border-accent/50"
          style={{ animationDelay: `${delay}s` }}
        />
      ))}
      {/* Coin: a fine outer ring, then the gold face with the icon struck into it */}
      <div className="relative grid size-[56%] animate-breathe place-items-center rounded-full border border-accent/60 p-[6%]">
        <div className="foil-emboss grid size-full place-items-center rounded-full border-2 border-gold-500 bg-accent text-on-cta">
          <Icon className="size-[46%]" strokeWidth={1.25} />
        </div>
      </div>
    </div>
  )
}

/**
 * Shared layout for Privacy Policy and Terms & Disclaimer: plum hero with the emblem, the page
 * at a glance on a plum card, then a contents list that follows the reader beside the
 * numbered sections on laptops, with a link to the other legal page under it.
 */
export async function LegalPage({ namespace }: { namespace: LegalNamespace }) {
  const locale = await getLocale()
  const page = PAGES[namespace]
  const other = PAGES[page.other]
  const [t, tOther, tl, tn, settings] = await Promise.all([
    getTranslations(namespace),
    getTranslations(page.other),
    getTranslations('legal'),
    getTranslations('nav'),
    getSiteSettings(locale),
  ])
  const sections = t.raw('sections') as { title: string; body: string[] }[]
  const glance = t.raw('glance') as { title: string; text: string }[]
  const OtherIcon = other.icon

  return (
    <>
      <PageJsonLd locale={locale} home={tn('home')} name={t('crumb')} path={page.path} />
      <PageHero
        eyebrow={tl('eyebrow')}
        title={t('title')}
        intro={t('intro')}
        crumb={t('crumb')}
        backdrop
        aside={<Emblem icon={page.icon} />}
      >
        <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface-sunken px-4 py-1.5 text-sm text-ink-muted short:mb-4 xshort:hidden">
          <CalendarCheck aria-hidden className="size-4 text-accent" />
          {tl('updated')}
        </p>
        <CtaButtons settings={settings} location={`${namespace}_hero`} inline />
      </PageHero>

      <div className="bg-surface section-y text-ink">
        {/* At a glance: the page in four short points, on a plum card with a foil edge */}
        <div className="container-site">
          <Reveal>
            <section
              aria-labelledby="legal-glance"
              className="theme-dark relative isolate overflow-hidden rounded-lg border border-line bg-surface p-5 text-ink shadow-card sm:p-6 md:p-8"
            >
              <ScallopPattern className="-z-10 opacity-20" />
              <div aria-hidden className="foil-edge foil-shimmer absolute inset-x-0 top-0" />
              <h2 id="legal-glance" className="t-eyebrow">
                {tl('glance')}
              </h2>
              <ul className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-line">
                {glance.map((point, index) => {
                  const Icon = page.glance[index] ?? page.icon
                  return (
                    <li
                      key={point.title}
                      className="group flex gap-4 lg:flex-col lg:px-6 lg:first:pl-0 lg:last:pr-0"
                    >
                      <Medallion className="[&_svg]:stroke-[1.5]">
                        <Icon aria-hidden />
                      </Medallion>
                      <div className="min-w-0">
                        <h3 className="font-display text-xl leading-snug font-semibold text-accent">
                          {point.title}
                        </h3>
                        <p className="mt-1 text-ink-muted">{point.text}</p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </section>
          </Reveal>
        </div>

        <div className="container-site mt-10 grid gap-8 md:mt-14 lg:grid-cols-[17rem_1fr] lg:gap-14">
          <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
            <LegalToc label={tl('toc')} titles={sections.map((section) => section.title)} />
            {/* The other legal page, one tap away */}
            <Link
              href={other.path}
              className="group flex items-center gap-3 rounded-lg border border-line bg-surface-sunken p-4 transition-colors duration-300 hover:border-accent"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-full border border-accent/50 text-accent transition-colors duration-300 group-hover:bg-cta group-hover:text-on-cta">
                <OtherIcon aria-hidden className="size-5" strokeWidth={1.5} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm text-ink-muted">{tl('alsoRead')}</span>
                <span className="block font-semibold group-hover:text-accent">
                  {tOther('title')}
                </span>
              </span>
              <ArrowRight
                aria-hidden
                className="size-4 shrink-0 text-accent transition-transform group-hover:translate-x-1"
              />
            </Link>
          </aside>

          <div className="min-w-0 space-y-5">
            {/* Remove once the client and their CA/lawyer approve the text (Section 17) */}
            <ClientPlaceholder>{tl('draft')}</ClientPlaceholder>

            {sections.map((section, index) => {
              const Icon = page.sections[index] ?? page.icon
              return (
                <Reveal key={section.title} delay={Math.min(index, 2) * 0.05}>
                  <section
                    id={`section-${index + 1}`}
                    aria-labelledby={`section-${index + 1}-title`}
                    className="group relative hover-lift scroll-mt-28 overflow-hidden rounded-lg border border-line bg-surface-raised p-6 shadow-card after:absolute after:inset-x-0 after:top-0 after:h-0.5 after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-500 hover:after:scale-x-100 md:p-8"
                  >
                    {/* The section's number, large and faint in the corner */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -top-2 right-5 font-display text-[5rem] leading-none font-bold text-accent/10 transition-colors duration-500 group-hover:text-accent/20"
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="relative flex items-center gap-4 pr-16">
                      <Medallion className="[&_svg]:stroke-[1.5]">
                        <Icon aria-hidden />
                      </Medallion>
                      <div className="min-w-0">
                        <p className="t-eyebrow">{tl('sectionLabel', { n: index + 1 })}</p>
                        <h2 id={`section-${index + 1}-title`} className="mt-1 t-h3">
                          {section.title}
                        </h2>
                      </div>
                    </div>
                    <div className="relative mt-5 measure space-y-3 border-l-2 border-accent/40 pl-4 text-ink-muted md:ml-[1.625rem] md:pl-10">
                      {section.body.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </section>
                </Reveal>
              )
            })}
          </div>
        </div>
      </div>

      <CtaBand settings={settings} location={`${namespace}_cta`} />
    </>
  )
}

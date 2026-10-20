import { ArrowRight, Layers, Microscope, Sparkle, Timer } from 'lucide-react'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import type { ReactNode } from 'react'

import { OrnamentDivider } from '@/components/ui/ornament'
import { Link } from '@/i18n/navigation'
import type { Service, SiteSettings } from '@/lib/content'
import { cn } from '@/lib/utils'

import { CtaButtons } from '../CtaButtons'

import { HeroSlider } from './HeroSlider'

// Same order as `hero.points` in the messages files
const POINT_ICONS = [Microscope, Timer, Layers] as const

// [CLIENT TO PROVIDE: model photos] Temporary stock cutouts, see public/images/stock/CREDITS.md
const MAIN_MODEL = '/images/stock/model-about.webp'
const SERVICE_MODELS: Record<string, string | undefined> = {
  'sell-gold': '/images/stock/model-seated.webp',
  'release-pledged-gold': '/images/stock/model-silk-saree.webp',
  'buy-gold': '/images/stock/model-green-saree.webp',
}

/** Small label above the headline, led by a short gold rule. */
function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="mb-5 flex items-center gap-3 t-eyebrow lg:short:mb-3 lg:xshort:mb-2">
      <span aria-hidden className="h-px w-8 bg-accent" />
      {children}
    </p>
  )
}

/**
 * Model cut out of her background, standing on the bottom edge of the hero. She slides up
 * from below when her slide becomes the active one and drops back down when it leaves.
 * Also used by the About hero (AboutHero), which places her with `className`.
 */
export function ModelCutout({
  src,
  alt,
  priority = false,
  className,
}: {
  src: string
  alt: string
  priority?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        'pointer-events-none relative isolate mx-auto h-80 w-full max-w-sm sm:h-96 lg:absolute lg:top-6 lg:right-6 lg:bottom-0 lg:h-auto lg:w-[42%] lg:max-w-none',
        className,
      )}
    >
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        className="absolute top-1/2 left-1/2 -z-10 h-[92%] -translate-x-1/2 -translate-y-1/2 animate-ring-turn text-accent opacity-40"
        fill="none"
        stroke="currentColor"
      >
        <circle cx="50" cy="50" r="48" strokeWidth="0.3" strokeDasharray="0.6 2.4" />
        <circle cx="50" cy="50" r="43" strokeWidth="0.2" />
      </svg>
      <Sparkle
        aria-hidden
        className="absolute top-6 right-6 -z-10 size-6 animate-twinkle fill-accent text-accent"
      />
      <Sparkle
        aria-hidden
        className="absolute top-1/3 left-4 -z-10 size-4 animate-twinkle fill-accent text-accent [animation-delay:1.2s]"
      />

      {/* The clip keeps her hidden below the bottom edge until she slides up */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 translate-y-full opacity-0 transition-[translate,opacity] duration-1000 ease-in-out group-data-[active=true]:translate-y-0 group-data-[active=true]:opacity-100">
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 480px, 384px"
            // Phones show her above the slide controls, so her cut edge fades out there
            className="object-contain object-bottom max-lg:[mask-image:linear-gradient(to_bottom,black_78%,transparent)]"
          />
        </div>
      </div>
    </div>
  )
}

/** Text on the left, model on the right; on phones the model stands under the text. */
function Slide({ text, model }: { text: ReactNode; model: ReactNode }) {
  return (
    // Bottom padding leaves room for the slide controls
    <div className="relative container-site grid h-full items-center gap-10 pt-10 pb-28 md:pt-12 md:pb-32 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:short:pt-8 lg:short:pb-26 lg:xshort:pt-5 lg:xshort:pb-20">
      {/* The whole text block travels like a marquee: in from the left, out to the right.
          From laptop width it sits 40px in from the left edge, towards the middle */}
      <div className="flex flex-col items-center text-center group-data-[active=false]:animate-marquee-out group-data-[active=true]:animate-marquee-in lg:items-start lg:pl-10 lg:text-left">
        {text}
      </div>
      {model}
    </div>
  )
}

/**
 * Home hero: a model beside the headline, followed by one slide per service, each with its
 * own model.
 * Only the first slide carries the page's h1.
 */
export async function HeroSlides({
  settings,
  services,
}: {
  settings: SiteSettings
  services: Service[]
}) {
  const [t, ts, tc] = await Promise.all([
    getTranslations('hero'),
    getTranslations('services'),
    getTranslations('common'),
  ])
  const points = t.raw('points') as string[]

  const slides = [
    <Slide
      key="main"
      text={
        <>
          <Eyebrow>{t('eyebrow')}</Eyebrow>
          {/* The shimmer runs on the inner span: one element cannot hold two animations */}
          <h1 className="foil-emboss max-w-2xl t-hero">
            <span className="foil-text foil-shimmer block">{t('title')}</span>
          </h1>
          <OrnamentDivider className="mt-6 [animation-delay:200ms] group-data-[active=true]:animate-fade lg:short:mt-4 lg:xshort:hidden" />
          <p className="mt-6 max-w-xl t-body-lg text-ink lg:short:mt-4 lg:xshort:mt-3">
            {t('subtitle')}
          </p>
          <ul className="mt-6 hidden flex-wrap justify-center gap-2 sm:flex lg:justify-start lg:short:mt-4 lg:xshort:hidden">
            {/* The first point (purity testing) is left out of the hero */}
            {points.slice(1).map((point, index) => {
              const Icon = POINT_ICONS[index + 1] ?? Layers
              return (
                <li
                  key={point}
                  className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-plum-950/60 px-3 py-1.5 text-sm text-ink"
                >
                  <Icon aria-hidden className="size-4 shrink-0 text-accent" strokeWidth={1.5} />
                  {point}
                </li>
              )
            })}
          </ul>
          <CtaButtons
            settings={settings}
            location="hero"
            className="mt-8 w-full flex-row max-sm:*:flex-1 max-sm:*:px-3 sm:w-auto lg:short:mt-6 lg:xshort:mt-4"
          />
        </>
      }
      model={<ModelCutout src={MAIN_MODEL} alt={t('modelAlt')} priority />}
    />,
    ...services.map((service) => (
      <Slide
        key={service.slug}
        text={
          <>
            <Eyebrow>{ts('eyebrow')}</Eyebrow>
            <h2 className="foil-text foil-emboss max-w-2xl t-hero">{service.title}</h2>
            <OrnamentDivider className="mt-6 [animation-delay:200ms] group-data-[active=true]:animate-fade lg:short:mt-4 lg:xshort:hidden" />
            <p className="mt-6 max-w-xl t-body-lg text-ink lg:short:mt-4 lg:xshort:mt-3">
              {service.summary}
            </p>
            <Link
              href={`/${service.slug}`}
              className="mt-4 inline-flex min-h-12 items-center gap-2 t-label text-accent underline-offset-4 hover:underline lg:xshort:mt-1 lg:xshort:min-h-9"
            >
              {tc('learnMore')}
              {/* Names the service for screen readers and search engines; not shown */}
              <span className="sr-only">: {service.title}</span>
              <ArrowRight aria-hidden className="size-4" />
            </Link>
            <CtaButtons
              settings={settings}
              location={`hero_${service.slug}`}
              className="mt-4 w-full flex-row max-sm:*:flex-1 max-sm:*:px-3 sm:w-auto lg:xshort:mt-1"
            />
          </>
        }
        model={<ModelCutout src={SERVICE_MODELS[service.slug] ?? MAIN_MODEL} alt="" />}
      />
    )),
  ]

  return (
    <section className="theme-dark relative isolate overflow-hidden bg-surface text-ink">
      {/* [CLIENT TO PROVIDE: wide hero photo] Temporary stock photo, see public/images/stock/CREDITS.md */}
      <Image
        src="/images/stock/hero-wide-bangles.webp"
        alt=""
        fill
        // The largest image on the first screen: load it first, not lazily
        priority
        sizes="100vw"
        className="-z-20 animate-kenburns object-cover"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-plum-950/90" />

      <HeroSlider
        slides={slides}
        // From laptop width the controls line up under the text, which sits 40px in
        controlsClassName="lg:[&>div]:ml-10"
        labels={{
          region: t('slider.label'),
          previous: t('slider.previous'),
          next: t('slider.next'),
          pause: t('slider.pause'),
          play: t('slider.play'),
          slides: slides.map((_, index) =>
            t('slider.slide', { n: index + 1, total: slides.length }),
          ),
        }}
      />
    </section>
  )
}

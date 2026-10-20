import { ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import type { ReactNode } from 'react'

import { OrnamentDivider } from '@/components/ui/ornament'
import { Link } from '@/i18n/navigation'
import type { SiteSettings } from '@/lib/content'

import { CtaButtons } from '../CtaButtons'
import { HeroSlider } from '../home2/HeroSlider'
import { ModelCutout } from '../home2/HeroSlides'

// One model for each of `about.values`, in the same order (transparency, fair rate, respect)
// [CLIENT TO PROVIDE: model photos] Temporary stock cutouts, see public/images/stock/CREDITS.md
const VALUE_MODELS = [
  '/images/stock/model-silk-saree.webp',
  '/images/stock/model-green-saree.webp',
  // The model with folded hands (model-namaste) stands in "Who we are" further down
  '/images/stock/model-about.webp',
]

/**
 * The Suvarnavarsha logo, large beside the first slide's title from tablet width up (phones
 * already show it in the header): it breathes with a soft gold glow inside a fine dotted ring
 * turning slowly, and rings ripple out from it.
 */
function HeroLogo() {
  return (
    <div
      aria-hidden
      className="relative mx-auto grid aspect-square w-full max-w-lg place-items-center text-accent max-md:hidden md:short:max-w-sm lg:short:max-w-md md:xshort:max-w-60 lg:xshort:max-w-60"
    >
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-[8%] animate-ring-turn opacity-50"
        fill="none"
        stroke="currentColor"
      >
        <circle cx="50" cy="50" r="49" strokeWidth="0.3" strokeDasharray="0.6 2.4" />
      </svg>
      <span className="absolute inset-[26%] animate-glow-pulse rounded-full bg-accent/25 blur-3xl" />
      {[0, 2].map((delay) => (
        <span
          key={delay}
          className="absolute inset-[22%] animate-ripple rounded-full border border-accent/50"
          style={{ animationDelay: `${delay}s` }}
        />
      ))}
      <div className="relative w-[90%] animate-breathe">
        <Image
          src="/logo/suvarnavarsha-logo-v2-transparent.png"
          alt=""
          width={1100}
          height={572}
          priority
          sizes="(min-width: 768px) 460px, 0px"
          className="foil-emboss h-auto w-full"
        />
      </div>
    </div>
  )
}

/**
 * One slide: text on the left, and either content beside it (the logo) or a model standing
 * on the bottom edge of the hero on the right. The slide is not positioned, so the model is
 * placed against the whole hero section.
 */
function Slide({ text, aside }: { text: ReactNode; aside?: ReactNode }) {
  return (
    // Bottom padding leaves room for the slide controls
    <div className="container-site grid h-full items-center gap-10 pt-8 pb-24 md:grid-cols-[1.1fr_0.9fr] md:pt-[clamp(1.5rem,5vh,3rem)] md:pb-28 short:pt-5 short:pb-22 xshort:pt-2 xshort:pb-16 md:xshort:pt-2 md:xshort:pb-16">
      {/* Text travels like a marquee; from laptop width it sits 40px in, towards the middle */}
      <div className="group-data-[active=false]:animate-marquee-out group-data-[active=true]:animate-marquee-in lg:pl-10">
        {text}
      </div>
      {aside}
    </div>
  )
}

/**
 * About page hero, sliding like the home hero: the company with its logo first, then one
 * slide for each of its values with a model beside it. Same background as the home hero.
 * Only the first slide carries the page's h1 and the breadcrumb; the hero fills exactly the
 * first screen (tests/e2e/screens.spec.ts).
 */
export async function AboutHero({ settings }: { settings: SiteSettings }) {
  const [t, tn, th] = await Promise.all([
    getTranslations('about'),
    getTranslations('nav'),
    getTranslations('hero'),
  ])
  const values = t.raw('values') as { title: string; text: string }[]

  const heading =
    'foil-text foil-emboss max-w-3xl t-h1 lg:text-5xl lg:leading-[1.2] md:short:text-[34px] lg:short:text-[40px] md:xshort:text-[30px] md:xshort:leading-[1.25] lg:xshort:text-[32px]'

  const slides = [
    <Slide
      key="about"
      text={
        <>
          <nav
            aria-label={tn('breadcrumb')}
            className="mb-6 text-sm text-ink-muted max-sm:hidden short:mb-3 xshort:hidden"
          >
            <ol className="inline-flex flex-wrap items-center gap-1 rounded-full border border-line bg-surface-sunken px-4">
              <li>
                <Link href="/" className="inline-flex min-h-11 items-center hover:text-accent">
                  {tn('home')}
                </Link>
              </li>
              <li aria-hidden>
                <ChevronRight className="size-4 text-accent" />
              </li>
              <li aria-current="page" className="text-ink">
                {t('crumb')}
              </li>
            </ol>
          </nav>
          <p className="mb-3 t-eyebrow xshort:hidden">{t('eyebrow')}</p>
          <h1 className={heading}>{t('title')}</h1>
          <OrnamentDivider className="mt-4 sm:mt-5 max-lg:short:hidden xshort:hidden" />
          <p className="mt-4 measure t-body-lg text-ink sm:mt-5 xshort:hidden">{t('intro')}</p>
          {/* `data-hero-cta`: the floating Call / WhatsApp buttons wait until this scrolls away */}
          <div data-hero-cta className="mt-6 sm:mt-8 short:mt-5 xshort:mt-3">
            <CtaButtons settings={settings} location="about_hero" inline />
          </div>
        </>
      }
      aside={<HeroLogo />}
    />,
    ...values.map((value, index) => (
      <Slide
        key={value.title}
        text={
          <>
            <p className="mb-3 t-eyebrow max-md:short:hidden xshort:hidden">{t('valuesTitle')}</p>
            <h2 className={heading}>{value.title}</h2>
            <OrnamentDivider className="mt-4 sm:mt-5 max-lg:short:hidden xshort:hidden" />
            <p className="mt-4 measure t-body-lg text-ink sm:mt-5 xshort:hidden">{value.text}</p>
            <div className="mt-6 sm:mt-8 short:mt-5 xshort:mt-3">
              <CtaButtons settings={settings} location={`about_hero_${index + 2}`} inline />
            </div>
          </>
        }
        // Tablets and up: she stands on the bottom edge of the hero, on the right of the
        // page width. Phones: left out, so the hero still fits the screen
        aside={
          <ModelCutout
            src={VALUE_MODELS[index] ?? VALUE_MODELS[0]}
            alt=""
            className="max-md:hidden md:absolute md:top-6 md:right-[max(1.5rem,calc((100%-1200px)/2))] md:bottom-0 md:h-auto md:w-[40%] md:max-w-xl"
          />
        }
      />
    )),
  ]

  return (
    // Fills the first screen under the top bar and header
    <section className="theme-dark relative isolate flex min-h-first-screen flex-col justify-center overflow-hidden bg-surface text-ink">
      {/* The home hero's background: wide bangles drifting slowly under a deep plum veil.
          [CLIENT TO PROVIDE: wide hero photo] Temporary stock photo, see public/images/stock/CREDITS.md */}
      <Image
        src="/images/stock/hero-wide-bangles.webp"
        alt=""
        fill
        sizes="100vw"
        className="-z-30 animate-kenburns object-cover"
      />
      <div aria-hidden className="absolute inset-0 -z-30 bg-plum-950/90" />
      <HeroSlider
        slides={slides}
        // From laptop width the controls line up under the text, which sits 40px in.
        // Tablets: under the text, clear of the model. Phones on their side: a tighter controls
        // bar, so the hero still fits the screen
        controlsClassName="md:justify-start lg:[&>div]:ml-10 xshort:-mt-14 xshort:pb-2 md:xshort:-mt-14 md:xshort:pb-2 lg:xshort:-mt-14 lg:xshort:pb-2"
        labels={{
          region: th('slider.label'),
          previous: th('slider.previous'),
          next: th('slider.next'),
          pause: th('slider.pause'),
          play: th('slider.play'),
          slides: slides.map((_, index) =>
            th('slider.slide', { n: index + 1, total: slides.length }),
          ),
        }}
      />
    </section>
  )
}

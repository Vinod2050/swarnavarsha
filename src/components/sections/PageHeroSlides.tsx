import { Check, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import type { ReactNode } from 'react'

import { OrnamentDivider } from '@/components/ui/ornament'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

import { HeroSlider } from './home2/HeroSlider'

/** Text of a hero slide after the first, as kept in the messages files (`heroSlides`) */
export type HeroSlideText = { title: string; text: string; points: string[] }

export type HeroSlide = {
  eyebrow?: string
  title: string
  text?: string
  /** Decorative photo for this slide */
  image: string
  /** Which part of the photo stays in view when it is cropped to the frame (default centre) */
  imageFocus?: keyof typeof IMAGE_FOCUS
  /** `contain`: the whole photo shows (for pictures with text or steps across them), over a
      blurred copy of itself that fills the frame */
  imageFit?: 'cover' | 'contain'
  /** Buttons and extras under the text */
  children?: ReactNode
}

/** Short points under a slide's buttons; left out on phones and short tablets */
export function HeroPoints({ items }: { items: string[] }) {
  return (
    <ul className="mt-6 hidden flex-wrap gap-x-6 gap-y-2 text-sm text-ink-muted md:flex short:mt-4 max-lg:short:hidden xshort:hidden">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-2">
          <Check aria-hidden className="size-4 shrink-0 text-accent" strokeWidth={2.5} />
          {item}
        </li>
      ))}
    </ul>
  )
}

/**
 * Photo in a gold border beside the text from tablet width up; on phones it lies behind the text under
 * a plum veil, filling the hero (the section is its positioning box there). It rises into
 * place when its slide becomes the active one.
 *
 * Its width is `--hero-photo`, set on the section (PageHeroSlides). It is as tall as the hero
 * allows (the first screen less the slide padding and some breathing room, at most 480px), and taller if the text beside
 * it is, so it never looks like a low strip; the text sits centred beside it. It sits a little
 * lower than the text's middle and a little in from the right edge (top / left offsets, which
 * leave the layout and the hero's height unchanged).
 */
const IMAGE_FOCUS = {
  left: 'object-left',
  center: 'object-center',
  right: 'object-right',
} as const

// How the photo arrives from tablet width up (on phones it only fades, behind the text)
const PHOTO_MOTION = {
  // Rises a little into place
  rise: 'md:group-data-[active=false]:translate-y-8',
  // Slides in from the right edge as the text glides in from the left, and back out to the
  // right, like the text's marquee
  slide:
    'md:group-data-[active=false]:animate-hero-photo-out md:group-data-[active=true]:animate-hero-photo-in',
} as const

function SlidePhoto({
  src,
  priority,
  focus = 'center',
  fit = 'cover',
  motion = 'rise',
}: {
  src: string
  priority: boolean
  focus?: keyof typeof IMAGE_FOCUS
  fit?: 'cover' | 'contain'
  motion?: keyof typeof PHOTO_MOTION
}) {
  return (
    // [CLIENT TO PROVIDE: page photos] Temporary stock photos, see public/images/stock/CREDITS.md
    <div
      aria-hidden
      className={cn(
        'absolute inset-0 -z-20 overflow-hidden transition-[translate,opacity] duration-1000 ease-in-out group-data-[active=false]:opacity-0 md:relative md:inset-auto md:top-4 md:-left-6 md:z-auto md:min-h-[min(30rem,calc(100svh/var(--page-zoom)-var(--site-topbar)-var(--site-header)-14rem))] md:w-full md:self-stretch md:rounded-lg md:border-2 md:border-accent md:bg-surface-sunken md:shadow-foil lg:top-6 lg:-left-10 md:short:min-h-[calc(100svh/var(--page-zoom)-var(--site-topbar)-var(--site-header)-12rem)] md:xshort:top-0 md:xshort:min-h-[calc(100svh/var(--page-zoom)-var(--site-topbar)-var(--site-header)-7rem)]',
        PHOTO_MOTION[motion],
      )}
    >
      {fit === 'contain' && (
        // The same photo, blurred, filling the frame behind the whole one
        <Image
          src={src}
          alt=""
          fill
          sizes="(min-width: 768px) min(512px, 40vw), 100vw"
          className="scale-110 object-cover opacity-60 blur-xl"
        />
      )}
      <Image
        src={src}
        alt=""
        fill
        priority={priority}
        sizes="(min-width: 768px) min(512px, 40vw), 100vw"
        className={cn(
          'animate-kenburns',
          fit === 'contain' ? 'object-cover md:object-contain' : 'object-cover',
          IMAGE_FOCUS[focus],
        )}
      />
      {/* Phones: plum veil so the title and text stay readable over the photo */}
      <span className="absolute inset-0 bg-plum-950/80 md:hidden" />
    </div>
  )
}

/**
 * PageHero as a set of slides, moving like the home hero: the text travels like a marquee
 * and each slide brings its own photo. The first slide carries the page's h1 and the
 * breadcrumb; the hero still fills exactly the first screen (tests/e2e/screens.spec.ts).
 *
 * From tablet width up, the text takes the left of the page width and the photo a fixed
 * column on the right (`--hero-photo`), a fixed gap apart (`--hero-gap`). The photo stretches
 * to the height of the text, so the two always form one full block with no empty space.
 */
const PHOTO_WIDTH = {
  // At most 512px, and never more than 40% of the screen
  large: '[--hero-photo:min(32rem,40vw)]',
  // At most 416px, and never more than 34% of the screen (Services)
  small: '[--hero-photo:min(26rem,34vw)]',
} as const
export async function PageHeroSlides({
  crumb,
  slides,
  photo = 'large',
  photoMotion = 'rise',
}: {
  crumb: string
  slides: HeroSlide[]
  /** `small`: a narrower photo column (Services) */
  photo?: 'large' | 'small'
  /** `slide`: each photo slides in from the side, like the text (How It Works) */
  photoMotion?: keyof typeof PHOTO_MOTION
}) {
  const [t, th] = await Promise.all([getTranslations('nav'), getTranslations('hero')])

  const rendered = slides.map((slide, index) => {
    const first = index === 0
    const Heading = first ? 'h1' : 'h2'
    return (
      <div
        key={slide.title}
        // Phones: not positioned, so the photo fills the whole hero behind the text.
        // Bottom padding leaves room for the slide controls
        className="container-site grid h-full items-center gap-y-8 pt-6 pb-24 md:relative md:grid-cols-[minmax(0,1fr)_var(--hero-photo)] md:gap-x-(--hero-gap) md:pt-[clamp(1.5rem,4vh,3rem)] md:pb-24 short:pt-4 xshort:gap-y-6 xshort:pt-1 xshort:pb-14 md:xshort:pt-1 md:xshort:pb-14"
      >
        {/* A little in from the left edge, towards the middle of the hero */}
        <div className="group-data-[active=false]:animate-marquee-out group-data-[active=true]:animate-marquee-in md:pl-6 lg:pl-10">
          {first && (
            <nav
              aria-label={t('breadcrumb')}
              className="mb-6 text-sm text-ink-muted max-sm:hidden short:mb-3 xshort:hidden"
            >
              <ol className="inline-flex flex-wrap items-center gap-1 rounded-full border border-line bg-surface-sunken px-4">
                <li>
                  <Link href="/" className="inline-flex min-h-11 items-center hover:text-accent">
                    {t('home')}
                  </Link>
                </li>
                <li aria-hidden>
                  <ChevronRight className="size-4 text-accent" />
                </li>
                <li aria-current="page" className="text-ink">
                  {crumb}
                </li>
              </ol>
            </nav>
          )}
          {slide.eyebrow && (
            <p className="mb-3 t-eyebrow max-md:short:hidden xshort:hidden">{slide.eyebrow}</p>
          )}
          <Heading className="foil-text foil-emboss max-w-3xl t-h1 lg:text-5xl lg:leading-[1.2] md:short:text-[34px] lg:short:text-[40px] md:xshort:text-[30px] md:xshort:leading-[1.25] lg:xshort:text-[32px]">
            {slide.title}
          </Heading>
          <OrnamentDivider className="mt-4 sm:mt-5 max-lg:short:hidden xshort:hidden" />
          {slide.text && (
            <p className="mt-4 measure t-body-lg text-ink sm:mt-5 xshort:hidden">{slide.text}</p>
          )}
          {slide.children && (
            // `data-hero-cta` on the first slide only: the floating Call / WhatsApp buttons
            // wait until it scrolls away
            <div
              data-hero-cta={first ? '' : undefined}
              className="mt-6 sm:mt-8 short:mt-5 xshort:mt-3"
            >
              {slide.children}
            </div>
          )}
        </div>

        <SlidePhoto
          src={slide.image}
          priority={first}
          focus={slide.imageFocus}
          fit={slide.imageFit}
          motion={photoMotion}
        />
      </div>
    )
  })

  return (
    // Fills the first screen under the top bar and header
    <section
      className={cn(
        'theme-dark relative isolate flex min-h-first-screen flex-col justify-center overflow-hidden bg-surface text-ink [--hero-gap:3rem] lg:[--hero-gap:4rem]',
        PHOTO_WIDTH[photo],
      )}
    >
      {/* The home hero's background: wide bangles drifting slowly under a deep plum veil.
          Phones also show each slide's own photo above it (SlidePhoto).
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
        slides={rendered}
        // Phones on their side: a tighter controls bar, so the hero still fits the screen.
        // From laptop width the controls line up under the text, which sits 40px in
        controlsClassName="lg:[&>div]:ml-10 xshort:-mt-14 xshort:pb-2 md:xshort:-mt-14 md:xshort:pb-2 lg:xshort:-mt-14 lg:xshort:pb-2"
        labels={{
          region: th('slider.label'),
          previous: th('slider.previous'),
          next: th('slider.next'),
          pause: th('slider.pause'),
          play: th('slider.play'),
          slides: rendered.map((_, index) =>
            th('slider.slide', { n: index + 1, total: rendered.length }),
          ),
        }}
      />
    </section>
  )
}

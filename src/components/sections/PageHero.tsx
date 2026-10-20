import { ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import type { ReactNode } from 'react'

import { OrnamentDivider, ScallopPattern } from '@/components/ui/ornament'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

/**
 * Plum title band at the top of every inner page, with a breadcrumb. With `image` the title
 * sits beside a slowly drifting photo from tablet width up; on phones the same photo lies
 * behind the title under a plum veil. With `aside` the title sits beside that content
 * instead (the About page's logo). Without either the title is centred. `backdrop` lays the
 * home hero's background under the band: wide bangles drifting slowly under a deep plum veil.
 *
 * The whole band must fit the first screen on every device in tests/e2e/hero-fit.spec.ts,
 * so spacing tightens on short screens (`short`) and the breadcrumb is left out on phones
 * (PageJsonLd still gives it to search engines).
 */
export async function PageHero({
  eyebrow,
  title,
  intro,
  crumb,
  image,
  overlap = false,
  backdrop = false,
  aside,
  children,
}: {
  eyebrow?: string
  title: string
  intro?: string
  /** Short page name for the breadcrumb */
  crumb: string
  /** Decorative photo, shown from the `lg` breakpoint */
  image?: string
  /** Leaves room for a card that overlaps the bottom of the band (RateStrip, ContactChannels) */
  overlap?: boolean
  /** The home hero's background photo under the band */
  backdrop?: boolean
  /** Decorative content beside the title from tablet width up, in place of `image` */
  aside?: ReactNode
  children?: ReactNode
}) {
  const t = await getTranslations('nav')
  const centred = !image && !aside

  return (
    // Fills the first screen under the top bar and header, content centred in it
    <section className="theme-dark relative isolate flex min-h-first-screen items-center overflow-hidden bg-surface text-ink">
      {backdrop ? (
        <>
          {/* [CLIENT TO PROVIDE: wide hero photo] Temporary stock photo, see public/images/stock/CREDITS.md */}
          <Image
            src="/images/stock/hero-wide-bangles.webp"
            alt=""
            fill
            sizes="100vw"
            className="-z-30 animate-kenburns object-cover"
          />
          <div aria-hidden className="absolute inset-0 -z-30 bg-plum-950/90" />
        </>
      ) : (
        <ScallopPattern className="-z-10 opacity-40" />
      )}

      <div
        className={cn(
          // Short screens: tighter, so the band and the start of the next section share a screen.
          // Very short ones (phones on their side): the title, buttons and photo only
          // Tablets and up: padding follows the screen height, so laptops 800–900px tall fit too
          'container-site grid items-center gap-8 pt-8 md:pt-[clamp(1.5rem,5vh,3rem)] lg:gap-12 short:pt-6 lg:short:pt-6 xshort:gap-6 xshort:pt-3 md:xshort:pt-3 lg:xshort:pt-3',
          overlap
            ? 'pb-28 md:pb-36 lg:short:pb-28'
            : 'pb-10 md:pb-[clamp(2rem,7vh,5rem)] short:pb-8 md:short:pb-10 lg:short:pb-10 xshort:pb-4 md:xshort:pb-4 lg:xshort:pb-4',
          (image || aside) && 'md:grid-cols-[1.1fr_0.9fr]',
        )}
      >
        <div className={cn(centred && 'mx-auto flex max-w-3xl flex-col items-center text-center')}>
          <nav
            aria-label={t('breadcrumb')}
            className="mb-6 animate-fade text-sm text-ink-muted max-sm:hidden md:mb-8 short:mb-4 lg:short:mb-4 xshort:hidden"
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

          {eyebrow && <p className="mb-3 animate-rise t-eyebrow xshort:hidden">{eyebrow}</p>}
          <h1 className="foil-text foil-emboss max-w-3xl animate-rise t-h1 [animation-delay:80ms] lg:text-5xl lg:leading-[1.2] md:short:text-[34px] lg:short:text-[40px] md:xshort:text-[30px] md:xshort:leading-[1.25] lg:xshort:text-[32px]">
            {title}
          </h1>
          <OrnamentDivider className="mt-4 animate-fade [animation-delay:300ms] sm:mt-5 xshort:hidden" />
          {intro && (
            <p className="mt-4 measure animate-rise t-body-lg text-ink [animation-delay:160ms] sm:mt-5 xshort:hidden">
              {intro}
            </p>
          )}
          {children && (
            // `data-hero-cta`: the floating Call / WhatsApp buttons wait until this scrolls away
            <div
              data-hero-cta
              className="mt-6 animate-rise [animation-delay:240ms] sm:mt-8 short:mt-5 lg:short:mt-6 xshort:mt-4 lg:xshort:mt-4"
            >
              {children}
            </div>
          )}
        </div>

        {aside}

        {image && (
          // [CLIENT TO PROVIDE: page photos] Temporary stock photos, see public/images/stock/CREDITS.md
          // One photo element for every width: on phones it fills the band behind the text (the
          // section is its positioning box); from tablet width up it is a framed photo with a
          // fine gold line inside it, the same frame as the home service tiles
          <div
            aria-hidden
            className="absolute inset-0 -z-20 overflow-hidden md:relative md:inset-auto md:z-auto md:mx-auto md:aspect-[4/3] md:w-full md:max-w-lg md:animate-rise md:rounded-lg md:bg-surface-sunken md:shadow-foil md:[animation-delay:200ms] md:short:max-w-md lg:short:max-w-md md:xshort:max-w-60 lg:xshort:max-w-60"
          >
            <Image
              src={image}
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 512px, (min-width: 768px) 45vw, 100vw"
              className="animate-kenburns object-cover"
            />
            {/* Phones: plum veil so the title and text stay readable over the photo */}
            <span className="absolute inset-0 bg-plum-950/80 md:hidden" />
            <span className="pointer-events-none absolute inset-3 hidden rounded-md border border-accent/50 md:block" />
          </div>
        )}
      </div>
    </section>
  )
}

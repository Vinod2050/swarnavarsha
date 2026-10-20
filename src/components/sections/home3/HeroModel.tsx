import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

import type { SiteSettings } from '@/lib/content'

import { CtaButtons } from '../CtaButtons'

/** Home 3 hero: centred headline on the left, photo standing on the bottom edge on the right. */
export async function HeroModel({ settings }: { settings: SiteSettings }) {
  const t = await getTranslations('hero')

  return (
    <section className="theme-dark relative isolate overflow-hidden bg-surface-raised text-ink">
      {/* Fine geometric lines fanning out from the two top corners */}
      <svg
        aria-hidden
        viewBox="0 0 1200 600"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 -z-10 size-full text-accent opacity-25"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <path d="M0 0l260 190L0 330M0 0l150 300 110-110L420 0M260 190l160-190M150 300L0 600" />
        <path d="M1200 0L940 190l260 140M1200 0l-150 300-110-110L780 0M940 190L780 0M1050 300l150 300" />
      </svg>

      <div className="container-site grid items-end gap-8 pt-12 md:pt-20 lg:grid-cols-2 lg:gap-12">
        <div className="pb-12 text-center md:pb-20">
          <p className="mb-4 animate-rise t-eyebrow">{t('eyebrow')}</p>
          <h1 className="animate-rise t-hero text-ink [animation-delay:80ms]">{t('title')}</h1>
          <p className="mx-auto mt-5 max-w-xl animate-rise t-body-lg text-ink-muted [animation-delay:160ms]">
            {t('subtitle')}
          </p>
          <CtaButtons
            settings={settings}
            location="hero"
            className="mt-8 animate-rise [animation-delay:240ms] sm:justify-center [&_a]:rounded-full"
          />
        </div>

        {/* [CLIENT TO PROVIDE: hero photo] Temporary stock photo, see public/images/stock/CREDITS.md */}
        <div className="relative mx-auto aspect-[4/5] w-full max-w-sm animate-rise overflow-hidden rounded-t-lg border-x-2 border-t-2 border-accent/60 [animation-delay:200ms]">
          <Image
            src="/images/stock/hero-bangles.webp"
            alt={t('imageAlt')}
            fill
            priority
            sizes="(min-width: 1024px) 384px, 90vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  )
}

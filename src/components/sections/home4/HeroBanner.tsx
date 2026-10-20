import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

import type { SiteSettings } from '@/lib/content'

import { CtaButtons } from '../CtaButtons'

/** Home 4 hero: one full-width photo with a plum brand card standing on its right side. */
export async function HeroBanner({ settings }: { settings: SiteSettings }) {
  const t = await getTranslations('hero')

  return (
    <section className="relative isolate overflow-hidden bg-surface text-ink">
      {/* [CLIENT TO PROVIDE: wide hero photo] Temporary stock photo, see public/images/stock/CREDITS.md */}
      <Image
        src="/images/stock/hero-wide-bangles.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 animate-kenburns object-cover"
      />

      <div className="container-site flex min-h-[28rem] items-center justify-center py-10 md:min-h-[34rem] md:justify-end md:py-16">
        <div className="theme-dark w-full max-w-md animate-rise rounded-md border border-accent/50 bg-surface px-6 py-8 text-center text-ink shadow-card md:px-8 md:py-10">
          <Image
            src="/logo/suvarnavarsha-logo-v2-transparent.png"
            alt={settings.name}
            width={330}
            height={192}
            sizes="220px"
            className="mx-auto h-auto w-52"
          />
          <p className="mt-5 t-eyebrow">{t('eyebrow')}</p>
          <h1 className="mt-3 t-h2 text-accent">{t('title')}</h1>
          <p className="mt-3 text-ink-muted">{t('subtitle')}</p>
          <CtaButtons settings={settings} location="hero" className="mt-6 sm:justify-center" />
        </div>
      </div>
    </section>
  )
}

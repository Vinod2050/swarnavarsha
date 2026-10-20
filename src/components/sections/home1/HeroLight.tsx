import { BadgeCheck, Check } from 'lucide-react'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

import { OrnamentDivider } from '@/components/ui/ornament'
import type { SiteSettings } from '@/lib/content'

import { CtaButtons } from '../CtaButtons'

/** Home 1 hero: ivory ground, dark headline and a two-photo collage with an emerald badge. */
export async function HeroLight({ settings }: { settings: SiteSettings }) {
  const [t, tw] = await Promise.all([getTranslations('hero'), getTranslations('why')])
  const points = t.raw('points') as string[]
  const badge = (tw.raw('items') as { title: string }[]).at(-1)?.title

  return (
    <section className="overflow-hidden bg-surface text-ink">
      <div className="container-site grid items-center gap-12 py-12 md:py-20 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="mb-4 animate-rise t-eyebrow">{t('eyebrow')}</p>
          <h1 className="animate-rise t-hero [animation-delay:80ms]">{t('title')}</h1>
          <OrnamentDivider className="mt-6 animate-fade [animation-delay:300ms]" />
          <p className="mt-6 measure animate-rise t-body-lg text-ink-muted [animation-delay:160ms]">
            {t('subtitle')}
          </p>

          <ul className="mt-6 animate-rise space-y-3 [animation-delay:240ms]">
            {points.map((point) => (
              <li key={point} className="flex items-center gap-3 font-semibold">
                <span className="theme-dark theme-emerald grid size-6 shrink-0 place-items-center rounded-full bg-surface text-accent">
                  <Check aria-hidden className="size-4" strokeWidth={2.5} />
                </span>
                {point}
              </li>
            ))}
          </ul>

          <CtaButtons
            settings={settings}
            location="hero"
            className="mt-8 animate-rise [animation-delay:320ms]"
          />
        </div>

        {/*
          [CLIENT TO PROVIDE: hero photos — shop counter, testing machine or jewellery]
          Temporary stock photos, see public/images/stock/CREDITS.md.
        */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div
            aria-hidden
            className="absolute top-10 right-0 -bottom-4 left-12 animate-fade rounded-lg bg-surface-sunken [animation-delay:200ms]"
          />
          <div className="relative aspect-[4/5] w-4/5 animate-rise overflow-hidden rounded-lg shadow-card [animation-delay:200ms]">
            <Image
              src="/images/stock/hero-bangles.webp"
              alt={t('imageAlt')}
              fill
              priority
              sizes="(min-width: 1024px) 440px, 80vw"
              className="object-cover"
            />
          </div>
          <div className="absolute right-0 bottom-6 aspect-square w-[42%] animate-rise overflow-hidden rounded-lg border-4 border-surface shadow-card [animation-delay:450ms]">
            <Image
              src="/images/stock/story-necklace.webp"
              alt=""
              fill
              sizes="(min-width: 1024px) 230px, 40vw"
              className="object-cover"
            />
          </div>
          {badge && (
            <p className="theme-dark theme-emerald absolute top-6 right-0 flex animate-float items-center gap-2 rounded-md bg-surface px-4 py-3 t-label text-ink shadow-card">
              <BadgeCheck aria-hidden className="size-5 shrink-0 text-accent" />
              {badge}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

import { Reveal } from '@/components/ui/reveal'

/** Home 3: a full-width photo banner, then four bordered fact cards. */
export async function BannerFacts() {
  const t = await getTranslations('home3')
  const facts = t.raw('facts') as { value: string; label: string }[]

  return (
    <section aria-label={t('factsLabel')} className="bg-surface-raised pb-12 text-ink md:pb-20">
      {/* [CLIENT TO PROVIDE: wide shop photo or video] Temporary stock photo, see CREDITS.md */}
      <div className="relative aspect-[16/9] max-h-[32rem] w-full overflow-hidden md:aspect-[21/9]">
        <Image
          src="/images/stock/hero-wide-bangles.webp"
          alt=""
          fill
          sizes="100vw"
          className="animate-kenburns object-cover"
        />
      </div>

      {/* Facts from the client's flyer only; no invented counts (CLAUDE.md Section 8) */}
      <dl className="container-site mt-12 grid grid-cols-2 gap-4 md:mt-20 lg:grid-cols-4 lg:gap-6">
        {facts.map((fact, index) => (
          <Reveal
            key={fact.label}
            delay={index * 0.08}
            className="flex flex-col-reverse justify-end rounded-md border border-accent/50 bg-surface-raised px-4 py-6 text-center shadow-card"
          >
            <dt className="mt-2 text-ink-muted">{fact.label}</dt>
            <dd className="font-display text-3xl leading-tight font-bold text-accent md:text-5xl">
              {fact.value}
            </dd>
          </Reveal>
        ))}
      </dl>
    </section>
  )
}

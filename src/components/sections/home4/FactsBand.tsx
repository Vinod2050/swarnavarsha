import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

import { Reveal } from '@/components/ui/reveal'

/** Home 4: dark photo band with the flyer facts listed in gold and a closing line. */
export async function FactsBand() {
  const [t, tf] = await Promise.all([getTranslations('home3'), getTranslations('footer')])
  const facts = t.raw('facts') as { value: string; label: string }[]

  return (
    <section
      aria-label={t('factsLabel')}
      className="theme-dark relative isolate overflow-hidden bg-surface text-ink"
    >
      {/* [CLIENT TO PROVIDE: shop photo] Temporary stock photo, see CREDITS.md */}
      <Image
        src="/images/stock/service-buy-gold.webp"
        alt=""
        fill
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-plum-950/80" />

      <div className="container-site py-12 md:py-20">
        <Reveal className="mx-auto max-w-xl">
          {/* Facts from the client's flyer only; no invented counts (CLAUDE.md Section 8) */}
          <ul className="space-y-1">
            {facts.map((fact) => (
              <li key={fact.label} className="t-h3 text-accent">
                {fact.value} <span className="text-ink">{fact.label}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 t-body-lg text-ink [&:lang(en)]:italic">{tf('about')}</p>
        </Reveal>
      </div>
    </section>
  )
}

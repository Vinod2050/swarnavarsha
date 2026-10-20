import { getTranslations } from 'next-intl/server'

import { Reveal } from '@/components/ui/reveal'

/** Four facts in foil numerals on a deep plum band. */
export async function FactsStrip() {
  const t = await getTranslations('home3')
  const facts = t.raw('facts') as { value: string; label: string }[]

  return (
    <section aria-label={t('factsLabel')} className="theme-dark theme-deep bg-surface text-ink">
      {/* Facts from the client's flyer only; no invented counts (CLAUDE.md Section 8) */}
      <dl className="container-site grid grid-cols-2 gap-y-8 py-10 md:py-14 lg:grid-cols-4 lg:divide-x lg:divide-line">
        {facts.map((fact, index) => (
          <Reveal
            key={fact.label}
            delay={index * 0.08}
            className="flex flex-col-reverse justify-end px-4 text-center"
          >
            <dt className="mt-2 text-ink-muted">{fact.label}</dt>
            <dd className="foil-text font-display text-3xl leading-tight font-bold md:text-5xl md:leading-tight">
              {fact.value}
            </dd>
          </Reveal>
        ))}
      </dl>
    </section>
  )
}

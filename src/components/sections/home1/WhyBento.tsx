import { BadgeCheck, Banknote, Layers, Microscope, Scale } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import { Medallion } from '@/components/ui/ornament'
import { Reveal } from '@/components/ui/reveal'
import { cn } from '@/lib/utils'

import { SectionHeading } from '../SectionHeading'

// Same order as `why.items` in the messages files
const ICONS = [Microscope, Banknote, Layers, Scale, BadgeCheck] as const

/** Home 1 "why choose us": a grid of unequal cards, the first one large and emerald. */
export async function WhyBento() {
  const t = await getTranslations('why')
  const items = t.raw('items') as { title: string; text: string }[]

  return (
    <section aria-labelledby="bento-title" className="bg-surface-sunken section-y text-ink">
      <div className="container-site">
        <SectionHeading id="bento-title" eyebrow={t('eyebrow')} title={t('title')} />
        <ul className="grid gap-4 md:grid-cols-6 md:gap-6">
          {items.map((item, index) => {
            const Icon = ICONS[index] ?? BadgeCheck
            const lead = index === 0
            return (
              <li key={item.title} className={lead ? 'md:col-span-4' : 'md:col-span-2'}>
                <Reveal
                  delay={index * 0.05}
                  className={cn(
                    'flex h-full flex-col rounded-lg p-6 shadow-card md:p-8',
                    lead
                      ? 'theme-dark theme-emerald bg-surface text-ink'
                      : 'border border-line bg-surface-raised',
                  )}
                >
                  <Medallion>
                    <Icon aria-hidden strokeWidth={1.5} />
                  </Medallion>
                  <h3 className={cn('mt-5', lead ? 't-h2 text-accent' : 't-h3')}>{item.title}</h3>
                  <p className={cn('mt-2 text-ink-muted', lead && 't-body-lg')}>{item.text}</p>
                </Reveal>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

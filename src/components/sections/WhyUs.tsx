import { BadgeCheck, Banknote, Layers, Microscope, Scale } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import { Medallion } from '@/components/ui/ornament'
import { Reveal } from '@/components/ui/reveal'

import { SectionHeading } from './SectionHeading'

// Same order as `why.items` in the messages files
const ICONS = [Microscope, Banknote, Layers, Scale, BadgeCheck] as const

export async function WhyUs() {
  const t = await getTranslations('why')
  const items = t.raw('items') as { title: string; text: string }[]

  return (
    <section aria-labelledby="why-title" className="theme-dark bg-surface section-y text-ink">
      <div className="container-site">
        <SectionHeading id="why-title" eyebrow={t('eyebrow')} title={t('title')} />
        <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
          {items.map((item, index) => {
            const Icon = ICONS[index] ?? BadgeCheck
            return (
              <li key={item.title}>
                <Reveal delay={index * 0.06} className="group">
                  <Medallion>
                    <Icon aria-hidden strokeWidth={1.5} />
                  </Medallion>
                  <h3 className="mt-4 text-lg leading-7 font-semibold text-ink transition-colors duration-300 group-hover:text-accent">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-ink-muted">{item.text}</p>
                </Reveal>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

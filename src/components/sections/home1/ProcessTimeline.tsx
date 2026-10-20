import { getTranslations } from 'next-intl/server'

import { Reveal } from '@/components/ui/reveal'

import { SectionHeading } from '../SectionHeading'

/** Home 1 process: gold numbered circles on an emerald band, joined by a line on desktop. */
export async function ProcessTimeline() {
  const t = await getTranslations('process')
  const steps = t.raw('steps') as { title: string; text: string }[]

  return (
    <section
      aria-labelledby="timeline-title"
      className="theme-dark theme-emerald bg-surface section-y text-ink"
    >
      <div className="container-site">
        <SectionHeading
          id="timeline-title"
          eyebrow={t('eyebrow')}
          title={t('title')}
          intro={t('intro')}
        />
        <ol className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-6 lg:gap-4">
          <li
            aria-hidden
            className="absolute inset-x-[8%] top-7 hidden h-px bg-accent/40 lg:block"
          />
          {steps.map((step, index) => (
            <li key={step.title} className="relative">
              <Reveal
                delay={index * 0.08}
                className="flex gap-4 lg:flex-col lg:items-center lg:text-center"
              >
                <span
                  aria-hidden
                  className="grid size-14 shrink-0 place-items-center rounded-full bg-cta text-xl font-bold text-on-cta"
                >
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-lg leading-7 font-semibold text-ink">{step.title}</h3>
                  <p className="mt-1 text-ink-muted">{step.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

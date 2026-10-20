import { getTranslations } from 'next-intl/server'

import { Reveal } from '@/components/ui/reveal'

import { SectionHeading } from '../SectionHeading'

/** Home 2 process: six ruled cells, each led by a large numeral. */
export async function ProcessNumbers() {
  const t = await getTranslations('process')
  const steps = t.raw('steps') as { title: string; text: string }[]

  return (
    <section aria-labelledby="steps-title" className="bg-surface section-y text-ink">
      <div className="container-site">
        <SectionHeading
          id="steps-title"
          eyebrow={t('eyebrow')}
          title={t('title')}
          intro={t('intro')}
        />
        <ol className="grid gap-px overflow-hidden rounded-lg border border-line bg-line shadow-card sm:grid-cols-2 lg:grid-cols-3 lg:short:grid-cols-6">
          {steps.map((step, index) => (
            <li
              key={step.title}
              // A gold rule draws itself across the top of the cell under the pointer
              className="group relative bg-surface-raised p-6 transition-colors duration-300 after:absolute after:inset-x-0 after:top-0 after:h-0.5 after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-500 hover:bg-surface-sunken hover:after:scale-x-100 md:p-8 lg:short:p-5 lg:xshort:p-4"
            >
              <Reveal delay={(index % 3) * 0.08}>
                <span
                  aria-hidden
                  className="block origin-left font-display text-5xl leading-none font-bold text-accent transition-transform duration-300 group-hover:scale-110 lg:short:text-4xl lg:xshort:text-3xl"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-4 t-h3 lg:short:mt-3 lg:short:text-lg lg:short:leading-6 lg:xshort:mt-2">
                  {step.title}
                </h3>
                <p className="mt-2 text-ink-muted lg:short:mt-1 lg:xshort:text-sm">{step.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

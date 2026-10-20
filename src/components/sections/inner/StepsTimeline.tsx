import { Banknote, Calculator, IdCard, Scale, ScanSearch, Store } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import { Medallion } from '@/components/ui/ornament'
import { cn } from '@/lib/utils'

import { SectionHeading } from '../SectionHeading'

// Same order as `process.steps`: visit, KYC, purity test, weighing, price, payment
const STEP_ICONS = [Store, IdCard, ScanSearch, Scale, Calculator, Banknote] as const

/**
 * The six steps in full (How It Works). A gold line runs down the steps and fills as they
 * scroll past; each step hangs off it on a medallion carrying its icon and number. Laptops:
 * the line runs down the middle and the steps alternate left and right, overlapping a little
 * so the timeline stays compact. Phones and tablets: the line runs down the left.
 *
 * As the page scrolls, each card glides in from the side and its medallion turns into place,
 * moving with the scroll so they arrive as slowly as the reader scrolls (globals.css
 * `scroll-slide`, `scroll-pop`).
 */
export async function StepsTimeline() {
  const [t, th] = await Promise.all([getTranslations('process'), getTranslations('how')])
  const steps = t.raw('steps') as { title: string; text: string; detail: string }[]

  return (
    // `overflow-x-clip`: cards still sliding in must not widen the page
    <section
      aria-labelledby="steps-title"
      className="overflow-x-clip bg-surface section-y text-ink"
    >
      <div className="container-site">
        <SectionHeading
          id="steps-title"
          eyebrow={t('eyebrow')}
          title={t('title')}
          intro={t('intro')}
        />
        <ol className="relative mx-auto max-w-5xl">
          {/* The track, and the gold that fills it on scroll (globals.css `timeline-fill`) */}
          <span
            aria-hidden
            className="absolute top-8 bottom-8 left-8 w-px -translate-x-1/2 bg-line-strong/40 lg:left-1/2"
          />
          <span
            aria-hidden
            className="absolute top-8 bottom-8 left-8 w-0.5 timeline-fill -translate-x-1/2 bg-accent lg:left-1/2"
          />
          {steps.map((step, index) => {
            const Icon = STEP_ICONS[index] ?? Store
            // Laptops: odd steps sit on the right of the line
            const right = index % 2 === 1
            return (
              <li
                key={step.title}
                className={cn(
                  'group relative grid grid-cols-[4rem_minmax(0,1fr)] gap-x-5 pb-8 last:pb-0 lg:grid-cols-[minmax(0,1fr)_4rem_minmax(0,1fr)] lg:gap-x-10 lg:pb-0',
                  // Laptops: each step after the first rises beside the one before it
                  index > 0 && 'lg:-mt-16',
                )}
              >
                <span className="relative z-10 col-start-1 row-start-1 inline-grid scroll-pop self-start lg:col-start-2">
                  <Medallion className="bg-surface">
                    <Icon aria-hidden />
                  </Medallion>
                  <span
                    aria-hidden
                    className="absolute -top-1 -right-1 grid size-7 place-items-center rounded-full bg-cta text-sm font-bold text-on-cta"
                  >
                    {index + 1}
                  </span>
                </span>

                {/* Glides in from the right on phones and tablets (the cards sit right of the
                    line), and from its own side on laptops, as the page scrolls */}
                <div
                  className={cn(
                    'relative col-start-2 row-start-1 scroll-slide [--slide-from:5rem]',
                    right
                      ? 'lg:col-start-3 lg:[--slide-from:9rem]'
                      : 'lg:col-start-1 lg:[--slide-from:-9rem]',
                  )}
                >
                  {/* A small point on the card's edge, towards the line */}
                  <span
                    aria-hidden
                    className={cn(
                      'absolute top-6 -left-1.5 z-10 size-3 rotate-45 border-b border-l border-line bg-surface-raised transition-colors duration-400 group-hover:border-accent',
                      !right &&
                        'lg:right-[-0.375rem] lg:left-auto lg:border-t lg:border-r lg:border-b-0 lg:border-l-0',
                    )}
                  />
                  <div className="relative hover-lift overflow-hidden rounded-lg border border-line bg-surface-raised p-6 shadow-card after:absolute after:inset-x-0 after:top-0 after:h-0.5 after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-500 group-hover:after:scale-x-100 md:p-7">
                    {/* The step's number, large and faint behind the text */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -top-2 right-4 font-display text-[5.5rem] leading-none font-bold text-accent/10 transition-colors duration-500 group-hover:text-accent/20"
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <p className="relative t-eyebrow">{th('step', { n: index + 1 })}</p>
                    <h3 className="relative mt-1 t-h3 transition-colors duration-300 group-hover:text-accent">
                      {step.title}
                    </h3>
                    <p className="relative mt-2 text-ink-muted">{step.detail}</p>
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

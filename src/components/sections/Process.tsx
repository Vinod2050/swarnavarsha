import { getTranslations } from 'next-intl/server'

import { Reveal } from '@/components/ui/reveal'
import { cn } from '@/lib/utils'

import { SectionHeading } from './SectionHeading'

/**
 * The six steps of selling gold. Horizontal on desktop, a vertical timeline on phones.
 * `detailed` shows the longer text used on the How It Works page.
 */
export async function Process({
  detailed = false,
  sunken = false,
  screen = false,
}: {
  detailed?: boolean
  sunken?: boolean
  /** At least one screen tall under the sticky header, steps centred in it */
  screen?: boolean
}) {
  const t = await getTranslations('process')
  const steps = t.raw('steps') as { title: string; text: string; detail: string }[]

  return (
    <section
      aria-labelledby="process-title"
      className={cn(
        'section-y text-ink',
        sunken ? 'bg-surface-sunken' : 'bg-surface',
        screen && 'flex min-h-screen-section flex-col justify-center max-md:py-7 md:short:py-10',
      )}
    >
      <div className="container-site">
        <SectionHeading
          id="process-title"
          eyebrow={t('eyebrow')}
          title={t('title')}
          intro={t('intro')}
          // A full-screen section on a phone needs the room for the six steps
          introClassName={screen ? 'max-sm:hidden' : undefined}
        />
        <ol
          className={cn(
            'grid gap-0',
            // Short laptop screens: the long version runs in two columns, so it fits one screen
            detailed
              ? 'mx-auto max-w-3xl lg:short:max-w-none lg:short:grid-cols-2 lg:short:gap-x-12'
              : // Tablets: two rows of three; laptops: one row of six
                'md:grid-cols-3 md:gap-x-6 md:gap-y-8 md:short:gap-y-5 lg:grid-cols-6 lg:gap-4',
          )}
        >
          {steps.map((step, index) => (
            <li
              key={step.title}
              className={cn(
                'group relative pb-5 last:pb-0 sm:pb-8',
                detailed ? 'lg:short:pb-4' : 'md:pb-0',
              )}
            >
              {/* connector line */}
              {index < steps.length - 1 && (
                <span
                  aria-hidden
                  className={cn(
                    'absolute top-12 bottom-0 left-6 w-px -translate-x-1/2 bg-line-strong/50',
                    // No single line can join steps laid out in two columns
                    detailed && 'lg:short:hidden',
                    // The tablet grid wraps after three steps, so its connectors are left out
                    !detailed &&
                      'md:hidden lg:top-6 lg:right-[-50%] lg:bottom-auto lg:left-1/2 lg:block lg:h-px lg:w-auto lg:translate-x-6',
                  )}
                />
              )}
              {/* Steps arrive one after another; the numeral turns plum under the pointer */}
              <Reveal
                delay={index * 0.08}
                className={cn(
                  'relative flex gap-4',
                  !detailed && 'md:flex-col md:items-center md:text-center',
                )}
              >
                <span
                  aria-hidden
                  className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gold-300 text-xl font-bold text-plum-800 ring-4 ring-gold-300/0 transition duration-500 group-hover:scale-110 group-hover:bg-plum-800 group-hover:text-gold-300 group-hover:ring-gold-300/40"
                >
                  {index + 1}
                </span>
                <div className={cn(!detailed && 'md:mt-3')}>
                  <h3
                    className={cn(
                      'pt-2.5 text-lg leading-7 font-semibold transition-colors duration-300 group-hover:text-accent',
                      detailed ? 'lg:pt-0' : 'md:pt-0',
                    )}
                  >
                    {step.title}
                  </h3>
                  <p className="mt-1 text-ink-muted">{detailed ? step.detail : step.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

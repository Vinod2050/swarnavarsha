import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/ui/reveal'
import { Link } from '@/i18n/navigation'
import type { Service } from '@/lib/content'
import { cn } from '@/lib/utils'

import { CheckList } from '../Content'
import { SectionHeading } from '../SectionHeading'

// [CLIENT TO PROVIDE: service photos] Temporary stock photos, see public/images/stock/CREDITS.md
const PHOTOS: Record<string, string | undefined> = {
  'sell-gold': '/images/stock/service-sell-gold.webp',
  'release-pledged-gold': '/images/services/release-pledged-gold.webp',
  'buy-gold': '/images/services/coins-and-bars.webp',
}

/** Services page: one wide row per service, photo and text swapping sides, with its key points. */
export async function ServiceShowcase({ services }: { services: Service[] }) {
  const [t, ts, tc] = await Promise.all([
    getTranslations('servicesPage'),
    getTranslations('services'),
    getTranslations('common'),
  ])

  return (
    <section aria-labelledby="showcase-title" className="bg-surface section-y text-ink">
      <div className="container-site">
        <SectionHeading
          id="showcase-title"
          eyebrow={ts('eyebrow')}
          title={ts('title')}
          intro={ts('intro')}
        />
        <ul className="space-y-12 md:space-y-20 lg:short:space-y-14">
          {services.map((service, index) => {
            const photo = PHOTOS[service.slug]
            const flipped = index % 2 === 1
            return (
              <li key={service.slug}>
                <article className="group grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
                  {/* The photo stays inside the column: nothing hangs past the screen edge */}
                  <Reveal
                    from={flipped ? 'right' : 'left'}
                    className={cn(
                      'theme-dark relative aspect-[4/3] overflow-hidden rounded-lg bg-surface shadow-card lg:short:aspect-[16/10]',
                      flipped && 'lg:order-2',
                    )}
                  >
                    {photo && (
                      <Image
                        src={photo}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 544px, 100vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    )}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-3 rounded-md border border-accent/50 transition-all duration-500 ease-out group-hover:inset-2 group-hover:border-accent"
                    />
                    <span
                      aria-hidden
                      className="absolute top-6 left-6 grid size-14 place-items-center rounded-full border border-accent bg-surface font-display text-xl font-bold text-accent"
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </Reveal>

                  <Reveal from={flipped ? 'left' : 'right'} delay={0.1}>
                    <h3 className="t-h2 transition-colors duration-300 group-hover:text-accent">
                      {service.title}
                    </h3>
                    <p className="mt-3 t-body-lg text-ink-muted lg:short:text-base lg:short:leading-[26px]">
                      {service.summary}
                    </p>
                    <CheckList
                      items={t.raw(`highlights.${service.slug}`) as string[]}
                      className="mt-6 lg:short:mt-4"
                    />
                    <Button asChild className="mt-8 lg:short:mt-6">
                      <Link href={`/${service.slug}`}>
                        {tc('learnMore')}
                        {/* Names the service for screen readers and search engines; not shown */}
                        <span className="sr-only">: {service.title}</span>
                        <ArrowRight aria-hidden />
                      </Link>
                    </Button>
                  </Reveal>
                </article>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

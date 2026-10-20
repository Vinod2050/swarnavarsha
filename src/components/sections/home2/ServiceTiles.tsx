import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

import { Reveal } from '@/components/ui/reveal'
import { Link } from '@/i18n/navigation'
import type { Service } from '@/lib/content'

import { SectionHeading } from '../SectionHeading'

// [CLIENT TO PROVIDE: service photos] Temporary stock photos, see public/images/stock/CREDITS.md
const PHOTOS: Record<string, string | undefined> = {
  'sell-gold': '/images/stock/service-sell-gold.webp',
  'release-pledged-gold': '/images/stock/service-release-pledged-gold.webp',
  'buy-gold': '/images/stock/service-buy-gold.webp',
}

/** Home 2 services: tall photo tiles with a gold inner frame and the title on a plum panel. */
export async function ServiceTiles({ services }: { services: Service[] }) {
  const [t, tc] = await Promise.all([getTranslations('services'), getTranslations('common')])

  return (
    <section aria-labelledby="tiles-title" className="bg-surface-sunken section-y text-ink">
      <div className="container-site">
        <SectionHeading
          id="tiles-title"
          eyebrow={t('eyebrow')}
          title={t('title')}
          intro={t('intro')}
        />
        <ul className="grid gap-6 md:grid-cols-3">
          {services.map((service, index) => {
            const photo = PHOTOS[service.slug]
            return (
              <li key={service.slug}>
                <Reveal delay={index * 0.08}>
                  <Link
                    href={`/${service.slug}`}
                    className="theme-dark group relative block aspect-[3/4] hover-lift overflow-hidden rounded-lg bg-surface text-ink shadow-card lg:short:aspect-auto lg:short:h-[calc(100svh-20.5rem)] lg:short:min-h-52 lg:xshort:h-[calc(100svh-16.5rem)]"
                  >
                    {photo && (
                      <Image
                        src={photo}
                        alt=""
                        fill
                        sizes="(min-width: 768px) 380px, 100vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                    )}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-3 rounded-md border border-accent/50 transition-all duration-500 ease-out group-hover:inset-2 group-hover:border-accent"
                    />
                    <span className="absolute inset-x-0 bottom-0 block bg-plum-950/85 px-6 pt-5 pb-7 lg:short:pt-4 lg:short:pb-5 lg:xshort:px-5 lg:xshort:pt-3 lg:xshort:pb-4">
                      <span className="block t-h3 text-accent">{service.title}</span>
                      <span className="mt-2 line-clamp-3 min-h-[3lh] text-ink-muted lg:xshort:mt-1 lg:xshort:line-clamp-1 lg:xshort:min-h-0">
                        {service.summary}
                      </span>
                      <span className="mt-3 inline-flex items-center gap-2 t-label text-ink lg:xshort:mt-1">
                        {tc('learnMore')}
                        <ArrowRight
                          aria-hidden
                          className="size-4 transition-transform group-hover:translate-x-1"
                        />
                      </span>
                    </span>
                  </Link>
                </Reveal>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

import { Reveal } from '@/components/ui/reveal'
import { Link } from '@/i18n/navigation'
import type { Service } from '@/lib/content'

// [CLIENT TO PROVIDE: service photos] Temporary stock photos, see public/images/stock/CREDITS.md
const PHOTOS: Record<string, string | undefined> = {
  'sell-gold': '/images/stock/service-sell-gold.webp',
  'release-pledged-gold': '/images/stock/service-release-pledged-gold.webp',
  'buy-gold': '/images/stock/service-buy-gold.webp',
}

/** Home 4 services: a left-aligned serif heading over three photos with captions beneath. */
export async function ServiceTrio({ services }: { services: Service[] }) {
  const t = await getTranslations('services')

  return (
    <section aria-labelledby="trio-title" className="bg-surface section-y text-ink">
      <div className="container-site">
        <h2 id="trio-title" className="t-h1">
          {t('title')}
        </h2>
        <ul className="mt-8 grid gap-8 md:grid-cols-3 md:gap-6">
          {services.map((service, index) => {
            const photo = PHOTOS[service.slug]
            return (
              <li key={service.slug}>
                <Reveal delay={index * 0.1}>
                  <Link href={`/${service.slug}`} className="group block rounded-md">
                    <span className="relative block aspect-video overflow-hidden rounded-md bg-surface-sunken">
                      {photo && (
                        <Image
                          src={photo}
                          alt=""
                          fill
                          sizes="(min-width: 768px) 380px, 100vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                    </span>
                    <span className="mt-4 block t-h3 group-hover:text-accent">{service.title}</span>
                    <span className="mt-2 block text-ink-muted">{service.summary}</span>
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

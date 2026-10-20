import { ArrowRight, Landmark } from 'lucide-react'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import type { ReactNode } from 'react'

import { GoldBarsIcon, NecklaceIcon } from '@/components/ui/icons'
import { Medallion } from '@/components/ui/ornament'
import { Reveal } from '@/components/ui/reveal'
import { Link } from '@/i18n/navigation'
import type { Service } from '@/lib/content'
import { cn } from '@/lib/utils'

import { SectionHeading } from './SectionHeading'

// Keys are the Services collection's `icon` options
const ICONS: Record<Service['icon'], () => ReactNode> = {
  coins: () => <NecklaceIcon />,
  landmark: () => <Landmark aria-hidden strokeWidth={1.5} />,
  gem: () => <GoldBarsIcon />,
}

// [CLIENT TO PROVIDE: service photos] Temporary stock photos, see public/images/stock/CREDITS.md
const PHOTOS: Record<string, string | undefined> = {
  'sell-gold': '/images/stock/service-sell-gold.webp',
  'release-pledged-gold': '/images/stock/service-release-pledged-gold.webp',
  'buy-gold': '/images/stock/service-buy-gold.webp',
}

export async function Services({ services }: { services: Service[] }) {
  const [t, tc] = await Promise.all([getTranslations('services'), getTranslations('common')])

  return (
    <section aria-labelledby="services-title" className="bg-surface section-y text-ink">
      <div className="container-site">
        <SectionHeading
          id="services-title"
          eyebrow={t('eyebrow')}
          title={t('title')}
          intro={t('intro')}
        />
        <ul className="grid gap-6 md:grid-cols-3">
          {services.map((service, index) => {
            const Icon = ICONS[service.icon]
            const photo = PHOTOS[service.slug]
            return (
              <li key={service.slug}>
                <Reveal delay={index * 0.08} className="h-full">
                  <Link
                    href={`/${service.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-md border border-line bg-surface-raised shadow-card transition-transform hover:-translate-y-1"
                  >
                    {photo && (
                      <div className="relative aspect-[4/3] overflow-hidden bg-surface-sunken">
                        {/* Decorative: the card title names the service */}
                        <Image
                          src={photo}
                          alt=""
                          fill
                          sizes="(min-width: 768px) 380px, 100vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-6 md:p-8">
                      <Medallion
                        className={cn(
                          'relative self-start bg-surface-raised',
                          photo && '-mt-14 md:-mt-16',
                        )}
                      >
                        <Icon />
                      </Medallion>
                      <h3 className="mt-4 t-h3">{service.title}</h3>
                      <p className="mt-2 flex-1 text-ink-muted">{service.summary}</p>
                      <span className="mt-5 inline-flex items-center gap-2 t-label text-accent">
                        {tc('learnMore')}
                        <ArrowRight
                          aria-hidden
                          className="size-4 transition-transform group-hover:translate-x-1"
                        />
                      </span>
                    </div>
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

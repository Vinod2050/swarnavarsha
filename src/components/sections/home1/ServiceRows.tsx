import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/ui/reveal'
import { Link } from '@/i18n/navigation'
import type { Service } from '@/lib/content'
import { cn } from '@/lib/utils'

import { SectionHeading } from '../SectionHeading'

// [CLIENT TO PROVIDE: service photos] Temporary stock photos, see public/images/stock/CREDITS.md
const PHOTOS: Record<string, string | undefined> = {
  'sell-gold': '/images/stock/service-sell-gold.webp',
  'release-pledged-gold': '/images/stock/service-release-pledged-gold.webp',
  'buy-gold': '/images/stock/service-buy-gold.webp',
}

/** Home 1 services: wide rows, photo and text swapping sides from one row to the next. */
export async function ServiceRows({ services }: { services: Service[] }) {
  const [t, tc] = await Promise.all([getTranslations('services'), getTranslations('common')])

  return (
    <section aria-labelledby="rows-title" className="bg-surface section-y text-ink">
      <div className="container-site">
        <SectionHeading
          id="rows-title"
          eyebrow={t('eyebrow')}
          title={t('title')}
          intro={t('intro')}
        />
        <ul className="space-y-8">
          {services.map((service, index) => {
            const photo = PHOTOS[service.slug]
            return (
              <li key={service.slug}>
                <Reveal from={index % 2 === 1 ? 'right' : 'left'}>
                  <article className="grid overflow-hidden rounded-lg border border-line bg-surface-raised shadow-card md:grid-cols-2">
                    <div
                      className={cn(
                        'relative aspect-[16/10] bg-surface-sunken md:aspect-auto md:min-h-80',
                        index % 2 === 1 && 'md:order-2',
                      )}
                    >
                      {photo && (
                        <Image
                          src={photo}
                          alt=""
                          fill
                          sizes="(min-width: 768px) 576px, 100vw"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex flex-col justify-center p-6 md:p-12">
                      <span
                        aria-hidden
                        className="font-display text-4xl leading-none font-bold text-accent"
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <h3 className="mt-4 t-h2">{service.title}</h3>
                      <p className="mt-3 t-body-lg text-ink-muted">{service.summary}</p>
                      <Button asChild className="mt-6 self-start">
                        <Link href={`/${service.slug}`}>
                          {tc('learnMore')}
                          <ArrowRight aria-hidden />
                        </Link>
                      </Button>
                    </div>
                  </article>
                </Reveal>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

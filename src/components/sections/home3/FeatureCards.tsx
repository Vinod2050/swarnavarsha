import { getTranslations } from 'next-intl/server'

import { Reveal } from '@/components/ui/reveal'
import { Link } from '@/i18n/navigation'
import type { Service } from '@/lib/content'

/** Home 3: centred heading over three solid gold cards, each with an outlined pill link. */
export async function FeatureCards({ services }: { services: Service[] }) {
  const [t, tc] = await Promise.all([getTranslations('services'), getTranslations('common')])

  return (
    <section aria-labelledby="feature-title" className="bg-surface-raised section-y text-ink">
      <div className="container-site">
        <h2 id="feature-title" className="text-center t-h2 text-accent">
          {t('title')}
        </h2>
        <p className="mt-3 text-center text-ink-muted">{t('intro')}</p>

        <ul className="mt-10 grid gap-6 md:mt-16 md:grid-cols-3">
          {services.map((service, index) => (
            <li key={service.slug}>
              <Reveal
                delay={index * 0.1}
                className="flex h-full flex-col items-center rounded-md bg-gold-300 px-6 py-8 text-center text-plum-800 shadow-card"
              >
                <h3 className="text-lg leading-7 font-bold">{service.title}</h3>
                <p className="mt-3 flex-1">{service.summary}</p>
                <Link
                  href={`/${service.slug}`}
                  className="mt-6 inline-flex min-h-12 items-center rounded-full border-[1.5px] border-plum-800 px-6 t-label transition-colors hover:bg-plum-800 hover:text-gold-300"
                >
                  {tc('learnMore')}
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

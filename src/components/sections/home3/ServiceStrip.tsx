import { Landmark } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import type { ReactNode } from 'react'

import { GoldBarsIcon, NecklaceIcon } from '@/components/ui/icons'
import { Link } from '@/i18n/navigation'
import type { Service } from '@/lib/content'

// Keys are the Services collection's `icon` options
const ICONS: Record<Service['icon'], () => ReactNode> = {
  coins: () => <NecklaceIcon />,
  landmark: () => <Landmark aria-hidden strokeWidth={1.5} />,
  gem: () => <GoldBarsIcon />,
}

/** Home 3 strip under the hero: "Our services" on the left, one icon link per service. */
export async function ServiceStrip({ services }: { services: Service[] }) {
  const t = await getTranslations('services')

  return (
    <section
      aria-labelledby="strip-title"
      className="theme-dark theme-deep border-y border-line bg-surface text-ink"
    >
      <div className="container-site flex flex-col gap-6 py-6 md:flex-row md:items-center md:gap-10 md:py-8">
        <h2 id="strip-title" className="shrink-0 t-h2 text-ink md:max-w-40">
          {t('eyebrow')}
        </h2>
        <ul className="grid flex-1 gap-2 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-line">
          {services.map((service) => {
            const Icon = ICONS[service.icon]
            return (
              <li key={service.slug}>
                <Link
                  href={`/${service.slug}`}
                  className="flex min-h-14 items-center gap-3 rounded-md px-2 py-2 hover:text-accent sm:flex-col sm:px-4 sm:text-center"
                >
                  <span className="text-accent [&_svg]:size-9">
                    <Icon />
                  </span>
                  <span className="t-label">{service.title}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

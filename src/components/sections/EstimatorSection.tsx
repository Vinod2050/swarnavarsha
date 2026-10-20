import { getTranslations } from 'next-intl/server'

import type { LatestRates } from '@/lib/rates'

import { Estimator } from './Estimator'
import { SectionHeading } from './SectionHeading'

export async function EstimatorSection({ rates }: { rates: LatestRates | null }) {
  const t = await getTranslations('estimator')

  return (
    <section
      id="estimator"
      aria-labelledby="estimator-title"
      className="bg-surface-sunken section-y text-ink"
    >
      <div className="container-site">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            id="estimator-title"
            eyebrow={t('eyebrow')}
            title={t('title')}
            intro={t('intro')}
          />
          <Estimator rate24k={rates?.buying.gold24k999 ?? null} />
        </div>
      </div>
    </section>
  )
}

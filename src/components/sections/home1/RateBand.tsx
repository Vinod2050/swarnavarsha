import { getLocale, getTranslations } from 'next-intl/server'

import type { Locale } from '@/i18n/routing'
import type { SiteSettings } from '@/lib/content'
import { formatDateTime, formatINR } from '@/lib/format'
import type { LatestRates } from '@/lib/rates'

/** Home 1 rates: a full-width emerald band with the rates in one ruled row. */
export async function RateBand({
  rates,
  settings,
}: {
  rates: LatestRates | null
  settings: SiteSettings
}) {
  const t = await getTranslations('rates')
  const locale = (await getLocale()) as Locale

  const cells = rates
    ? [
        { label: t('gold24'), value: rates.buying.gold24k999, unit: t('perGram') },
        { label: t('gold22'), value: rates.buying.gold22k, unit: t('perGram') },
        { label: t('gold18'), value: rates.buying.gold18k, unit: t('perGram') },
        ...(settings.showSilver
          ? [{ label: t('silver'), value: rates.buying.silverKg, unit: t('perKg') }]
          : []),
      ]
    : []

  return (
    <section
      id="rates"
      aria-labelledby="rates-title"
      className="theme-dark theme-emerald bg-surface text-ink"
    >
      <div aria-hidden className="foil-edge" />
      <div className="container-site py-8 md:py-10">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <h2 id="rates-title" className="t-h3 text-accent">
            {t('title')}
          </h2>
          {rates && (
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-muted">
              {rates.isSample && (
                <span className="mr-1 inline-block rounded-sm bg-peacock-pink px-2 py-0.5 t-label text-white">
                  {t('sample')}
                </span>
              )}
              {t('updated', { time: formatDateTime(rates.updatedAt, locale) })}
            </p>
          )}
        </div>

        {rates ? (
          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-6 lg:grid-cols-4">
            {cells.map((cell) => (
              <div key={cell.label} className="border-l-2 border-accent/60 pl-4">
                <dt className="t-label text-ink-muted">{cell.label}</dt>
                <dd className="mt-1">
                  <span className="t-rate text-ink">{formatINR(cell.value)}</span>
                  <span className="block text-sm text-ink-muted">{cell.unit}</span>
                </dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="mt-4 text-ink-muted">{t('unavailable')}</p>
        )}

        <p className="mt-6 text-sm text-ink-muted">{t('note')}</p>
      </div>
    </section>
  )
}

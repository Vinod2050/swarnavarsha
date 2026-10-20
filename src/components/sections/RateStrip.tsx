import { Info, PhoneCall } from 'lucide-react'
import { getLocale, getTranslations } from 'next-intl/server'

import type { Locale } from '@/i18n/routing'
import type { SiteSettings } from '@/lib/content'
import { formatDateTime, formatINR } from '@/lib/format'
import type { LatestRates } from '@/lib/rates'
import { cn } from '@/lib/utils'

import { CtaButtons } from './CtaButtons'

/**
 * Plum rate card in its own ivory band under the hero:
 * the title and update time on the left, one tile per metal on the right. Until staff enter
 * a rate, the right side asks the visitor to call instead.
 */
export async function RateStrip({
  rates,
  settings,
  screen = false,
}: {
  rates: LatestRates | null
  settings: SiteSettings
  /** Its own screen under the sticky header, the card centred in it */
  screen?: boolean
}) {
  const t = await getTranslations('rates')
  const locale = (await getLocale()) as Locale

  // `mark` is the karat stamp on each tile
  const cells = rates
    ? [
        { mark: '24K', label: t('gold24'), value: rates.buying.gold24k999, unit: t('perGram') },
        { mark: '22K', label: t('gold22'), value: rates.buying.gold22k, unit: t('perGram') },
        { mark: '18K', label: t('gold18'), value: rates.buying.gold18k, unit: t('perGram') },
        ...(settings.showSilver
          ? [{ mark: 'Ag', label: t('silver'), value: rates.buying.silverKg, unit: t('perKg') }]
          : []),
      ]
    : []

  return (
    <section
      id="rates"
      aria-labelledby="rates-title"
      className={cn(
        'bg-surface',
        screen
          ? 'flex min-h-screen-section flex-col justify-center section-y max-md:py-7 md:short:py-10'
          : 'pt-10 md:pt-14 lg:short:pt-8',
      )}
    >
      <div className="container-site">
        <div className="theme-dark overflow-hidden rounded-lg border border-line bg-surface-raised text-ink shadow-card">
          <div aria-hidden className="foil-edge foil-shimmer" />

          <div className="grid gap-5 p-5 md:p-7 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-8">
            <div className="lg:max-w-60 lg:border-r lg:border-line lg:pr-8">
              <h2 id="rates-title" className="t-h2 text-accent">
                {t('title')}
              </h2>
              {rates && (
                <p className="mt-2 flex items-start gap-2 text-sm text-ink-muted">
                  {/* Green dot with a slow pulse: the rate is the latest one entered */}
                  <span aria-hidden className="relative mt-[5px] flex size-2.5 shrink-0">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-peacock-green opacity-60" />
                    <span className="relative inline-flex size-2.5 rounded-full bg-peacock-green" />
                  </span>
                  {t('updated', { time: formatDateTime(rates.updatedAt, locale) })}
                </p>
              )}
              {rates?.isSample && (
                <p className="mt-3 inline-block rounded-sm bg-peacock-pink px-2 py-0.5 t-label text-white">
                  {t('sample')}
                </p>
              )}
            </div>

            {rates ? (
              <dl
                className={cn(
                  'grid grid-cols-2 gap-3',
                  cells.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3',
                )}
              >
                {cells.map((cell, index) => (
                  <div
                    key={cell.label}
                    className={cn(
                      'hover-lift rounded-md border bg-surface-sunken px-4 py-4',
                      // The 24K rate is the one every other price is worked out from
                      index === 0 ? 'border-accent/60' : 'border-line',
                    )}
                  >
                    <dt className="flex items-center gap-2 t-label text-ink-muted">
                      <span
                        aria-hidden
                        className="grid size-8 shrink-0 place-items-center rounded-full bg-cta text-xs font-bold text-on-cta"
                      >
                        {cell.mark}
                      </span>
                      {cell.label}
                    </dt>
                    <dd className="mt-3 flex flex-wrap items-baseline gap-x-2">
                      <span className="t-rate text-ink">{formatINR(cell.value)}</span>
                      <span className="text-sm text-ink-muted">{cell.unit}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
                <p className="flex flex-1 basis-72 items-center gap-4 text-ink">
                  <span
                    aria-hidden
                    className="grid size-12 shrink-0 place-items-center rounded-full border border-accent/50 text-accent"
                  >
                    <PhoneCall className="size-5" strokeWidth={1.5} />
                  </span>
                  {t('unavailable')}
                </p>
                <CtaButtons
                  settings={settings}
                  location="rates"
                  className="w-full flex-row max-sm:*:flex-1 max-sm:*:px-3 sm:w-auto"
                />
              </div>
            )}
          </div>

          <p className="flex items-start gap-2 border-t border-line bg-surface-sunken px-5 py-3 text-sm text-ink-muted md:px-7">
            <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={1.5} />
            {t('note')}
          </p>
        </div>
      </div>
    </section>
  )
}

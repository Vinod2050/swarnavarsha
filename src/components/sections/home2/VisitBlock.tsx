import { Clock, MapPin, Navigation, Phone } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import type { ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/ui/reveal'
import { TrackedAnchor } from '@/components/ui/tracked-anchor'
import type { SiteSettings } from '@/lib/content'
import { cn } from '@/lib/utils'

import { CtaButtons } from '../CtaButtons'
import { SectionHeading } from '../SectionHeading'

/** White card for one contact detail, led by a gold-ringed icon. */
function DetailCard({
  icon,
  label,
  className,
  children,
}: {
  icon: ReactNode
  label: string
  className?: string
  children: ReactNode
}) {
  return (
    <li
      className={cn(
        'group flex min-w-0 hover-lift gap-4 rounded-md border border-line bg-surface-raised p-5 shadow-card lg:short:gap-3 lg:short:p-4 lg:xshort:p-3',
        className,
      )}
    >
      <span
        aria-hidden
        className="grid size-11 shrink-0 place-items-center rounded-full border border-accent/50 text-accent transition-colors duration-500 group-hover:bg-cta group-hover:text-on-cta lg:short:size-10 [&_svg]:size-5"
      >
        {icon}
      </span>
      <div className="min-w-0">
        <h3 className="t-label text-ink-muted">{label}</h3>
        {children}
      </div>
    </li>
  )
}

/**
 * Home 2 "visit us": address, phones and hours as cards with the call and WhatsApp
 * buttons under them, beside a framed map with a directions bar.
 */
export async function VisitBlock({ settings }: { settings: SiteSettings }) {
  const [t, tc] = await Promise.all([getTranslations('contact'), getTranslations('common')])

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="bg-surface-sunken section-y text-ink lg:xshort:py-6"
    >
      <div className="container-site">
        <SectionHeading
          id="contact-title"
          eyebrow={t('eyebrow')}
          title={t('title')}
          intro={t('intro')}
          // Wide, short screens use the compact title inside the left column instead
          className="lg:short:hidden"
        />

        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-10 lg:short:grid-cols-[1.25fr_1fr] lg:short:gap-8 lg:xshort:grid-cols-[1.5fr_1fr]">
          <Reveal from="left" className="flex min-w-0 flex-col">
            {/* Same title as above, set beside the map so the whole section fits one screen */}
            <p
              aria-hidden
              className="mb-4 hidden t-h2 lg:short:block lg:xshort:mb-2 lg:xshort:text-2xl lg:xshort:leading-8"
            >
              {t('title')}
            </p>
            <ul className="grid gap-4 sm:grid-cols-2 lg:short:gap-3 lg:xshort:grid-cols-[1.35fr_1fr] lg:xshort:gap-2">
              <DetailCard
                icon={<MapPin strokeWidth={1.5} />}
                label={t('address')}
                className="sm:col-span-2"
              >
                <p className="mt-1 t-body-lg lg:short:text-base lg:short:leading-6">
                  {settings.address}
                </p>
              </DetailCard>
              <DetailCard icon={<Phone strokeWidth={1.5} />} label={t('phones')}>
                <ul className="mt-1 lg:xshort:flex lg:xshort:flex-wrap lg:xshort:gap-x-4">
                  {settings.phones.map((phone) => (
                    <li key={phone.tel}>
                      <TrackedAnchor
                        href={`tel:${phone.tel}`}
                        event="call_click"
                        location="contact"
                        className="inline-flex min-h-11 items-center t-body-lg font-semibold whitespace-nowrap hover:text-accent lg:min-h-9 lg:short:min-h-7 lg:short:text-base"
                      >
                        {phone.display}
                      </TrackedAnchor>
                    </li>
                  ))}
                </ul>
              </DetailCard>
              <DetailCard icon={<Clock strokeWidth={1.5} />} label={t('hours')}>
                <p className="mt-1 t-body-lg lg:short:text-base lg:short:leading-6">
                  {settings.openingHours ?? tc('hoursPlaceholder')}
                </p>
              </DetailCard>
            </ul>

            <div className="mt-6 flex flex-wrap items-center gap-3 lg:short:mt-4 lg:xshort:mt-3">
              <CtaButtons
                settings={settings}
                location="contact"
                className="w-full sm:w-auto lg:short:*:min-h-11 lg:short:*:px-4 lg:short:*:py-2"
              />
            </div>
          </Reveal>

          {/* Map in a gold frame; the plum bar under it carries the directions button */}
          <Reveal
            from="right"
            delay={0.1}
            className="flex flex-col overflow-hidden rounded-lg border border-accent/40 bg-surface-raised p-2 shadow-card"
          >
            <div className="relative aspect-[4/3] flex-1 overflow-hidden rounded-md md:aspect-[16/9] lg:aspect-auto lg:min-h-64 lg:short:min-h-40">
              <iframe
                src={settings.mapEmbedUrl}
                title={t('mapTitle')}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 size-full border-0"
              />
            </div>
            <div className="theme-dark mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 rounded-md bg-surface px-4 py-3 text-ink lg:short:justify-start lg:short:px-3 lg:short:py-2">
              {/* The address card is right beside the map on wide, short screens, so it is not repeated */}
              <p className="flex min-w-0 flex-1 basis-56 items-start gap-3 text-sm text-ink-muted lg:short:hidden">
                <MapPin
                  aria-hidden
                  className="mt-0.5 size-5 shrink-0 text-accent"
                  strokeWidth={1.5}
                />
                {settings.address}
              </p>
              <Button asChild size="sm">
                <a href={settings.mapLinkUrl} target="_blank" rel="noopener noreferrer">
                  <Navigation aria-hidden />
                  {tc('directions')}
                </a>
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

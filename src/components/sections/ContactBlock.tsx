import { Clock, MapPin, Navigation, Phone } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/ui/reveal'
import { TrackedAnchor } from '@/components/ui/tracked-anchor'
import type { SiteSettings } from '@/lib/content'
import { cn } from '@/lib/utils'

import { CtaButtons } from './CtaButtons'
import { SectionHeading } from './SectionHeading'

/**
 * Address, phones and hours with the call and WhatsApp buttons on one side; the map in a
 * gold frame on the other. The call-back form was taken off the whole site on 2026-10-14.
 */
export async function ContactBlock({
  settings,
  heading = true,
  sunken = true,
}: {
  settings: SiteSettings
  heading?: boolean
  /** Pale gold band (default) or plain ivory, whichever differs from the section above */
  sunken?: boolean
}) {
  const [t, tc] = await Promise.all([getTranslations('contact'), getTranslations('common')])

  return (
    <section
      id="contact"
      aria-labelledby={heading ? 'contact-title' : undefined}
      aria-label={heading ? undefined : t('title')}
      className={cn(
        'section-y text-ink lg:short:py-8',
        sunken ? 'bg-surface-sunken' : 'bg-surface',
      )}
    >
      <div className="container-site">
        {heading && (
          <SectionHeading
            id="contact-title"
            eyebrow={t('eyebrow')}
            title={t('title')}
            intro={t('intro')}
            className="lg:short:mb-6"
          />
        )}

        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-stretch lg:gap-12">
          <Reveal from="left" className="flex flex-col justify-center">
            <ul className="space-y-6 lg:short:space-y-3">
              <li className="flex gap-4">
                <MapPin aria-hidden className="mt-1 size-6 shrink-0 text-accent" />
                <div>
                  <h3 className="t-label text-ink-muted">{t('address')}</h3>
                  <p className="mt-1 t-body-lg">{settings.address}</p>
                </div>
              </li>
              <li className="flex gap-4">
                <Phone aria-hidden className="mt-1 size-6 shrink-0 text-accent" />
                <div>
                  <h3 className="t-label text-ink-muted">{t('phones')}</h3>
                  <ul className="mt-1 flex flex-wrap gap-x-6">
                    {settings.phones.map((phone) => (
                      <li key={phone.tel}>
                        <TrackedAnchor
                          href={`tel:${phone.tel}`}
                          event="call_click"
                          location="contact"
                          className="inline-flex min-h-11 items-center t-body-lg font-semibold whitespace-nowrap hover:text-accent lg:short:min-h-8"
                        >
                          {phone.display}
                        </TrackedAnchor>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
              <li className="flex gap-4">
                <Clock aria-hidden className="mt-1 size-6 shrink-0 text-accent" />
                <div>
                  <h3 className="t-label text-ink-muted">{t('hours')}</h3>
                  <p className="mt-1 t-body-lg">
                    {settings.openingHours ?? tc('hoursPlaceholder')}
                  </p>
                </div>
              </li>
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:short:mt-5">
              <CtaButtons settings={settings} location="contact" />
              <Button asChild variant="secondary">
                <a href={settings.mapLinkUrl} target="_blank" rel="noopener noreferrer">
                  <Navigation aria-hidden />
                  {tc('directions')}
                </a>
              </Button>
            </div>
          </Reveal>

          <Reveal
            from="right"
            delay={0.1}
            className="overflow-hidden rounded-lg border border-accent/40 bg-surface-raised p-2 shadow-card"
          >
            <iframe
              src={settings.mapEmbedUrl}
              title={t('mapTitle')}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block aspect-[4/3] w-full rounded-md border-0 md:aspect-[16/9] lg:aspect-auto lg:h-full lg:min-h-80 lg:short:min-h-64"
            />
          </Reveal>
        </div>
      </div>
    </section>
  )
}

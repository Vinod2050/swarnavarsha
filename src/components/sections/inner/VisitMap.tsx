import { Clock, MapPin, Navigation, Phone } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import type { ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { OrnamentDivider, ScallopPattern } from '@/components/ui/ornament'
import { Reveal } from '@/components/ui/reveal'
import { TrackedAnchor } from '@/components/ui/tracked-anchor'
import type { SiteSettings } from '@/lib/content'

function Row({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="flex gap-4 py-4 first:pt-0 last:pb-0">
      <span className="grid size-10 shrink-0 place-items-center rounded-full border border-accent/50 text-accent [&_svg]:size-5">
        {icon}
      </span>
      <div className="min-w-0">
        <dt className="t-label text-ink-muted">{label}</dt>
        <dd className="mt-0.5">{children}</dd>
      </div>
    </div>
  )
}

/**
 * Plum band with faint scallops: the branch's address, phones and hours beside the map, which
 * sits in a double gold frame.
 */
export async function VisitMap({ settings }: { settings: SiteSettings }) {
  const [t, tc] = await Promise.all([getTranslations('contact'), getTranslations('common')])

  return (
    <section
      aria-labelledby="visit-title"
      className="theme-dark relative isolate overflow-hidden bg-surface section-y text-ink"
    >
      <ScallopPattern className="-z-10 opacity-20" />
      <div className="container-site grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Reveal from="left">
          <p className="mb-2 t-eyebrow">{t('address')}</p>
          <h2 id="visit-title" className="foil-text foil-emboss t-h2">
            {t('mapHeading')}
          </h2>
          <OrnamentDivider className="mt-4" />
          <dl className="mt-6 divide-y divide-line">
            <Row icon={<MapPin aria-hidden />} label={t('address')}>
              {settings.address}
            </Row>
            <Row icon={<Phone aria-hidden />} label={t('phones')}>
              <span className="flex flex-wrap gap-x-5">
                {settings.phones.map((phone) => (
                  <TrackedAnchor
                    key={phone.tel}
                    href={`tel:${phone.tel}`}
                    event="call_click"
                    location="contact_map"
                    className="inline-flex min-h-11 items-center font-semibold whitespace-nowrap hover:text-accent"
                  >
                    {phone.display}
                  </TrackedAnchor>
                ))}
              </span>
            </Row>
            <Row icon={<Clock aria-hidden />} label={t('hours')}>
              {settings.openingHours ?? tc('hoursPlaceholder')}
            </Row>
          </dl>
          <Button asChild className="mt-8">
            <a href={settings.mapLinkUrl} target="_blank" rel="noopener noreferrer">
              <Navigation aria-hidden />
              {tc('directions')}
            </a>
          </Button>
        </Reveal>

        {/* The map in a double gold frame that stays inside the column */}
        <Reveal
          from="right"
          delay={0.1}
          className="rounded-lg border border-accent/30 p-1.5 shadow-foil sm:p-2"
        >
          <div className="overflow-hidden rounded-md border border-accent/70 bg-surface-raised p-1.5 sm:p-2">
            <iframe
              src={settings.mapEmbedUrl}
              title={t('mapTitle')}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block aspect-[4/3] max-h-[26rem] w-full rounded-sm border-0 md:aspect-[16/10] lg:short:max-h-80"
            />
          </div>
        </Reveal>
      </div>
    </section>
  )
}

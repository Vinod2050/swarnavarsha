import { ArrowRight, Clock, MapPin, Phone } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import type { ReactNode } from 'react'

import { WhatsAppIcon } from '@/components/ui/icons'
import { Medallion } from '@/components/ui/ornament'
import { Reveal } from '@/components/ui/reveal'
import { TrackedAnchor } from '@/components/ui/tracked-anchor'
import { whatsappUrl, type SiteSettings } from '@/lib/content'
import { cn } from '@/lib/utils'

import { SectionHeading } from '../SectionHeading'

const actionClass =
  'group/action mt-auto inline-flex min-h-11 items-center gap-2 pt-3 t-label text-accent hover:underline'

/**
 * One way to reach us. Under the pointer the card lifts, its coin fills with gold and a gold
 * rule draws across its top. `featured` (Call): a plum card with a shimmering foil edge.
 */
function Channel({
  icon,
  title,
  index,
  featured = false,
  children,
}: {
  icon: ReactNode
  title: string
  index: number
  featured?: boolean
  children: ReactNode
}) {
  return (
    <li>
      <Reveal
        delay={index * 0.08}
        className={cn(
          'group relative flex h-full hover-lift flex-col overflow-hidden rounded-lg border border-line p-6 shadow-card after:absolute after:inset-x-0 after:top-0 after:h-0.5 after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-500 hover:after:scale-x-100',
          featured ? 'theme-dark bg-surface text-ink' : 'bg-surface-raised',
        )}
      >
        {featured && (
          <div aria-hidden className="foil-edge foil-shimmer absolute inset-x-0 top-0" />
        )}
        <Medallion className="[&_svg]:stroke-[1.5]">{icon}</Medallion>
        <h3 className={cn('mt-4 t-h3', featured && 'text-accent')}>{title}</h3>
        {children}
      </Reveal>
    </li>
  )
}

/** Contact page: four ways to reach us, under the hero. */
export async function ContactChannels({ settings }: { settings: SiteSettings }) {
  const [t, tc] = await Promise.all([getTranslations('contact'), getTranslations('common')])

  return (
    <section aria-labelledby="channels-title" className="bg-surface section-y text-ink">
      <div className="container-site">
        <SectionHeading
          id="channels-title"
          eyebrow={t('eyebrow')}
          title={t('title')}
          intro={t('intro')}
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          <Channel index={0} featured icon={<Phone aria-hidden />} title={t('channels.call.title')}>
            <p className="mt-2 text-ink-muted">{t('channels.call.text')}</p>
            <ul className="mt-auto pt-3">
              {settings.phones.map((phone) => (
                <li key={phone.tel}>
                  <TrackedAnchor
                    href={`tel:${phone.tel}`}
                    event="call_click"
                    location="contact_channels"
                    className="inline-flex min-h-11 items-center text-lg font-bold whitespace-nowrap hover:text-accent"
                  >
                    {phone.display}
                  </TrackedAnchor>
                </li>
              ))}
            </ul>
          </Channel>

          <Channel index={1} icon={<WhatsAppIcon />} title={t('channels.whatsapp.title')}>
            <p className="mt-2 text-ink-muted">{t('channels.whatsapp.text')}</p>
            <TrackedAnchor
              href={whatsappUrl(settings.whatsapp, tc('whatsappMessage'))}
              target="_blank"
              rel="noopener noreferrer"
              event="whatsapp_click"
              location="contact_channels"
              className={actionClass}
            >
              {tc('whatsapp')}
              <ArrowRight
                aria-hidden
                className="size-4 transition-transform group-hover/action:translate-x-1"
              />
            </TrackedAnchor>
          </Channel>

          <Channel index={2} icon={<MapPin aria-hidden />} title={t('channels.visit.title')}>
            <p className="mt-2 text-ink-muted">{settings.address}</p>
            <a
              href={settings.mapLinkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={actionClass}
            >
              {tc('directions')}
              <ArrowRight
                aria-hidden
                className="size-4 transition-transform group-hover/action:translate-x-1"
              />
            </a>
          </Channel>

          <Channel index={3} icon={<Clock aria-hidden />} title={t('hours')}>
            <p className="mt-2 text-ink-muted">{settings.openingHours ?? tc('hoursPlaceholder')}</p>
          </Channel>
        </ul>
      </div>
    </section>
  )
}

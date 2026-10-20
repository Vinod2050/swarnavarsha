import { Clock, Phone } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import { TrackedAnchor } from '@/components/ui/tracked-anchor'
import type { SiteSettings } from '@/lib/content'

import { LanguageSwitch } from './LanguageSwitch'

export async function TopBar({ settings }: { settings: SiteSettings }) {
  const t = await getTranslations('common')

  return (
    <div className="theme-dark theme-deep bg-surface text-sm text-ink">
      <div className="container-site flex min-h-11 items-center justify-between gap-6 md:xshort:min-h-9">
        <div className="hidden items-center gap-6 md:flex">
          <span className="flex items-center gap-2">
            <Phone aria-hidden className="size-4 text-accent" />
            {settings.phones.map((phone, index) => (
              <span key={phone.tel} className="flex items-center gap-2">
                {index > 0 && (
                  <span aria-hidden className="text-line-strong">
                    /
                  </span>
                )}
                <TrackedAnchor
                  href={`tel:${phone.tel}`}
                  event="call_click"
                  location="top_bar"
                  className="hover:text-accent"
                >
                  {phone.display}
                </TrackedAnchor>
              </span>
            ))}
          </span>
          <span className="flex items-center gap-2 text-ink-muted">
            <Clock aria-hidden className="size-4 text-accent" />
            {settings.openingHours ?? t('hoursPlaceholder')}
          </span>
        </div>
        <LanguageSwitch label={t('language')} className="ml-auto" />
      </div>
    </div>
  )
}

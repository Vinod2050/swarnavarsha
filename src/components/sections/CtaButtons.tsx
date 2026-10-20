import { Phone } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import { Button } from '@/components/ui/button'
import { WhatsAppIcon } from '@/components/ui/icons'
import { TrackedAnchor } from '@/components/ui/tracked-anchor'
import { whatsappUrl, type SiteSettings } from '@/lib/content'
import { cn } from '@/lib/utils'

/** The two actions every page offers: call now, or chat on WhatsApp. */
export async function CtaButtons({
  settings,
  location,
  inline = false,
  className,
}: {
  settings: SiteSettings
  location: string
  /** Side by side on phones too, sharing the width (page heroes, where height is short) */
  inline?: boolean
  className?: string
}) {
  const t = await getTranslations('common')
  const phone = settings.phones[0]

  return (
    <div
      className={cn(
        'flex gap-3',
        inline ? 'flex-row max-sm:*:flex-1 max-sm:*:px-3' : 'flex-col sm:flex-row',
        className,
      )}
    >
      <Button asChild>
        <TrackedAnchor href={`tel:${phone.tel}`} event="call_click" location={location}>
          <Phone aria-hidden />
          {t('callNow')}
        </TrackedAnchor>
      </Button>
      <Button asChild variant="whatsapp">
        <TrackedAnchor
          href={whatsappUrl(settings.whatsapp, t('whatsappMessage'))}
          target="_blank"
          rel="noopener noreferrer"
          event="whatsapp_click"
          location={location}
        >
          <WhatsAppIcon />
          {t('whatsapp')}
        </TrackedAnchor>
      </Button>
    </div>
  )
}

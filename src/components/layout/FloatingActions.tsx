import { Phone } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import { WhatsAppIcon } from '@/components/ui/icons'
import { TrackedAnchor } from '@/components/ui/tracked-anchor'
import { whatsappUrl, type SiteSettings } from '@/lib/content'

import { FloatingActionsShell } from './FloatingActionsShell'

/**
 * Call (phones only) and WhatsApp buttons fixed to the bottom-right of every page. They step
 * aside while a page hero's own Call / WhatsApp buttons are on screen (FloatingActionsShell).
 */
export async function FloatingActions({ settings }: { settings: SiteSettings }) {
  const t = await getTranslations('common')
  const phone = settings.phones[0]

  return (
    <FloatingActionsShell>
      <TrackedAnchor
        href={`tel:${phone.tel}`}
        event="call_click"
        location="floating"
        aria-label={`${t('callNow')}: ${phone.display}`}
        className="flex size-14 items-center justify-center rounded-full bg-gold-300 text-plum-800 shadow-card outline-offset-4 transition-colors hover:bg-gold-400 md:hidden"
      >
        <Phone aria-hidden className="size-6" />
      </TrackedAnchor>
      <TrackedAnchor
        href={whatsappUrl(settings.whatsapp, t('whatsappMessage'))}
        target="_blank"
        rel="noopener noreferrer"
        event="whatsapp_click"
        location="floating"
        aria-label={t('whatsappChat')}
        className="flex size-14 items-center justify-center rounded-full bg-peacock-green text-white shadow-card outline-offset-4 transition-colors hover:bg-peacock-green/90"
      >
        <WhatsAppIcon className="size-7" />
      </TrackedAnchor>
    </FloatingActionsShell>
  )
}

import { Phone } from 'lucide-react'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

import { Button } from '@/components/ui/button'
import { TrackedAnchor } from '@/components/ui/tracked-anchor'
import { Link } from '@/i18n/navigation'
import { whatsappUrl, type SiteSettings } from '@/lib/content'

import { MobileMenu } from './MobileMenu'
import { NAV_ITEMS } from './nav'
import { NavLinks } from './NavLinks'

export async function Header({ settings }: { settings: SiteSettings }) {
  const [t, tc] = await Promise.all([getTranslations('nav'), getTranslations('common')])
  const phone = settings.phones[0]
  const items = NAV_ITEMS.map((item) => ({
    href: item.href,
    label: t(item.key),
    children:
      'children' in item
        ? item.children.map((child) => ({ href: child.href, label: t(child.key) }))
        : undefined,
  }))

  return (
    <header className="theme-dark sticky top-0 z-40 border-b border-line bg-surface text-ink">
      <div className="container-site flex h-18 items-center gap-3 md:h-24 md:gap-4 md:short:h-18 md:xshort:h-16">
        <Link
          href="/"
          className="shrink-0 rounded-md"
          aria-label={`${settings.name} – ${t('home')}`}
        >
          <Image
            src="/logo/suvarnavarsha-logo-v2-transparent.png"
            alt={settings.name}
            width={154}
            height={80}
            priority
            className="h-16 w-auto transition-transform duration-500 ease-out hover:scale-[1.04] md:h-20 md:short:h-16 md:xshort:h-14"
          />
        </Link>

        <NavLinks items={items} label={t('main')} />

        <div className="ml-auto flex items-center gap-2 md:gap-3">
          <Link
            href="/#rates"
            className="inline-flex min-h-11 items-center rounded-full border-[1.5px] border-accent px-4 t-label whitespace-nowrap text-accent transition-colors hover:bg-accent/10"
          >
            {tc('todaysRate')}
          </Link>
          <Button asChild size="sm" className="hidden md:inline-flex">
            <TrackedAnchor href={`tel:${phone.tel}`} event="call_click" location="header">
              <Phone aria-hidden />
              <span className="whitespace-nowrap">{phone.display}</span>
            </TrackedAnchor>
          </Button>
          <MobileMenu
            items={items}
            siteName={settings.name}
            phone={phone}
            whatsappHref={whatsappUrl(settings.whatsapp, tc('whatsappMessage'))}
            labels={{
              menu: t('menu'),
              close: t('close'),
              call: tc('call'),
              whatsapp: tc('whatsapp'),
              language: tc('language'),
              staffLogin: t('staffLogin'),
            }}
          />
        </div>
      </div>
    </header>
  )
}

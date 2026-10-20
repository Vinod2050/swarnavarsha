'use client'

import {
  ChevronDown,
  ChevronRight,
  Gem,
  HelpCircle,
  LockKeyhole,
  Home,
  ListChecks,
  MapPin,
  Menu,
  Phone,
  Store,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react'
import Image from 'next/image'
import NextLink from 'next/link'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { WhatsAppIcon } from '@/components/ui/icons'
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { TrackedAnchor } from '@/components/ui/tracked-anchor'
import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

import { LanguageSwitch } from './LanguageSwitch'
import type { NavLinkItem } from './nav'

type Props = {
  items: NavLinkItem[]
  siteName: string
  phone: { display: string; tel: string }
  whatsappHref: string
  labels: {
    menu: string
    close: string
    call: string
    whatsapp: string
    language: string
    staffLogin: string
  }
}

// One icon per top-level page; anything not listed falls back to the gem
const ICONS: Record<string, LucideIcon> = {
  '/': Home,
  '/about': Users,
  '/services': Gem,
  '/store': Store,
  '/how-it-works': ListChecks,
  '/faq': HelpCircle,
  '/contact': MapPin,
}

const roundButton =
  'inline-flex size-12 shrink-0 items-center justify-center rounded-full border-[1.5px] border-accent/50 text-accent transition-colors hover:border-accent hover:bg-accent/10'

// Rows come in one after another when the drawer opens
const rowIn = 'animate-rise'

export function MobileMenu({ items, siteName, phone, whatsappHref, labels }: Props) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  // The group that is unfolded; it starts open when the visitor is on one of its pages
  const [expanded, setExpanded] = useState<string | null>(
    () =>
      items.find((item) => item.children?.some((child) => child.href === pathname))?.href ?? null,
  )
  const close = () => setOpen(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger aria-label={labels.menu} className={cn(roundButton, 'xl:hidden')}>
        <Menu aria-hidden className="size-6" />
      </SheetTrigger>

      <SheetContent aria-describedby={undefined} className="theme-dark bg-surface text-ink">
        <div className="flex h-18 shrink-0 items-center justify-between border-b border-line px-5">
          <SheetTitle asChild>
            <Image
              src="/logo/suvarnavarsha-logo-v2-transparent.png"
              alt={siteName}
              width={123}
              height={64}
              className="h-14 w-auto"
            />
          </SheetTitle>
          <SheetClose aria-label={labels.close} className={roundButton}>
            <X aria-hidden className="size-6" />
          </SheetClose>
        </div>

        {/* Only the list scrolls; the logo row and the buttons stay in place */}
        <nav aria-label={labels.menu} className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
          <ul className="space-y-1">
            {items.map((item, index) => {
              const Icon = ICONS[item.href] ?? Gem
              const delay = { animationDelay: `${60 + index * 45}ms` }

              // A group's own link would repeat its first child, so it becomes a button that
              // unfolds its pages
              if (item.children) {
                const isOpen = expanded === item.href
                const listId = `menu-group-${index}`
                return (
                  <li key={item.label} className={rowIn} style={delay}>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={listId}
                      onClick={() => setExpanded(isOpen ? null : item.href)}
                      className="group flex min-h-13 w-full items-center gap-4 rounded-md px-3 text-left text-lg leading-7 font-semibold text-ink transition-colors hover:bg-surface-raised"
                    >
                      <Icon aria-hidden className="size-5 shrink-0 text-accent" strokeWidth={1.5} />
                      {item.label}
                      <ChevronDown
                        aria-hidden
                        className={cn(
                          'ml-auto size-5 shrink-0 text-ink-muted transition-transform duration-200 group-hover:text-accent',
                          isOpen && 'rotate-180 text-accent',
                        )}
                      />
                    </button>
                    <ul
                      id={listId}
                      hidden={!isOpen}
                      className="mt-1 mb-1 ml-[22px] space-y-1 border-l border-accent/40 pl-4"
                    >
                      {item.children.map((child) => {
                        const current = pathname === child.href
                        return (
                          <li key={child.label}>
                            <Link
                              href={child.href}
                              onClick={close}
                              aria-current={current ? 'page' : undefined}
                              className={cn(
                                'flex min-h-11 items-center rounded-md px-3 text-base leading-6 font-semibold transition-colors',
                                current
                                  ? 'bg-surface-raised text-accent'
                                  : 'text-ink-muted hover:bg-surface-raised hover:text-ink',
                              )}
                            >
                              {child.label}
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  </li>
                )
              }

              const current = pathname === item.href
              return (
                <li key={item.label} className={rowIn} style={delay}>
                  <Link
                    href={item.href}
                    onClick={close}
                    aria-current={current ? 'page' : undefined}
                    className={cn(
                      'group flex min-h-13 items-center gap-4 rounded-md px-3 text-lg leading-7 font-semibold transition-colors',
                      current
                        ? 'bg-surface-raised text-accent'
                        : 'text-ink hover:bg-surface-raised',
                    )}
                  >
                    <Icon aria-hidden className="size-5 shrink-0 text-accent" strokeWidth={1.5} />
                    {item.label}
                    <ChevronRight
                      aria-hidden
                      className="ml-auto size-5 shrink-0 text-ink-muted transition-transform group-hover:translate-x-1 group-hover:text-accent"
                    />
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="shrink-0 border-t border-line bg-surface-sunken px-5 pt-4 pb-3">
          <div className="grid grid-cols-2 gap-3">
            <Button asChild className="px-3">
              <TrackedAnchor href={`tel:${phone.tel}`} event="call_click" location="mobile_menu">
                <Phone aria-hidden />
                {labels.call}
              </TrackedAnchor>
            </Button>
            <Button asChild variant="whatsapp" className="px-3">
              <TrackedAnchor
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                event="whatsapp_click"
                location="mobile_menu"
              >
                <WhatsAppIcon />
                {labels.whatsapp}
              </TrackedAnchor>
            </Button>
          </div>
          <div className="mt-1 flex items-center justify-between gap-3">
            {/* Staff sign-in for the admin panel: next/link, not the locale Link, because /admin has no language prefix */}
            <NextLink
              href="/admin"
              prefetch={false}
              className="inline-flex min-h-11 items-center gap-2 t-label text-ink-muted transition-colors hover:text-accent"
            >
              <LockKeyhole aria-hidden className="size-4 shrink-0 text-accent" strokeWidth={1.5} />
              {labels.staffLogin}
            </NextLink>
            <LanguageSwitch label={labels.language} className="-mr-3" />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

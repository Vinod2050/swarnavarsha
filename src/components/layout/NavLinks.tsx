'use client'

import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

import type { NavLinkItem } from './nav'

// A gold line grows under the link on hover and stays under the current page
const itemClass =
  'relative inline-flex min-h-11 items-center gap-1 rounded-md px-3 text-[15px] leading-5 font-semibold whitespace-nowrap transition-colors after:absolute after:inset-x-3 after:bottom-1 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-accent after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100 aria-[current=page]:after:scale-x-100'

/** Desktop navigation with dropdowns and the current page marked. */
export function NavLinks({ items, label }: { items: NavLinkItem[]; label: string }) {
  const pathname = usePathname()
  const [open, setOpen] = useState<string | null>(null)

  return (
    <nav aria-label={label} className="hidden xl:block">
      <ul className="flex items-center gap-1">
        {items.map((item) => {
          if (!item.children) {
            const current = pathname === item.href
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  aria-current={current ? 'page' : undefined}
                  className={cn(itemClass, current ? 'text-accent' : 'text-ink hover:text-accent')}
                >
                  {item.label}
                </Link>
              </li>
            )
          }

          const expanded = open === item.label
          const current = item.children.some((child) => child.href === pathname)
          return (
            <li
              key={item.label}
              className="relative"
              onMouseEnter={() => setOpen(item.label)}
              onMouseLeave={() => setOpen(null)}
              onKeyDown={(event) => {
                if (event.key === 'Escape') setOpen(null)
              }}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) setOpen(null)
              }}
            >
              <button
                type="button"
                aria-expanded={expanded}
                onClick={() => setOpen(expanded ? null : item.label)}
                className={cn(itemClass, current ? 'text-accent' : 'text-ink hover:text-accent')}
              >
                {item.label}
                <ChevronDown
                  aria-hidden
                  className={cn(
                    'size-4 transition-transform duration-200',
                    expanded && 'rotate-180',
                  )}
                />
              </button>

              {/* pt-2 keeps the pointer inside the item on its way down to the panel */}
              <div className={cn('absolute top-full left-0 z-50 pt-2', !expanded && 'hidden')}>
                <ul className="min-w-60 animate-sheet-in overflow-hidden rounded-md border border-line bg-surface-raised py-2 shadow-foil">
                  <li aria-hidden className="foil-edge -mt-2 mb-2" />
                  {item.children.map((child) => {
                    const childCurrent = pathname === child.href
                    return (
                      <li key={child.label}>
                        <Link
                          href={child.href}
                          onClick={() => setOpen(null)}
                          aria-current={childCurrent ? 'page' : undefined}
                          className={cn(
                            'flex min-h-11 items-center px-4 text-[15px] font-semibold whitespace-nowrap transition-colors hover:bg-surface-sunken hover:text-accent',
                            childCurrent ? 'text-accent' : 'text-ink',
                          )}
                        >
                          {child.label}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

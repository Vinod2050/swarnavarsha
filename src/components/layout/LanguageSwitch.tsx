'use client'

import { useLocale } from 'next-intl'

import { Link, usePathname } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { cn } from '@/lib/utils'

const LABELS: Record<(typeof routing.locales)[number], string> = {
  en: 'English',
  mr: 'मराठी',
}

/** Switches language and stays on the same page. */
export function LanguageSwitch({ label, className }: { label: string; className?: string }) {
  const locale = useLocale()
  const pathname = usePathname()

  return (
    <nav aria-label={label} className={cn('flex items-center', className)}>
      {routing.locales.map((code, index) => (
        <span key={code} className="flex items-center">
          {index > 0 && (
            <span aria-hidden className="text-line-strong">
              |
            </span>
          )}
          <Link
            href={pathname}
            locale={code}
            lang={code}
            hrefLang={code}
            aria-current={code === locale ? 'true' : undefined}
            className={cn(
              't-label inline-flex min-h-11 items-center px-3',
              code === locale ? 'text-accent' : 'text-ink-muted hover:text-ink',
            )}
          >
            {LABELS[code]}
          </Link>
        </span>
      ))}
    </nav>
  )
}

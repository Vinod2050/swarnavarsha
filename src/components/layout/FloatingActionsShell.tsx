'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef, type ReactNode } from 'react'

/**
 * Holds the floating Call / WhatsApp buttons out of the way while a page hero's own buttons
 * (marked `data-hero-cta`) are on screen, so the two never overlap on small phones.
 * globals.css hides them on such pages before this runs, so there is no flash on landing.
 */
export function FloatingActionsShell({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    const shell = ref.current
    if (!shell) return
    // Back to the CSS default for the new page until its hero is measured
    delete shell.dataset.show

    const targets = document.querySelectorAll('[data-hero-cta]')
    if (targets.length === 0) {
      shell.dataset.show = 'true'
      return
    }

    const inView = new Set<Element>()
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) inView.add(entry.target)
        else inView.delete(entry.target)
      }
      shell.dataset.show = String(inView.size === 0)
    })
    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [pathname])

  return (
    <div
      ref={ref}
      className="floating-actions fixed right-4 bottom-4 z-30 flex flex-col items-center gap-3"
    >
      {children}
    </div>
  )
}

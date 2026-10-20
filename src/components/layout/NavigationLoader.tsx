'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { BrandLoader } from '@/components/ui/brand-loader'

/** Fast page changes finish before this, so the loader never flashes on a good connection */
const SHOW_AFTER_MS = 300
/** Never leave the loader over the page if a navigation is dropped */
const GIVE_UP_MS = 15_000

/**
 * Covers the page with the logo loader when moving to another page takes a moment, as on a
 * slow mobile network. It starts on a click on a link to another page of this site (or on the
 * browser's back and forward buttons) and ends as soon as the new address is in place.
 */
export function NavigationLoader({ label }: { label: string }) {
  const pathname = usePathname()
  const [pending, setPending] = useState(false)
  const [visible, setVisible] = useState(false)
  const [lastPath, setLastPath] = useState(pathname)

  // The new page has arrived: reset while rendering, so the loader never outlives it
  if (pathname !== lastPath) {
    setLastPath(pathname)
    setPending(false)
    setVisible(false)
  }

  useEffect(() => {
    const start = () => setPending(true)
    const onClick = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return
      const anchor = (event.target as Element | null)?.closest?.('a[href]')
      if (!(anchor instanceof HTMLAnchorElement)) return
      if (anchor.target && anchor.target !== '_self') return
      if (anchor.hasAttribute('download')) return
      const url = new URL(anchor.href, location.href)
      if (url.origin !== location.origin) return
      // Same page (a link to a section further down, or the page itself)
      if (url.pathname === location.pathname) return
      // The admin panel is a different app
      if (url.pathname.startsWith('/admin')) return
      start()
    }

    document.addEventListener('click', onClick)
    window.addEventListener('popstate', start)
    return () => {
      document.removeEventListener('click', onClick)
      window.removeEventListener('popstate', start)
    }
  }, [])

  useEffect(() => {
    if (!pending) return
    const show = window.setTimeout(() => setVisible(true), SHOW_AFTER_MS)
    const giveUp = window.setTimeout(() => {
      setPending(false)
      setVisible(false)
    }, GIVE_UP_MS)
    return () => {
      window.clearTimeout(show)
      window.clearTimeout(giveUp)
    }
  }, [pending])

  if (!visible) return null

  return (
    <div className="theme-dark fixed inset-0 z-[70] grid animate-fade place-items-center bg-surface text-ink">
      <BrandLoader label={label} />
    </div>
  )
}

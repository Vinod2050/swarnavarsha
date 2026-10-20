import { Playfair_Display } from 'next/font/google'
import type { ReactNode } from 'react'

// Same heading face as the public site, offered to custom.scss as --sg-font-display
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['600'],
  display: 'swap',
  variable: '--sg-font-display',
})

/** Wraps the whole panel without adding a box, so every screen can use the heading font. */
export function Fonts({ children }: { children: ReactNode }) {
  return (
    <div className={playfair.variable} style={{ display: 'contents' }}>
      {children}
    </div>
  )
}

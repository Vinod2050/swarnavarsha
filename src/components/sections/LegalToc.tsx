'use client'

import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

/**
 * "On this page" list for the legal pages. The section being read is marked in gold, and a
 * fine gold bar along the card's top shows how far through the page the reader is.
 */
export function LegalToc({ label, titles }: { label: string; titles: string[] }) {
  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const sections = titles
      .map((_, index) => document.getElementById(`section-${index + 1}`))
      .filter((el): el is HTMLElement => el !== null)

    const update = () => {
      // The last section whose top has passed the upper third of the window
      const line = window.innerHeight / 3
      let current = 0
      sections.forEach((section, index) => {
        if (section.getBoundingClientRect().top <= line) current = index
      })
      setActive(current)

      const first = sections[0]
      const last = sections[sections.length - 1]
      if (first && last) {
        const start = first.getBoundingClientRect().top + window.scrollY - line
        const end = last.getBoundingClientRect().bottom + window.scrollY - window.innerHeight
        const ratio = end > start ? (window.scrollY - start) / (end - start) : 1
        setProgress(Math.min(1, Math.max(0, ratio)))
      }
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [titles])

  return (
    <nav
      aria-labelledby="legal-toc"
      className="relative overflow-hidden rounded-lg border border-line bg-surface-raised p-5 shadow-card"
    >
      <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-line">
        <span
          className="block h-full origin-left bg-accent transition-transform duration-200"
          style={{ transform: `scaleX(${progress})` }}
        />
      </span>
      <p id="legal-toc" className="t-eyebrow">
        {label}
      </p>
      <ol className="mt-3 grid gap-x-4 sm:grid-cols-2 lg:grid-cols-1">
        {titles.map((title, index) => {
          const current = index === active
          return (
            <li key={title}>
              <a
                href={`#section-${index + 1}`}
                aria-current={current ? 'location' : undefined}
                className={cn(
                  'group flex min-h-11 items-center gap-3 rounded-md py-1 font-semibold transition-colors duration-300 hover:text-accent lg:-mx-2 lg:px-2',
                  current && 'lg:bg-surface-sunken lg:text-accent',
                )}
              >
                <span
                  className={cn(
                    'grid size-7 shrink-0 place-items-center rounded-full border border-accent/50 text-sm text-accent transition-colors duration-300 group-hover:bg-cta group-hover:text-on-cta',
                    current && 'lg:border-cta lg:bg-cta lg:text-on-cta',
                  )}
                >
                  {index + 1}
                </span>
                {title}
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

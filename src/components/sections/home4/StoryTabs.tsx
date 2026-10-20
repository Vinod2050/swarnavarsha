'use client'

import Image from 'next/image'
import { useState } from 'react'

import { cn } from '@/lib/utils'

export type StoryTab = { label: string; text: string; image: string }

/** Home 4 "our story": a ruled list of tabs, the tab's photo, then its heading and text. */
export function StoryTabs({ title, tabs }: { title: string; tabs: StoryTab[] }) {
  const [active, setActive] = useState(0)
  const current = tabs[active]

  return (
    <section aria-labelledby="story4-title" className="bg-surface-raised section-y text-ink">
      <div className="container-site">
        <h2 id="story4-title" className="t-h1">
          {title}
        </h2>

        <div className="mt-8 grid items-center gap-8 lg:grid-cols-[0.7fr_1fr_1.2fr] lg:gap-10">
          <div role="tablist" aria-labelledby="story4-title" className="border-t border-accent/60">
            {tabs.map((tab, index) => (
              <button
                key={tab.label}
                type="button"
                role="tab"
                id={`story4-tab-${index}`}
                aria-selected={index === active}
                aria-controls="story4-panel"
                onClick={() => setActive(index)}
                className={cn(
                  'flex min-h-12 w-full items-center border-b border-accent/60 px-1 text-left t-label transition-colors hover:text-accent',
                  index === active ? 'text-accent' : 'text-ink',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* [CLIENT TO PROVIDE: shop photos] Temporary stock photos, see CREDITS.md */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-surface-sunken">
            <Image
              key={current.image}
              src={current.image}
              alt=""
              fill
              sizes="(min-width: 1024px) 400px, 100vw"
              className="animate-fade object-cover"
            />
          </div>

          <div
            key={active}
            id="story4-panel"
            role="tabpanel"
            aria-labelledby={`story4-tab-${active}`}
            className="animate-rise"
          >
            <h3 className="t-h2">{current.label}</h3>
            <p className="mt-3 t-body-lg text-ink-muted">{current.text}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

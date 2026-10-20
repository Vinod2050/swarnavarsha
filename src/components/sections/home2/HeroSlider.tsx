'use client'

import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode, type TouchEvent } from 'react'

import { cn } from '@/lib/utils'

/** Keep in step with `--animate-slide-progress` in globals.css */
const INTERVAL_MS = 3500
const SWIPE_PX = 48

type Labels = {
  region: string
  previous: string
  next: string
  pause: string
  play: string
  /** One per slide, for example "Slide 2 of 4" */
  slides: string[]
}

const controlClass =
  'grid size-12 place-items-center rounded-full border border-accent/40 text-accent transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-surface'

/**
 * Cross-fading hero slides. The slides are rendered on the server and stacked in one grid
 * cell, so the hero keeps the height of the tallest slide and never shifts the page.
 *
 * Slides advance on their own, one after another. They stop while keyboard focus is inside,
 * when the visitor presses pause, and for visitors who ask for reduced motion.
 */
export function HeroSlider({
  slides,
  labels,
  controlsClassName,
}: {
  slides: ReactNode[]
  labels: Labels
  /** Extra classes for the controls bar, for heroes that must fit tighter screens */
  controlsClassName?: string
}) {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [engaged, setEngaged] = useState(false)
  const touchX = useRef<number | null>(null)
  const count = slides.length
  const running = playing && !engaged

  useEffect(() => {
    if (!running || count < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // Restarts on every slide change, so a manual change gets the full interval too
    const timer = window.setTimeout(() => setIndex((index + 1) % count), INTERVAL_MS)
    return () => window.clearTimeout(timer)
  }, [running, index, count])

  const go = (step: number) => setIndex((current) => (current + step + count) % count)

  const onTouchEnd = (event: TouchEvent) => {
    const start = touchX.current
    touchX.current = null
    if (start === null) return
    const moved = event.changedTouches[0].clientX - start
    if (Math.abs(moved) > SWIPE_PX) go(moved < 0 ? 1 : -1)
  }

  return (
    <div
      role="region"
      aria-label={labels.region}
      // Only keyboard focus holds the slides: a mouse click on a control must not stop them
      onFocusCapture={(event) => setEngaged(event.target.matches(':focus-visible'))}
      onBlurCapture={() => setEngaged(false)}
      onTouchStart={(event) => {
        touchX.current = event.touches[0].clientX
      }}
      onTouchEnd={onTouchEnd}
    >
      <div className="grid">
        {slides.map((slide, slideIndex) => {
          const active = slideIndex === index
          return (
            <div
              // Slides are a fixed list that never reorders
              key={slideIndex}
              role="group"
              aria-label={labels.slides[slideIndex]}
              data-active={active}
              inert={!active}
              className={cn(
                'group col-start-1 row-start-1 transition-opacity duration-700 ease-out',
                active ? 'opacity-100' : 'pointer-events-none opacity-0',
              )}
            >
              {slide}
            </div>
          )
        })}
      </div>

      {count > 1 && (
        <div
          className={cn(
            'relative z-10 container-site -mt-20 flex items-center justify-center gap-3 pb-8 md:-mt-24 md:pb-12 lg:justify-start lg:short:-mt-20 lg:short:pb-8 lg:xshort:-mt-18 lg:xshort:pb-6',
            controlsClassName,
          )}
        >
          {/* One group, so a hero can line it up under its text column (PageHeroSlides) */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label={labels.previous}
              onClick={() => go(-1)}
              className={controlClass}
            >
              <ChevronLeft aria-hidden className="size-5" />
            </button>

            <div className="flex items-center">
              {slides.map((_, slideIndex) => {
                const active = slideIndex === index
                return (
                  <button
                    // Same fixed list as the slides above
                    key={slideIndex}
                    type="button"
                    aria-label={labels.slides[slideIndex]}
                    aria-current={active ? 'true' : undefined}
                    onClick={() => setIndex(slideIndex)}
                    className="grid h-12 place-items-center px-1.5"
                  >
                    <span
                      className={cn(
                        'block h-1.5 overflow-hidden rounded-full bg-accent/30 transition-[width] duration-500',
                        active ? 'w-10' : 'w-3',
                      )}
                    >
                      {active && (
                        <span
                          // Remounts on every slide so the fill starts from empty again
                          key={`${index}-${running}`}
                          className={cn(
                            'block h-full origin-left bg-accent',
                            running && 'animate-slide-progress',
                          )}
                        />
                      )}
                    </span>
                  </button>
                )
              })}
            </div>

            <button
              type="button"
              aria-label={labels.next}
              onClick={() => go(1)}
              className={controlClass}
            >
              <ChevronRight aria-hidden className="size-5" />
            </button>

            <button
              type="button"
              aria-label={playing ? labels.pause : labels.play}
              onClick={() => setPlaying((current) => !current)}
              className={cn(controlClass, 'border-transparent')}
            >
              {playing ? (
                <Pause aria-hidden className="size-4" />
              ) : (
                <Play aria-hidden className="size-4" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

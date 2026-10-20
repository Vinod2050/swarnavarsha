'use client'

import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ComponentProps,
  type KeyboardEvent,
} from 'react'

import { cn } from '@/lib/utils'

type EmblaOptions = Parameters<typeof useEmblaCarousel>[0]

type CarouselContextValue = {
  viewportRef: ReturnType<typeof useEmblaCarousel>[0]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
}

const CarouselContext = createContext<CarouselContextValue | null>(null)

function useCarousel(): CarouselContextValue {
  const context = useContext(CarouselContext)
  if (!context) throw new Error('Carousel parts must be used inside <Carousel>')
  return context
}

/** Embla carousel. `label` is the translated name announced by screen readers. */
export function Carousel({
  label,
  options,
  className,
  children,
  ...props
}: ComponentProps<'div'> & { label: string; options?: EmblaOptions }) {
  const [viewportRef, api] = useEmblaCarousel({ align: 'start', ...options })
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  useEffect(() => {
    if (!api) return
    const update = () => {
      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
    }
    update()
    api.on('select', update)
    api.on('reInit', update)
    return () => {
      api.off('select', update)
      api.off('reInit', update)
    }
  }, [api])

  const scrollPrev = useCallback(() => api?.scrollPrev(), [api])
  const scrollNext = useCallback(() => api?.scrollNext(), [api])

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      scrollPrev()
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      scrollNext()
    }
  }

  return (
    <CarouselContext.Provider
      value={{ viewportRef, scrollPrev, scrollNext, canScrollPrev, canScrollNext }}
    >
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        onKeyDownCapture={onKeyDown}
        className={cn('relative', className)}
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  )
}

export function CarouselContent({ className, ...props }: ComponentProps<'div'>) {
  const { viewportRef } = useCarousel()
  return (
    <div ref={viewportRef} className="overflow-hidden">
      <div className={cn('-ml-6 flex', className)} {...props} />
    </div>
  )
}

export function CarouselItem({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      role="group"
      aria-roledescription="slide"
      className={cn('min-w-0 shrink-0 grow-0 basis-full pl-6', className)}
      {...props}
    />
  )
}

const arrowClass =
  'flex size-12 items-center justify-center rounded-full border-[1.5px] border-accent text-accent transition-colors hover:bg-accent/10 disabled:pointer-events-none disabled:opacity-40'

export function CarouselPrevious({
  label,
  className,
  ...props
}: ComponentProps<'button'> & { label: string }) {
  const { scrollPrev, canScrollPrev } = useCarousel()
  return (
    <button
      type="button"
      aria-label={label}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      className={cn(arrowClass, className)}
      {...props}
    >
      <ChevronLeft aria-hidden className="size-5" />
    </button>
  )
}

export function CarouselNext({
  label,
  className,
  ...props
}: ComponentProps<'button'> & { label: string }) {
  const { scrollNext, canScrollNext } = useCarousel()
  return (
    <button
      type="button"
      aria-label={label}
      disabled={!canScrollNext}
      onClick={scrollNext}
      className={cn(arrowClass, className)}
      {...props}
    >
      <ChevronRight aria-hidden className="size-5" />
    </button>
  )
}

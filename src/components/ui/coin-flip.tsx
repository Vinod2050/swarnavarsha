'use client'

import Image from 'next/image'
import { useEffect, useRef, useState, type AnimationEvent } from 'react'

import { cn } from '@/lib/utils'

// Coins pouring from Lakshmi's blessing hand: position across the stream (%) and start delay
// (s) from the moment the coin settles on Lakshmi. The stream waits 1 s, then runs to the last
// coin (from 3.7 s, falling 0.8 s), which is gone by 4.5 s, before the coin starts turning
// over to the logo at 5 s (`coin-loop` in globals.css)
const POUR = Array.from({ length: 40 }, (_, index) => ({
  left: [25, 0, 50, 10, 40][index % 5] ?? 0,
  delay: 1 + index * 0.07,
}))

/**
 * The gold Lakshmi coin: it pops in, a glint of light crosses it, then it flips over once and
 * lands on its other face, the Suvarnavarsha logo on a plum coin with a gold rim, which then
 * glows softly. `loop`: keeps turning over, 5 s on the Lakshmi face, who pours gold coins from
 * her blessing hand, and about 5 s on the logo each 12 s round (home page About panel).
 * `playOnView`: waits until half the coin is on screen; otherwise it plays at once (page
 * loader). With reduced motion, the logo face shows at once.
 * The coin takes the size of `className`.
 */
export function CoinFlip({
  className,
  playOnView = false,
  loop = false,
  logoSizes = '120px',
  priority = false,
}: {
  className?: string
  playOnView?: boolean
  /** Keep flipping between the coin and the logo, with coins pouring while Lakshmi shows */
  loop?: boolean
  /** `sizes` for the logo on the back face */
  logoSizes?: string
  priority?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [play, setPlay] = useState(!playOnView)
  // Bumped each time the looping coin settles back on Lakshmi, to restart the coin rain
  const [round, setRound] = useState(0)

  useEffect(() => {
    const element = ref.current
    if (!playOnView || !element) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setPlay(true)
          observer.disconnect()
        }
      },
      { threshold: 0.5 },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [playOnView])

  // A new `coin-loop` round starts the moment the coin is back on Lakshmi. Restarting the rain
  // from here keeps it in step with the coin however long the page has been open
  const onIteration = (event: AnimationEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && event.animationName === 'coin-loop') {
      setRound((value) => value + 1)
    }
  }

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn('relative perspective-[800px]', play && 'animate-loader-coin-in', className)}
    >
      <div
        onAnimationIteration={loop ? onIteration : undefined}
        className={cn(
          'relative size-full transform-3d',
          play && (loop ? 'animate-coin-loop' : 'animate-loader-coin-flip'),
          play && 'motion-reduce:rotate-y-180 motion-reduce:animate-none',
        )}
      >
        {/* Front: the Lakshmi coin, with a band of light passing across it */}
        <div className="absolute inset-0 overflow-hidden rounded-full shadow-foil backface-hidden">
          {/* Lakshmi coin supplied by Finixsoft, see public/images/loader/CREDITS.md */}
          <Image
            src="/images/loader/lakshmi-coin-gold.webp"
            alt=""
            width={480}
            height={480}
            priority={priority}
            className="size-full"
          />
          {play && (
            <span className="absolute inset-y-0 -left-1/2 w-1/3 animate-loader-coin-shine bg-linear-to-r from-transparent via-white/60 to-transparent motion-reduce:hidden" />
          )}
        </div>

        {/* Looping: gold coins pour from Lakshmi's blessing hand (the raised open palm, on the
            left). The stream belongs to the Lakshmi face: it turns away with it, so it never
            shows on the logo, and it restarts (`key`) only once the coin is back on Lakshmi */}
        {loop && play && (
          <div
            key={round}
            className="pointer-events-none absolute top-[48%] left-[34%] h-[55%] w-[12%] backface-hidden motion-reduce:hidden"
            style={{ transform: 'translateZ(1px)' }}
          >
            {POUR.map((coin) => (
              <span
                key={coin.delay}
                className="absolute top-0 aspect-square w-3/5 animate-coin-drop rounded-full border border-gold-800 bg-linear-to-br from-gold-200 via-gold-400 to-gold-500 shadow-foil"
                style={{ left: `${coin.left}%`, animationDelay: `${coin.delay}s` }}
              />
            ))}
          </div>
        )}

        {/* Back: the logo struck on a plum coin with a gold rim */}
        <div className="absolute inset-0 grid rotate-y-180 place-items-center rounded-full border-4 border-gold-500 bg-surface-sunken shadow-foil ring-1 ring-accent/60 ring-offset-2 ring-offset-surface backface-hidden">
          <Image
            src="/logo/suvarnavarsha-logo-v2-transparent.png"
            alt=""
            width={1100}
            height={572}
            sizes={logoSizes}
            priority={priority}
            className={cn(
              'h-auto w-[76%]',
              play && (loop ? 'animate-loader-glow' : 'animate-loader-logo-glow'),
            )}
          />
        </div>
      </div>
    </div>
  )
}

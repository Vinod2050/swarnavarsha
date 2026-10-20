import { cn } from '@/lib/utils'

import { CoinFlip } from './coin-flip'

/**
 * A gold Lakshmi coin appears with a glint of light, flips over once like a tossed
 * coin and lands on its other face, the Suvarnavarsha logo, which then glows softly, all inside
 * a slowly turning ring of gold dots. Used while a page loads (`[locale]/loading.tsx`) and over
 * the page when a link takes a moment on a slow network (NavigationLoader).
 * Set it inside a plum (`theme-dark`) block. With reduced motion, the logo face shows at once.
 */
export function BrandLoader({ label, className }: { label: string; className?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn('flex flex-col items-center gap-6 text-accent', className)}
    >
      <div className="relative grid size-48 place-items-center sm:size-56">
        <svg
          aria-hidden
          viewBox="0 0 100 100"
          className="absolute inset-0 size-full animate-loader-ring"
          fill="none"
          stroke="currentColor"
        >
          <circle
            cx="50"
            cy="50"
            r="48"
            strokeWidth="0.8"
            strokeDasharray="0.8 3.2"
            opacity="0.6"
          />
          {/* One bright arc travels round the ring */}
          <circle
            cx="50"
            cy="50"
            r="48"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeDasharray="40 262"
          />
        </svg>

        <CoinFlip priority logoSizes="122px" className="size-36 sm:size-40" />
      </div>
      <span className="sr-only">{label}</span>
    </div>
  )
}

import { useId, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

/** Hairline, diamond, hairline: sits under section titles. Colour follows `text-accent`. */
export function OrnamentDivider({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 120 12"
      className={cn('block h-3 w-[120px] text-accent', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
    >
      <path d="M0 6h44M76 6h44" />
      <path d="M60 1l5 5-5 5-5-5z" fill="currentColor" />
      <circle cx="50" cy="6" r="1" fill="currentColor" stroke="none" />
      <circle cx="70" cy="6" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

/**
 * Double gold ring around an icon, like a struck coin. Inside a `group`, the coin fills with
 * the button colour while the pointer is over the card.
 */
export function Medallion({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-grid size-16 shrink-0 place-items-center rounded-full border border-accent/30 transition-colors duration-500 group-hover:border-accent',
        className,
      )}
    >
      <span className="grid size-[52px] place-items-center rounded-full border border-accent/60 bg-surface-sunken text-accent transition-colors duration-500 group-hover:bg-cta group-hover:text-on-cta [&_svg]:size-7 [&_svg]:transition-transform [&_svg]:duration-500 group-hover:[&_svg]:scale-110">
        {children}
      </span>
    </span>
  )
}

/** Faint peacock-feather scallops for plum sections. Parent must be `relative`. */
export function ScallopPattern({ className }: { className?: string }) {
  const id = useId()

  return (
    <svg
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 size-full text-line', className)}
    >
      <defs>
        <pattern id={id} width="48" height="24" patternUnits="userSpaceOnUse">
          <path
            d="M0 24a24 24 0 0 1 48 0M8 24a16 16 0 0 1 32 0M-24 12a24 24 0 0 1 48 0M24 12a24 24 0 0 1 48 0"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}

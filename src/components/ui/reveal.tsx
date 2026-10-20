'use client'

import { LazyMotion, MotionConfig, domAnimation, m } from 'motion/react'
import type { ReactNode } from 'react'

const HIDDEN = {
  up: { opacity: 0, y: 24 },
  left: { opacity: 0, x: -32 },
  right: { opacity: 0, x: 32 },
  scale: { opacity: 0, scale: 0.94 },
} as const

/**
 * Light entrance when a block scrolls into view: rising (default), sliding in from a side,
 * or growing slightly. Fade only for reduced-motion users.
 */
export function Reveal({
  children,
  delay = 0,
  from = 'up',
  className,
}: {
  children: ReactNode
  delay?: number
  from?: keyof typeof HIDDEN
  className?: string
}) {
  // The server cannot know the visitor's motion preference, so the markup must be the same
  // for everyone: `reducedMotion="user"` drops the movement and keeps only the fade.
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        <m.div
          className={className}
          initial={HIDDEN[from]}
          whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
        >
          {children}
        </m.div>
      </LazyMotion>
    </MotionConfig>
  )
}

/**
 * Lets its content slide up from below the box's bottom edge when the box scrolls into
 * view, the way the hero models arrive. The box itself is what is watched, because the
 * content starts hidden under its edge. Fade only for reduced-motion users.
 */
export function RiseInView({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        <m.div
          className={className}
          initial="hidden"
          whileInView="shown"
          viewport={{ once: true, margin: '-80px' }}
        >
          <m.div
            className="absolute inset-0"
            variants={{
              hidden: { opacity: 0, y: '100%' },
              shown: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.45, 0, 0.2, 1] } },
            }}
          >
            {children}
          </m.div>
        </m.div>
      </LazyMotion>
    </MotionConfig>
  )
}

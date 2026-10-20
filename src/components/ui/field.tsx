import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

import { controlClass } from './input'

export function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
  return <textarea className={cn(controlClass, 'min-h-28 resize-y', className)} {...props} />
}

/**
 * Native select: on phones it opens the system picker, which is the easiest control
 * for our older, mobile-first audience. The Radix version lives in `select.tsx`.
 */
export function NativeSelect({ className, ...props }: ComponentProps<'select'>) {
  return <select className={cn(controlClass, 'appearance-auto', className)} {...props} />
}

export function FieldError({ id, children }: { id: string; children?: string }) {
  if (!children) return null
  return (
    <p id={id} role="alert" className="mt-1.5 text-sm text-danger">
      {children}
    </p>
  )
}

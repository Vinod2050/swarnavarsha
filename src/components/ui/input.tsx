import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

/** Shared look of text inputs, textareas and selects. */
export const controlClass =
  'w-full min-h-12 rounded-sm border border-line-strong bg-surface-raised px-3 py-2 text-base text-ink placeholder:text-ink-muted aria-[invalid=true]:border-danger'

export function Input({ className, ...props }: ComponentProps<'input'>) {
  return <input className={cn(controlClass, className)} {...props} />
}

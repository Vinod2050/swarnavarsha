'use client'

import * as DialogPrimitive from '@radix-ui/react-dialog'
import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

export const Sheet = DialogPrimitive.Root
export const SheetTrigger = DialogPrimitive.Trigger
export const SheetClose = DialogPrimitive.Close
export const SheetTitle = DialogPrimitive.Title
export const SheetDescription = DialogPrimitive.Description

/**
 * Panel that slides in from the right over a dimmed page: full width on phones, a 420px
 * drawer from tablets up. Used for the mobile menu.
 */
export function SheetContent({
  className,
  children,
  ...props
}: ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-plum-950/75 data-[state=closed]:animate-overlay-out data-[state=open]:animate-dialog-in" />
      <DialogPrimitive.Content
        className={cn(
          'fixed inset-y-0 right-0 z-50 flex w-full flex-col shadow-foil data-[state=closed]:animate-sheet-out data-[state=open]:animate-sheet-in sm:max-w-[420px] sm:border-l sm:border-line',
          className,
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}

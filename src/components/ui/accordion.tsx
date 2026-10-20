'use client'

import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { Plus } from 'lucide-react'
import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

export const Accordion = AccordionPrimitive.Root

export function AccordionItem({
  className,
  ...props
}: ComponentProps<typeof AccordionPrimitive.Item>) {
  return <AccordionPrimitive.Item className={cn('border-b border-line', className)} {...props} />
}

export function AccordionTrigger({
  className,
  children,
  ...props
}: ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          'group flex min-h-14 flex-1 items-center justify-between gap-4 py-4 text-left text-[17px] leading-7 font-semibold text-ink transition-colors duration-300 hover:text-accent max-sm:min-h-12 max-sm:py-2.5 md:short:min-h-12 md:short:py-2.5',
          className,
        )}
        {...props}
      >
        {children}
        {/* The ring fills with gold under the pointer; the plus turns into a cross when open */}
        <span
          aria-hidden
          className="grid size-8 shrink-0 place-items-center rounded-full border border-accent/40 text-accent transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-surface"
        >
          <Plus className="size-4 transition-transform duration-300 group-data-[state=open]:rotate-45" />
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

export function AccordionContent({
  className,
  children,
  ...props
}: ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      {...props}
    >
      <div className={cn('measure pb-5 text-ink-muted', className)}>{children}</div>
    </AccordionPrimitive.Content>
  )
}

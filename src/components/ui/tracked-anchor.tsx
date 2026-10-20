'use client'

import type { ComponentProps } from 'react'

import { track, type AnalyticsEvent } from '@/lib/analytics'

type Props = ComponentProps<'a'> & {
  event: AnalyticsEvent
  /** Where on the page the link sits, for example "header" or "hero" */
  location: string
}

/** A plain link that also reports a GA4 event (call_click / whatsapp_click). */
export function TrackedAnchor({ event, location, onClick, ...props }: Props) {
  return (
    <a
      {...props}
      onClick={(e) => {
        track(event, { location })
        onClick?.(e)
      }}
    />
  )
}

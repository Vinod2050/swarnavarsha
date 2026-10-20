export type AnalyticsEvent = 'call_click' | 'whatsapp_click' | 'enquiry_submit'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

/** Sends a GA4 event. Does nothing when analytics is not configured. */
export function track(event: AnalyticsEvent, params: Record<string, string> = {}): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('event', event, params)
}

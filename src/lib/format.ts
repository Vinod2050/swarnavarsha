import type { Locale } from '@/i18n/routing'

const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

/** ₹1,23,456 — Indian digit grouping, Western digits in both languages. */
export function formatINR(value: number): string {
  return inr.format(value)
}

/** "10:30 AM, 8 Oct 2026" in India time; month name follows the page language. */
export function formatDateTime(iso: string, locale: Locale): string {
  const date = new Date(iso)
  const tag = locale === 'mr' ? 'mr-IN-u-nu-latn' : 'en-IN'
  const time = new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
  })
    .format(date)
    .toUpperCase()
  const day = new Intl.DateTimeFormat(tag, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  }).format(date)
  return `${time}, ${day}`
}

import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'mr'],
  defaultLocale: 'en',
  // English at /sell-gold, Marathi at /mr/sell-gold
  localePrefix: 'as-needed',
  // The visitor chooses the language with the switch; never redirect by browser language.
  localeDetection: false,
})

export type Locale = (typeof routing.locales)[number]

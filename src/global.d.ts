import type { routing } from '@/i18n/routing'

import type messages from '../messages/en.json'

// Type-checks every translation key and the locale against the English messages file
declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number]
    Messages: typeof messages
  }
}

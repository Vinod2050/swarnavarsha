import type { MetadataRoute } from 'next'

import { routing } from '@/i18n/routing'
import { PAGE_PATHS, languageAlternates, localeUrl } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGE_PATHS.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: localeUrl(locale, path),
      changeFrequency: path === '' ? ('daily' as const) : ('monthly' as const),
      priority: path === '' ? 1 : 0.7,
      alternates: { languages: languageAlternates(path) },
    })),
  )
}

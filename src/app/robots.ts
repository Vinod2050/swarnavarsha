import type { MetadataRoute } from 'next'

import { AI_TRAINING_BOTS, INDEXING_ENABLED, SEARCH_BOTS, SITE_URL } from '@/lib/seo'

// Admin panel and JSON endpoints stay out of search; uploaded photos under /api/media/file
// stay crawlable so Google Images and link previews can fetch them.
const PRIVATE = ['/admin', '/api/']
const PUBLIC_FILES = ['/', '/api/media/file/']

export default function robots(): MetadataRoute.Robots {
  // Staging or preview server: nothing may be crawled (robots.txt is not security; /admin
  // keeps its own sign-in)
  if (!INDEXING_ENABLED) return { rules: { userAgent: '*', disallow: '/' } }

  const blockTraining = process.env.ROBOTS_BLOCK_AI_TRAINING === 'true'
  const allowed = blockTraining ? SEARCH_BOTS : [...SEARCH_BOTS, ...AI_TRAINING_BOTS]

  return {
    rules: [
      { userAgent: '*', allow: PUBLIC_FILES, disallow: PRIVATE },
      // Named so the intent is explicit to each crawler; same rules as everyone else
      { userAgent: allowed, allow: PUBLIC_FILES, disallow: PRIVATE },
      ...(blockTraining ? [{ userAgent: AI_TRAINING_BOTS, disallow: '/' }] : []),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}

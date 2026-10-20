import { NextResponse, type NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware'

import { routing } from './i18n/routing'
import { PAGE_PATHS } from './lib/seo'

const handleI18n = createMiddleware(routing)

const KNOWN_PATHS: ReadonlySet<string> = new Set(PAGE_PATHS)
const LOCALE_PREFIX = new RegExp(`^/(${routing.locales.join('|')})(?=/|$)`)

/** True for the site's pages, with or without a locale prefix. */
function isKnownPage(pathname: string): boolean {
  const path = pathname.replace(LOCALE_PREFIX, '').replace(/\/$/, '')
  return KNOWN_PATHS.has(path)
}

export default function proxy(request: NextRequest) {
  const response = handleI18n(request)

  // Unknown address: the translated not-found page still renders, but with a real 404
  // status. Without this the loading screen (loading.tsx) starts the response before the
  // page calls notFound(), so it would go out as 200 (a "soft 404" for search engines).
  // A new page must be added to PAGE_PATHS in src/lib/seo.ts (the sitemap uses it too).
  // Redirects (for example /en/... to /...) are left as they are
  if (response.headers.has('location') || isKnownPage(request.nextUrl.pathname)) return response
  const target = response.headers.get('x-middleware-rewrite') ?? request.url
  return NextResponse.rewrite(new URL(target), { status: 404, headers: response.headers })
}

export const config = {
  // Skip Payload admin, API routes, Next.js internals and files with an extension
  matcher: ['/((?!api|admin|_next|_vercel|.*\\..*).*)'],
}

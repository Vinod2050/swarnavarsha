import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const isDev = process.env.NODE_ENV !== 'production'

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://www.googletagmanager.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://www.google-analytics.com https://www.googletagmanager.com",
  "font-src 'self' data:",
  `connect-src 'self'${isDev ? ' ws:' : ''} https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com`,
  'frame-src https://www.google.com https://maps.google.com',
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
]

const nextConfig: NextConfig = {
  // NEXT_OUTPUT=standalone builds the self-contained server.js used on GoDaddy
  // (.github/workflows/build-godaddy.yml, docs/deploy-godaddy.md).
  output: process.env.NEXT_OUTPUT === 'standalone' ? 'standalone' : undefined,
  // File tracing copies sharp's .node file but not the libvips libraries beside it (pnpm),
  // so image resizing fails in the standalone build without this
  outputFileTracingIncludes: {
    '/**': ['./node_modules/.pnpm/@img+sharp-*/node_modules/@img/**/*'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    localPatterns: [
      { pathname: '/api/media/file/**' },
      { pathname: '/logo/**' },
      { pathname: '/images/**' },
    ],
  },
  async headers() {
    // The panel and the API must never be indexed by search engines. Uploaded photos
    // (/api/media/file) stay indexable for Google Images and link previews.
    const noIndex = [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }]
    // SITE_INDEXING=off (staging / preview servers): nothing on this deployment is indexed
    if (process.env.SITE_INDEXING === 'off') {
      return [{ source: '/(.*)', headers: [...securityHeaders, ...noIndex] }]
    }
    return [
      { source: '/(.*)', headers: securityHeaders },
      { source: '/admin/:path*', headers: noIndex },
      { source: '/api/:path((?!media/file/).*)', headers: noIndex },
    ]
  },
  async rewrites() {
    // IndexNow key file at /<INDEXNOW_KEY>.txt (see src/app/api/indexnow-key/route.ts)
    const key = process.env.INDEXNOW_KEY
    return key && /^[a-zA-Z0-9-]{8,128}$/.test(key)
      ? [{ source: `/${key}.txt`, destination: '/api/indexnow-key' }]
      : []
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

export default withPayload(withNextIntl(nextConfig), { devBundleServerPackages: false })

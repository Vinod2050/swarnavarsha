import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { AuditLogs } from './collections/AuditLogs'
import { Enquiries } from './collections/Enquiries'
import { Faqs } from './collections/Faqs'
import { Media } from './collections/Media'
import { Products } from './collections/Products'
import { Rates } from './collections/Rates'
import { Services } from './collections/Services'
import { Testimonials } from './collections/Testimonials'
import { Users } from './collections/Users'
import { FeedbackVideos, Videos } from './collections/Videos'
import { Navigation } from './globals/Navigation'
import { Offer } from './globals/Offer'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const isProduction = process.env.NODE_ENV === 'production'
const secret = process.env.PAYLOAD_SECRET || ''

if (isProduction && process.env.DATABASE_URI && secret.length < 32) {
  throw new Error('PAYLOAD_SECRET must be at least 32 characters. See .env.example.')
}

// In production the panel and API accept signed-in requests only from the site's own address
const siteOrigins =
  isProduction && process.env.NEXT_PUBLIC_SITE_URL
    ? [new URL(process.env.NEXT_PUBLIC_SITE_URL).origin]
    : []

/**
 * Without DATABASE_URI the admin panel cannot start and the public site reads
 * src/seed/data.ts. Set DATABASE_URI in .env to bring the CMS online (steps in .env.example).
 *
 * Decision D-08: never add collections or fields for investment plans, deposits,
 * returns, lucky draws or coupons.
 */
export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: { titleSuffix: ' · Suvarnavarsha Gold', icons: [{ rel: 'icon', url: '/icon.png' }] },
    components: {
      graphics: {
        Logo: '/components/admin/Logo#Logo',
        Icon: '/components/admin/Icon#Icon',
      },
      providers: ['/components/admin/Fonts#Fonts'],
      // Logo and role at the top of the side menu
      beforeNavLinks: ['/components/admin/NavBrand#NavBrand'],
      beforeDashboard: ['/components/admin/DashboardIntro#DashboardIntro'],
      // "Log out" at the top right of every page
      actions: ['/components/admin/LogoutButton#LogoutButton'],
    },
  },
  collections: [
    Rates,
    Enquiries,
    Videos,
    FeedbackVideos,
    Products,
    Services,
    Faqs,
    Testimonials,
    Media,
    Users,
    AuditLogs,
  ],
  globals: [SiteSettings, Offer, Navigation],
  // The sign-in box accepts a username or an email, but staff are given usernames.
  // Forgot password sends a request to the super admin, not an email (collections/Users.ts).
  i18n: {
    translations: {
      en: {
        authentication: {
          emailOrUsername: 'Username',
          forgotPasswordUsernameInstructions:
            'Enter your username and send a request. The super admin will set a new password for you, or unlock your account.',
          emailSent: 'Request sent',
          checkYourEmailForPasswordReset:
            'The super admin has your request and will give you a new password or unlock your account. Please contact them directly if it is urgent.',
          resend: 'Send again',
        },
        error: {
          userLocked:
            'This account is locked after 5 wrong passwords. Use "Forgot password?" to ask the super admin to unlock it.',
        },
        // "Submit" is the button of the forgot-password form and nothing else
        general: { submit: 'Send request' },
      },
    },
  },
  localization: {
    locales: [
      { label: 'English', code: 'en' },
      { label: 'मराठी', code: 'mr' },
    ],
    defaultLocale: 'en',
    fallback: false,
  },
  editor: lexicalEditor(),
  secret,
  cors: siteOrigins,
  csrf: siteOrigins,
  // The site reads content through the Local API, so the GraphQL endpoint stays off
  graphQL: { disable: true },
  upload: {
    // Sized for videos (collections/Videos.ts); images are capped lower in collections/Media.ts
    limits: { fileSize: 100 * 1024 * 1024 },
    abortOnLimit: true,
  },
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // SQLite file, e.g. DATABASE_URI=file:./data/suvarnavarsha.db (D-03, changed 2026-10-20 for
  // GoDaddy shared hosting, which has no PostgreSQL). Keep the file outside public_html.
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [],
})

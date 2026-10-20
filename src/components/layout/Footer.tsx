import {
  ArrowUp,
  ArrowUpRight,
  ChevronRight,
  Clock,
  MapPin,
  Phone,
  ShieldAlert,
} from 'lucide-react'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import type { ReactNode } from 'react'

import { CtaButtons } from '@/components/sections/CtaButtons'
import { TrackedAnchor } from '@/components/ui/tracked-anchor'
import { Link } from '@/i18n/navigation'
import type { Service, SiteSettings } from '@/lib/content'

// Company pages; the service pages, the services overview and the store are in the
// Services column, so both columns are the same length
const QUICK_LINKS = [
  { key: 'home', href: '/' },
  { key: 'about', href: '/about' },
  { key: 'howItWorks', href: '/how-it-works' },
  { key: 'faq', href: '/faq' },
  { key: 'contact', href: '/contact' },
] as const

const MORE_SERVICE_LINKS = [
  { key: 'allServices', href: '/services' },
  { key: 'store', href: '/store' },
] as const

const linkClass = 'inline-flex min-h-11 items-center text-ink-muted hover:text-accent'

// Column links: a small gold arrow that nudges forward under the pointer
const navLinkClass =
  'group inline-flex min-h-11 items-center gap-2 text-ink-muted transition-colors hover:text-accent md:min-h-9'

function NavArrow() {
  return (
    <ChevronRight
      aria-hidden
      className="size-4 shrink-0 text-accent/60 transition-transform group-hover:translate-x-1 group-hover:text-accent"
    />
  )
}

/** Column heading with a short gold rule under it. */
function ColumnTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="t-eyebrow after:mt-3 after:block after:h-px after:w-10 after:bg-accent/60">
      {children}
    </h2>
  )
}

/** Gold-ringed circle behind each contact icon. */
function IconRing({ children }: { children: ReactNode }) {
  return (
    <span className="grid size-10 shrink-0 place-items-center rounded-full border border-accent/40 text-accent [&_svg]:size-5">
      {children}
    </span>
  )
}

export async function Footer({
  settings,
  services,
}: {
  settings: SiteSettings
  services: Service[]
}) {
  const [t, tn, tc] = await Promise.all([
    getTranslations('footer'),
    getTranslations('nav'),
    getTranslations('common'),
  ])

  return (
    <footer className="theme-dark theme-deep bg-surface text-ink">
      <div aria-hidden className="foil-edge" />

      {/* Phones: the brand and contact blocks span both columns, the two link lists sit side by side */}
      <div className="container-site grid grid-cols-2 gap-x-6 gap-y-10 py-12 md:gap-x-10 md:py-16 lg:grid-cols-[1.35fr_1.15fr_1fr_1.4fr] lg:short:py-10 lg:xshort:gap-8 lg:xshort:py-8">
        <div className="col-span-2 md:col-span-1">
          <Link href="/" className="inline-block rounded-md" aria-label={settings.name}>
            <Image
              src="/logo/suvarnavarsha-logo-v2-transparent.png"
              alt={settings.name}
              width={215}
              height={112}
              className="h-28 w-auto lg:short:h-20"
            />
          </Link>
          <p className="mt-4 max-w-xs text-ink-muted">{t('about')}</p>
          <CtaButtons
            settings={settings}
            location="footer"
            className="mt-6 *:px-4 *:whitespace-nowrap lg:max-xl:flex-col lg:max-xl:items-start"
          />
        </div>

        <nav aria-label={t('quickLinks')}>
          <ColumnTitle>{t('quickLinks')}</ColumnTitle>
          <ul className="mt-4">
            {QUICK_LINKS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={navLinkClass}>
                  <NavArrow />
                  {tn(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={t('services')}>
          <ColumnTitle>{t('services')}</ColumnTitle>
          <ul className="mt-4">
            {services.map((service) => (
              <li key={service.slug}>
                <Link href={`/${service.slug}`} className={navLinkClass}>
                  <NavArrow />
                  {service.title}
                </Link>
              </li>
            ))}
            {MORE_SERVICE_LINKS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={navLinkClass}>
                  <NavArrow />
                  {tn(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="col-span-2 md:col-span-1">
          <ColumnTitle>{t('contact')}</ColumnTitle>
          <ul className="mt-5 space-y-4 text-ink-muted">
            <li className="flex gap-4">
              <IconRing>
                <MapPin aria-hidden strokeWidth={1.5} />
              </IconRing>
              <span>
                {settings.address}
                <a
                  href={settings.mapLinkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-2 flex min-h-9 w-fit items-center gap-1.5 font-semibold text-accent underline-offset-4 hover:underline"
                >
                  {tc('directions')}
                  <ArrowUpRight
                    aria-hidden
                    className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              </span>
            </li>
            <li className="flex items-center gap-4">
              <IconRing>
                <Phone aria-hidden strokeWidth={1.5} />
              </IconRing>
              <span className="flex flex-col">
                {settings.phones.map((phone) => (
                  <TrackedAnchor
                    key={phone.tel}
                    href={`tel:${phone.tel}`}
                    event="call_click"
                    location="footer"
                    className="inline-flex min-h-8 items-center font-semibold text-ink hover:text-accent"
                  >
                    {phone.display}
                  </TrackedAnchor>
                ))}
              </span>
            </li>
            <li className="flex items-center gap-4">
              <IconRing>
                <Clock aria-hidden strokeWidth={1.5} />
              </IconRing>
              <span>{settings.openingHours ?? tc('hoursPlaceholder')}</span>
            </li>
          </ul>
          {settings.social.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2">
              {settings.social.map((item) => (
                <li key={item.url}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center rounded-full border border-accent/40 px-4 t-label text-ink-muted transition-colors hover:border-accent hover:text-accent"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Legal notice on the gold the shop accepts and who may sell (client's wording) */}
      <div className="container-site pb-8 lg:short:pb-6">
        <aside
          aria-labelledby="legal-notice-title"
          className="flex gap-4 rounded-lg border border-l-2 border-accent/30 border-l-accent bg-plum-950/40 p-5 md:p-6"
        >
          {/* Phones: the text gets the full width */}
          <span className="max-sm:hidden">
            <IconRing>
              <ShieldAlert aria-hidden strokeWidth={1.5} />
            </IconRing>
          </span>
          <div>
            <h2 id="legal-notice-title" className="t-label text-accent">
              {t('legalTitle')}
            </h2>
            <p className="mt-2 text-sm leading-6 text-ink-muted">{t('legalText')}</p>
          </div>
        </aside>
      </div>

      <div className="border-t border-line bg-plum-950/40">
        <div className="container-site flex flex-col gap-3 py-5 text-sm text-ink-muted lg:flex-row lg:items-center lg:justify-between lg:max-2xl:pr-24">
          {/* The legal name already ends in a full stop (Pvt. Ltd.) */}
          <p>
            © {new Date().getFullYear()} {settings.legalName} {t('rights')}
          </p>
          <ul className="flex flex-wrap items-center gap-x-5 sm:gap-x-0 sm:divide-x sm:divide-line sm:*:px-5 sm:*:first:pl-0 sm:*:last:pr-0">
            <li>
              <Link href="/privacy-policy" className={linkClass}>
                {tn('privacy')}
              </Link>
            </li>
            <li>
              <Link href="/terms" className={linkClass}>
                {tn('terms')}
              </Link>
            </li>
            <li>
              <a href="#main" className={`group gap-1.5 ${linkClass}`}>
                {t('backToTop')}
                <ArrowUp
                  aria-hidden
                  className="size-4 text-accent transition-transform group-hover:-translate-y-0.5"
                />
              </a>
            </li>
          </ul>
        </div>
        {/* Room for the floating Call / WhatsApp buttons on phones */}
        <div aria-hidden className="h-20 md:hidden" />
      </div>
    </footer>
  )
}

import {
  ArrowRight,
  CircleAlert,
  CircleCheck,
  CircleHelp,
  Clapperboard,
  Coins,
  Download,
  ExternalLink,
  History,
  Image as ImageIcon,
  KeyRound,
  ListTree,
  LogIn,
  MessageSquareQuote,
  Pencil,
  PhoneIncoming,
  Plus,
  Settings,
  Sparkles,
  Store,
  Tag,
  Trash2,
  UserCog,
  UserPlus,
  Video,
  type LucideIcon,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { ServerProps } from 'payload'
import type { ReactNode } from 'react'

const day = new Intl.DateTimeFormat('en-IN', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Asia/Kolkata',
})

const shortDay = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'Asia/Kolkata',
})

const moment = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'short',
  hour: 'numeric',
  minute: '2-digit',
  timeZone: 'Asia/Kolkata',
})

const ACTION_LABEL: Record<string, string> = {
  login: 'Signed in',
  create: 'Created',
  update: 'Updated',
  delete: 'Deleted',
  export: 'Exported',
  request: 'Requested',
}

const ACTION_ICON: Record<string, LucideIcon> = {
  login: LogIn,
  create: Plus,
  update: Pencil,
  delete: Trash2,
  export: Download,
  request: KeyRound,
}

type Shortcut = { label: string; note: string; href: string; icon: LucideIcon; meta?: string }

const rupees = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

/** yyyy-mm-dd in India time, to compare with a rate's date */
function indiaDate(date: Date): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(date)
}

const plural = (count: number, one: string, many: string) => (count === 1 ? one : many)

/** One task: icon, a done / to-do badge, the figure that matters, a line of detail and a button. */
function TaskCard({
  icon: Icon,
  title,
  due,
  badge,
  figure,
  detail,
  href,
  action,
  manage,
}: {
  icon: LucideIcon
  title: string
  /** true puts a gold edge on the card: something is waiting */
  due: boolean
  badge: string
  figure: string
  detail: ReactNode
  href: string
  action: string
  /** Second, quieter link: the list where entries are edited or deleted */
  manage?: { href: string; label: string }
}) {
  const StatusIcon = due ? CircleAlert : CircleCheck
  return (
    <article className={['sg-task', due && 'sg-task--due'].filter(Boolean).join(' ')}>
      <div className="sg-task__top">
        <span className="sg-task__icon" aria-hidden>
          <Icon size={22} strokeWidth={1.6} />
        </span>
        <span className="sg-task__badge">
          <StatusIcon size={14} strokeWidth={2} aria-hidden />
          {badge}
        </span>
      </div>
      <h2 className="sg-task__title">{title}</h2>
      <p className="sg-task__figure">{figure}</p>
      <p className="sg-task__detail">{detail}</p>
      <div className="sg-task__actions">
        <Link className="sg-dash__button" href={href}>
          {action}
          <ArrowRight size={18} strokeWidth={2} aria-hidden />
        </Link>
        {manage && (
          <Link className="sg-task__manage" href={manage.href}>
            {manage.label}
          </Link>
        )}
      </div>
    </article>
  )
}

/**
 * The admin dashboard, sized for a phone. An admin sees the daily work they are allowed to
 * do: today's rate, the two kinds of video and the store products. The super admin also sees the day's figures,
 * accounts, recent activity and a way into every part of the panel.
 */
export async function DashboardIntro({ payload, user }: ServerProps) {
  const adminRoute = payload.config.routes.admin
  const isSuper = user?.role === 'superadmin'

  /** How many entries a part of the panel holds, shown on its tile */
  const count = (
    collection: 'daily-rates' | 'enquiries' | 'faqs' | 'media' | 'services' | 'testimonials',
  ) => (isSuper ? payload.count({ collection }) : null)

  const [
    latest,
    adverts,
    feedback,
    feedbackWaiting,
    products,
    admins,
    activity,
    requests,
    rateCount,
    enquiryCount,
    faqCount,
    testimonialCount,
    serviceCount,
    photoCount,
  ] = await Promise.all([
    payload.find({
      collection: 'daily-rates',
      where: { type: { equals: 'buying' } },
      sort: '-rateDate',
      limit: 1,
      depth: 0,
    }),
    payload.count({ collection: 'videos', where: { active: { equals: true } } }),
    payload.count({
      collection: 'feedback-videos',
      where: { and: [{ active: { equals: true } }, { consentConfirmed: { equals: true } }] },
    }),
    payload.count({
      collection: 'feedback-videos',
      where: { consentConfirmed: { not_equals: true } },
    }),
    payload.count({ collection: 'products', where: { active: { equals: true } } }),
    isSuper
      ? payload.find({
          collection: 'users',
          where: { role: { equals: 'admin' } },
          sort: 'name',
          limit: 6,
          depth: 0,
          // lockUntil is a hidden field
          showHiddenFields: true,
        })
      : null,
    isSuper
      ? payload.find({ collection: 'audit-logs', sort: '-createdAt', limit: 6, depth: 0 })
      : null,
    // Sent from the "Forgot password?" page (collections/Users.ts)
    isSuper
      ? payload.find({
          collection: 'users',
          where: { accessRequest: { in: ['reset', 'unlock'] } },
          sort: 'accessRequestedAt',
          limit: 20,
          depth: 0,
        })
      : null,
    count('daily-rates'),
    count('enquiries'),
    count('faqs'),
    count('testimonials'),
    count('services'),
    count('media'),
  ])

  const rate = latest.docs[0]
  const rateIsToday = rate ? indiaDate(new Date(rate.rateDate)) === indiaDate(new Date()) : false
  const noConsent = feedbackWaiting.totalDocs
  const accountRequests = requests?.docs ?? []
  const todo = [!rateIsToday, noConsent > 0, accountRequests.length > 0].filter(Boolean).length

  const adminCount = admins?.totalDocs ?? 0
  const entries = (found: { totalDocs: number } | null, one = 'entry', many = 'entries') =>
    found ? `${found.totalDocs} ${plural(found.totalDocs, one, many)}` : undefined

  /** Every part of the panel, in the same groups as the side menu */
  const sections: { title: string; items: Shortcut[] }[] = [
    {
      title: 'Daily work',
      items: [
        {
          label: 'Rates',
          note: 'Enter, correct or delete daily rates',
          href: `${adminRoute}/collections/daily-rates`,
          icon: Coins,
          meta: entries(rateCount),
        },
        {
          label: 'Advertisement videos',
          note: 'Add, hide, reorder or delete',
          href: `${adminRoute}/collections/videos`,
          icon: Clapperboard,
          meta: `${adverts.totalDocs} live`,
        },
        {
          label: 'Customer feedback videos',
          note: 'Add, tick consent, hide or delete',
          href: `${adminRoute}/collections/feedback-videos`,
          icon: Video,
          meta: `${feedback.totalDocs} live`,
        },
        {
          label: 'Store products',
          note: 'Add coins and bars with photo, description and price',
          href: `${adminRoute}/collections/products`,
          icon: Store,
          meta: `${products.totalDocs} live`,
        },
        {
          label: 'Enquiries',
          note: 'Earlier call-back requests. The form is off the website',
          href: `${adminRoute}/collections/enquiries`,
          icon: PhoneIncoming,
          meta: entries(enquiryCount),
        },
      ],
    },
    {
      title: 'Website content',
      items: [
        {
          label: 'Services',
          note: 'Text of the three service pages',
          href: `${adminRoute}/collections/services`,
          icon: Sparkles,
          meta: entries(serviceCount),
        },
        {
          label: 'FAQs',
          note: 'Questions and answers on the site',
          href: `${adminRoute}/collections/faqs`,
          icon: CircleHelp,
          meta: entries(faqCount),
        },
        {
          label: 'Testimonials',
          note: 'Customer reviews, with consent',
          href: `${adminRoute}/collections/testimonials`,
          icon: MessageSquareQuote,
          meta: entries(testimonialCount),
        },
        {
          label: 'Photos',
          note: 'Image library and cover images',
          href: `${adminRoute}/collections/media`,
          icon: ImageIcon,
          meta: entries(photoCount, 'photo', 'photos'),
        },
        {
          label: 'Saturday offer',
          note: 'Switch the offer band on or off',
          href: `${adminRoute}/globals/offer`,
          icon: Tag,
        },
      ],
    },
    {
      title: 'Settings and accounts',
      items: [
        {
          label: 'Admin accounts',
          note: 'Add, block, unlock, reset password, delete',
          href: `${adminRoute}/collections/users`,
          icon: UserCog,
          meta: `${adminCount} ${plural(adminCount, 'admin', 'admins')}`,
        },
        {
          label: 'Site settings',
          note: 'Phones, address, hours, map',
          href: `${adminRoute}/globals/site-settings`,
          icon: Settings,
        },
        {
          label: 'Website menu',
          note: 'Order and labels of the main menu',
          href: `${adminRoute}/globals/navigation`,
          icon: ListTree,
        },
        {
          label: 'Activity log',
          note: 'Who did what, and when',
          href: `${adminRoute}/collections/audit-logs`,
          icon: History,
        },
      ],
    },
  ]

  const rateHref =
    rate && rateIsToday
      ? `${adminRoute}/collections/daily-rates/${rate.id}`
      : `${adminRoute}/collections/daily-rates/create`
  const rateAction = rate && rateIsToday ? 'Correct today’s rate' : 'Enter today’s rate'

  /** The day at a glance; each figure opens the place where it is managed */
  const stats: { label: string; value: string; href: string; icon: LucideIcon; due?: boolean }[] = [
    {
      label: 'Today’s 24K rate',
      value: rate && rateIsToday ? rupees.format(rate.gold24k999) : 'Not entered',
      href: rateHref,
      icon: Coins,
      due: !rateIsToday,
    },
    {
      label: 'Videos on the website',
      value: String(adverts.totalDocs + feedback.totalDocs),
      href: `${adminRoute}/collections/videos`,
      icon: Clapperboard,
    },
    {
      label: 'Admin accounts',
      value: String(adminCount),
      href: `${adminRoute}/collections/users`,
      icon: UserCog,
    },
    {
      label: 'Requests from admins',
      value: accountRequests.length === 0 ? 'None' : `${accountRequests.length} waiting`,
      href: accountRequests.length === 0 ? `${adminRoute}/collections/users` : '#sg-requests-title',
      icon: KeyRound,
      due: accountRequests.length > 0,
    },
  ]

  const now = new Date()
  /** Blocked by the super admin, locked by wrong passwords, or fine */
  const accountState = (account: { blocked?: boolean | null; lockUntil?: string | null }) =>
    account.blocked
      ? { label: 'Blocked', tone: 'bad' }
      : account.lockUntil && new Date(account.lockUntil) > now
        ? { label: 'Locked', tone: 'warn' }
        : { label: 'Active', tone: 'ok' }

  return (
    <section className="sg-dash" aria-label="Dashboard">
      <header className="sg-dash__banner">
        <div className="sg-dash__intro">
          <Image
            src="/logo/suvarnavarsha-logo-v2-transparent.png"
            alt="Suvarnavarsha Gold"
            width={1100}
            height={572}
            sizes="(max-width: 640px) 150px, 170px"
            priority
            className="sg-dash__logo"
          />
          <div className="sg-dash__welcome">
            <p className="sg-dash__eyebrow">{day.format(new Date())}</p>
            <h1 className="sg-dash__hello">Welcome{user?.name ? `, ${user.name}` : ''}</h1>
            <p className="sg-dash__summary">
              {todo === 0
                ? 'Everything is up to date.'
                : `${todo} ${plural(todo, 'thing needs', 'things need')} your attention today.`}
            </p>
          </div>
        </div>
        <div className="sg-dash__side">
          <span className="sg-dash__role">{isSuper ? 'Super admin · full access' : 'Admin'}</span>
          <div className="sg-dash__actions">
            <Link className="sg-dash__button sg-dash__button--gold" href={rateHref}>
              <Coins size={18} strokeWidth={1.8} aria-hidden />
              {rateAction}
            </Link>
            <a className="sg-dash__ghost" href="/" target="_blank" rel="noopener noreferrer">
              View website
              <ExternalLink size={16} strokeWidth={2} aria-hidden />
            </a>
          </div>
        </div>
      </header>

      {isSuper && (
        <ul className="sg-dash__stats" aria-label="Today at a glance">
          {stats.map((stat) => (
            <li key={stat.label}>
              <Link href={stat.href} className={stat.due ? 'sg-stat sg-stat--due' : 'sg-stat'}>
                <span className="sg-stat__icon" aria-hidden>
                  <stat.icon size={20} strokeWidth={1.6} />
                </span>
                <span className="sg-stat__text">
                  <span>{stat.label}</span>
                  <strong>{stat.value}</strong>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {accountRequests.length > 0 && (
        <section className="sg-panel sg-panel--due" aria-labelledby="sg-requests-title">
          <div className="sg-panel__head">
            <h2 id="sg-requests-title">
              <KeyRound size={20} strokeWidth={1.6} aria-hidden />
              Requests from admins
            </h2>
            <span className="sg-pill sg-pill--warn">{accountRequests.length} waiting</span>
          </div>
          <ul className="sg-panel__list">
            {accountRequests.map((account) => (
              <li key={account.id}>
                <Link href={`${adminRoute}/collections/users/${account.id}`}>
                  <span className="sg-panel__avatar" aria-hidden>
                    {account.name.slice(0, 1).toUpperCase()}
                  </span>
                  <span className="sg-panel__main">
                    <strong>
                      {account.name} ({account.username ?? account.email})
                    </strong>
                    <span>
                      {account.accessRequest === 'unlock'
                        ? 'Locked after 5 wrong passwords. Asks to be unlocked'
                        : 'Forgot the password. Asks for a new one'}
                      {account.accessRequestedAt &&
                        ` · ${moment.format(new Date(account.accessRequestedAt))}`}
                    </span>
                  </span>
                  <span className="sg-panel__action">
                    {account.accessRequest === 'unlock' ? 'Unlock' : 'Set password'}
                    <ArrowRight size={16} strokeWidth={2} aria-hidden />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="sg-panel__foot">
            Open the account, then use “Change password” to set a new one or “Force unlock” to
            unlock it. The request disappears from here once that is done.
          </p>
        </section>
      )}

      <h2 className="sg-dash__heading">Daily work</h2>
      <div className="sg-dash__cards">
        <TaskCard
          icon={Coins}
          title="Today’s rate"
          due={!rateIsToday}
          badge={rateIsToday ? 'Entered' : 'To do'}
          figure={rate ? `${rupees.format(rate.gold24k999)} / g` : 'No rate yet'}
          detail={
            rate
              ? rateIsToday
                ? '24K buying rate, entered today.'
                : `24K buying rate from ${shortDay.format(new Date(rate.rateDate))}. Today’s is not entered.`
              : 'The website asks visitors to call until you enter one.'
          }
          href={rateHref}
          action={rateAction}
        />

        <TaskCard
          icon={Clapperboard}
          title="Advertisement videos"
          due={false}
          badge={adverts.totalDocs === 0 ? 'None yet' : 'Live'}
          figure={`${adverts.totalDocs} on the website`}
          detail={
            adverts.totalDocs === 0
              ? 'The Advertisements section shows “coming soon”.'
              : 'Showing in the Advertisements section of the home page.'
          }
          href={`${adminRoute}/collections/videos/create`}
          action="Add advertisement"
          manage={{ href: `${adminRoute}/collections/videos`, label: 'Edit or delete videos' }}
        />

        <TaskCard
          icon={Video}
          title="Customer feedback videos"
          due={noConsent > 0}
          badge={
            noConsent > 0 ? `${noConsent} hidden` : feedback.totalDocs === 0 ? 'None yet' : 'Live'
          }
          figure={`${feedback.totalDocs} on the website`}
          detail={
            noConsent > 0
              ? `${noConsent} ${plural(noConsent, 'video is', 'videos are')} hidden until the customer’s consent is ticked.`
              : feedback.totalDocs === 0
                ? 'The Customer feedback section shows “coming soon”.'
                : 'Showing in the Customer feedback section of the home page.'
          }
          href={`${adminRoute}/collections/feedback-videos/create`}
          action="Add feedback video"
          manage={{
            href: `${adminRoute}/collections/feedback-videos`,
            label: 'Edit or delete videos',
          }}
        />

        <TaskCard
          icon={Store}
          title="Store products"
          due={false}
          badge={products.totalDocs === 0 ? 'None yet' : 'Live'}
          figure={`${products.totalDocs} on the website`}
          detail={
            products.totalDocs === 0
              ? 'The Online Store shows sample products until you add your own.'
              : 'Showing on the Online Store page. Update prices when the rate changes.'
          }
          href={`${adminRoute}/collections/products/create`}
          action="Add product"
          manage={{ href: `${adminRoute}/collections/products`, label: 'Edit or delete products' }}
        />
      </div>

      {isSuper ? (
        <>
          <div className="sg-dash__panels">
            <section className="sg-panel" aria-labelledby="sg-admins-title">
              <div className="sg-panel__head">
                <h2 id="sg-admins-title">
                  <UserCog size={20} strokeWidth={1.6} aria-hidden />
                  Admins
                </h2>
                <Link className="sg-panel__action" href={`${adminRoute}/collections/users/create`}>
                  <UserPlus size={16} strokeWidth={2} aria-hidden />
                  Add admin
                </Link>
              </div>
              {admins && admins.docs.length > 0 ? (
                <ul className="sg-panel__list">
                  {admins.docs.map((account) => {
                    const state = accountState(account)
                    return (
                      <li key={account.id}>
                        <Link href={`${adminRoute}/collections/users/${account.id}`}>
                          <span className="sg-panel__avatar" aria-hidden>
                            {account.name.slice(0, 1).toUpperCase()}
                          </span>
                          <span className="sg-panel__main">
                            <strong>{account.name}</strong>
                            <span>{account.username ?? account.email}</span>
                          </span>
                          <span className={`sg-pill sg-pill--${state.tone}`}>{state.label}</span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <p className="sg-panel__empty">
                  No admin accounts yet. Add one for the shop staff.
                </p>
              )}
              <p className="sg-panel__foot">
                Open an admin to reset the password, block or unblock, unlock or delete the account.
                {adminCount > (admins?.docs.length ?? 0) && (
                  <>
                    {' '}
                    <Link href={`${adminRoute}/collections/users`}>See all {adminCount}</Link>
                  </>
                )}
              </p>
            </section>

            <section className="sg-panel" aria-labelledby="sg-activity-title">
              <div className="sg-panel__head">
                <h2 id="sg-activity-title">
                  <History size={20} strokeWidth={1.6} aria-hidden />
                  Recent activity
                </h2>
                <Link className="sg-panel__action" href={`${adminRoute}/collections/audit-logs`}>
                  Full log
                  <ArrowRight size={16} strokeWidth={2} aria-hidden />
                </Link>
              </div>
              {activity && activity.docs.length > 0 ? (
                <ul className="sg-panel__list sg-panel__list--plain">
                  {activity.docs.map((entry) => {
                    const ActionIcon = ACTION_ICON[entry.action] ?? History
                    return (
                      <li key={entry.id}>
                        <span className="sg-panel__avatar sg-panel__avatar--soft" aria-hidden>
                          <ActionIcon size={17} strokeWidth={1.8} />
                        </span>
                        <span className="sg-panel__main">
                          <strong>
                            {/* A sign-in entry already reads "Signed in: name" */}
                            {entry.action === 'login'
                              ? entry.target
                              : `${ACTION_LABEL[entry.action] ?? entry.action}: ${entry.target}`}
                          </strong>
                          <span>
                            {entry.actor} · {moment.format(new Date(entry.createdAt))}
                          </span>
                        </span>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <p className="sg-panel__empty">Nothing recorded yet.</p>
              )}
            </section>
          </div>

          <h2 className="sg-dash__heading">Manage everything</h2>
          <p className="sg-dash__lead">
            As super admin you can open, add, change and delete in every part of the panel.
          </p>
          {sections.map((group) => (
            <section key={group.title} className="sg-dash__group" aria-label={group.title}>
              <h3>{group.title}</h3>
              <ul className="sg-dash__links">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}>
                      <span className="sg-dash__link-icon" aria-hidden>
                        <item.icon size={20} strokeWidth={1.6} />
                      </span>
                      <span className="sg-panel__main">
                        <span className="sg-dash__link-title">
                          <strong>{item.label}</strong>
                          {item.meta && <span className="sg-dash__link-meta">{item.meta}</span>}
                        </span>
                        <span>{item.note}</span>
                      </span>
                      <ArrowRight size={16} strokeWidth={2} aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </>
      ) : (
        <p className="sg-dash__hint">
          Your account can enter and correct rates, and add, edit or delete videos and store
          products. For anything else, ask the super admin.
        </p>
      )}
    </section>
  )
}

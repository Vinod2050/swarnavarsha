import { Check } from 'lucide-react'
import type { ComponentType, ReactNode } from 'react'

import { Medallion, OrnamentDivider } from '@/components/ui/ornament'
import { Reveal } from '@/components/ui/reveal'
import { cn } from '@/lib/utils'

/** A lucide icon or one of our own from `ui/icons` */
export type IconType = ComponentType<{ className?: string }>

/** A titled block of page copy on an ivory (or pale gold) band. */
export function ContentSection({
  id,
  eyebrow,
  title,
  intro,
  sunken = false,
  narrow = false,
  centred = false,
  screen = false,
  children,
}: {
  id?: string
  eyebrow?: string
  title?: string
  intro?: string
  sunken?: boolean
  /**
   * A reading-width column (FAQ lists). On wide, short laptop screens the heading moves
   * beside the content instead, so the whole section fits one screen.
   */
  narrow?: boolean
  /** Centres the heading, as on the home pages */
  centred?: boolean
  /** At least one screen tall under the sticky header, content centred in it */
  screen?: boolean
  children?: ReactNode
}) {
  return (
    <section
      id={id}
      className={cn(
        'section-y text-ink',
        sunken ? 'bg-surface-sunken' : 'bg-surface',
        // Phones: less padding, the screen around the centred content gives the air
        screen && 'flex min-h-screen-section flex-col justify-center max-md:py-7 md:short:py-10',
      )}
    >
      <div className="container-site">
        <div
          className={cn(
            narrow &&
              // Laptops, and tablets on their side: heading beside the list
              'mx-auto max-w-3xl lg:grid lg:max-w-none lg:grid-cols-[0.6fr_1.4fr] lg:items-start lg:gap-x-16 md:short:grid md:short:max-w-none md:short:grid-cols-[0.6fr_1.4fr] md:short:items-start md:short:gap-x-10',
          )}
        >
          {(title || intro) && (
            <Reveal
              className={cn(
                'mb-8 md:mb-12 md:short:mb-8 lg:short:mb-8',
                centred && 'mx-auto max-w-2xl text-center',
                narrow &&
                  'lg:mx-0 lg:mb-0 lg:text-left md:short:mx-0 md:short:mb-0 md:short:text-left',
              )}
            >
              {eyebrow && <p className="mb-2 t-eyebrow">{eyebrow}</p>}
              {title && (
                <>
                  <h2 className="t-h2">{title}</h2>
                  <OrnamentDivider
                    className={cn('mt-4', centred && 'mx-auto', narrow && 'lg:mx-0 md:short:mx-0')}
                  />
                </>
              )}
              {intro && (
                <p className={cn('mt-3 t-body-lg text-ink-muted', !centred && 'measure')}>
                  {intro}
                </p>
              )}
            </Reveal>
          )}
          {narrow ? <Reveal delay={0.1}>{children}</Reveal> : children}
        </div>
      </div>
    </section>
  )
}

export function CheckList({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={cn('space-y-3', className)}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border border-accent/60 text-accent">
            <Check aria-hidden className="size-3.5" strokeWidth={2.5} />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

/**
 * Title + text cards in a grid. Each card leads with its icon in a medallion, or with its
 * number when `numbered` (steps).
 */
export function CardGrid({
  items,
  columns = 3,
  icons,
  numbered = false,
  compact = false,
}: {
  items: { title: string; text: string }[]
  columns?: 2 | 3 | 4
  /** Same order as `items` */
  icons?: readonly IconType[]
  numbered?: boolean
  /** Phones: the icon sits beside the text, so short cards do not each take a screen */
  compact?: boolean
}) {
  const List = numbered ? 'ol' : 'ul'

  return (
    <List
      className={cn(
        'grid',
        compact ? 'gap-3 sm:gap-6' : 'gap-6',
        columns === 2 && 'md:grid-cols-2',
        columns === 3 && 'md:grid-cols-3',
        columns === 4 && 'sm:grid-cols-2 lg:grid-cols-4',
      )}
    >
      {items.map((item, index) => {
        const Icon = icons?.[index]
        return (
          <li key={item.title}>
            <Reveal
              delay={index * 0.06}
              // The gold rule along the top draws itself across the card under the pointer
              className={cn(
                'group relative h-full hover-lift overflow-hidden rounded-lg border border-line bg-surface-raised shadow-card after:absolute after:inset-x-0 after:top-0 after:h-0.5 after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-500 hover:after:scale-x-100 lg:short:p-6',
                // Compact: icon beside the text up to laptop width, so two short rows fit a
                // tablet screen
                compact ? 'flex items-start gap-4 p-4 sm:p-5 lg:block lg:p-6' : 'p-6 md:p-8',
              )}
            >
              {numbered && (
                <span
                  aria-hidden
                  className="grid size-12 place-items-center rounded-full bg-gold-300 text-xl font-bold text-plum-800 transition-transform duration-500 group-hover:scale-110"
                >
                  {index + 1}
                </span>
              )}
              {Icon && (
                <Medallion className="[&_svg]:stroke-[1.5]">
                  <Icon />
                </Medallion>
              )}
              <div className={cn('min-w-0', compact && 'max-sm:pt-1')}>
                <h3 className={cn('t-h3', (Icon || numbered) && (compact ? 'lg:mt-5' : 'mt-5'))}>
                  {item.title}
                </h3>
                <p className={cn('text-ink-muted', compact ? 'mt-1 lg:mt-2' : 'mt-2')}>
                  {item.text}
                </p>
              </div>
            </Reveal>
          </li>
        )
      })}
    </List>
  )
}

/** A bordered panel with an icon beside its title: documents, pricing, rules. */
export function InfoPanel({
  icon: Icon,
  title,
  dark = false,
  className,
  children,
}: {
  icon: IconType
  title: string
  /** Plum panel with a foil edge, for the one panel on a page that should stand out */
  dark?: boolean
  className?: string
  children: ReactNode
}) {
  return (
    <Reveal
      className={cn(
        'group h-full hover-lift overflow-hidden rounded-lg border border-line shadow-card',
        dark ? 'theme-dark bg-surface text-ink' : 'bg-surface-raised',
        className,
      )}
    >
      {dark && <div aria-hidden className="foil-edge foil-shimmer" />}
      <div className="p-5 sm:p-6 md:p-8 lg:short:p-6">
        <div className="flex items-center gap-4">
          <Medallion className="[&_svg]:stroke-[1.5]">
            <Icon />
          </Medallion>
          <h2 className={cn('min-w-0 t-h3', dark && 'text-accent')}>{title}</h2>
        </div>
        <div className="mt-6 lg:short:mt-4">{children}</div>
      </div>
    </Reveal>
  )
}

/**
 * Content the client still has to supply (CLAUDE.md rule 10). Deliberately visible so it
 * cannot be missed before launch.
 */
export function ClientPlaceholder({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-md border-2 border-dashed border-line-strong px-4 py-3 text-sm text-ink-muted">
      {children}
    </p>
  )
}

/** Numbered legal-style sections (Privacy Policy, Terms). */
export function Prose({ sections }: { sections: { title: string; body: string[] }[] }) {
  return (
    <div className="measure space-y-10">
      {sections.map((section, index) => (
        <section key={section.title} className="border-l-2 border-accent/40 pl-5 md:pl-8">
          <h2 className="t-h3">
            <span className="mr-2 text-accent">{index + 1}.</span>
            {section.title}
          </h2>
          <div className="mt-3 space-y-3 text-ink-muted">
            {section.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

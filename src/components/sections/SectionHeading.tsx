import { OrnamentDivider } from '@/components/ui/ornament'
import { Reveal } from '@/components/ui/reveal'
import { cn } from '@/lib/utils'

type Props = {
  eyebrow?: string
  title: string
  intro?: string
  align?: 'left' | 'center'
  /** Heading level: sections on a page use h2 */
  id?: string
  className?: string
  /** Extra classes for the intro line, e.g. to leave it out where height is short */
  introClassName?: string
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = 'center',
  id,
  className,
  introClassName,
}: Props) {
  return (
    <Reveal
      className={cn(
        'mb-8 md:mb-12 md:short:mb-8 lg:short:mb-8 lg:xshort:mb-5',
        align === 'center' && 'mx-auto max-w-2xl text-center',
        className,
      )}
    >
      {eyebrow && <p className="mb-2 t-eyebrow">{eyebrow}</p>}
      <h2 id={id} className="t-h2">
        {title}
      </h2>
      <OrnamentDivider className={cn('mt-4 lg:xshort:mt-2', align === 'center' && 'mx-auto')} />
      {intro && (
        <p
          className={cn(
            'mt-3 t-body-lg text-ink-muted md:short:hidden',
            align === 'left' && 'measure',
            introClassName,
          )}
        >
          {intro}
        </p>
      )}
    </Reveal>
  )
}

import { ArrowRight, Sparkle } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import { Button } from '@/components/ui/button'
import { ScallopPattern } from '@/components/ui/ornament'
import { Reveal } from '@/components/ui/reveal'
import { Link } from '@/i18n/navigation'
import type { Offer } from '@/lib/content'
import { cn } from '@/lib/utils'

/**
 * Shown only while the Offer global is active. `tone="dark"` (Store): a plum band with faint
 * scallops, the offer in gold and a sparkle twinkling beside the badge.
 */
export async function OfferBand({
  offer,
  showLink = true,
  tone = 'light',
}: {
  offer: Offer
  showLink?: boolean
  tone?: 'light' | 'dark'
}) {
  if (!offer.active || !offer.text) return null
  const t = await getTranslations('offer')
  const dark = tone === 'dark'

  return (
    <section
      aria-label={t('badge')}
      className={cn(
        'border-y border-line text-ink',
        dark ? 'theme-dark relative isolate overflow-hidden bg-surface' : 'bg-surface-raised',
      )}
    >
      {dark && <ScallopPattern className="-z-10 opacity-30" />}
      <Reveal
        from="scale"
        className={cn(
          'container-site flex flex-col items-start gap-5 py-8 md:flex-row md:items-center md:justify-between md:py-10',
          dark && 'md:py-12',
        )}
      >
        <div>
          <span className="inline-flex items-center gap-2">
            <span className="inline-block rounded-sm bg-peacock-pink px-2.5 py-1 t-label text-white">
              {t('badge')}
            </span>
            {dark && (
              <Sparkle aria-hidden className="size-5 animate-twinkle fill-accent text-accent" />
            )}
          </span>
          <p className={cn('mt-3 t-h3', dark && 'foil-text foil-emboss md:text-[28px]')}>
            {offer.text}
          </p>
          <p className="mt-1 text-sm text-ink-muted">{t('terms')}</p>
        </div>
        {showLink && (
          <Button asChild className="shrink-0">
            <Link href="/buy-gold">
              {t('cta')}
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        )}
      </Reveal>
    </section>
  )
}

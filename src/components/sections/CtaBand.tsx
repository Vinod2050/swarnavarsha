import { getTranslations } from 'next-intl/server'

import { OrnamentDivider, ScallopPattern } from '@/components/ui/ornament'
import { Reveal } from '@/components/ui/reveal'
import type { SiteSettings } from '@/lib/content'

import { CtaButtons } from './CtaButtons'

/** Closing call-to-action on inner pages. */
export async function CtaBand({
  settings,
  title,
  text,
  location,
}: {
  settings: SiteSettings
  title?: string
  text?: string
  location: string
}) {
  const t = await getTranslations('cta')

  return (
    <section className="theme-dark relative isolate overflow-hidden bg-surface text-ink">
      <ScallopPattern className="-z-10 opacity-40" />
      <Reveal className="container-site flex flex-col items-center py-12 text-center md:py-20">
        <h2 className="foil-text foil-emboss foil-shimmer t-h1">{title ?? t('title')}</h2>
        <OrnamentDivider className="mt-5" />
        <p className="mt-5 max-w-xl t-body-lg text-ink">{text ?? t('text')}</p>
        <CtaButtons
          settings={settings}
          location={location}
          className="mt-8 w-full sm:w-auto sm:justify-center"
        />
      </Reveal>
    </section>
  )
}

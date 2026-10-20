import { BadgeCheck, Banknote, Layers, Microscope, Scale } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import { Medallion, OrnamentDivider, ScallopPattern } from '@/components/ui/ornament'
import { Reveal } from '@/components/ui/reveal'
import type { SiteSettings } from '@/lib/content'

import { CtaButtons } from '../CtaButtons'

// Same order as `why.items` in the messages files
const ICONS = [Microscope, Banknote, Layers, Scale, BadgeCheck] as const

/** Home 2 "why choose us": heading and buttons on the left, a ruled list on the right. */
export async function WhyList({ settings }: { settings: SiteSettings }) {
  const t = await getTranslations('why')
  const items = t.raw('items') as { title: string; text: string }[]

  return (
    <section
      aria-labelledby="whylist-title"
      className="theme-dark relative isolate overflow-hidden bg-surface section-y text-ink"
    >
      <ScallopPattern className="-z-10 [mask-image:linear-gradient(to_right,black,transparent_60%)] opacity-70" />

      <div className="container-site grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:short:grid-cols-[0.6fr_1.4fr] lg:short:gap-12">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="mb-2 t-eyebrow">{t('eyebrow')}</p>
          <h2 id="whylist-title" className="t-h1 text-accent">
            {t('title')}
          </h2>
          <OrnamentDivider className="mt-5" />
          <CtaButtons settings={settings} location="why" className="mt-8 lg:short:mt-6" />
        </div>

        <ul className="divide-y divide-line border-y border-line lg:short:grid lg:short:grid-cols-2 lg:short:gap-x-10 lg:short:divide-y-0 lg:short:border-y-0">
          {items.map((item, index) => {
            const Icon = ICONS[index] ?? BadgeCheck
            return (
              <li key={item.title}>
                <Reveal
                  delay={index * 0.05}
                  className="group flex items-start gap-5 py-6 lg:short:gap-4 lg:short:py-3 lg:xshort:py-2"
                >
                  <Medallion className="lg:xshort:size-12 lg:xshort:*:size-10 lg:xshort:[&_svg]:size-5">
                    <Icon aria-hidden strokeWidth={1.5} />
                  </Medallion>
                  <div>
                    <h3 className="t-h3 text-ink transition-colors duration-300 group-hover:text-accent lg:short:text-xl lg:short:leading-7">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-ink-muted">{item.text}</p>
                  </div>
                </Reveal>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

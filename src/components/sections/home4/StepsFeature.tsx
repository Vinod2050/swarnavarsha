import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

import { OrnamentDivider } from '@/components/ui/ornament'
import { Reveal } from '@/components/ui/reveal'
import { Link } from '@/i18n/navigation'

/** Home 4 process: big serif heading and numbered list on the left, one large photo on the right. */
export async function StepsFeature() {
  const [t, tn] = await Promise.all([getTranslations('process'), getTranslations('nav')])
  const steps = t.raw('steps') as { title: string; text: string }[]

  return (
    <section aria-labelledby="steps4-title" className="bg-surface section-y text-ink">
      <div className="container-site grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal from="left">
          <h2 id="steps4-title" className="t-hero">
            {t('title')}
          </h2>
          <OrnamentDivider className="mt-5" />
          <p className="mt-5 t-body-lg text-ink-muted">{t('intro')}</p>

          <ol className="mt-6 space-y-3">
            {steps.map((step, index) => (
              <li key={step.title} className="flex items-baseline gap-4">
                <span aria-hidden className="w-8 shrink-0 font-display text-2xl text-accent">
                  {index + 1}
                </span>
                <span>
                  <span className="font-semibold">{step.title}</span>
                  <span className="text-ink-muted"> · {step.text}</span>
                </span>
              </li>
            ))}
          </ol>

          <Link
            href="/how-it-works"
            className="mt-8 inline-flex min-h-12 items-center gap-2 t-label text-accent hover:underline"
          >
            {tn('howItWorks')}
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </Reveal>

        {/* [CLIENT TO PROVIDE: shop front photo] Temporary stock photo, see CREDITS.md */}
        <Reveal
          from="right"
          delay={0.1}
          className="relative aspect-[4/5] overflow-hidden rounded-tl-[5rem] rounded-br-[5rem] bg-surface-sunken"
        >
          <Image
            src="/images/stock/hero-bangles.webp"
            alt=""
            fill
            sizes="(min-width: 1024px) 560px, 100vw"
            className="object-cover"
          />
        </Reveal>
      </div>
    </section>
  )
}

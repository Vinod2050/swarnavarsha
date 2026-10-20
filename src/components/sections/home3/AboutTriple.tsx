import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/ui/reveal'
import { Link } from '@/i18n/navigation'

/** Home 3 about block: tall photo, welcome text, second photo. */
export async function AboutTriple() {
  const [t, th] = await Promise.all([getTranslations('about'), getTranslations('home2')])
  const story = t.raw('story') as string[]

  return (
    <section aria-labelledby="about3-title" className="bg-surface-raised section-y text-ink">
      {/* [CLIENT TO PROVIDE: shop and jewellery photos] Temporary stock photos, see CREDITS.md */}
      <div className="container-site grid items-center gap-8 lg:grid-cols-[1fr_1.3fr_0.8fr] lg:gap-10">
        <Reveal
          from="left"
          className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-lg shadow-card"
        >
          <Image
            src="/images/stock/story-necklace.webp"
            alt=""
            fill
            sizes="(min-width: 1024px) 360px, 90vw"
            className="object-cover"
          />
        </Reveal>

        <Reveal delay={0.1}>
          <p className="t-body-lg text-accent">{t('eyebrow')}</p>
          <h2 id="about3-title" className="mt-2 t-h1">
            {t('title')}
          </h2>
          <div className="mt-5 space-y-4 text-ink-muted">
            {story.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <p className="mt-4 font-display text-accent">
            {t('contactTitle')}: {t('contactName')}
          </p>
          <Button asChild className="mt-6 rounded-full">
            <Link href="/about">{th('aboutCta')}</Link>
          </Button>
        </Reveal>

        <div className="relative mx-auto hidden aspect-[3/4] w-full max-w-xs overflow-hidden rounded-lg shadow-card lg:block">
          <Image
            src="/images/stock/service-release-pledged-gold.webp"
            alt=""
            fill
            sizes="280px"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  )
}

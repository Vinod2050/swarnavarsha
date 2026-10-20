import { ArrowRight, Eye, HeartHandshake, Scale } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import { Button } from '@/components/ui/button'
import { CoinFlip } from '@/components/ui/coin-flip'
import { Medallion, OrnamentDivider, ScallopPattern } from '@/components/ui/ornament'
import { Reveal } from '@/components/ui/reveal'
import { Link } from '@/i18n/navigation'

// Same order as `about.values` in the messages files
const VALUE_ICONS = [Eye, Scale, HeartHandshake] as const

/**
 * Home 2 "who we are": the gold Lakshmi coin, large on a plum panel, beside the company
 * story, its three values as cards and a link to the About page.
 *
 * Once the panel is in view the coin keeps turning over between Lakshmi, who pours gold coins
 * from her hand, and the Suvarnavarsha logo, resting longer on the logo. Around it, rings
 * ripple out as the coin breathes with a soft glow, and two sparks of light run round the
 * gold frame. On hover the coin lifts and the light brightens. `prefers-reduced-motion` stops
 * it and shows the logo face (globals.css).
 */
export async function StorySplit() {
  const [t, th] = await Promise.all([getTranslations('about'), getTranslations('home2')])
  const story = t.raw('story') as string[]
  const values = t.raw('values') as { title: string; text: string }[]

  return (
    <section aria-labelledby="story-title" className="bg-surface section-y text-ink">
      <div className="container-site grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <Reveal
          from="left"
          className="relative mx-auto aspect-square w-full max-w-xs sm:max-w-sm lg:max-w-md lg:short:max-w-80 lg:xshort:max-w-56"
        >
          <div
            aria-hidden
            className="theme-dark group [container-type:size] absolute inset-0 overflow-hidden rounded-lg bg-surface text-accent shadow-card"
          >
            <ScallopPattern className="opacity-30" />

            {/* Soft gold light behind the coin, glowing in time with its breath */}
            <span className="absolute inset-[24%] animate-glow-pulse rounded-full bg-accent/25 blur-3xl transition-[inset] duration-700 group-hover:inset-[18%]" />

            {/* Rings rippling out from the logo */}
            {[0, 2].map((delay) => (
              <span
                key={delay}
                className="absolute inset-[20%] animate-ripple rounded-full border border-accent/50"
                style={{ animationDelay: `${delay}s` }}
              />
            ))}

            {/* Gold frame, with two sparks of light running round it */}
            <span className="absolute inset-3 rounded-md border border-accent/30" />
            <svg className="absolute inset-3 size-[calc(100%-1.5rem)] overflow-visible" fill="none">
              {/* The second spark starts half a lap behind the first (6s lap) */}
              {[0, -3].map((delay) => (
                <rect
                  key={delay}
                  width="100%"
                  height="100%"
                  rx="8"
                  pathLength={100}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeDasharray="7 93"
                  className="animate-frame-trace"
                  style={{ animationDelay: `${delay}s` }}
                />
              ))}
            </svg>

            {/* The Lakshmi coin flips over to the logo when the panel comes into view */}
            <div className="absolute inset-0 grid place-items-center">
              <div className="w-[64%] transition-transform duration-700 ease-out group-hover:-translate-y-1.5 group-hover:scale-105">
                <div className="animate-breathe">
                  <CoinFlip
                    playOnView
                    loop
                    logoSizes="(min-width: 1024px) 220px, (min-width: 640px) 190px, 160px"
                    className="aspect-square w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal from="right" delay={0.1}>
          <p className="mb-3 flex items-center gap-3 t-eyebrow lg:xshort:mb-1">
            <span aria-hidden className="h-px w-8 bg-accent" />
            {t('eyebrow')}
          </p>
          <h2 id="story-title" className="t-h1 lg:short:text-[32px]">
            {t('storyTitle')}
          </h2>
          <OrnamentDivider className="mt-4 lg:xshort:hidden" />
          {/* The opening paragraph reads as the lead; the rest is quieter */}
          <div className="mt-6 measure space-y-4 t-body-lg text-ink-muted lg:short:mt-4 lg:short:space-y-3 lg:short:text-base lg:short:leading-[26px] lg:xshort:mt-3 [&>p:first-child]:border-l-2 [&>p:first-child]:border-accent [&>p:first-child]:pl-4 [&>p:first-child]:text-ink lg:xshort:[&>p:not(:first-child)]:hidden">
            {story.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <ul className="mt-8 grid gap-4 sm:grid-cols-3 lg:short:mt-5 lg:short:gap-3 lg:xshort:mt-4">
            {values.map((value, index) => {
              const Icon = VALUE_ICONS[index] ?? Eye
              return (
                <li
                  key={value.title}
                  className="group hover-lift rounded-md border border-t-2 border-line border-t-accent bg-surface-raised p-5 shadow-card max-sm:flex max-sm:items-start max-sm:gap-4 lg:short:flex lg:short:items-center lg:short:gap-3 lg:short:p-3"
                >
                  <Medallion className="lg:short:size-12 lg:short:*:size-10 lg:short:[&_svg]:size-5">
                    <Icon aria-hidden strokeWidth={1.5} />
                  </Medallion>
                  <div>
                    <h3 className="mt-3 text-lg leading-7 font-semibold max-sm:mt-0 lg:short:mt-0 lg:max-xl:short:text-base">
                      {value.title}
                    </h3>
                    <p className="mt-1 text-ink-muted lg:short:hidden">{value.text}</p>
                  </div>
                </li>
              )
            })}
          </ul>

          <Button asChild className="mt-8 lg:short:mt-5 lg:xshort:mt-4">
            <Link href="/about">
              {th('aboutCta')}
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        </Reveal>
      </div>
    </section>
  )
}

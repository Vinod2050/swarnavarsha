import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

import { Reveal } from '@/components/ui/reveal'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

// [CLIENT TO PROVIDE: photos] Temporary stock photos, see public/images/stock/CREDITS.md
const TILES = [
  { key: 'sellGold', href: '/sell-gold', image: '/images/stock/service-sell-gold.webp' },
  {
    key: 'releasePledged',
    href: '/release-pledged-gold',
    image: '/images/stock/story-necklace.webp',
  },
  { key: 'buyGold', href: '/buy-gold', image: '/images/stock/product-bar-20g.webp' },
  { key: 'store', href: '/store', image: '/images/stock/product-coin-1g.webp' },
] as const

/** Home 4: a centred statement, then four staggered tall tiles with a caption band. */
export async function TileQuartet() {
  const [t, tn] = await Promise.all([getTranslations('about'), getTranslations('nav')])

  return (
    <section aria-labelledby="quartet-title" className="bg-surface section-y text-ink">
      <div className="container-site">
        <h2 id="quartet-title" className="mx-auto max-w-3xl text-center t-h2">
          {t('intro')}
        </h2>

        <ul className="mt-10 grid grid-cols-2 gap-4 md:mt-14 md:grid-cols-4 md:gap-6">
          {TILES.map((tile, index) => (
            <li key={tile.href} className={cn(index % 2 === 1 && 'md:mt-16')}>
              <Reveal from="scale" delay={index * 0.08}>
                <Link
                  href={tile.href}
                  className={cn(
                    'theme-dark group relative block aspect-[3/4] overflow-hidden bg-surface text-ink',
                    index % 2 === 0
                      ? 'rounded-tl-[3rem] rounded-br-[3rem]'
                      : 'rounded-tr-[3rem] rounded-bl-[3rem]',
                  )}
                >
                  <Image
                    src={tile.image}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 280px, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute inset-x-0 bottom-0 block bg-plum-950/70 px-3 py-3 text-center t-body-lg [&:lang(en)]:italic">
                    {tn(tile.key)}
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

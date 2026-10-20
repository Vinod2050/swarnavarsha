import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/ui/reveal'
import { Link } from '@/i18n/navigation'
import type { Product } from '@/lib/content'

/** Home 4: centred serif heading over a sideways-scrolling row of store products. */
export async function StoreScroller({ products }: { products: Product[] }) {
  const [t, tn] = await Promise.all([getTranslations('store'), getTranslations('nav')])

  return (
    <section aria-labelledby="scroller-title" className="bg-surface-raised section-y text-ink">
      <div className="container-site">
        <h2 id="scroller-title" className="text-center t-hero">
          {tn('store')}
        </h2>

        <Reveal>
          <ul className="mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4">
            {products.map((product) => (
              <li key={product.code} className="w-64 shrink-0 snap-start md:w-72">
                <Link href="/store" className="group block rounded-md">
                  <span className="relative block aspect-[4/3] overflow-hidden rounded-lg bg-surface-sunken">
                    <Image
                      src={product.image}
                      alt=""
                      fill
                      sizes="288px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Dummy products stay labelled wherever they appear */}
                    <span className="absolute top-3 left-3 rounded-sm bg-peacock-pink px-2 py-0.5 t-label text-white">
                      {t('sample')}
                    </span>
                  </span>
                  <span className="mt-4 block t-h3 group-hover:text-accent">{product.name}</span>
                  <span className="mt-2 block text-ink-muted">{product.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="mt-8 text-center">
          <Button asChild variant="secondary">
            <Link href="/store">{tn('store')}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

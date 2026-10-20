import { Star } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import { Reveal } from '@/components/ui/reveal'
import type { Testimonial } from '@/lib/content'

import { SectionHeading } from './SectionHeading'

/**
 * Real customer reviews only (Section 8.3). The section is not rendered until the client
 * supplies reviews with the customer's consent.
 */
export async function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null
  const t = await getTranslations('testimonials')

  return (
    <section
      aria-labelledby="testimonials-title"
      className="theme-dark bg-surface section-y text-ink"
    >
      <div className="container-site">
        <SectionHeading id="testimonials-title" eyebrow={t('eyebrow')} title={t('title')} />
        <ul className="grid gap-6 md:grid-cols-3">
          {testimonials.slice(0, 6).map((item, index) => (
            <li key={item.id}>
              <Reveal
                delay={(index % 3) * 0.08}
                className="h-full hover-lift rounded-md border border-line bg-surface-raised p-6"
              >
                <p className="flex gap-1" aria-label={t('rating', { rating: item.rating })}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      aria-hidden
                      className={
                        i < item.rating
                          ? 'size-5 fill-accent text-accent'
                          : 'size-5 text-line-strong'
                      }
                    />
                  ))}
                </p>
                <blockquote className="mt-4 text-ink">{item.text}</blockquote>
                <p className="mt-4 t-label text-accent">
                  {item.name}
                  {item.area && <span className="font-normal text-ink-muted"> · {item.area}</span>}
                </p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

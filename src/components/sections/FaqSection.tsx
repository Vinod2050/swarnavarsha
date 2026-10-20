import { ArrowRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/ui/reveal'
import { Link } from '@/i18n/navigation'
import type { Faq } from '@/lib/content'

import { FaqList } from './FaqList'
import { SectionHeading } from './SectionHeading'

/** A short FAQ list with a link to the full FAQ page. */
export async function FaqSection({ faqs }: { faqs: Faq[] }) {
  if (faqs.length === 0) return null
  const t = await getTranslations('faq')

  return (
    <section aria-labelledby="faq-title" className="bg-surface section-y text-ink">
      <div className="container-site">
        <div className="mx-auto max-w-3xl lg:short:grid lg:short:max-w-none lg:short:grid-cols-[0.7fr_1.3fr] lg:short:items-start lg:short:gap-x-16">
          <SectionHeading
            id="faq-title"
            eyebrow={t('eyebrow')}
            title={t('title')}
            className="lg:short:mx-0 lg:short:text-left lg:short:[&_svg]:mx-0"
          />
          <Reveal className="lg:short:row-span-2">
            <FaqList faqs={faqs} />
          </Reveal>
          <div className="mt-8 text-center lg:short:mt-0 lg:short:text-left">
            <Button asChild variant="secondary">
              <Link href="/faq">
                {t('viewAll')}
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

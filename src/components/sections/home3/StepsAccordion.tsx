import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

import { Reveal } from '@/components/ui/reveal'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

/** Home 3 process: tall framed photo on the left, the steps as an accordion on the right. */
export async function StepsAccordion() {
  const t = await getTranslations('process')
  const steps = t.raw('steps') as { title: string; detail: string }[]

  return (
    <section aria-labelledby="steps3-title" className="theme-dark bg-surface section-y text-ink">
      <div className="container-site grid gap-10 lg:grid-cols-2 lg:gap-12">
        {/* [CLIENT TO PROVIDE: counter or team photo] Temporary stock photo, see CREDITS.md */}
        <Reveal
          from="left"
          className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-lg border-2 border-accent lg:aspect-auto lg:min-h-[34rem]"
        >
          <Image
            src="/images/stock/service-sell-gold.webp"
            alt=""
            fill
            sizes="(min-width: 1024px) 448px, 90vw"
            className="object-cover"
          />
        </Reveal>

        <Reveal from="right" delay={0.1}>
          <h2 id="steps3-title" className="text-center t-h2 text-ink">
            {t('title')}
          </h2>
          <p className="mt-2 text-center text-ink-muted">{t('intro')}</p>

          <Accordion type="single" collapsible defaultValue="step-0" className="mt-8">
            {steps.map((step, index) => (
              <AccordionItem
                key={step.title}
                value={`step-${index}`}
                className="mb-3 rounded-md border border-line-strong data-[state=open]:border-transparent data-[state=open]:bg-cta"
              >
                <AccordionTrigger className="px-4 data-[state=open]:text-on-cta data-[state=open]:hover:text-on-cta [&[data-state=open]_svg]:text-on-cta">
                  {index + 1}. {step.title}
                </AccordionTrigger>
                <AccordionContent className="px-4 text-on-cta">{step.detail}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  )
}

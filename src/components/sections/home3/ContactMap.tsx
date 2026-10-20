import { getTranslations } from 'next-intl/server'

import type { SiteSettings } from '@/lib/content'

import { CtaButtons } from '../CtaButtons'
import { EnquiryForm } from '../EnquiryForm'

/** Home 3 contact: map in a gold frame on the left, heading and enquiry form on the right. */
export async function ContactMap({ settings }: { settings: SiteSettings }) {
  const [t, te] = await Promise.all([getTranslations('contact'), getTranslations('enquiry')])

  return (
    <section
      id="contact"
      aria-labelledby="contact3-title"
      className="theme-dark bg-surface section-y text-ink"
    >
      <div className="container-site grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
        <div className="overflow-hidden rounded-lg border-2 border-accent">
          <iframe
            src={settings.mapEmbedUrl}
            title={t('mapTitle')}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block h-80 w-full border-0 lg:h-full lg:min-h-[32rem]"
          />
        </div>

        <div>
          <p className="text-center t-body-lg text-ink">{t('eyebrow')}</p>
          <h2 id="contact3-title" className="mt-2 text-center t-h1 text-ink">
            {t('title')}
          </h2>
          <p className="mt-3 text-center text-ink-muted">{settings.address}</p>
          <CtaButtons
            settings={settings}
            location="contact"
            className="mt-6 sm:justify-center [&_a]:rounded-full"
          />

          <div className="theme-light mt-8 rounded-lg bg-surface-raised p-6 text-ink md:p-8">
            <h3 className="t-h3">{te('title')}</h3>
            <p className="mt-2 mb-6 text-ink-muted">{te('intro')}</p>
            <EnquiryForm />
          </div>
        </div>
      </div>
    </section>
  )
}

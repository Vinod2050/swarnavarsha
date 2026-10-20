import { useTranslations } from 'next-intl'

import { BrandLoader } from '@/components/ui/brand-loader'

/** Shown in place of a page while it is still on its way from the server. */
export default function Loading() {
  const t = useTranslations('common')

  return (
    <section className="theme-dark grid min-h-first-screen place-items-center bg-surface text-ink">
      <BrandLoader label={t('loading')} />
    </section>
  )
}

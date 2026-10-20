import { getTranslations } from 'next-intl/server'

import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'

export default async function NotFound() {
  const t = await getTranslations('notFound')

  return (
    <section className="theme-dark bg-surface text-ink">
      <div className="container-site flex min-h-[50vh] flex-col items-start justify-center py-16">
        <p className="mb-3 t-eyebrow">404</p>
        <h1 className="foil-text foil-emboss t-h1">{t('title')}</h1>
        <p className="mt-4 measure t-body-lg text-ink-muted">{t('text')}</p>
        <Button asChild className="mt-8">
          <Link href="/">{t('home')}</Link>
        </Button>
      </div>
    </section>
  )
}

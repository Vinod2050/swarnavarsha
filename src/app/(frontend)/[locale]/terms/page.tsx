import { LegalPage } from '@/components/sections/LegalPage'
import { pageMetadata, resolveLocale, type PageProps } from '@/lib/page'

export function generateMetadata({ params }: PageProps) {
  return pageMetadata(params, 'terms', '/terms')
}

export default async function TermsPage({ params }: PageProps) {
  await resolveLocale(params)
  return <LegalPage namespace="terms" />
}

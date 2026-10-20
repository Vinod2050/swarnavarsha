import { LegalPage } from '@/components/sections/LegalPage'
import { pageMetadata, resolveLocale, type PageProps } from '@/lib/page'

export function generateMetadata({ params }: PageProps) {
  return pageMetadata(params, 'privacy', '/privacy-policy')
}

export default async function PrivacyPolicyPage({ params }: PageProps) {
  await resolveLocale(params)
  return <LegalPage namespace="privacy" />
}

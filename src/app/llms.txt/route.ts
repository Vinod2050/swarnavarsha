import { getTranslations } from 'next-intl/server'

import { getFaqs, getServices, getSiteSettings } from '@/lib/content'
import { PAGE_META_KEY, PAGE_PATHS, localeUrl } from '@/lib/seo'

// Rebuilt at most once an hour, so edits in /admin appear without a new deploy
export const revalidate = 3600

/**
 * /llms.txt — a plain Markdown summary of the business for AI assistants (an informal
 * convention; not every assistant reads it). Built only from the site's own settings, page
 * titles and FAQs, so it says nothing the website does not already say.
 */
export async function GET() {
  const locale = 'en'
  const [t, settings, services, faqs] = await Promise.all([
    getTranslations({ locale, namespace: 'meta' }),
    getSiteSettings(locale),
    getServices(locale),
    getFaqs(locale),
  ])

  const lines = [
    `# ${settings.name}`,
    '',
    `> ${t('home.description')}`,
    '',
    `${settings.name} (${settings.legalName}) is a gold buyer and seller in Pune, Maharashtra, India.`,
    'The website is available in English and Marathi (Marathi pages are under /mr).',
    '',
    '## Contact',
    '',
    `- Address: ${settings.address}`,
    ...settings.phones.map((phone) => `- Phone: ${phone.display}`),
    `- WhatsApp: https://wa.me/${settings.whatsapp}`,
    `- Map: ${settings.mapLinkUrl}`,
    ...(settings.openingHours ? [`- Opening hours: ${settings.openingHours}`] : []),
    ...settings.social.map((item) => `- ${item.label}: ${item.url}`),
    '',
    '## Services',
    '',
    ...services.map(
      (service) => `- [${service.title}](${localeUrl(locale, `/${service.slug}`)}): ${service.summary}`,
    ),
    '',
    '## Pages',
    '',
    ...PAGE_PATHS.map((path) => {
      const key = PAGE_META_KEY[path]
      return `- [${t(`${key}.title`)}](${localeUrl(locale, path)}): ${t(`${key}.description`)}`
    }),
    '',
    '## Frequently asked questions',
    '',
    ...faqs.flatMap((faq) => [`### ${faq.question}`, '', faq.answer, '']),
    '## Notes',
    '',
    '- Gold and silver rates on the website are indicative; the final price is decided after purity testing at the branch.',
    '- No investment, deposit or savings schemes are offered.',
    '',
  ]

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  })
}

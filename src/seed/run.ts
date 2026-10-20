import config from '@payload-config'
import { getPayload } from 'payload'

import { passwordProblem } from '@/collections/Users'

import { faqsSeed, offerSeed, servicesSeed, siteSeed } from './data'

/**
 * Fills an empty database with the client content from ./data.ts, in English and Marathi.
 * Run with `pnpm seed`. Safe to run again: anything that already has content is left alone.
 *
 * Not seeded on purpose:
 * - Rates: the sample numbers are not real. Staff enter the first real rate in /admin.
 * - Testimonials: only real reviews with the customer's consent (CLAUDE.md Section 8.3).
 */
const payload = await getPayload({ config })

// First super admin, from SUPERADMIN_EMAIL and SUPERADMIN_PASSWORD in .env
const { SUPERADMIN_EMAIL: email, SUPERADMIN_PASSWORD: password } = process.env
if ((await payload.count({ collection: 'users' })).totalDocs > 0) {
  payload.logger.info('Users: accounts already exist, skipped')
} else if (!email || !password) {
  payload.logger.warn('Users: SUPERADMIN_EMAIL and SUPERADMIN_PASSWORD not set, no account created')
} else if (passwordProblem(password, email)) {
  payload.logger.error(
    `Users: SUPERADMIN_PASSWORD is too weak. ${passwordProblem(password, email)}`,
  )
} else {
  await payload.create({
    collection: 'users',
    data: { name: 'Super Admin', email, password, role: 'superadmin' },
  })
  payload.logger.info(`Users: super admin ${email} created`)
}

const settings = await payload.findGlobal({ slug: 'site-settings', locale: 'en', depth: 0 })
if (settings.phones?.length) {
  payload.logger.info('Site settings: already filled in, skipped')
} else {
  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'en',
    data: {
      phones: siteSeed.phones,
      whatsapp: siteSeed.whatsapp,
      address: siteSeed.address.en,
      mapEmbedUrl: siteSeed.mapEmbedUrl,
      mapLinkUrl: siteSeed.mapLinkUrl,
      openingHours: siteSeed.openingHours?.en,
      social: siteSeed.social,
      showSilver: siteSeed.showSilver,
    },
  })
  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'mr',
    data: { address: siteSeed.address.mr, openingHours: siteSeed.openingHours?.mr },
  })
  payload.logger.info('Site settings: seeded')
}

const offer = await payload.findGlobal({ slug: 'offer', locale: 'en', depth: 0 })
if (offer.text) {
  payload.logger.info('Offer: already filled in, skipped')
} else {
  await payload.updateGlobal({
    slug: 'offer',
    locale: 'en',
    data: { active: offerSeed.active, text: offerSeed.text.en },
  })
  await payload.updateGlobal({ slug: 'offer', locale: 'mr', data: { text: offerSeed.text.mr } })
  payload.logger.info('Offer: seeded')
}

if ((await payload.count({ collection: 'services' })).totalDocs > 0) {
  payload.logger.info('Services: already has rows, skipped')
} else {
  for (const [index, service] of servicesSeed.entries()) {
    const { id } = await payload.create({
      collection: 'services',
      locale: 'en',
      data: {
        slug: service.slug,
        icon: service.icon,
        order: index + 1,
        title: service.title.en,
        summary: service.summary.en,
      },
    })
    await payload.update({
      collection: 'services',
      id,
      locale: 'mr',
      data: { title: service.title.mr, summary: service.summary.mr },
    })
  }
  payload.logger.info(`Services: seeded ${servicesSeed.length}`)
}

if ((await payload.count({ collection: 'faqs' })).totalDocs > 0) {
  payload.logger.info('FAQs: already has rows, skipped')
} else {
  for (const [index, faq] of faqsSeed.entries()) {
    const { id } = await payload.create({
      collection: 'faqs',
      locale: 'en',
      data: {
        category: faq.category,
        showOnHome: faq.showOnHome,
        // Gaps of 10 leave room to slot new questions in between
        order: (index + 1) * 10,
        question: faq.question.en,
        answer: faq.answer.en,
      },
    })
    await payload.update({
      collection: 'faqs',
      id,
      locale: 'mr',
      data: { question: faq.question.mr, answer: faq.answer.mr },
    })
  }
  payload.logger.info(`FAQs: seeded ${faqsSeed.length}`)
}

payload.logger.info('Seed finished')
process.exit(0)

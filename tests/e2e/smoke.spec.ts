import { expect, test } from '@playwright/test'

import { LOCALES, PAGE_PATHS, url } from './helpers'

for (const locale of LOCALES) {
  test.describe(`pages (${locale.code})`, () => {
    for (const pagePath of PAGE_PATHS) {
      test(`${url(locale.prefix, pagePath)} renders with call and WhatsApp one tap away`, async ({
        page,
      }) => {
        const response = await page.goto(url(locale.prefix, pagePath))
        expect(response?.status()).toBe(200)

        await expect(page.locator('html')).toHaveAttribute('lang', locale.code)
        await expect(page.locator('h1')).toHaveCount(1)
        await expect(page.locator('h1')).toBeVisible()
        await expect(page).toHaveTitle(/.+/)

        await expect(page.locator('a[href^="tel:+91"]').first()).toBeAttached()
        await expect(
          page.getByRole('link', { name: locale.messages.common.whatsappChat }),
        ).toHaveAttribute('href', /^https:\/\/wa\.me\/91\d{10}\?text=/)
      })
    }

    test('unknown page shows the translated not-found page', async ({ page }) => {
      const response = await page.goto(url(locale.prefix, '/no-such-page'))
      expect(response?.status()).toBe(404)
      await expect(
        page.getByRole('heading', { name: locale.messages.notFound.title }),
      ).toBeVisible()
    })

    // The call-back form was taken off the whole site on 2026-10-14
    test('contact page has no call-back form', async ({ page }) => {
      await page.goto(url(locale.prefix, '/contact'))

      await expect(page.locator('main form')).toHaveCount(0)
      await expect(page.getByRole('button', { name: locale.messages.enquiry.submit })).toHaveCount(
        0,
      )
    })
  })
}

test('language switch stays on the same page', async ({ page }) => {
  const [from, to] = LOCALES
  await page.goto(url(from.prefix, '/sell-gold'))

  await page
    .getByRole('navigation', { name: from.messages.common.language })
    .first()
    .getByRole('link', { name: to.switchLabel })
    .click()

  await expect(page).toHaveURL(new RegExp(`${url(to.prefix, '/sell-gold')}$`))
  await expect(page.locator('html')).toHaveAttribute('lang', to.code)

  await page
    .getByRole('navigation', { name: to.messages.common.language })
    .first()
    .getByRole('link', { name: from.switchLabel })
    .click()

  await expect(page).toHaveURL(new RegExp(`${url(from.prefix, '/sell-gold')}$`))
  await expect(page.locator('html')).toHaveAttribute('lang', from.code)
})

test('mobile menu opens and navigates', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'the hamburger menu is only shown on phones')
  const { nav } = LOCALES[0].messages
  await page.goto('/')

  await page.getByRole('button', { name: nav.menu }).click()
  await page.getByRole('dialog').getByRole('link', { name: nav.sellGold }).click()

  await expect(page).toHaveURL(/\/sell-gold$/)
  await expect(page.getByRole('dialog')).toBeHidden()
})

test('home page has the rates in the HTML', async ({ request }) => {
  const rates = await (await request.get('/api/rates')).json()
  const html = await (await request.get('/')).text()

  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(rates.buying.gold24k999)
  expect(html).toContain(formatted)
})

test('robots.txt, sitemap.xml and /api/rates respond', async ({ request }) => {
  const robots = await request.get('/robots.txt')
  expect(robots.status()).toBe(200)
  expect(await robots.text()).toContain('/admin')

  const sitemap = await request.get('/sitemap.xml')
  expect(sitemap.status()).toBe(200)
  expect(await sitemap.text()).toContain('/sell-gold')

  const rates = await request.get('/api/rates')
  expect(rates.status()).toBe(200)
  expect(rates.headers()['cache-control']).toContain('s-maxage=300')
})

test('unknown pages answer 404 in both languages', async ({ request }) => {
  for (const path of ['/no-such-page', '/mr/no-such-page', '/sell-gold/no-such-page']) {
    const response = await request.get(path)
    expect(response.status(), path).toBe(404)
  }
})

test('llms.txt and the web manifest respond', async ({ request }) => {
  const llms = await request.get('/llms.txt')
  expect(llms.status()).toBe(200)
  expect(await llms.text()).toContain('Suvarnavarsha Gold')

  const manifest = await request.get('/manifest.webmanifest')
  expect(manifest.status()).toBe(200)
})

test('service pages carry WebPage, BreadcrumbList and Service structured data', async ({
  request,
}) => {
  const html = await (await request.get('/sell-gold')).text()
  for (const type of ['"JewelryStore"', '"WebPage"', '"BreadcrumbList"', '"Service"']) {
    expect(html).toContain(type)
  }
})

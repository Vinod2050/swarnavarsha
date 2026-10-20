import { expect, test, type Page } from '@playwright/test'

import { LOCALES, PAGE_PATHS, url } from './helpers'

/**
 * Phones (320–430, and two on their side), tablets (768, 960 on its side), laptops (1024–1536,
 * one of them short) and desktops, up to a large monitor. screens.spec.ts covers the full list
 * of agreed test sizes for the first screen and the full-screen sections.
 */
const SCREENS = [
  { width: 320, height: 568 },
  { width: 360, height: 740 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  // phones and small tablets on their side
  { width: 568, height: 320 },
  { width: 844, height: 390 },
  { width: 768, height: 1024 },
  { width: 960, height: 600 },
  { width: 1024, height: 768 },
  { width: 1366, height: 650 },
  { width: 1536, height: 864 },
  { width: 1920, height: 950 },
  { width: 2560, height: 1300 },
] as const

type Report = {
  pageWidth: number
  screenWidth: number
  outside: string[]
  clipped: string[]
  stretched: string[]
}

/** Scrolls to the bottom so lazy images load and scroll animations finish, then measures. */
async function measure(page: Page): Promise<Report> {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y)
      await new Promise((resolve) => setTimeout(resolve, 80))
    }
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(700)

  return page.evaluate(() => {
    const screenWidth = document.documentElement.clientWidth
    const name = (el: Element) =>
      `${el.tagName.toLowerCase()}.${String(el.getAttribute('class') ?? '').slice(0, 60)}`
    const outside: Element[] = []
    const clipped: string[] = []
    const stretched: string[] = []

    for (const el of document.querySelectorAll('header *, main *, footer *')) {
      const box = el.getBoundingClientRect()
      if (box.width === 0 || box.height === 0) continue
      const classes = String(el.getAttribute('class') ?? '')
      if (classes.includes('sr-only')) continue
      // A drawing's own frame cuts off its shapes, so only the frame (the <svg>) is measured
      if (el instanceof SVGElement && el.ownerSVGElement) continue

      // A decoration cut off by a clipping parent is not visible outside the screen
      const style = getComputedStyle(el)
      let hiddenByParent = false
      for (let parent = el.parentElement; parent; parent = parent.parentElement) {
        const parentStyle = getComputedStyle(parent)
        if (/hidden|clip/.test(parentStyle.overflowX)) {
          const parentBox = parent.getBoundingClientRect()
          if (parentBox.right <= screenWidth + 1 && parentBox.left >= -1) hiddenByParent = true
          break
        }
      }
      if (
        !hiddenByParent &&
        (box.right > screenWidth + 1 || box.left < -1) &&
        !outside.some((other) => other.contains(el))
      ) {
        outside.push(el)
      }

      // Text cut off by its own box (line clamps and media boxes are deliberate)
      if (
        /hidden|clip/.test(style.overflowY) &&
        el.scrollHeight > el.clientHeight + 2 &&
        !classes.includes('line-clamp') &&
        !el.querySelector('img,video,iframe,svg')
      ) {
        clipped.push(`${name(el)} needs ${el.scrollHeight}px, has ${el.clientHeight}px`)
      }

      // A photo drawn in a different shape from its file, without cover or contain to fit it
      if (el instanceof HTMLImageElement && el.naturalWidth > 0 && style.objectFit === 'fill') {
        const drawn = box.width / box.height
        const natural = el.naturalWidth / el.naturalHeight
        if (Math.abs(drawn - natural) / natural > 0.03) {
          stretched.push(
            `${el.getAttribute('src')?.slice(0, 60)} drawn ${drawn.toFixed(2)}, file ${natural.toFixed(2)}`,
          )
        }
      }
    }

    return {
      pageWidth: document.documentElement.scrollWidth,
      screenWidth,
      outside: outside.map((el) => {
        const box = el.getBoundingClientRect()
        return `${name(el)} [${Math.round(box.left)}..${Math.round(box.right)}]`
      }),
      clipped,
      stretched,
    }
  })
}

/**
 * Every page, in both languages, at each screen size: no sideways scroll, nothing outside the
 * screen, no text cut off by its box and no stretched photo. The screen sizes are set here, so
 * the test runs once (in the desktop project) instead of once per device.
 */
for (const locale of LOCALES) {
  test.describe(`layout (${locale.code})`, () => {
    for (const pagePath of PAGE_PATHS) {
      test(`${url(locale.prefix, pagePath)} fits every screen size`, async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'desktop', 'screen sizes are set inside the test')
        test.setTimeout(180_000)

        // Blocks that slide in are measured where they come to rest, not part-way through
        await page.emulateMedia({ reducedMotion: 'reduce' })
        await page.setViewportSize(SCREENS[0])
        await page.goto(url(locale.prefix, pagePath), { waitUntil: 'networkidle' })

        for (const screen of SCREENS) {
          await page.setViewportSize(screen)
          const report = await measure(page)
          const at = `${screen.width}×${screen.height}`

          expect
            .soft(report.pageWidth, `sideways scroll at ${at}`)
            .toBeLessThanOrEqual(report.screenWidth)
          expect.soft(report.outside, `outside the screen at ${at}`).toEqual([])
          expect.soft(report.clipped, `text cut off at ${at}`).toEqual([])
          expect.soft(report.stretched, `stretched photo at ${at}`).toEqual([])
        }
      })
    }
  })
}

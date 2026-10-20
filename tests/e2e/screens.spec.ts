import { expect, test } from '@playwright/test'

import { LOCALES, PAGE_PATHS, url } from './helpers'

/**
 * The responsive test sizes agreed with Finixsoft (2026-10-16): phones and tablets in both
 * orientations, laptops and desktop monitors up to 4K.
 */
const SCREENS = [
  // phones, portrait and on their side
  [320, 568],
  [360, 800],
  [375, 812],
  [390, 844],
  [412, 915],
  [430, 932],
  [568, 320],
  [800, 360],
  [812, 375],
  [844, 390],
  [915, 412],
  [932, 430],
  // tablets, portrait and on their side
  [600, 960],
  [768, 1024],
  [810, 1080],
  [834, 1194],
  [1024, 1366],
  [960, 600],
  [1024, 768],
  [1080, 810],
  [1194, 834],
  [1366, 1024],
  // laptops and desktop monitors
  [1280, 720],
  [1366, 768],
  [1440, 900],
  [1536, 864],
  [1920, 1080],
  [2560, 1440],
  [3840, 2160],
].map(([width, height]) => ({ width, height }))

/** Marathi runs longer, so it is checked too, at one size of each kind */
const MARATHI_SCREENS = SCREENS.filter((s) =>
  ['320x568', '390x844', '844x390', '768x1024', '960x600', '1366x768', '1920x1080'].includes(
    `${s.width}x${s.height}`,
  ),
)

/**
 * The first screen and the full-screen sections (globals.css `min-h-first-screen`,
 * `min-h-screen-section`): an inner page's hero fills the first screen exactly, every
 * full-screen section fits one screen under the sticky header, the floating Call / WhatsApp
 * buttons never cover the hero's own buttons, and nothing scrolls sideways.
 */
for (const locale of LOCALES) {
  const screens = locale.code === 'en' ? SCREENS : MARATHI_SCREENS

  test.describe(`screens (${locale.code})`, () => {
    for (const pagePath of PAGE_PATHS) {
      test(`${url(locale.prefix, pagePath)} fits the first screen and each full-screen section`, async ({
        page,
      }, testInfo) => {
        test.skip(testInfo.project.name !== 'desktop', 'screen sizes are set inside the test')
        test.setTimeout(240_000)
        await page.emulateMedia({ reducedMotion: 'reduce' })

        for (const screen of screens) {
          await page.setViewportSize(screen)
          await page.goto(url(locale.prefix, pagePath), { waitUntil: 'networkidle' })
          const at = `${screen.width}×${screen.height}`

          const report = await page.evaluate(() => {
            const vh = innerHeight
            const hero = document.querySelector('main section.min-h-first-screen')
            const heroBottom = hero ? Math.round(hero.getBoundingClientRect().bottom) : null

            const header = document.querySelector('header')
            const room = vh - (header?.getBoundingClientRect().height ?? 0)
            const tooTall = [...document.querySelectorAll('main .min-h-screen-section')]
              // Natural height (min-height 0) on very tall or very short screens
              .filter((s) => parseFloat(getComputedStyle(s).minHeight) > 0)
              .map((s) => ({
                title: s.querySelector('h2')?.textContent?.trim() ?? '',
                over: Math.round(s.getBoundingClientRect().height - room),
              }))
              .filter((s) => s.over > 1)

            let covered = false
            const floating = document.querySelector('.floating-actions')
            const cta = document.querySelector('[data-hero-cta]')
            if (floating && cta) {
              const style = getComputedStyle(floating)
              if (style.visibility !== 'hidden' && style.opacity !== '0') {
                const c = cta.getBoundingClientRect()
                covered = [...floating.querySelectorAll('a')].some((a) => {
                  const r = a.getBoundingClientRect()
                  return (
                    r.width > 0 &&
                    r.left < c.right &&
                    r.right > c.left &&
                    r.top < c.bottom &&
                    r.bottom > c.top
                  )
                })
              }
            }

            return {
              vh,
              heroBottom,
              tooTall,
              covered,
              pageWidth: document.documentElement.scrollWidth,
              screenWidth: document.documentElement.clientWidth,
            }
          })

          expect
            .soft(report.pageWidth, `sideways scroll at ${at}`)
            .toBeLessThanOrEqual(report.screenWidth)
          if (report.heroBottom !== null) {
            expect
              .soft(report.heroBottom, `hero runs past the first screen at ${at}`)
              .toBeLessThanOrEqual(report.vh + 1)
            expect
              .soft(report.heroBottom, `hero stops short of the screen bottom at ${at}`)
              .toBeGreaterThanOrEqual(report.vh - 2)
          }
          expect.soft(report.tooTall, `sections taller than one screen at ${at}`).toEqual([])
          expect
            .soft(report.covered, `floating buttons cover the hero buttons at ${at}`)
            .toBe(false)
        }
      })
    }
  })
}

# TODO — responsive work (started 2026-10-15/16)

Pick up from **P1**. Each item says how to check it is done.

## Done so far

- Sell Gold page reworked:
  - Hero highlights (3 ticks) added.
  - "What we buy" uses compact cards.
  - The price panel has its own screen.
  - Documents and Payment sit side by side.
- `PageHero` (all inner pages):
  - Fills the first screen exactly (`min-h-first-screen`, uses `svh`).
  - On phones the photo sits behind the text under a plum veil; from tablet width up it is framed beside the text.
  - Spacing tightens on short screens.
  - Hero Call / WhatsApp buttons sit side by side on phones (`CtaButtons inline`).
- Full-screen sections (`min-h-screen-section`, `screen` prop on `ContentSection`, `Process`, `RateStrip`):
  - Used on Sell Gold only.
  - Active on screens 600–1080px tall; natural height above and below that (agreed with Finixsoft 2026-10-16).
- Floating Call / WhatsApp buttons hide while a hero's own buttons are on screen (`FloatingActionsShell` + `data-hero-cta`).
- Page zoom on 2240px+ monitors is divided out of the screen heights (`--page-zoom`).
- New test `tests/e2e/screens.spec.ts` covers the agreed viewport list. `layout.spec.ts` gained 4 sizes (landscape phones, small tablet on its side).
- Audit (scratch script, not in the repo): **552 / 552 checks clean**.
  - English: 12 pages × 34 sizes.
  - Marathi: 12 pages × 12 sizes.
  - Checks: no sideways scroll, nothing off screen, no clipped or spilling text, no stretched images, hero fills the first screen, full-screen sections fit, floating buttons never cover the hero buttons.
- `pnpm typecheck` and `eslint` pass on all changed files.

## P1 — finish verification (before anything else)

1. [ ] **Playwright suite: not run yet.** The 2026-10-16 run was stopped part-way because the computer ran low on memory, and it produced no results. Close other apps, start the dev server (`pnpm dev`), then run:
   `pnpm exec playwright test --workers=1 --reporter=line`
   (1 worker; with the dev server running the machine had only ~2 GB free). Fix any failure, especially in the new `screens.spec.ts`. To run just the new test: `pnpm exec playwright test screens --workers=1`.
2. [ ] **Production build.** `pnpm build` has not been run since these changes. Stop the dev server first to free memory. Check the Home page client JS stays ≤ 120 KB gzipped (CLAUDE.md §13), since `FloatingActionsShell` is a new client component.
3. [ ] **Full lint.** `pnpm lint` (whole project; only changed files were linted).

## P2 — real-device checks (automation cannot cover these)

4. [ ] Android Chrome and iPhone Safari, portrait and landscape:
   - The hero ends exactly at the bottom toolbar (`svh`).
   - The floating buttons appear after scrolling past the hero buttons.
   - Call and WhatsApp open correctly.
5. [ ] Mobile menu (Sheet) and the Services dropdown on phones turned sideways (568×320, 844×390). The audit did not open menus or dropdowns.
6. [ ] Video section and carousel on phones and tablets: play, poster, no overflow. The audit measured layout only, not playback.

## P3 — decisions to make

7. [ ] Apply full-screen sections (`screen` prop) to the other inner pages too (Release Pledged Gold, Buy Gold, How It Works, About…)? Today only Sell Gold uses them.
8. [ ] Home page hero (`HeroSlides`) does not use `min-h-first-screen`. Should it fill the first screen like the inner pages?
9. [ ] 320×568 phone and phones on their side: sections take their natural height (taller than one screen), because their content cannot fit legibly at the 16px minimum body size. Confirm this is acceptable.
10. [ ] Record the full-screen section rule as a Finixsoft exception in CLAUDE.md §6 (same style as the emerald-theme note).

## P4 — maintenance

11. [ ] `--site-topbar` / `--site-header` in `globals.css` copy the TopBar / Header heights by hand. If either component's height changes, update them. `screens.spec.ts` fails if they drift.
12. [ ] Optionally move the scratch audit script into `scripts/` so the page × size report can be re-run. `screens.spec.ts` and `layout.spec.ts` already cover the same rules in CI.

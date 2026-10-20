import { defineConfig, devices } from '@playwright/test'

const PORT = Number(process.env.PORT) || 3000
const baseURL = process.env.E2E_BASE_URL || `http://localhost:${PORT}`

/** Smoke tests (CLAUDE.md Section 14.11). Run with `pnpm test:e2e`. */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    // Most customers are on phones (Section 1), so the phone layout is tested first
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
  ],
  // Set E2E_BASE_URL to test a deployed site instead of starting one here
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: process.env.CI ? 'pnpm start' : 'pnpm dev',
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
})

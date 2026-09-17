import { defineConfig, devices } from '@playwright/test';

const PORT = 4173;

export default defineConfig({
  testDir: './e2e',
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] }, testIgnore: 'screenshots.spec.ts' },
    { name: 'mobile', use: { ...devices['Pixel 7'] }, testIgnore: 'screenshots.spec.ts' },
    // Run explicitly with `npm run screenshots`
    {
      name: 'screenshots',
      use: { ...devices['Desktop Chrome'] },
      testMatch: 'screenshots.spec.ts',
    },
  ],
  // Runs against the production build; the API is stubbed per test (see e2e/mock-api.ts)
  webServer: {
    command: `npm run build && npx vite preview --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});

import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright 스모크 테스트 설정.
 * - 브라우저: chromium. 로컬에선 PLAYWRIGHT_CHROMIUM_PATH로 사전 설치본을 가리키고,
 *   CI에선 `npx playwright install chromium`이 제공하므로 env가 없으면 undefined(기본 경로).
 * - webServer: 빌드 산출물을 vite preview로 4173 포트에 서빙(test:e2e가 사전 build 수행).
 */
export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined,
        },
      },
    },
  ],
  webServer: {
    command: 'npm run preview -- --port 4173',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});

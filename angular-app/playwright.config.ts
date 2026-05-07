/// <reference types="node" />
import { defineConfig, devices } from "@playwright/test";

const isCI = !!process.env["CI"];
const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

export default defineConfig({
  testDir: "./e2e/tests",
  fullyParallel: false,
  workers: isCI ? 1 : 1,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  reporter: [
    ["list"],
    [
      "html",
      {
        outputFolder: `playwright-report/report-${timestamp}`,
        open: "never",
      },
    ],
  ],
  use: {
    baseURL: process.env["PLAYWRIGHT_TEST_BASE_URL"] ?? "http://localhost:4200",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    /*{
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },

    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    */
    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  webServer: {
    command: "npm run start:silent",
    url: "http://localhost:4200",
    reuseExistingServer: true,
    timeout: 180000,
  },
});

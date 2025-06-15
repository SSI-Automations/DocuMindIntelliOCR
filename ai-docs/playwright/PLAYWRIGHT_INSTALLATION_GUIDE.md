# Playwright Installation Guide (for New Projects)

This guide provides a step-by-step process to set up Playwright for End-to-End (E2E) testing in a new Next.js project, based on our project's configuration and best practices.

## Prerequisites

Before you begin, ensure you have:

- Node.js (LTS version recommended)
- pnpm (our preferred package manager)
- A new Next.js project initialized and functional.

## Step 1: Install Playwright

Navigate to your project's root directory in the terminal and run the following command to initialize Playwright. This command will guide you through the setup process.

```bash
pnpm create playwright
```

During the installation, you will be prompted with a few questions:

1.  **Where to put your end-to-end tests?**
    - Enter `tests` (this is our recommended directory).
2.  **Add a GitHub Actions workflow?**
    - Select `N` (No), as we manage CI separately.
3.  **Install Playwright browsers?**
    - Select `Y` (Yes) to install the necessary browsers (Chromium, Firefox, WebKit).

This command will create the `playwright.config.ts` file, a `tests` directory (with an `example.spec.ts` file), and install the required Playwright dependencies.

## Step 2: Configure Playwright

We need to configure Playwright to automatically start our Next.js development server and set the base URL for tests.

Open `playwright.config.ts` and modify the `webServer` and `baseURL` properties as follows:

```typescript
import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: "http://localhost:3000",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },

    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
```

## Step 3: Install Node.js Types

If you encounter TypeScript errors related to the `process` global variable in `playwright.config.ts`, you might need to install the Node.js type definitions:

```bash
pnpm add --save-dev @types/node
```

## Step 4: Update Project Metadata (if applicable)

Ensure your Next.js application's root layout (`app/layout.tsx`) has a descriptive title. Playwright tests often assert on page titles.

Open `app/layout.tsx` and modify the `metadata` object as follows:

```typescript
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Health Coach AI',
  description: 'The All-in-One AI-Powered Platform for Health Coaches',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

## Step 5: Verify Installation with a "Hello World" Test

Playwright generates an `example.spec.ts` file in the `tests` directory. We can adapt this to test basic page content. Ensure your `app/page.tsx` (the root page) has some distinguishable text.

Open `tests/example.spec.ts` and replace its content with the following:

```typescript
import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Health Coach AI/);
});

test("has signup form heading", async ({ page }) => {
  await page.goto("/");

  // Expect the page to have the main heading.
  await expect(
    page.getByRole("heading", { name: "Start Your Free Trial" }),
  ).toBeVisible();
});

test("has signup form subheading", async ({ page }) => {
  await page.goto("/");

  // Expect the page to have the subheading.
  await expect(
    page.getByText("Don't get left behind - join the AI coaching movement."),
  ).toBeVisible();
});
```

## Step 6: Run Your First Tests

With the configuration and test file updated, run the tests from your project root:

```bash
pnpm exec playwright test
```

If everything is configured correctly, all tests should pass.

## Step 7: Clean Up (Optional)

After verifying the installation, you can remove the `tests-examples` directory created by Playwright:

```bash
rm -rf tests-examples
```

Your Playwright environment is now ready for writing comprehensive E2E tests!

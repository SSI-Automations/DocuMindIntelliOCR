# Playwright Test Organization and Best Practices

This document outlines the recommended folder hierarchy for organizing Playwright tests, strategies for tagging and grouping tests, and general best practices for writing robust and maintainable end-to-end tests for this project.

## 1. Test Folder Hierarchy

To keep our test suite organized and scalable, we recommend structuring the `tests` directory based on application features or modules. Each top-level feature of the application should have its own directory within `tests`, containing related test files.

```
tests/
├── auth/
│   ├── login.spec.ts
│   └── signup.spec.ts
├── dashboard/
│   ├── clients.spec.ts
│   └── insights.spec.ts
├── onboarding/
│   ├── wizard.spec.ts
│   └── profile.spec.ts
├── common/
│   ├── navigation.spec.ts
│   └── footer.spec.ts
└── playwright.config.ts
```

- **`tests/auth/`**: Contains tests related to user authentication (login, signup, password reset, etc.).
- **`tests/dashboard/`**: Contains tests for the dashboard features (client management, insights, etc.).
- **`tests/onboarding/`**: Contains tests for the user onboarding flow.
- **`tests/common/`**: Contains shared tests for common elements or functionalities that span across multiple features (e.g., navigation, header, footer).

## 2. Test Tagging and Grouping Strategy

We will use Playwright's built-in capabilities to tag and group tests for different testing purposes (e.g., smoke tests, regression tests).

### Using `test.describe` and Annotations for Grouping

For general grouping and readability, use `test.describe` to group related tests within a file. You can also use annotations like `test.skip`, `test.only`, `test.fixme` for temporary filtering during development.

### Smoke Tests

Smoke tests are a subset of tests that verify the critical functionalities of the application are working. These should be run frequently (e.g., on every commit or before every deployment).

To define smoke tests, we can use `test.describe.configure({ mode: 'serial' })` for a specific set of critical tests, or leverage Playwright projects in `playwright.config.ts` if a separate browser configuration or setup is needed for smoke tests.

**Recommendation for Smoke Tests:**

Create a dedicated tag for smoke tests (e.g., `@smoke`) within the test files, or configure a Playwright project specifically for smoke tests in `playwright.config.ts`.

Example `playwright.config.ts` snippet for a smoke project:

```typescript
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  // ... other configurations
  projects: [
    {
      name: "Smoke",
      testMatch: /.*\.smoke\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "Regression",
      testIgnore: /.*\.smoke\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
    // ... other browser projects
  ],
});
```

Then, name your smoke test files with `.smoke.spec.ts` suffix (e.g., `login.smoke.spec.ts`).

To run only smoke tests:

```bash
pnpm exec playwright test --project=Smoke
```

### Regression Tests

Regression tests are a comprehensive set of tests to ensure that recent code changes have not adversely affected existing functionalities. These are typically run less frequently than smoke tests (e.g., nightly builds, before major releases).

All tests not explicitly marked as smoke tests (or other specific tags) can be considered part of the regression suite.

To run only regression tests (excluding smoke tests if configured as above):

```bash
pnpm exec playwright test --project=Regression
```

## 3. Best Practices for Playwright Tests

Based on this project's structure and common Next.js patterns, here are some best practices:

1.  **Prioritize User-Facing Locators**: Instead of relying on brittle CSS classes or DOM structure, use user-facing locators like `getByRole`, `getByText`, `getByLabel`, `getByPlaceholder`, or `getByTestId`. This makes tests more resilient to UI changes.

    ```typescript
    // Good
    await page.getByRole("button", { name: "Submit" }).click();
    await expect(page.getByText("Welcome!")).toBeVisible();

    // Avoid
    await page.locator(".submit-button").click();
    await expect(page.locator("#welcome-message")).toBeVisible();
    ```

2.  **Maintain Test Isolation**: Each test should be independent and not rely on the state of previous tests. Playwright's `page` fixture provides a fresh browser context for each test, ensuring isolation. Use `test.beforeEach` for common setup like navigation or login to maintain a clean state.

3.  **Leverage `baseURL` and `webServer`**: As configured in `playwright.config.ts`, use `page.goto('/')` instead of hardcoding `http://localhost:3000`. The `webServer` option ensures the Next.js development server is automatically started before tests run, simplifying the test execution flow.

4.  **Use Web-First Assertions**: Playwright's `expect` assertions (e.g., `toBeVisible()`, `toContainText()`) automatically wait for the element to appear or the condition to be met, reducing the need for arbitrary `waitForTimeout` calls.

    ```typescript
    // Good
    await expect(page.getByText("Loading...")).not.toBeVisible();

    // Avoid
    await page.waitForTimeout(1000); // Arbitrary wait
    expect(await page.getByText("Loading...").isVisible()).toBe(false);
    ```

5.  **Mock API Calls**: For unit or integration-like E2E tests, consider mocking API calls using `page.route()` to ensure consistent test data and faster execution, especially for external dependencies.

6.  **Avoid Testing Third-Party Components Internally**: If you are using a UI library like `shadcn/ui`, focus on testing how your application integrates and uses these components, rather than re-testing the components themselves. Their internal functionality is handled by their respective libraries.

7.  **Descriptive Test Names**: Write clear and concise test names that describe the behavior being tested. This improves test readability and makes it easier to understand failures.

8.  **Add Debugging Logs & Comments**: Follow the project's rule to include `console.log` statements for key operations and add clear, concise comments to explain the purpose and logic of code sections within your tests. This helps in debugging and understanding test flow.

By following these guidelines, our Playwright test suite will be robust, maintainable, and an effective tool for ensuring the quality of the Health Coach AI application.

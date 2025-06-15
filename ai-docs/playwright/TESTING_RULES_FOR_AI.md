# AI Assistant Rules for End-to-End Testing

This document outlines the mandatory rules for the AI assistant to follow when implementing new features or fixing bugs in this project. The goal is to ensure our Playwright test suite remains comprehensive, up-to-date, and a reliable indicator of application quality.

**These rules are to be followed by you, the AI assistant, in every relevant development task.**

---

## Core Principles

### 1. New Features Require New Tests

When you implement a new feature, you **MUST** create new end-to-end (E2E) tests that validate its functionality. The tests should cover the primary success path and common edge cases.

_Example: If you add a "Client Notes" feature, you must add tests for creating, editing, and deleting notes._

### 2. Bug Fixes Require Test Validation

When you fix a bug, you **MUST** ensure a test exists that covers the bug scenario.

- If a test already exists and was failing, ensure your fix makes it pass.
- If no test exists, you **MUST** create a new test that would have failed before your fix.

### 3. Maintain Existing Tests

If your code changes cause existing tests to fail, you **MUST** update those tests to reflect the changes. Do not ignore or delete failing tests unless the feature they cover has been removed.

---

## Test Organization and Structure

You must follow this structure to keep the test suite organized and scalable.

### 1. Folder Hierarchy

Structure the `tests` directory based on application features.

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
└── common/
    ├── navigation.spec.ts
    └── footer.spec.ts
```

- **`auth/`**: Tests for user authentication.
- **`dashboard/`**: Tests for dashboard features.
- **`onboarding/`**: Tests for the user onboarding flow.
- **`common/`**: Tests for shared elements or functionalities (e.g., navigation, footer).

### 2. Test Tagging and Grouping

Use Playwright's project configuration to manage different test suites. You will configure `playwright.config.ts` to distinguish between smoke and regression tests.

- **Smoke Tests**: A small, fast subset of tests for critical functionality. Name these files with a `.smoke.spec.ts` suffix.
- **Regression Tests**: The comprehensive suite of all other tests.

Update `playwright.config.ts` with the following `projects` configuration to enable this strategy:

```typescript
// In playwright.config.ts
projects: [
  // Setup project
  { name: 'setup', testMatch: /.*\.setup\.ts/ },

  {
    name: 'smoke',
    testMatch: /.*\.smoke\.spec\.ts/,
    dependencies: ['setup'],
    use: {
      ...devices['Desktop Chrome'],
      // Use prepared auth state.
      storageState: 'playwright/.auth/user.json',
    },
  },

  {
    name: 'regression',
    testIgnore: /.*\.smoke\.spec\.ts/,
    dependencies: ['setup'],
    use: {
      ...devices['Desktop Chrome'],
      // Use prepared auth state.
      storageState: 'playwright/.auth/user.json',
    },
  },

  // ... other browser/device configurations if needed
],
```

To run only smoke tests: `pnpm exec playwright test --project=smoke`
To run regression tests: `pnpm exec playwright test --project=regression`

---

## Best Practices for Writing Tests

You must adhere to the following best practices when writing tests.

1.  **Prioritize User-Facing Locators**: Use locators like `getByRole`, `getByText`, `getByLabel`, `getByPlaceholder`, or `getByTestId`. This makes tests resilient.

    ```typescript
    // Good
    await page.getByRole("button", { name: "Submit" }).click();
    ```

2.  **Maintain Test Isolation**: Each test must be independent. Use `test.beforeEach` for common setup like navigation. For authentication, use the `setup` project to log in once and reuse the state (as configured in the projects above).

3.  **Leverage `baseURL` and `webServer`**: The project is already configured to use a `baseURL` and start the dev server automatically. Use relative paths like `page.goto('/dashboard')`.

4.  **Use Web-First Assertions**: Use Playwright's `expect` which automatically waits for conditions to be met. Avoid manual waits.

    ```typescript
    // Good
    await expect(page.getByText("Success!")).toBeVisible();
    ```

5.  **Mock API Calls**: When appropriate, use `page.route()` to mock API responses for consistent and fast tests.

6.  **Descriptive Test Names**: Write clear test names that describe the behavior being tested.

7.  **Add Debugging Logs & Comments**: As per general project rules, include `console.log` statements for key operations and add comments to explain complex test logic.

By adhering to these rules, you will help maintain a high-quality, robust, and reliable application.

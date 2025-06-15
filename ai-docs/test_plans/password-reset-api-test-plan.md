# Test Plan: Supabase Password Reset API Integration

## 1. Introduction

This document outlines the test plan for the automated functional testing of the Supabase Password Reset API integration within the Health Coach AI application. The primary goal of these tests is to ensure that users can securely and successfully initiate and complete the password reset process through various API interactions.

## 2. Scope

### 2.1 In-Scope

- **Functional Testing:** Verification of all core functionalities related to password reset, including sending reset emails, updating passwords, and validating user authentication post-reset.
- **API Integration:** Testing interactions directly with Supabase Auth APIs and any internal `/api/auth/reset-password` endpoint.
- **User Provisioning & Cleanup:** Automated creation and deletion of test users for isolated test execution.
- **Environment Variable Validation:** Ensuring necessary environment variables are present for test execution.

### 2.2 Out-of-Scope

- **Performance Testing:** Load, stress, or scalability testing of the password reset functionality.
- **Security Vulnerability Assessment:** Comprehensive penetration testing or vulnerability scanning.
- **UI/UX Testing:** End-to-end testing of the password reset form user interface (this is covered by separate E2E UI tests).
- **Email Content/Delivery Validation:** Actual content or delivery specifics of reset emails (focus is on API response).
- **Database Schema Validation:** Detailed verification of database schema beyond user data presence.

## 3. Test Environment

- **Application:** Health Coach AI Application
- **API:** Supabase Auth API, Internal `/api/auth/reset-password` endpoint
- **Testing Framework:** Playwright
- **Language:** TypeScript
- **Database:** Supabase Postgres
- **Environment Variables:**
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (for admin operations)

## 4. Test Data

- **Test Users:** Dynamically generated unique email addresses and passwords for each test run to ensure isolation and prevent conflicts (e.g., `playwright-{browser}-{timestamp}@ssiautomations.com`).
- **User Role:** `coach` (configurable if needed).

## 5. Test Setup and Teardown

Each test scenario leverages `beforeEach` and `afterEach` hooks to ensure a clean state:

### 5.1 `beforeEach` (Setup)

1. **Generate Unique User:** Create a unique test user email and passwords based on browser name and timestamp.
2. **Validate Environment Variables:** Assert that all required Supabase environment variables are available.
3. **Initialize Supabase Clients:** Create both anonymous and admin Supabase client instances.
4. **Create Confirmed User:** Programmatically create a confirmed user in `auth.users` using the Supabase admin client. This user will be used for the subsequent password reset tests.
5. **Introduce Delay:** Implement a brief delay (1 second) to mitigate potential Supabase rate limits.

### 5.2 `afterEach` (Teardown)

1. **Introduce Delay:** Implement a brief delay (0.5 seconds) before starting cleanup.
2. **Cleanup Test User:** If a user was successfully created, delete the user's records from `profiles` (if any) and then from `auth.users` using the Supabase admin client.
3. **Handle Cleanup Errors:** Log any warnings during cleanup without failing the test.
4. **Introduce Post-Cleanup Delay:** Implement another brief delay (1 second) to further mitigate rate limits for subsequent tests.

## 6. Test Scenarios

### 6.1 Scenario: Send Password Reset Email via Supabase Auth API

- **Objective:** Verify that the Supabase Auth API successfully accepts a password reset request for a valid user and indicates that a reset email has been sent.
- **User Flow:** A user requests a password reset by providing their email address.
- **Test Steps:**
  1. Call `supabase.auth.resetPasswordForEmail()` with the test user's email and a redirect URL.
- **Acceptance Criteria (Expected Results):**
  - The `error` object returned from `resetPasswordForEmail` is `null`.
  - Console log confirms that the password reset email was sent successfully.
  - Console log confirms the reset link redirects to the expected URL.

### 6.2 Scenario: Update Password via Admin API

- **Objective:** Verify that a user's password can be successfully updated using the Supabase Admin API (simulating the action after a user clicks a reset link) and that the user can then log in with the new password.
- **User Flow:** (Simulated) User clicks reset link, lands on password update page, provides new password. Then, user attempts to log in with new password.
- **Test Steps:**
  1. Call `supabaseAdmin.auth.admin.updateUserById()` with the `createdUserId` and the `newPassword`.
  2. Attempt to sign in with the `testUser.email` and `testUser.newPassword`.
  3. Sign out the user.
- **Acceptance Criteria (Expected Results):**
  - The `error` object returned from `updateUserById` is `null`.
  - The `updatedUser.user` object returned is truthy.
  - Console log confirms that the password was updated successfully via admin API.
  - The `error` object returned from `signInWithPassword` with `newPassword` is `null`.
  - The `loginData.user` object is truthy and its email matches `testUser.email`.
  - Console log confirms successful login with the new password.

### 6.3 Scenario: Handle Password Reset Request via Internal API Endpoint

- **Objective:** Verify that the internal `/api/auth/reset-password` endpoint (if implemented) correctly processes password reset requests and returns an appropriate response.
- **User Flow:** A request is sent to the application's own password reset API endpoint.
- **Test Steps:**
  1. Make a POST request to `/api/auth/reset-password` with the `testUser.email`.
- **Acceptance Criteria (Expected Results):**
  - If the endpoint exists and is implemented: The response status is 200 (OK).
  - If the endpoint does not exist: The response status is 404 (Not Found).
  - Console log indicates whether the API endpoint responded successfully or if it was not found (as expected if not implemented).

### 6.4 Scenario: Validate Complete Password Reset Flow

- **Objective:** Verify the entire password reset process end-to-end, from initiating the request to successfully logging in with a new password and ensuring the old password no longer works.
- **User Flow:** User (pre-confirmed) initiates a password reset, (simulated) updates password, then attempts to log in with new password, and verifies old password fails.
- **Test Steps:**
  1. Verify the `createdUserId` exists and its email is confirmed using `supabaseAdmin.auth.admin.getUserById()`.
  2. Call `supabase.auth.resetPasswordForEmail()` with `testUser.email`.
     - If rate limit exceeded, log a warning and continue (do not fail test).
     - Otherwise, expect `resetError` to be `null` and log success.
  3. Introduce a delay (2 seconds) to avoid immediate subsequent rate limits.
  4. Call `supabaseAdmin.auth.admin.updateUserById()` with `createdUserId` and `testUser.newPassword`.
  5. Attempt to sign in with `testUser.email` and `testUser.newPassword`.
  6. Sign out the user.
  7. Attempt to sign in with `testUser.email` and `testUser.password` (old password).
- **Acceptance Criteria (Expected Results):**
  - User exists and is confirmed (`email_confirmed_at` is truthy).
  - `resetError` is `null` (unless rate limit exceeded, in which case it's handled).
  - `updateError` is `null`.
  - Successful login with `newPassword` (`loginError` is `null`, `loginData.user` is truthy).
  - Failed login with `oldPassword` (`oldPasswordError` is truthy and message contains 'Invalid login credentials').
  - Console log confirms successful validation of the complete flow.

## 7. Reporting

Test results will be generated by Playwright, providing:

- Pass/Fail status for each test.
- Duration of test execution.
- Detailed error messages and stack traces for failures.
- Console output logs for debugging and context.

## 8. Areas for Improvement

- **Dedicated Test Environment:** Utilize a separate, isolated test environment for Supabase to prevent interference with development data and dedicated rate limits for testing.
- **Test Data Factory:** Implement a more robust test data factory for complex user scenarios (e.g., creating users with specific profile data).
- **Mocking External Services:** For true unit/integration tests, consider mocking the actual email sending service to avoid hitting real-world rate limits and dependencies on external services.
- **Configuration Management:** Centralize Playwright configuration for environment variables and Supabase clients to reduce duplication.
- **Monitoring:** Integrate test results with a CI/CD pipeline and a reporting dashboard for continuous monitoring.
- **Test Data Cleanup Robustness:** Enhance cleanup to actively query and remove any remaining user data in case `createdUserId` is somehow not set (though current implementation should prevent this).

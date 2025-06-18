# Authentication Test Plan

## 1. Test Plan Overview

### 1.1 Purpose

This document outlines the functional testing strategy for the Health Coach AI authentication system, focusing on the signup flow. The goal is to ensure that user registration, authentication, and related database operations work as expected.

### 1.2 Scope

- User registration flow
- Authentication processes
- Database operations during signup
- Error handling and edge cases
- Data cleanup procedures

## 2. Test Environment

### 2.1 Prerequisites

- Node.js environment
- Playwright test runner
- Supabase instance
- Required environment variables:
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`

### 2.2 Test Data

- Test users with unique emails (automatically generated)
- Test password: "ValidPassword123!" (meets security requirements)

## 3. Test Cases

### 3.1 Signup Flow

#### TC-001: New User Registration

**Objective**: Verify a new user can successfully register

- **Preconditions**:
  - Test email is not already registered
  - Supabase service is available
- **Test Steps**:
  1. Call `supabase.auth.signUp` with valid credentials
  2. Verify response contains user data
  3. Verify no error is returned
  4. Verify user ID is generated
- **Expected Results**:
  - User is created in auth.users
  - User ID is returned in response
  - No errors occur during the process

#### TC-002: Duplicate User Registration

**Objective**: Verify system prevents duplicate email registration

- **Preconditions**:
  - Test email is already registered
- **Test Steps**:
  1. Attempt to register with existing email
  2. Verify error response
- **Expected Results**:
  - Registration attempt fails
  - Appropriate error message is returned

### 3.2 Data Integrity

#### TC-003: Profile and Coach Record Creation

**Objective**: Verify related records are created during signup

- **Preconditions**:
  - New user registration
- **Test Steps**:
  1. Complete user registration
  2. Verify records in 'profiles' table
  3. Verify records in 'coach' table
- **Expected Results**:
  - Profile record is created with matching user ID
  - Coach record is created with matching user ID
  - All required fields are populated

### 3.3 Cleanup Process

#### TC-004: Test Cleanup

**Objective**: Verify proper cleanup of test data

- **Preconditions**:
  - Test user exists in the system
- **Test Steps**:
  1. Execute cleanup function
  2. Verify user is removed from all tables
- **Expected Results**:
  - User is removed from auth.users
  - Related records are removed from 'profiles' and 'coach' tables
  - No orphaned records remain

## 4. Test Automation

### 4.1 Framework

- **Testing Framework**: Playwright
- **Language**: TypeScript
- **Assertion Library**: Playwright Test

### 4.2 Test Structure

```typescript
test.describe("Authentication Flow", () => {
  // Test setup

  test("should allow new user registration", async () => {
    // Test implementation
  });

  // Additional test cases
});
```

### 4.3 Test Data Management

- Unique email generation using `nanoid`
- Automatic cleanup after each test
- Isolated test cases

## 5. Error Handling

### 5.1 Expected Error Cases

- Duplicate email registration
- Invalid email format
- Weak password
- Service unavailability
- Missing required fields

### 5.2 Error Logging

- Console logging for test steps
- Detailed error messages
- Stack traces for failures

## 6. Test Execution

### 6.1 Running Tests

```bash
# Run all authentication tests
npx playwright test tests/auth/

# Run with UI
npx playwright test --ui

# Run specific test file
npx playwright test tests/auth/signup-ssr.spec.ts
```

### 6.2 Test Reports

- HTML reports for test execution
- Screenshots on failure
- Video recordings (if configured)

## 7. Maintenance

### 7.1 Test Updates

- Update tests when authentication flow changes
- Review and update test data as needed
- Maintain test documentation

### 7.2 Known Issues

- List any known issues or limitations
- Workarounds if applicable

## 8. Dependencies

- @supabase/supabase-js
- @playwright/test
- nanoid

## 9. Future Enhancements

- Add more validation test cases
- Implement negative testing
- Add performance testing
- Include security testing (OWASP Top 10)

## 10. Approval

| Role            | Name | Date |
| --------------- | ---- | ---- |
| Test Engineer   |      |      |
| QA Lead         |      |      |
| Project Manager |      |      |

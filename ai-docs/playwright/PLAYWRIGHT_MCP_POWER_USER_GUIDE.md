# Playwright MCP Power User Guide

## Table of Contents

- [Overview](#overview)
- [Quick Setup](#quick-setup)
- [Power User Commands](#power-user-commands)
- [Advanced Workflows](#advanced-workflows)
- [Performance Optimization](#performance-optimization)
- [Testing Automation Strategies](#testing-automation-strategies)
- [Debugging and Troubleshooting](#debugging-and-troubleshooting)
- [Best Practices](#best-practices)

## Overview

The Playwright MCP (Model Context Protocol) tool enables browser automation directly within Claude Code, allowing you to:

- Inspect live web pages and extract element locators
- Generate and update Page Object Models automatically
- Create test scripts from browser interactions
- Debug test failures with visual snapshots
- Automate repetitive testing tasks

## Quick Setup

### Installation

```bash
# Add Playwright MCP to Claude Code
claude mcp add playwright npx -- @playwright/mcp@latest
```

### Advanced Configuration Options

```bash
# Headless mode for CI/CD
claude mcp add playwright npx -- @playwright/mcp@latest --headless

# Vision mode for visual debugging
claude mcp add playwright npx -- @playwright/mcp@latest --vision

# Isolated sessions (clean state each run)
claude mcp add playwright npx -- @playwright/mcp@latest --isolated

# Custom viewport size
claude mcp add playwright npx -- @playwright/mcp@latest --viewport-size "1920,1080"

# Enable specific capabilities only
claude mcp add playwright npx -- @playwright/mcp@latest --caps "core,tabs,testing"
```

## Power User Commands

### 1. Page Inspection & Element Discovery

```typescript
// Navigate and capture page structure
await mcp__playwright__browser_navigate({ url: "http://localhost:3000/login" });
await mcp__playwright__browser_snapshot();

// Take targeted screenshots for documentation
await mcp__playwright__browser_take_screenshot({
  filename: "login-form.png",
  element: "Login form section",
  ref: "e50",
});
```

### 2. Automated POM Generation

Use browser inspection to automatically update Page Object Models:

```typescript
// 1. Navigate to page
// 2. Take snapshot to get element references
// 3. Update POM file with accurate locators
// 4. Add helper methods for common actions
```

### 3. Test Data Generation

```typescript
// Generate test scenarios from user interactions
await mcp__playwright__browser_generate_playwright_test({
  name: "Login Flow Test",
  description: "Test complete login flow with validation",
  steps: [
    "Navigate to login page",
    "Fill email and password",
    "Click login button",
    "Verify dashboard redirect",
  ],
});
```

## Advanced Workflows

### 1. Cross-Browser Testing Setup

```bash
# Chrome
claude mcp add playwright-chrome npx -- @playwright/mcp@latest --browser chrome

# Firefox
claude mcp add playwright-firefox npx -- @playwright/mcp@latest --browser firefox

# WebKit
claude mcp add playwright-webkit npx -- @playwright/mcp@latest --browser webkit
```

### 2. Responsive Testing

```bash
# Mobile viewport
claude mcp add playwright-mobile npx -- @playwright/mcp@latest --device "iPhone 15"

# Tablet viewport
claude mcp add playwright-tablet npx -- @playwright/mcp@latest --viewport-size "1024,768"

# Desktop viewport
claude mcp add playwright-desktop npx -- @playwright/mcp@latest --viewport-size "1920,1080"
```

### 3. Authentication State Management

```bash
# Save authenticated state
claude mcp add playwright-auth npx -- @playwright/mcp@latest --storage-state "./auth-state.json"

# Use saved state for faster test runs
claude mcp add playwright-fast npx -- @playwright/mcp@latest --storage-state "./auth-state.json" --isolated
```

## Performance Optimization

### 1. Speed Optimization Techniques

```typescript
// Use concurrent operations
await Promise.all([
  mcp__playwright__browser_navigate({ url: "/login" }),
  mcp__playwright__browser_wait_for({ text: "Welcome Back" }),
]);

// Minimize screenshots (expensive operations)
// Only take screenshots when debugging or documenting

// Use headless mode for faster execution
// Reserve headed mode for debugging only
```

### 2. Resource Management

```bash
# Block unnecessary resources for faster loading
claude mcp add playwright-fast npx -- @playwright/mcp@latest --blocked-origins "*.googletagmanager.com;*.google-analytics.com"

# Disable service workers if not needed
claude mcp add playwright-fast npx -- @playwright/mcp@latest --block-service-workers
```

### 3. Network Optimization

```bash
# Use proxy for external requests
claude mcp add playwright-proxy npx -- @playwright/mcp@latest --proxy-server "http://localhost:8080"

# Bypass proxy for local development
claude mcp add playwright-dev npx -- @playwright/mcp@latest --proxy-bypass "localhost,127.0.0.1,.local"
```

## Testing Automation Strategies

### 1. Page Object Model Automation

```typescript
// Workflow: Inspect → Generate → Test → Refine
1. Navigate to page with MCP tool
2. Capture element snapshot
3. Auto-generate/update POM class
4. Create test using POM
5. Run test and iterate
```

### 2. Visual Regression Testing

```typescript
// Capture baseline screenshots
await mcp__playwright__browser_take_screenshot({
  filename: "baseline-login.png",
  raw: true, // PNG format for pixel-perfect comparison
});

// Compare against baseline in tests
// Use in CI/CD for visual regression detection
```

### 3. API + UI Integration Testing

```typescript
// Monitor network requests during UI interactions
await mcp__playwright__browser_network_requests();

// Validate API calls triggered by UI actions
// Test error handling scenarios
// Verify data consistency between API and UI
```

### 4. Accessibility Testing

```typescript
// Use snapshots for accessibility analysis
await mcp__playwright__browser_snapshot();

// Verify proper ARIA labels and roles
// Test keyboard navigation
// Validate screen reader compatibility
```

## Debugging and Troubleshooting

### 1. Debug Mode Setup

```bash
# Enable trace saving for debugging
claude mcp add playwright-debug npx -- @playwright/mcp@latest --save-trace --vision
```

### 2. Console Message Monitoring

```typescript
// Capture JavaScript errors and logs
await mcp__playwright__browser_console_messages();

// Monitor for unexpected errors during test execution
// Debug client-side issues
```

### 3. Network Request Analysis

```typescript
// Track all network activity
await mcp__playwright__browser_network_requests();

// Identify failed API calls
// Analyze performance bottlenecks
// Debug CORS issues
```

### 4. Step-by-Step Debugging

```typescript
// Take screenshots at each step
await mcp__playwright__browser_click({ element: "Login button", ref: "e63" });
await mcp__playwright__browser_take_screenshot({
  filename: "after-login-click.png",
});

// Wait for specific conditions
await mcp__playwright__browser_wait_for({ text: "Dashboard" });
```

## Best Practices

### 1. Efficient Element Selection

```typescript
// Prefer role-based selectors (more stable)
page.getByRole("button", { name: "Sign In" }); // ✅ Good

// Avoid fragile selectors
page.locator("#btn-123"); // ❌ Avoid - IDs may change
page.locator(".css-xyz"); // ❌ Avoid - CSS classes may change
```

### 2. Smart Waiting Strategies

```typescript
// Wait for specific elements, not arbitrary timeouts
await mcp__playwright__browser_wait_for({ text: "Welcome Back" }); // ✅ Good
await mcp__playwright__browser_wait_for({ time: 5 }); // ❌ Avoid
```

### 3. Test Data Management

```typescript
// Use isolated sessions for clean test data
// Save authentication state to speed up test setup
// Generate test data programmatically, don't rely on UI setup
```

### 4. Error Handling

```typescript
// Always handle potential failures gracefully
try {
  await mcp__playwright__browser_click({ element: "Button", ref: "e1" });
} catch (error) {
  // Take screenshot for debugging
  await mcp__playwright__browser_take_screenshot({
    filename: "error-state.png",
  });
  throw error;
}
```

### 5. Maintenance Strategy

```typescript
// Regular POM updates using MCP inspection
// Version control for baseline screenshots
// Automated smoke tests using MCP tools
// Documentation generation from live page inspection
```

## Common Patterns

### 1. Authentication Flow Testing

```typescript
// 1. Navigate to login page
// 2. Inspect form elements
// 3. Update POM with current selectors
// 4. Test login with valid/invalid credentials
// 5. Verify redirect behavior
```

### 2. Form Validation Testing

```typescript
// 1. Inspect form structure
// 2. Test each field validation
// 3. Capture error states visually
// 4. Verify error messages
```

### 3. Responsive Design Testing

```typescript
// 1. Test multiple viewport sizes
// 2. Capture screenshots at each breakpoint
// 3. Verify element visibility and layout
// 4. Test touch interactions on mobile
```

### 4. Performance Testing

```typescript
// 1. Monitor network requests
// 2. Measure page load times
// 3. Identify slow-loading elements
// 4. Test under different network conditions
```

## Integration with CI/CD

### 1. Headless Configuration for CI

```bash
# CI-optimized configuration
claude mcp add playwright-ci npx -- @playwright/mcp@latest --headless --no-sandbox --isolated
```

### 2. Artifact Generation

```typescript
// Generate test reports with screenshots
// Save trace files for failed tests
// Capture network logs for debugging
```

### 3. Parallel Testing

```bash
# Run multiple instances for parallel testing
# Use different configurations for different test suites
# Optimize resource usage in CI environment
```

---

_This guide helps you maximize the power of Playwright MCP for faster, more reliable test automation. Combine these techniques with your existing testing framework for optimal results._

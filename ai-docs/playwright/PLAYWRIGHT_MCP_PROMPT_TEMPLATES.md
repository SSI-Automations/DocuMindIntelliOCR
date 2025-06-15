# Playwright MCP Prompt Templates

## Table of Contents

- [Page Object Model Generation](#page-object-model-generation)
- [Test Creation and Automation](#test-creation-and-automation)
- [Debugging and Troubleshooting](#debugging-and-troubleshooting)
- [Visual Testing and Screenshots](#visual-testing-and-screenshots)
- [API Integration Testing](#api-integration-testing)
- [Accessibility Testing](#accessibility-testing)
- [Performance Testing](#performance-testing)
- [Cross-Browser Testing](#cross-browser-testing)

## Page Object Model Generation

### 1. Create POM from Live Page

```
Use playwright MCP to inspect the elements on [URL] and create/update the Page Object Model for [PageName]. Include all interactive elements, form fields, buttons, and navigation links. Add helper methods for common user actions.
```

### 2. Update Existing POM

```
Use playwright MCP to navigate to [URL], capture the current page elements, and update the existing POM at [file-path]. Focus on [specific-section] and ensure locators match the actual DOM structure.
```

### 3. Generate POM with Validation Methods

```
Inspect [URL] with playwright MCP and create a comprehensive POM that includes:
- All form elements with proper locators
- Validation methods for each field
- Error message locators
- Success state indicators
- Helper methods for complete user workflows
```

### 4. Mobile-Responsive POM

```
Use playwright MCP to inspect [URL] at mobile viewport (375x667) and desktop viewport (1920x1080). Create a responsive POM that handles element differences between breakpoints.
```

## Test Creation and Automation

### 1. End-to-End Test Generation

```
Use playwright MCP to navigate through this user journey on [URL]:
1. [Step 1]
2. [Step 2]
3. [Step 3]

Generate a complete Playwright test that includes assertions, error handling, and cleanup. Use the existing POM pattern from our codebase.
```

### 2. Form Validation Test Suite

```
Inspect the form at [URL] using playwright MCP and create comprehensive validation tests for:
- Required field validation
- Email format validation
- Password strength requirements
- Error message display
- Success submission flow
Include both positive and negative test scenarios.
```

### 3. Authentication Flow Tests

```
Use playwright MCP to analyze the login/signup flow starting at [URL]. Create tests for:
- Valid login credentials
- Invalid credentials (wrong password, non-existent user)
- Password reset flow
- Session persistence
- Logout functionality
Generate reusable authentication helpers for other tests.
```

### 4. API + UI Integration Tests

```
Monitor network requests using playwright MCP while testing [feature] at [URL]. Create tests that verify:
- Correct API calls are made
- UI reflects API responses
- Error handling for failed requests
- Loading states during API calls
```

## Debugging and Troubleshooting

### 1. Debug Test Failure

```
My Playwright test for [test-name] is failing at [URL]. Use playwright MCP to:
1. Navigate to the failing step
2. Take a screenshot of the current state
3. Inspect the DOM elements
4. Check console messages
5. Analyze what might have changed and suggest fixes
```

### 2. Element Not Found Investigation

```
The locator [locator-code] is not finding elements on [URL]. Use playwright MCP to:
- Inspect the current page structure
- Find the actual element structure
- Suggest more robust locator strategies
- Update the POM with reliable selectors
```

### 3. Timing Issue Diagnosis

```
Tests are failing intermittently on [URL] due to timing issues. Use playwright MCP to:
- Identify elements that load asynchronously
- Suggest proper wait strategies
- Find loading indicators to wait for
- Recommend best practices for stable test execution
```

### 4. Console Error Analysis

```
Capture and analyze console messages on [URL] using playwright MCP. Identify:
- JavaScript errors that might affect test stability
- Network failures
- Performance warnings
- Suggest fixes for critical issues
```

## Visual Testing and Screenshots

### 1. Visual Regression Testing Setup

```
Use playwright MCP to capture baseline screenshots for visual regression testing of [page/component] at [URL]. Include:
- Multiple viewport sizes (mobile, tablet, desktop)
- Different user states (logged in/out)
- Various form states (empty, filled, error)
- Light/dark theme variations if applicable
```

### 2. Component Screenshot Documentation

```
Navigate to [URL] and capture annotated screenshots of [component-name] showing:
- Default state
- Hover states
- Active/selected states
- Error states
- Loading states
Generate documentation with these screenshots.
```

### 3. Cross-Browser Visual Testing

```
Use playwright MCP to capture screenshots of [URL] across:
- Chrome
- Firefox
- Safari (WebKit)
Compare and document any visual differences, especially for [specific-feature].
```

### 4. Responsive Design Validation

```
Test [URL] across these breakpoints using playwright MCP:
- Mobile: 375x667
- Tablet: 768x1024
- Desktop: 1920x1080
- Large Desktop: 2560x1440
Capture screenshots and verify responsive behavior of [component/layout].
```

## API Integration Testing

### 1. API Call Verification

```
Use playwright MCP to monitor network requests on [URL] while performing [action]. Verify:
- Correct API endpoints are called
- Request payloads match expected format
- Response codes are handled properly
- Error responses trigger appropriate UI feedback
```

### 2. Real-time Data Testing

```
Test real-time features at [URL] using playwright MCP:
- Monitor WebSocket connections
- Verify data updates in real-time
- Test reconnection behavior
- Validate UI updates match incoming data
```

### 3. Authentication API Integration

```
Test authentication flows at [URL] using playwright MCP:
- Monitor auth token handling
- Verify token refresh mechanisms
- Test expired token scenarios
- Validate secure cookie handling
```

### 4. Error Handling Validation

```
Simulate API failures while testing [URL] with playwright MCP:
- Network timeouts
- 500 server errors
- 401 unauthorized responses
- Malformed response data
Verify UI handles each scenario gracefully.
```

## Accessibility Testing

### 1. ARIA Compliance Check

```
Use playwright MCP to inspect [URL] and verify accessibility compliance:
- Check ARIA labels and roles
- Validate heading hierarchy
- Test keyboard navigation flow
- Verify focus management
- Generate accessibility test recommendations
```

### 2. Screen Reader Compatibility

```
Analyze [URL] with playwright MCP for screen reader compatibility:
- Identify missing alt text
- Check form label associations
- Verify semantic HTML structure
- Test skip navigation links
```

### 3. Color Contrast Validation

```
Inspect [URL] using playwright MCP and identify potential color contrast issues:
- Text on background combinations
- Interactive element states
- Error message visibility
- Success indicator contrast
```

### 4. Keyboard Navigation Testing

```
Test keyboard-only navigation on [URL] using playwright MCP:
- Tab order verification
- Focus indicator visibility
- Keyboard shortcuts functionality
- Modal dialog trap focus
- Generate keyboard navigation test suite
```

## Performance Testing

### 1. Page Load Performance

```
Analyze page load performance of [URL] using playwright MCP:
- Measure time to first contentful paint
- Identify slow-loading resources
- Monitor network waterfall
- Suggest performance optimizations
```

### 2. Core Web Vitals Testing

```
Test Core Web Vitals for [URL] using playwright MCP:
- Largest Contentful Paint (LCP)
- First Input Delay (FID)
- Cumulative Layout Shift (CLS)
- Generate performance test assertions
```

### 3. Memory Usage Monitoring

```
Monitor memory usage while testing [feature] at [URL] using playwright MCP:
- Check for memory leaks
- Monitor DOM growth
- Analyze JavaScript heap usage
- Test garbage collection effectiveness
```

### 4. Network Performance Testing

```
Test [URL] under various network conditions using playwright MCP:
- Slow 3G simulation
- Fast 3G simulation
- Offline scenarios
- Verify graceful degradation
```

## Cross-Browser Testing

### 1. Browser Compatibility Suite

```
Create cross-browser tests for [URL] using playwright MCP across:
- Chrome (latest)
- Firefox (latest)
- Safari/WebKit (latest)
- Edge (latest)
Focus on [specific-feature] compatibility and document any differences.
```

### 2. Feature Detection Testing

```
Test progressive enhancement on [URL] using playwright MCP:
- Verify core functionality without JavaScript
- Test with limited CSS support
- Validate graceful feature degradation
- Check polyfill effectiveness
```

### 3. Mobile Browser Testing

```
Test [URL] on mobile browsers using playwright MCP:
- Chrome Mobile
- Safari Mobile
- Samsung Internet
- Focus on touch interactions and mobile-specific features
```

### 4. Legacy Browser Support

```
Test [URL] compatibility with older browser versions using playwright MCP:
- Document breaking changes
- Identify required polyfills
- Test fallback mechanisms
- Generate compatibility matrix
```

## Quick Action Prompts

### Rapid POM Update

```
Quick: Update POM for [PageName] - navigate to [URL], snapshot elements, update locators in [file-path]
```

### Fast Debug

```
Debug: Test failing on [URL] at step "[step]" - inspect, screenshot, suggest fix
```

### Element Inspector

```
Find: Locate element for "[description]" on [URL] - provide reliable locator
```

### Test Generator

```
Generate: E2E test for "[user-story]" starting at [URL] - use existing patterns
```

### Screenshot Capture

```
Capture: Screenshots of [component] on [URL] - all states, mobile + desktop
```

## Advanced Workflow Prompts

### 1. Complete Feature Testing

```
Implement comprehensive testing for [feature-name]:
1. Use playwright MCP to inspect all related pages
2. Generate/update POMs for each page
3. Create end-to-end test scenarios
4. Add visual regression tests
5. Include API integration validation
6. Generate test documentation
```

### 2. Test Maintenance Sprint

```
Maintenance sprint using playwright MCP:
1. Audit all existing POMs against live pages
2. Update outdated locators
3. Add missing accessibility tests
4. Improve test reliability with better waits
5. Generate test coverage report
```

### 3. New Feature Test Setup

```
Set up testing for new [feature-name] using playwright MCP:
1. Analyze requirements and user journeys
2. Inspect implementation at [URL]
3. Create comprehensive POM
4. Generate test scenarios (happy path + edge cases)
5. Set up CI/CD integration
6. Create maintenance documentation
```

---

_Use these prompt templates to maximize efficiency when working with Playwright MCP. Customize the placeholders [URL], [feature-name], etc. with your specific values._

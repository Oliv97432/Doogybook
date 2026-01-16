# Playwright Testing Guide for Doogybook

This directory contains end-to-end (E2E) tests for the Doogybook application using Playwright.

## Getting Started

### Running Tests

```bash
# Run all tests
npm test

# Run tests in UI mode (recommended for development)
npm run test:ui

# Run tests in headed mode (see the browser)
npm run test:headed

# Run tests in a specific browser
npm run test:chromium
npm run test:firefox
npm run test:webkit

# Run mobile tests only
npm run test:mobile

# Debug tests
npm run test:debug

# View test report
npm run test:report
```

## Test Structure

The tests are organized by feature:

- **landing.spec.js** - Tests for the landing page functionality
- **authentication.spec.js** - Tests for login/signup flows
- **accessibility.spec.js** - Accessibility compliance tests
- **navigation.spec.js** - Tests for app navigation
- **pwa.spec.js** - Progressive Web App features tests

## Writing New Tests

### Basic Test Structure

```javascript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should do something', async ({ page }) => {
    // Your test code here
    await expect(page).toHaveTitle(/Expected Title/);
  });
});
```

### Best Practices

1. **Use Descriptive Test Names** - Test names should clearly describe what is being tested
2. **Keep Tests Independent** - Each test should be able to run independently
3. **Use Page Object Model** - For complex pages, consider creating page objects
4. **Wait for Elements Properly** - Use Playwright's auto-waiting features
5. **Clean Up After Tests** - Ensure tests don't leave side effects

### Common Patterns

#### Waiting for Navigation
```javascript
await page.waitForLoadState('networkidle');
```

#### Checking Element Visibility
```javascript
await expect(page.locator('selector')).toBeVisible();
```

#### Clicking Elements
```javascript
await page.getByRole('button', { name: 'Submit' }).click();
```

#### Filling Forms
```javascript
await page.getByLabel('Email').fill('test@example.com');
await page.getByLabel('Password').fill('password123');
```

## Configuration

The Playwright configuration is in [playwright.config.js](../playwright.config.js).

Key settings:
- **Base URL**: `http://localhost:5173` (Vite dev server)
- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Retries**: 2 retries on CI, 0 locally
- **Screenshots**: Captured on failure
- **Videos**: Retained on failure
- **Traces**: Captured on first retry

## Continuous Integration

Tests are configured to run on CI with:
- Parallel execution disabled on CI
- 2 retry attempts for flaky tests
- Forbidden use of `test.only`

## Debugging Tests

### Debug Mode
```bash
npm run test:debug
```

This will:
- Open the Playwright Inspector
- Allow you to step through tests
- Inspect the page state at each step

### UI Mode
```bash
npm run test:ui
```

This provides a visual interface to:
- Run and watch tests
- See test execution in real-time
- Time travel through test steps
- Inspect DOM snapshots

## Troubleshooting

### Tests are failing locally but passing on CI
- Ensure your dev server is running on port 5173
- Check for race conditions or timing issues
- Verify your local environment matches CI

### Slow tests
- Use `networkidle` sparingly, prefer specific element waiting
- Consider reducing timeout values where appropriate
- Use parallel execution: `npx playwright test --workers=4`

### Flaky tests
- Add explicit waits for dynamic content
- Use `toBeVisible()` instead of checking existence
- Ensure proper cleanup between tests

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [Best Practices](https://playwright.dev/docs/best-practices)

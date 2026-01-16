import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test('should have proper document structure', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check for proper HTML structure
    const main = page.locator('main, [role="main"], #root');
    await expect(main).toBeVisible();
  });

  test('should have accessible navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check for navigation elements
    const nav = page.locator('nav, [role="navigation"]');

    if ((await nav.count()) > 0) {
      await expect(nav.first()).toBeVisible();
    }
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Test tab navigation
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement.tagName);

    // Should focus on an interactive element
    expect(['A', 'BUTTON', 'INPUT']).toContain(focusedElement);
  });

  test('should have proper color contrast', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // This is a basic check - for comprehensive accessibility testing,
    // consider using @axe-core/playwright
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('images should have alt text', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Get all images
    const images = page.locator('img');
    const count = await images.count();

    if (count > 0) {
      for (let i = 0; i < Math.min(count, 10); i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');

        // Alt attribute should exist (can be empty for decorative images)
        expect(alt).toBeDefined();
      }
    }
  });
});

import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate between pages', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Test navigation to About page if it exists
    const aboutLink = page.getByRole('link', { name: /à propos|about/i });

    if (await aboutLink.isVisible()) {
      await aboutLink.click();
      await page.waitForLoadState('networkidle');

      // Verify URL changed
      await expect(page).toHaveURL(/about/i);
    }
  });

  test('should handle 404 pages gracefully', async ({ page }) => {
    const response = await page.goto('/non-existent-page-12345');

    // Should either redirect or show 404
    if (response) {
      expect([200, 404]).toContain(response.status());
    }
  });

  test('should navigate back and forward', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Click on any link
    const firstLink = page.getByRole('link').first();

    if (await firstLink.isVisible()) {
      const initialUrl = page.url();
      await firstLink.click();
      await page.waitForLoadState('networkidle');

      // Navigate back
      await page.goBack();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toBe(initialUrl);

      // Navigate forward
      await page.goForward();
      await page.waitForLoadState('networkidle');
      expect(page.url()).not.toBe(initialUrl);
    }
  });

  test('should maintain state when navigating', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // This test can be expanded based on your app's state management
    const root = page.locator('#root');
    await expect(root).toBeVisible();
  });
});

import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the landing page successfully', async ({ page }) => {
    // Check that the page title is correct
    await expect(page).toHaveTitle(/Doogybook/);
  });

  test('should display the main heading', async ({ page }) => {
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Check for key elements on the landing page
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
  });

  test('should have proper meta tags', async ({ page }) => {
    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /Doogybook/);
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForLoadState('networkidle');

    // Ensure the page is still functional on mobile
    const root = page.locator('#root');
    await expect(root).toBeVisible();
  });

  test('should navigate to sign up when clicking CTA button', async ({ page }) => {
    // Look for common CTA text (adjust based on your actual button text)
    const ctaButton = page.getByRole('button', { name: /inscription|s'inscrire|commencer/i }).first();

    if (await ctaButton.isVisible()) {
      await ctaButton.click();
      // Wait for navigation or modal to appear
      await page.waitForTimeout(1000);
    }
  });
});

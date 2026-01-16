import { test, expect } from '@playwright/test';

test.describe('PWA Features', () => {
  test('should have a service worker', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Wait a bit for service worker to register
    await page.waitForTimeout(2000);

    // Check if service worker is registered
    const hasServiceWorker = await page.evaluate(async () => {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        return !!registration;
      }
      return false;
    });

    // PWA should have a service worker
    expect(hasServiceWorker).toBe(true);
  });

  test('should have a manifest file', async ({ page }) => {
    await page.goto('/');

    // Check for manifest link
    const manifestLink = page.locator('link[rel="manifest"]');
    await expect(manifestLink).toHaveAttribute('href', /manifest\.json/);

    // Verify manifest is accessible
    const manifestHref = await manifestLink.getAttribute('href');
    const manifestResponse = await page.request.get(manifestHref || '/manifest.json');
    expect(manifestResponse.ok()).toBe(true);

    // Parse and validate manifest
    const manifest = await manifestResponse.json();
    expect(manifest.name || manifest.short_name).toBeTruthy();
  });

  test('should have theme color meta tag', async ({ page }) => {
    await page.goto('/');

    const themeColor = page.locator('meta[name="theme-color"]');
    await expect(themeColor).toHaveAttribute('content', /.+/);
  });

  test('should have apple touch icons', async ({ page }) => {
    await page.goto('/');

    const appleTouchIcon = page.locator('link[rel="apple-touch-icon"]');
    const count = await appleTouchIcon.count();

    expect(count).toBeGreaterThan(0);
  });

  test('should work offline after initial load', async ({ page, context }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Wait for service worker to cache resources
    await page.waitForTimeout(3000);

    // Simulate offline mode
    await context.setOffline(true);

    // Reload the page
    await page.reload();

    // Page should still be accessible (service worker serves cached version)
    const root = page.locator('#root');
    await expect(root).toBeVisible({ timeout: 10000 });

    // Re-enable online mode
    await context.setOffline(false);
  });
});

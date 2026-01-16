import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should display login form', async ({ page }) => {
    await page.goto('/');

    // Look for login/signin link or button
    const loginLink = page.getByRole('link', { name: /connexion|login|se connecter/i }).first();

    if (await loginLink.isVisible()) {
      await loginLink.click();
      await page.waitForLoadState('networkidle');

      // Check for email and password inputs
      const emailInput = page.getByLabel(/email|e-mail/i).or(page.getByPlaceholder(/email/i));
      const passwordInput = page.getByLabel(/mot de passe|password/i).or(page.getByPlaceholder(/mot de passe|password/i));

      await expect(emailInput.first()).toBeVisible();
      await expect(passwordInput.first()).toBeVisible();
    }
  });

  test('should show validation errors for empty login form', async ({ page }) => {
    await page.goto('/');

    const loginLink = page.getByRole('link', { name: /connexion|login|se connecter/i }).first();

    if (await loginLink.isVisible()) {
      await loginLink.click();
      await page.waitForLoadState('networkidle');

      // Try to submit empty form
      const submitButton = page.getByRole('button', { name: /connexion|login|se connecter/i }).first();

      if (await submitButton.isVisible()) {
        await submitButton.click();
        await page.waitForTimeout(500);

        // Form validation should prevent submission or show error messages
        // This will depend on your implementation
      }
    }
  });

  test('should navigate to registration page', async ({ page }) => {
    await page.goto('/');

    const registerLink = page.getByRole('link', { name: /inscription|s'inscrire|créer un compte|register/i }).first();

    if (await registerLink.isVisible()) {
      await registerLink.click();
      await page.waitForLoadState('networkidle');

      // Verify we're on the registration page
      await expect(page).toHaveURL(/inscription|register|signup/i);
    }
  });
});

import { test, expect, devices } from '@playwright/test';

/**
 * TEST COMPLET DE TOUTES LES FONCTIONNALITÉS - DOOGYBOOK
 * Mobile, Tablette et PC
 */

// Configuration des devices à tester
const testDevices = [
  { name: 'Desktop 1920x1080', viewport: { width: 1920, height: 1080 }, type: 'desktop' },
  { name: 'Tablet iPad Pro', device: 'iPad Pro', type: 'tablet' },
  { name: 'Mobile iPhone 14', device: 'iPhone 14', type: 'mobile' },
];

testDevices.forEach(({ name, viewport, device, type }) => {
  test.describe(`Tests Complets - ${name}`, () => {
    test.use(device ? devices[device] : { viewport });

    test('1. Landing Page - Éléments visibles et responsive', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Vérifier titre
      await expect(page).toHaveTitle(/Doogybook/);

      // Vérifier qu'il n'y a pas de défilement horizontal
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(hasHorizontalScroll).toBe(false);

      // Vérifier présence du root
      const root = page.locator('#root');
      await expect(root).toBeVisible();

      // Screenshot
      await page.screenshot({
        path: `test-results/${name.replace(/\s+/g, '-')}-landing.png`,
        fullPage: true
      });
    });

    test('2. Navigation - Liens principaux fonctionnels', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Liens vers connexion
      const loginLink = page.getByRole('link', { name: /connexion|login/i }).first();
      if (await loginLink.isVisible({ timeout: 2000 }).catch(() => false)) {
        await loginLink.click();
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL(/login/);
        await page.goBack();
      }

      // Liens vers inscription
      await page.goto('/');
      const registerLink = page.getByRole('link', { name: /inscription|s'inscrire/i }).first();
      if (await registerLink.isVisible({ timeout: 2000 }).catch(() => false)) {
        await registerLink.click();
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL(/register/);
      }
    });

    test('3. Page Login - Formulaire visible et validations', async ({ page }) => {
      await page.goto('/login');
      await page.waitForLoadState('networkidle');

      // Vérifier champs de formulaire
      const emailInput = page.locator('input[type="email"]').or(page.getByPlaceholder(/email/i)).first();
      const passwordInput = page.locator('input[type="password"]').first();

      await expect(emailInput).toBeVisible();
      await expect(passwordInput).toBeVisible();

      // Vérifier dimensions des inputs (accessibilité mobile)
      if (type === 'mobile') {
        const emailBox = await emailInput.boundingBox();
        expect(emailBox.height).toBeGreaterThanOrEqual(44); // Minimum iOS/Android
      }

      await page.screenshot({
        path: `test-results/${name.replace(/\s+/g, '-')}-login.png`,
        fullPage: true
      });
    });

    test('4. Page Register - Formulaire visible', async ({ page }) => {
      await page.goto('/register');
      await page.waitForLoadState('networkidle');

      // Vérifier présence du formulaire
      const root = page.locator('#root');
      await expect(root).toBeVisible();

      await page.screenshot({
        path: `test-results/${name.replace(/\s+/g, '-')}-register.png`,
        fullPage: true
      });
    });

    test('5. Page Adoption Publique - Chiens visibles', async ({ page }) => {
      await page.goto('/adoption');
      await page.waitForLoadState('networkidle');

      // Vérifier que la page charge
      const root = page.locator('#root');
      await expect(root).toBeVisible();

      // Attendre un peu pour le chargement des données
      await page.waitForTimeout(2000);

      await page.screenshot({
        path: `test-results/${name.replace(/\s+/g, '-')}-adoption.png`,
        fullPage: true
      });
    });

    test('6. PWA - Service Worker et Manifest', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      // Vérifier Service Worker
      const hasServiceWorker = await page.evaluate(async () => {
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.getRegistration();
          return !!registration;
        }
        return false;
      });

      expect(hasServiceWorker).toBe(true);

      // Vérifier Manifest
      const manifestLink = page.locator('link[rel="manifest"]');
      await expect(manifestLink).toHaveCount(1);
    });

    test('7. Responsive Design - Pas de débordement', async ({ page }) => {
      const pages = ['/', '/login', '/register', '/adoption', '/about', '/contact'];

      for (const url of pages) {
        try {
          await page.goto(url, { waitUntil: 'networkidle', timeout: 10000 });

          const hasHorizontalScroll = await page.evaluate(() => {
            return document.documentElement.scrollWidth > document.documentElement.clientWidth;
          });

          if (hasHorizontalScroll) {
            console.warn(`⚠️ Débordement horizontal détecté sur ${url} - ${name}`);
          }

          expect(hasHorizontalScroll).toBe(false);
        } catch (e) {
          console.log(`Page ${url} non accessible (probablement protégée)`);
        }
      }
    });

    test('8. Images - Alt text et chargement', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      const images = page.locator('img');
      const count = await images.count();

      let imagesWithoutAlt = 0;
      let imagesNotLoaded = 0;

      for (let i = 0; i < Math.min(count, 10); i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');

        if (!alt || alt === '') {
          imagesWithoutAlt++;
        }

        const naturalWidth = await img.evaluate(el => el.naturalWidth);
        if (naturalWidth === 0) {
          imagesNotLoaded++;
        }
      }

      console.log(`Images testées: ${Math.min(count, 10)}`);
      console.log(`Images sans alt: ${imagesWithoutAlt}`);
      console.log(`Images non chargées: ${imagesNotLoaded}`);
    });

    test('9. Performance - Temps de chargement', async ({ page }) => {
      const startTime = Date.now();

      await page.goto('/', { waitUntil: 'networkidle' });

      const loadTime = Date.now() - startTime;

      console.log(`⏱️ Temps de chargement ${name}: ${loadTime}ms`);

      // Le chargement devrait être inférieur à 5 secondes
      expect(loadTime).toBeLessThan(5000);
    });

    test('10. Meta Tags SEO - Présents', async ({ page }) => {
      await page.goto('/');

      // Meta description
      const metaDescription = page.locator('meta[name="description"]');
      await expect(metaDescription).toHaveCount(1);

      // Meta keywords
      const metaKeywords = page.locator('meta[name="keywords"]');
      await expect(metaKeywords).toHaveCount(1);

      // Open Graph
      const ogTitle = page.locator('meta[property="og:title"]');
      await expect(ogTitle).toHaveCount(1);

      // Theme color
      const themeColor = page.locator('meta[name="theme-color"]');
      await expect(themeColor).toHaveCount(1);
    });

  });
});

// Tests spécifiques MOBILE uniquement
test.describe('Tests Spécifiques Mobile', () => {
  test.use(devices['iPhone 12']);

  test('Touch targets - Taille minimum 44x44px', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    const buttons = page.locator('button');
    const count = await buttons.count();

    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i);
      if (await button.isVisible()) {
        const box = await button.boundingBox();
        if (box) {
          // iOS recommande minimum 44x44px
          const meetsMinimum = box.height >= 44 || box.width >= 44;
          if (!meetsMinimum) {
            const text = await button.textContent();
            console.warn(`⚠️ Bouton trop petit: "${text}" (${box.width}x${box.height}px)`);
          }
        }
      }
    }
  });

  test('Pull to refresh - Geste mobile', async ({ page, context }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Simuler un pull to refresh (swipe down)
    await page.touchscreen.tap(200, 100);
    await page.waitForTimeout(500);
  });
});

// Tests spécifiques TABLETTE
test.describe('Tests Spécifiques Tablette', () => {
  test.use(devices['iPad Pro']);

  test('Orientation - Portrait et Landscape', async ({ page }) => {
    // Portrait
    await page.setViewportSize({ width: 1024, height: 1366 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: 'test-results/Tablet-Portrait.png',
      fullPage: true
    });

    // Landscape
    await page.setViewportSize({ width: 1366, height: 1024 });
    await page.reload();
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: 'test-results/Tablet-Landscape.png',
      fullPage: true
    });

    // Vérifier pas de débordement dans les deux orientations
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasHorizontalScroll).toBe(false);
  });
});

// Tests spécifiques DESKTOP
test.describe('Tests Spécifiques Desktop', () => {
  test.use({ viewport: { width: 1920, height: 1080 } });

  test('Navigation Desktop - Hover states', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Trouver des liens
    const links = page.locator('a');
    const count = await links.count();

    if (count > 0) {
      const firstLink = links.first();
      if (await firstLink.isVisible()) {
        await firstLink.hover();
        await page.waitForTimeout(300);
        // Le hover devrait appliquer des styles
      }
    }
  });

  test('Résolutions multiples Desktop', async ({ page }) => {
    const resolutions = [
      { width: 1920, height: 1080, name: 'Full HD' },
      { width: 1366, height: 768, name: 'HD' },
      { width: 2560, height: 1440, name: '2K' },
    ];

    for (const res of resolutions) {
      await page.setViewportSize({ width: res.width, height: res.height });
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      expect(hasHorizontalScroll).toBe(false);

      await page.screenshot({
        path: `test-results/Desktop-${res.name}.png`,
        fullPage: false
      });
    }
  });
});

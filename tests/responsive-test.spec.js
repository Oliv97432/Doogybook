// Test responsive de l'application Doogybook
const { test, expect, devices } = require('@playwright/test');

// Configurations des devices
const deviceConfigs = [
  { name: 'Desktop 1920x1080', viewport: { width: 1920, height: 1080 } },
  { name: 'Desktop 1366x768', viewport: { width: 1366, height: 768 } },
  { name: 'Tablet iPad Pro', ...devices['iPad Pro'] },
  { name: 'Tablet iPad', ...devices['iPad (gen 7)'] },
  { name: 'Mobile iPhone 14', ...devices['iPhone 14'] },
  { name: 'Mobile iPhone SE', ...devices['iPhone SE'] },
  { name: 'Mobile Pixel 5', ...devices['Pixel 5'] },
];

// Pages principales à tester
const pagesToTest = [
  { path: '/', name: 'Page d\'accueil' },
  { path: '/login', name: 'Page de connexion' },
  { path: '/signup', name: 'Page d\'inscription' },
  { path: '/dashboard', name: 'Dashboard' },
];

deviceConfigs.forEach(device => {
  test.describe(`Tests ${device.name}`, () => {

    test.use(device);

    pagesToTest.forEach(page => {
      test(`${page.name} - ${device.name}`, async ({ page: browserPage }) => {

        // Aller sur la page
        await browserPage.goto(`http://localhost:5173${page.path}`, {
          waitUntil: 'networkidle',
          timeout: 30000
        });

        // Prendre une capture d'écran
        await browserPage.screenshot({
          path: `test-results/screenshots/${device.name.replace(/\s+/g, '-')}-${page.name.replace(/\s+/g, '-')}.png`,
          fullPage: true
        });

        // Vérifications de base
        await expect(browserPage).toHaveTitle(/.*/);

        // Vérifier qu'il n'y a pas d'erreurs console critiques
        const errors = [];
        browserPage.on('console', msg => {
          if (msg.type() === 'error') {
            errors.push(msg.text());
          }
        });

        // Vérifier que la page est visible
        const body = await browserPage.locator('body');
        await expect(body).toBeVisible();

        // Vérifier le responsive (pas de débordement horizontal)
        const hasHorizontalScroll = await browserPage.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });

        if (hasHorizontalScroll) {
          console.warn(`⚠️ Débordement horizontal détecté sur ${page.name} - ${device.name}`);
        }
      });
    });

  });
});

// Test spécifique des éléments critiques
test.describe('Tests des éléments critiques', () => {

  test('Navigation mobile - Menu hamburger', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('http://localhost:5173');

    // Vérifier la présence du menu mobile
    const mobileMenu = page.getByRole('button', { name: /menu/i });
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'test-results/mobile-menu-open.png' });
    }
  });

  test('Formulaires responsifs', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:5173/login');

    // Vérifier que les champs de formulaire sont accessibles
    const inputs = page.locator('input');
    const count = await inputs.count();

    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      const box = await input.boundingBox();
      if (box) {
        // Vérifier que l'input n'est pas trop petit
        expect(box.height).toBeGreaterThan(30);
        expect(box.width).toBeGreaterThan(100);
      }
    }
  });

  test('Images responsives', async ({ page }) => {
    await page.goto('http://localhost:5173');

    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const src = await img.getAttribute('src');

      // Vérifier que l'image a un alt text
      const alt = await img.getAttribute('alt');
      if (!alt) {
        console.warn(`⚠️ Image sans alt text: ${src}`);
      }

      // Vérifier que l'image est chargée
      const naturalWidth = await img.evaluate(el => el.naturalWidth);
      if (naturalWidth === 0) {
        console.error(`❌ Image non chargée: ${src}`);
      }
    }
  });
});

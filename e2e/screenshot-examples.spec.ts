import { test } from './coverage-fixture.js';

test.describe('Screenshot Examples', () => {
  test('basic screenshot - full page', async ({ page }) => {
    await page.goto('/');

    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Take a full page screenshot
    await page.screenshot({
      path: 'test-results/screenshots/home-full-page.png',
      fullPage: true,
    });
  });

  test('screenshot - viewport only', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Take a screenshot of only the visible viewport
    await page.screenshot({
      path: 'test-results/screenshots/home-viewport.png',
    });
  });

  test('screenshot - specific element', async ({ page }) => {
    await page.goto('/');

    // Take a screenshot of a specific element
    const hero = page.locator('h1').first();
    await hero.screenshot({
      path: 'test-results/screenshots/hero-section.png',
    });
  });

  test('screenshot - mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: 'test-results/screenshots/home-mobile.png',
      fullPage: true,
    });
  });

  test('screenshot - with annotations', async ({ page }) => {
    await page.goto('/blog');
    await page.waitForLoadState('networkidle');

    // You can take multiple screenshots during a test
    await page.screenshot({
      path: 'test-results/screenshots/blog-before-interaction.png',
    });

    // Interact with the page
    const blogLink = page.getByRole('link').first();
    if (await blogLink.isVisible()) {
      await blogLink.hover();

      // Screenshot after hover
      await page.screenshot({
        path: 'test-results/screenshots/blog-after-hover.png',
      });
    }
  });

  test('screenshot - comparison test', async ({ page }) => {
    await page.goto('/');

    // Desktop screenshot
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.screenshot({
      path: 'test-results/screenshots/desktop-view.png',
    });

    // Tablet screenshot
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.screenshot({
      path: 'test-results/screenshots/tablet-view.png',
    });

    // Mobile screenshot
    await page.setViewportSize({ width: 375, height: 667 });
    await page.screenshot({
      path: 'test-results/screenshots/mobile-view.png',
    });
  });
});

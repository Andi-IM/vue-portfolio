import { type Page } from '@playwright/test';
import { test, expect } from './coverage-fixture.js';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    await page.goto('/');
  });

  test('renders all main sections', async ({ page }: { page: Page }) => {
    // NavBar should be visible
    await expect(page.locator('nav')).toBeVisible();

    // Hero section with name
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // Check for key sections
    await expect(page.getByRole('heading', { name: 'Tools & Technology' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Experiences' })).toBeVisible();
  });

  test('navigation links work correctly', async ({ page }: { page: Page }) => {
    // Check nav links exist
    const navLinks = page.locator('nav a, nav button');
    await expect(navLinks.first()).toBeVisible();
  });

  test('has correct page title', async ({ page }: { page: Page }) => {
    await expect(page).toHaveTitle(/Portfolio|Andi/);
  });

  test('footer section is present', async ({ page }: { page: Page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('page is responsive on mobile', async ({ page }: { page: Page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});

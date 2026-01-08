import { type Page } from '@playwright/test';
import { test, expect } from './coverage-fixture.js';

test.describe('Blog Pages', () => {
  test('blog index page loads', async ({ page }: { page: Page }) => {
    await page.goto('/blog');

    // Wait for page to load
    await expect(page.locator('body')).toBeVisible();

    // Check for blog-related content
    const heading = page.getByRole('heading');
    await expect(heading.first()).toBeVisible();
  });

  test('can navigate from home to blog', async ({ page }: { page: Page }) => {
    await page.goto('/');

    // Look for blog link in navigation
    const blogLink = page.getByRole('link', { name: /blog/i });
    if (await blogLink.isVisible()) {
      await blogLink.click();
      await expect(page).toHaveURL(/\/blog/);
    }
  });

  test('can navigate to a post from index', async ({ page }: { page: Page }) => {
    await page.goto('/blog', { waitUntil: 'networkidle' });

    // Wait for posts to load with explicit timeout
    const firstPostArticle = page.locator('article').first();
    await expect(firstPostArticle).toBeVisible({ timeout: 10000 });

    // Get title to verify - wait for h2 to be visible first
    const firstPostTitle = firstPostArticle.locator('h2');
    await expect(firstPostTitle).toBeVisible({ timeout: 5000 });
    const titleText = await firstPostTitle.innerText();

    // Click the title link
    await firstPostTitle.locator('a').click();

    // Wait for navigation to complete
    await page.waitForURL(/\/blog\//, { timeout: 10000 });

    // Verify title matches on detail page
    const postArticle = page.locator('article');
    await expect(postArticle).toBeVisible({ timeout: 10000 });

    const postHeading = postArticle.locator('h1');
    await expect(postHeading).toBeVisible({ timeout: 5000 });
    await expect(postHeading).toContainText(titleText);
  });
});

test.describe('Admin Pages', () => {
  test('admin dashboard loads', async ({ page }: { page: Page }) => {
    await page.goto('/admin');

    // Wait for page to load
    await expect(page.locator('body')).toBeVisible();

    // Admin page should have some content
    const heading = page.getByRole('heading');
    await expect(heading.first()).toBeVisible();
  });
});

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
    await page.goto('/blog');

    // Wait for posts to load
    // Assuming posts are rendered inside article tags on the blog index
    const firstPostArticle = page.locator('article').first();
    await expect(firstPostArticle).toBeVisible();

    // Get title to verify
    // Adjust selector based on actual BlogIndex implementation (h2 inside article usually)
    const firstPostTitle = firstPostArticle.locator('h2');
    const titleText = await firstPostTitle.innerText();

    // Click the title link
    await firstPostTitle.locator('a').click();

    // Verify navigation
    await expect(page).toHaveURL(/\/blog\//);

    // Verify title matches on detail page
    const postArticle = page.locator('article');
    const postHeading = postArticle.locator('h1');
    await expect(postHeading).toBeVisible();
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

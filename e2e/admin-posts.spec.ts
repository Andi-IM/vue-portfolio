import { type Page } from '@playwright/test';
import { test, expect } from './coverage-fixture.js';

test.describe('Admin Posts Management', () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    await page.goto('/admin/posts');
  });

  test('displays post list', async ({ page }: { page: Page }) => {
    await expect(page.getByRole('heading', { name: 'Manage Posts' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'New Post' })).toBeVisible();
    await expect(page.locator('table')).toBeVisible();
  });

  test('can create and then delete a post', async ({ page }: { page: Page }) => {
    // 0. Setup dialog handler
    page.on('dialog', async (dialog) => {
      console.log(`Dialog message: ${dialog.message()}`);
      await dialog.accept();
    });
    // Debug browser logs
    page.on('console', (msg) => console.log('BROWSER LOG:', msg.text()));

    // 1. Create a new post
    await page.getByRole('link', { name: 'New Post' }).click();
    await expect(page).toHaveURL(/\/admin\/posts\/new/);

    const testTitle = `E2E Test Post ${Date.now()}`;

    // Fill Title
    await page.getByPlaceholder('Post Title').fill(testTitle);

    // Fill Content (Contenteditable div)
    const editor = page.locator('[contenteditable="true"]');
    await editor.click();
    await page.keyboard.type('This is a test post content.');

    // Save
    await page.getByRole('button', { name: 'Save Post' }).click();

    // Verify redirection to list
    await expect(page).toHaveURL(/\/admin\/posts/);

    // Verify post appears in list
    const newRow = page.locator('tbody tr').filter({ hasText: testTitle });
    await expect(newRow).toBeVisible();

    // 2. Delete the post
    // The global dialog handler defined above will handle the confirmation ("Are you sure...")

    // Find the delete button within that specific row
    const deleteBtn = newRow.getByRole('button', { name: 'Delete' });
    await deleteBtn.click();

    // Verify removal
    await expect(newRow).not.toBeVisible();
  });
});

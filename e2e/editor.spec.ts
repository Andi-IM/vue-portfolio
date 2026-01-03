import { type Page } from '@playwright/test';
import { test, expect } from './coverage-fixture.js';

test.describe('Editor Functionality', () => {
  test('should allow typing and backspace in RichTextEditor', async ({ page }: { page: Page }) => {
    // Navigate to the new post page
    page.on('console', (msg) => console.log('BROWSER LOG:', msg.text()));
    await page.goto('/admin/new');

    // Verify redirection
    await expect(page).toHaveURL(/\/admin\/posts\/new/);

    // Wait for editor to be visible
    const editor = page.locator('[contenteditable="true"]');
    await expect(editor).toBeVisible();

    // Click to focus
    await editor.click();
    console.log('Clicked editor');

    // Type "Hello World"
    await page.keyboard.type('Hello World');
    const textAfterTyping = await editor.innerText();
    console.log('Text after typing:', textAfterTyping);
    await expect(editor).toHaveText('Hello World');

    // Press Backspace 5 times
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Backspace');
      // Small delay to ensure UI updates (though Playwright usually handles this)
      await page.waitForTimeout(50);
    }
    const textAfterBackspace = await editor.innerText();
    console.log('Text after backspace:', textAfterBackspace);

    // Expect "Hello "
    await expect(editor).toHaveText('Hello ');

    // Type something else to confirm it's still working
    await page.keyboard.type('Vue');
    await expect(editor).toHaveText('Hello Vue');
  });
});

test.describe('Post Editor Features', () => {
  test('cover image URL shows preview when valid URL entered', async ({ page }: { page: Page }) => {
    await page.goto('/admin/posts/new');
    await expect(page).toHaveURL(/\/admin\/posts\/new/);

    // Find cover image input
    const coverImageInput = page.locator('input[placeholder="https://..."]');
    await expect(coverImageInput).toBeVisible();

    // Enter a valid image URL
    await coverImageInput.fill('https://picsum.photos/200/300');

    // Wait for preview to appear
    const previewImage = page.locator('img[alt="Cover preview"]');
    await expect(previewImage).toBeVisible({ timeout: 5000 });
  });

  test('cover image preview hides on invalid URL', async ({ page }: { page: Page }) => {
    await page.goto('/admin/posts/new');

    const coverImageInput = page.locator('input[placeholder="https://..."]');
    await coverImageInput.fill('not-a-valid-url');

    // Preview should not be visible (hidden by @error handler)
    const previewImage = page.locator('img[alt="Cover preview"]');
    // Wait a moment for error handler to fire
    await page.waitForTimeout(1000);
    await expect(previewImage).not.toBeVisible();
  });

  test('editor has Editor and Preview tabs', async ({ page }: { page: Page }) => {
    await page.goto('/admin/posts/new');

    // Check for tabs
    const editorTab = page.getByRole('tab', { name: /editor/i });
    const previewTab = page.getByRole('tab', { name: /preview/i });

    await expect(editorTab).toBeVisible();
    await expect(previewTab).toBeVisible();
  });

  test('can switch between Editor and Preview tabs', async ({ page }: { page: Page }) => {
    await page.goto('/admin/posts/new');

    // Find the content editor
    const editor = page.locator('[contenteditable="true"]');
    await expect(editor).toBeVisible();

    // Type content
    await editor.click();
    await page.keyboard.type('Test content for preview');

    // Click Preview tab
    const previewTab = page.getByRole('tab', { name: /preview/i });
    await previewTab.click();

    // Wait for tab animation
    await page.waitForTimeout(500);

    // Verify Preview tab is now selected
    await expect(previewTab).toHaveAttribute('aria-selected', 'true');

    // Verify preview shows the content
    const previewPanel = page.locator('.prose');
    await expect(previewPanel).toBeVisible();
    await expect(previewPanel).toContainText('Test content for preview');

    // Switch back to Editor tab
    const editorTab = page.getByRole('tab', { name: /editor/i });
    await editorTab.click();

    // Wait for tab animation
    await page.waitForTimeout(500);

    // Verify Editor tab is now selected
    await expect(editorTab).toHaveAttribute('aria-selected', 'true');

    // The editor should exist in the DOM and content should be preserved
    await expect(editor).toContainText('Test content for preview');
  });
});

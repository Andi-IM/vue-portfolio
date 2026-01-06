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

  test('can edit raw HTML and verifies XSS protection', async ({ page }: { page: Page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/admin/posts/new');
    // Verify we are in the editor
    await expect(page.locator('.visual-editor')).toBeVisible();

    // Check if we are already in source mode (state might persist in SPA or fast tests)
    const visualEditorBtn = page.getByRole('button', { name: 'Visual Editor' });
    if (await visualEditorBtn.isVisible()) {
      console.log('Already in source mode, resetting...');
      await visualEditorBtn.click();
      await expect(
        page.locator('.q-editor__tool-button').filter({ hasText: 'Source' }),
      ).toBeVisible();
    }

    // Debug: Check if "Source" text is visible and what tag it is
    // Verify Source button is visible using safe selector
    const sourceBtn = page.getByRole('button', { name: 'Source' });
    await expect(sourceBtn).toBeVisible();

    await sourceBtn.click();

    // Wait for toggle - checking for the source editor to appear
    const sourceArea = page.locator('.source-editor textarea');
    await expect(sourceArea).toBeVisible();

    // Enter raw HTML with a script tag
    const maliciousHtml =
      '<h3>Safe Heading</h3><script>alert("XSS")</script><p onclick="alert(1)">Click me</p>';
    // Use fill instead of type for textarea to be faster/more reliable
    await sourceArea.fill(maliciousHtml);

    // Toggle source view off using the "Visual Editor" button
    const closeSourceBtn = page.getByRole('button', { name: 'Visual Editor' });
    await expect(closeSourceBtn).toBeVisible();
    await closeSourceBtn.click();

    // Verify we are back in WYSIWYG mode
    const editor = page.locator('[contenteditable="true"]');
    await expect(editor).toBeVisible();

    // Verify content persisted
    await expect(editor).toContainText('Safe Heading');

    // Switch to Preview tab to verify sanitization
    const previewTab = page.getByRole('tab', { name: /preview/i });
    await previewTab.click();

    // Wait for animation
    await page.waitForTimeout(500);

    // Verify sanitized preview - Find panel by content
    // We expect "Click me" to be present (p tag)
    const previewPanel = page
      .locator('.q-tab-panel')
      .filter({ hasText: 'Click me' })
      .locator('div.prose');
    await expect(previewPanel).toBeVisible();

    // Verify sanitized preview content
    await expect(previewPanel).toContainText('Safe Heading');
    await expect(previewPanel).toContainText('Click me');

    const safeHeading = previewPanel.getByRole('heading', { name: 'Safe Heading' });
    await expect(safeHeading).toBeVisible();

    // Script should NOT be there
    const scripts = await previewPanel.locator('script').count();
    expect(scripts).toBe(0);

    // onclick attribute should NOT be there
    const pTag = previewPanel.locator('p').filter({ hasText: 'Click me' });
    const onclickAttr = await pTag.getAttribute('onclick');
    expect(onclickAttr).toBeNull();
  });
});

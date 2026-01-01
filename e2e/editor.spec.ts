import { test, expect } from '@playwright/test'

test.describe('Editor Functionality', () => {
  test('should allow typing and backspace in RichTextEditor', async ({ page }) => {
    // Navigate to the new post page
    page.on('console', (msg) => console.log('BROWSER LOG:', msg.text()))
    await page.goto('/admin/new')

    // Verify redirection
    await expect(page).toHaveURL(/\/admin\/posts\/new/)

    // Wait for editor to be visible
    const editor = page.locator('[contenteditable="true"]')
    await expect(editor).toBeVisible()

    // Click to focus
    await editor.click()
    console.log('Clicked editor')

    // Type "Hello World"
    await page.keyboard.type('Hello World')
    const textAfterTyping = await editor.innerText()
    console.log('Text after typing:', textAfterTyping)
    await expect(editor).toHaveText('Hello World')

    // Press Backspace 5 times
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Backspace')
      // Small delay to ensure UI updates (though Playwright usually handles this)
      await page.waitForTimeout(50)
    }
    const textAfterBackspace = await editor.innerText()
    console.log('Text after backspace:', textAfterBackspace)

    // Expect "Hello "
    await expect(editor).toHaveText('Hello ')

    // Type something else to confirm it's still working
    await page.keyboard.type('Vue')
    await expect(editor).toHaveText('Hello Vue')
  })
})

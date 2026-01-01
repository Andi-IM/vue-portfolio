import { test, expect } from '@playwright/test'

test.describe('Blog Pages', () => {
  test('blog index page loads', async ({ page }) => {
    await page.goto('/blog')

    // Wait for page to load
    await expect(page.locator('body')).toBeVisible()

    // Check for blog-related content
    const heading = page.getByRole('heading')
    await expect(heading.first()).toBeVisible()
  })

  test('can navigate from home to blog', async ({ page }) => {
    await page.goto('/')

    // Look for blog link in navigation
    const blogLink = page.getByRole('link', { name: /blog/i })
    if (await blogLink.isVisible()) {
      await blogLink.click()
      await expect(page).toHaveURL(/\/blog/)
    }
  })
})

test.describe('Admin Pages', () => {
  test('admin dashboard loads', async ({ page }) => {
    await page.goto('/admin')

    // Wait for page to load
    await expect(page.locator('body')).toBeVisible()

    // Admin page should have some content
    const heading = page.getByRole('heading')
    await expect(heading.first()).toBeVisible()
  })
})

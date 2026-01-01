import { test, expect } from './coverage-fixture'

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('renders all main sections', async ({ page }) => {
    // NavBar should be visible
    await expect(page.locator('nav')).toBeVisible()

    // Hero section with name
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

    // Check for key sections
    await expect(page.getByText('Tools & Teknologi')).toBeVisible()
    await expect(page.getByText('Proyek Terselesaikan')).toBeVisible()
    await expect(page.getByText('Experiences')).toBeVisible()
  })

  test('navigation links work correctly', async ({ page }) => {
    // Check nav links exist
    const navLinks = page.locator('nav a, nav button')
    await expect(navLinks.first()).toBeVisible()
  })

  test('has correct page title', async ({ page }) => {
    await expect(page).toHaveTitle(/Portfolio|Andi/)
  })

  test('footer section is present', async ({ page }) => {
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
  })

  test('page is responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.locator('nav')).toBeVisible()
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })
})

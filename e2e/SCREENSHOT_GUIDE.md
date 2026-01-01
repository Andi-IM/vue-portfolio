# E2E Testing with Screenshots - Guide

## Screenshot Configuration Options

### 1. Global Configuration (playwright.config.ts)

You can configure automatic screenshots in your Playwright config:

```typescript
use: {
  screenshot: 'only-on-failure',  // Default - screenshots only when tests fail
  // OR
  screenshot: 'on',               // Screenshot after every test
  // OR
  screenshot: 'off',              // No automatic screenshots
}
```

**Current setting**: `'only-on-failure'` (line 13 in playwright.config.ts)

---

## 2. Manual Screenshots in Tests

### Basic Screenshot

```typescript
await page.screenshot({ path: 'screenshot.png' })
```

### Full Page Screenshot

```typescript
await page.screenshot({
  path: 'screenshot.png',
  fullPage: true, // Captures entire scrollable page
})
```

### Element Screenshot

```typescript
const element = page.locator('.my-element')
await element.screenshot({ path: 'element.png' })
```

### Screenshot with Options

```typescript
await page.screenshot({
  path: 'screenshot.png',
  fullPage: true,
  clip: { x: 0, y: 0, width: 800, height: 600 }, // Crop to specific area
  omitBackground: true, // Transparent background
  animations: 'disabled', // Disable CSS animations
})
```

---

## 3. Common Use Cases

### A. Visual Regression Testing

```typescript
test('visual regression', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveScreenshot('homepage.png')
})
```

### B. Responsive Design Testing

```typescript
test('responsive screenshots', async ({ page }) => {
  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1920, height: 1080 },
  ]

  for (const viewport of viewports) {
    await page.setViewportSize(viewport)
    await page.goto('/')
    await page.screenshot({
      path: `screenshots/${viewport.name}.png`,
    })
  }
})
```

### C. User Flow Documentation

```typescript
test('checkout flow', async ({ page }) => {
  await page.goto('/products')
  await page.screenshot({ path: 'flow/01-products.png' })

  await page.click('button:has-text("Add to Cart")')
  await page.screenshot({ path: 'flow/02-cart.png' })

  await page.click('button:has-text("Checkout")')
  await page.screenshot({ path: 'flow/03-checkout.png' })
})
```

### D. Before/After Comparisons

```typescript
test('dark mode toggle', async ({ page }) => {
  await page.goto('/')
  await page.screenshot({ path: 'light-mode.png' })

  await page.click('[aria-label="Toggle dark mode"]')
  await page.screenshot({ path: 'dark-mode.png' })
})
```

---

## 4. Screenshot Storage

### Default Locations

- **Test artifacts**: `test-results/`
- **Failure screenshots**: `test-results/<test-name>/<retry-number>/test-failed-<number>.png`
- **Playwright report**: `playwright-report/`

### Custom Paths

```typescript
// Relative to project root
await page.screenshot({ path: 'screenshots/my-test.png' })

// Organized by test name
await page.screenshot({
  path: `screenshots/${test.info().title}.png`,
})
```

---

## 5. Best Practices

### ✅ DO

- Use `waitForLoadState('networkidle')` before screenshots
- Use descriptive file names
- Organize screenshots in folders by feature
- Take screenshots at key interaction points
- Use full-page screenshots for documentation

### ❌ DON'T

- Take too many screenshots (slows tests)
- Use screenshots for assertions (use visual regression instead)
- Hardcode absolute paths
- Screenshot before page is fully loaded

---

## 6. Running Screenshot Tests

```bash
# Run all tests (including screenshot examples)
npm run test:e2e

# Run only screenshot examples
npx playwright test screenshot-examples

# Run with UI mode to see screenshots
npm run test:e2e:ui

# View last test report (includes screenshots)
npx playwright show-report
```

---

## 7. Visual Regression Testing

For automated visual comparisons, use Playwright's built-in visual regression:

```typescript
test('visual regression', async ({ page }) => {
  await page.goto('/')

  // First run: creates baseline
  // Subsequent runs: compares against baseline
  await expect(page).toHaveScreenshot('homepage.png', {
    maxDiffPixels: 100, // Allow small differences
  })
})
```

Update baselines:

```bash
npx playwright test --update-snapshots
```

---

## Example Test File

See [screenshot-examples.spec.ts](file:///d:/vue-portfolio/e2e/screenshot-examples.spec.ts) for working examples of all techniques.

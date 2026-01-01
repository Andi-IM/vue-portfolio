import { test, expect } from '@playwright/test'

test.describe('Performance Metrics', () => {
  test('home page loads within acceptable time', async ({ page }) => {
    const startTime = Date.now()

    await page.goto('/')
    await expect(page.locator('nav')).toBeVisible()

    const loadTime = Date.now() - startTime
    console.log(`Home page load time: ${loadTime}ms`)

    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000)
  })

  test('captures Core Web Vitals', async ({ page }) => {
    await page.goto('/')

    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle')

    // Collect performance metrics using Performance API
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      const paint = performance.getEntriesByType('paint')

      const fcp = paint.find(p => p.name === 'first-contentful-paint')

      return {
        // Navigation timing
        domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.startTime,
        loadComplete: navigation?.loadEventEnd - navigation?.startTime,
        ttfb: navigation?.responseStart - navigation?.requestStart,

        // First Contentful Paint
        fcp: fcp?.startTime,

        // Resource metrics
        resourceCount: performance.getEntriesByType('resource').length,
      }
    })

    console.log('Performance Metrics:')
    console.log(`  TTFB: ${metrics.ttfb?.toFixed(2)}ms`)
    console.log(`  FCP: ${metrics.fcp?.toFixed(2)}ms`)
    console.log(`  DOM Content Loaded: ${metrics.domContentLoaded?.toFixed(2)}ms`)
    console.log(`  Load Complete: ${metrics.loadComplete?.toFixed(2)}ms`)
    console.log(`  Resource Count: ${metrics.resourceCount}`)

    // Assertions for reasonable performance
    if (metrics.fcp) {
      expect(metrics.fcp).toBeLessThan(2500) // Good FCP is under 1.8s, acceptable under 2.5s
    }
    if (metrics.ttfb) {
      expect(metrics.ttfb).toBeLessThan(800) // Good TTFB is under 200ms, acceptable under 800ms
    }
  })

  test('measures Cumulative Layout Shift', async ({ page }) => {
    await page.goto('/')

    // Observe layout shifts
    const cls = await page.evaluate(async () => {
      return new Promise<number>((resolve) => {
        let clsValue = 0

        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const layoutShift = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number }
            if (!layoutShift.hadRecentInput) {
              clsValue += layoutShift.value ?? 0
            }
          }
        })

        observer.observe({ type: 'layout-shift', buffered: true })

        // Wait a bit for any layout shifts
        setTimeout(() => {
          observer.disconnect()
          resolve(clsValue)
        }, 3000)
      })
    })

    console.log(`  CLS: ${cls.toFixed(4)}`)

    // Good CLS is under 0.1, acceptable under 0.25
    expect(cls).toBeLessThan(0.25)
  })
})

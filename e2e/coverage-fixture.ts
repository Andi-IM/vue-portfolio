import { test as base } from '@playwright/test'
import * as fs from 'fs'
import * as path from 'path'
import * as crypto from 'crypto'

const istanbulCLIOutput = path.join(process.cwd(), '.nyc_output')

export const test = base.extend({
  page: async ({ page }, use) => {
    // Enable mock services for E2E tests
    await page.addInitScript(() => {
      window.USE_MOCK_SERVICES = true
    })
    await use(page)
  },
  context: async ({ context }, use) => {
    await use(context)

    const pages = context.pages()
    for (const page of pages) {
      try {
        const coverage = await page.evaluate(
          () => (window as { __coverage__?: unknown }).__coverage__,
        )
        if (coverage) {
          if (!fs.existsSync(istanbulCLIOutput)) {
            fs.mkdirSync(istanbulCLIOutput, { recursive: true })
          }
          fs.writeFileSync(
            path.join(
              istanbulCLIOutput,
              `playwright_coverage_${crypto.randomBytes(10).toString('hex')}.json`,
            ),
            JSON.stringify(coverage),
          )
        }
      } catch (e) {
        // Page might have been closed or navigation occurred
        console.warn('Failed to collect coverage from page:', e)
      }
    }
  },
})

export const expect = test.expect

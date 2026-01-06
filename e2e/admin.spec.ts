import { type Page } from '@playwright/test';
import { test, expect } from './coverage-fixture.js';

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    await page.goto('/admin');
  });

  test('loads with correct layout', async ({ page }: { page: Page }) => {
    // Check Sidebar
    await expect(page.locator('aside')).toBeVisible();

    // Check Main Content Area
    await expect(page.locator('main')).toBeVisible();

    // Check Header/Title
    await expect(page.getByRole('heading', { name: 'Dashboard Overview' })).toBeVisible();
  });

  test('displays statistic cards', async ({ page }: { page: Page }) => {
    // Total Posts Card
    const totalPostsCard = page.locator('.stat-card').filter({ hasText: 'Total Posts' });
    await expect(totalPostsCard).toBeVisible();
    await expect(totalPostsCard.locator('.stat-value')).not.toBeEmpty();

    // Total Views Card
    const totalViewsCard = page.locator('.stat-card').filter({ hasText: 'Total Views' });
    await expect(totalViewsCard).toBeVisible();
    await expect(totalViewsCard.locator('.stat-value')).not.toBeEmpty();
  });

  test('displays trend visualization', async ({ page }: { page: Page }) => {
    // Trend Section Header
    const trendHeader = page.getByRole('heading', { name: 'Views Trend' });
    await expect(trendHeader).toBeVisible();

    // The wrapper that contains the visualization
    const trendWrapper = page.locator('.trend-wrapper');
    await expect(trendWrapper).toBeVisible();

    // It should contain some content, either loading, empty state or data
    // We can check if it's visible. That's good enough for layout verification.
  });

  test('sidebar navigation works', async ({ page }: { page: Page }) => {
    // Dashboard Link (Active)
    const dashboardLink = page.getByRole('link', { name: 'Dashboard' });
    await expect(dashboardLink).toBeVisible();

    // Posts Link
    const postsLink = page.getByRole('link', { name: 'Posts' });
    await expect(postsLink).toBeVisible();
    await postsLink.click();

    // Verify Navigation to /admin/posts
    await expect(page).toHaveURL(/\/admin\/posts/);
    await expect(page.getByRole('heading', { name: 'Manage Posts' })).toBeVisible();

    // Navigate back to Dashboard
    await dashboardLink.click();
    await expect(page).toHaveURL(/\/admin$/);
    await expect(page.getByRole('heading', { name: 'Dashboard Overview' })).toBeVisible();
  });
});

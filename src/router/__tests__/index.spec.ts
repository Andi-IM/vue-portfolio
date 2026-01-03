import { describe, it, expect } from 'vitest';
import router from '../index';
import routes from '../routes';

describe('Router', () => {
  it('has correct routes', () => {
    const routes = router.getRoutes();
    expect(routes.find((r) => r.name === 'home')).toBeTruthy();
    expect(routes.find((r) => r.name === 'blog')).toBeTruthy();
    expect(routes.find((r) => r.name === 'blog-post')).toBeTruthy();
    expect(routes.find((r) => r.name === 'admin-dashboard')).toBeTruthy();
    expect(routes.find((r) => r.name === 'admin-post-editor')).toBeTruthy();
  });

  it('can navigate to all routes', async () => {
    const paths = ['/', '/blog', '/blog/test-post', '/admin', '/admin/posts/new'];

    for (const path of paths) {
      await router.push(path);
      await router.isReady();
      expect(router.currentRoute.value.path).toBe(path);
    }
  });

  it('resolves 404 for unknown routes', async () => {
    await router.push('/this-route-does-not-exist');
    await router.isReady();

    expect(router.currentRoute.value.path).toBe('/this-route-does-not-exist');
    expect(router.currentRoute.value.params.catchAll).toEqual(['this-route-does-not-exist']);

    // Verify that the route matches the catch-all definition match
    const matched = router.currentRoute.value.matched;
    expect(matched.length).toBeGreaterThan(0);

    // Trigger the component loader if it hasn't been triggered
    // In many setups simply matching the route isn't enough to call the import function if the component isn't mounted.
    // However, Vue Router resolves the component before confirming the navigation if we wait for it.

    // To ensure line coverage of `() => import(...)`, we can try to inspect the route configuration directly
    // and invoke the component function.
    const catchAllRoute = routes.find((r) => r.path === '/:catchAll(.*)*');
    if (catchAllRoute && typeof catchAllRoute.component === 'function') {
      await (catchAllRoute.component as () => Promise<any>)();
    }
  });
});

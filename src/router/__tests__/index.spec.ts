import { describe, it, expect } from 'vitest'
import router from '../index'

describe('Router', () => {
  it('has correct routes', () => {
    const routes = router.getRoutes()
    expect(routes.find((r) => r.name === 'home')).toBeTruthy()
    expect(routes.find((r) => r.name === 'blog')).toBeTruthy()
    expect(routes.find((r) => r.name === 'blog-post')).toBeTruthy()
    expect(routes.find((r) => r.name === 'admin-dashboard')).toBeTruthy()
    expect(routes.find((r) => r.name === 'admin-post-editor')).toBeTruthy()
  })

  it('can navigate to all routes', async () => {
    const paths = [
      '/',
      '/blog',
      '/blog/test-post',
      '/admin',
      '/admin/posts/new',
    ]

    for (const path of paths) {
      await router.push(path)
      await router.isReady()
      expect(router.currentRoute.value.path).toBe(path)
    }
  })
})

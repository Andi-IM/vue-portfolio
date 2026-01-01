/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import BlogIndex from '../BlogIndex.vue'
import { useBlogService } from '@/composables/useBlogService'

vi.mock('@/composables/useBlogService', () => ({
  useBlogService: vi.fn(),
  BLOG_SERVICE_KEY: Symbol('BlogService'),
}))

describe('BlogIndex', () => {
  it('renders loading state initially', () => {
    ;(useBlogService as any).mockReturnValue({
      getPosts: vi.fn().mockImplementation(() => new Promise(() => {})), // Never resolves
    })
    const wrapper = mount(BlogIndex)
    expect(wrapper.text()).toContain('Loading posts...')
  })

  it('renders empty state when no posts', async () => {
    ;(useBlogService as any).mockReturnValue({
      getPosts: vi.fn().mockResolvedValue([]),
    })
    const wrapper = mount(BlogIndex)
    await flushPromises()
    expect(wrapper.text()).toContain('No posts found')
  })

  it('renders posts when available', async () => {
    const mockPosts = [
      {
        id: '1',
        title: 'Test Post 1',
        slug: 'test-1',
        excerpt: 'Excerpt 1',
        createdAt: '2023-01-01',
      },
      {
        id: '2',
        title: 'Test Post 2',
        slug: 'test-2',
        excerpt: 'Excerpt 2',
        createdAt: '2023-01-02',
      },
    ]
    ;(useBlogService as any).mockReturnValue({
      getPosts: vi.fn().mockResolvedValue(mockPosts),
    })

    const wrapper = mount(BlogIndex, {
      global: {
        stubs: {
          RouterLink: {
            template: '<a><slot /></a>',
          },
        },
      },
    })
    await flushPromises()

    expect(wrapper.text()).toContain('Test Post 1')
    expect(wrapper.text()).toContain('Excerpt 1')
    expect(wrapper.text()).toContain('Test Post 2')
    expect(wrapper.findAll('article').length).toBe(2)
  })

  it('handles error when fetching posts fails', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const error = new Error('Failed to fetch posts')

    ;(useBlogService as any).mockReturnValue({
      getPosts: vi.fn().mockRejectedValue(error),
    })

    const wrapper = mount(BlogIndex)
    await flushPromises()

    expect(consoleErrorSpy).toHaveBeenCalledWith(error)
    expect(wrapper.text()).toContain('No posts found')

    consoleErrorSpy.mockRestore()
  })

  it('renders cover image when post has coverImage', async () => {
    const mockPosts = [
      {
        id: '1',
        title: 'Test Post with Image',
        slug: 'test-1',
        excerpt: 'Excerpt 1',
        createdAt: '2023-01-01',
        coverImage: 'https://example.com/image.jpg',
      },
    ]

    ;(useBlogService as any).mockReturnValue({
      getPosts: vi.fn().mockResolvedValue(mockPosts),
    })

    const wrapper = mount(BlogIndex, {
      global: {
        stubs: {
          RouterLink: {
            template: '<a><slot /></a>',
          },
        },
      },
    })
    await flushPromises()

    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('https://example.com/image.jpg')
    expect(img.attributes('alt')).toBe('Test Post with Image')
  })
})

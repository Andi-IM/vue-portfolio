/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import BlogPost from '../BlogPost.vue'
import { useBlogService } from '@/composables/useBlogService'
import { useRoute } from 'vue-router'

vi.mock('@/composables/useBlogService', () => ({
  useBlogService: vi.fn(),
  BLOG_SERVICE_KEY: Symbol('BlogService')
}))

vi.mock('vue-router', () => ({
  useRoute: vi.fn()
}))

describe('BlogPost', () => {
  it('renders loading state initially', () => {
    (useRoute as any).mockReturnValue({ params: { slug: 'test-slug' } });
    (useBlogService as any).mockReturnValue({
      getPostBySlug: vi.fn().mockImplementation(() => new Promise(() => {}))
    })
    const wrapper = mount(BlogPost)
    expect(wrapper.text()).toContain('Loading...')
  })

  it('renders error/not found state', async () => {
    (useRoute as any).mockReturnValue({ params: { slug: 'test-slug' } });
    (useBlogService as any).mockReturnValue({
      getPostBySlug: vi.fn().mockResolvedValue(null)
    })
    const wrapper = mount(BlogPost)
    await flushPromises()
    expect(wrapper.text()).toContain('Post not found')
  })

  it('renders post content correctly', async () => {
    const mockPost = {
        id: '1',
        title: 'My Title',
        createdAt: '2023-01-01',
        content: '{"type":"doc"}', // Mock rich text content
        coverImage: 'image.jpg'
    };

    (useRoute as any).mockReturnValue({ params: { slug: 'test-slug' } });
    (useBlogService as any).mockReturnValue({
      getPostBySlug: vi.fn().mockResolvedValue(mockPost)
    })

    const wrapper = mount(BlogPost, {
        global: {
            stubs: {
                RichTextRenderer: { template: '<div>Rich Content</div>' }
            }
        }
    })
    await flushPromises()

    expect(wrapper.text()).toContain('My Title')
    expect(wrapper.text()).toContain('Rich Content')
    expect(wrapper.find('img').attributes('src')).toBe('image.jpg')
  })
})

/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import PostEditor from '../PostEditor.vue'
import { useBlogService } from '@/composables/useBlogService'
import { useRoute, useRouter } from 'vue-router'

vi.mock('@/composables/useBlogService', () => ({
  useBlogService: vi.fn(),
  BLOG_SERVICE_KEY: Symbol('BlogService'),
}))

vi.mock('vue-router', () => ({
  useRoute: vi.fn(),
  useRouter: vi.fn(),
}))

describe('PostEditor', () => {
  it('renders new post form', () => {
    ;(useRoute as any).mockReturnValue({ params: { id: 'new' } })
    ;(useBlogService as any).mockReturnValue({ savePost: vi.fn() })

    const wrapper = mount(PostEditor, {
      global: {
        stubs: {
          RichTextEditor: { template: '<div>Editor</div>' },
        },
      },
    })

    expect(wrapper.text()).toContain('New Post')
    expect(wrapper.text()).toContain('Save Post')
  })

  it('validates title on save', async () => {
    ;(useRoute as any).mockReturnValue({ params: { id: 'new' } })
    ;(useBlogService as any).mockReturnValue({ savePost: vi.fn() })

    // Mock alert
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

    const wrapper = mount(PostEditor, {
      global: {
        stubs: { RichTextEditor: true },
      },
    })

    // Click save without title
    const saveBtn = wrapper.findAll('button').find((b) => b.text().includes('Save'))
    await saveBtn?.trigger('click')

    expect(alertSpy).toHaveBeenCalledWith('Title is required')
    alertSpy.mockRestore()
  })

  it('saves post correctly', async () => {
    ;(useRoute as any).mockReturnValue({ params: { id: 'new' } })
    const mockSave = vi.fn().mockResolvedValue({})
    ;(useBlogService as any).mockReturnValue({ savePost: mockSave })
    const mockRouterPush = vi.fn()
    ;(useRouter as any).mockReturnValue({ push: mockRouterPush })

    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

    const wrapper = mount(PostEditor, {
      global: {
        stubs: { RichTextEditor: true },
      },
    })

    // Fill title
    const titleInput = wrapper.findAll('input')[0]!
    await titleInput.setValue('My New Post')

    // Click save
    const saveBtn = wrapper.findAll('button').find((b) => b.text().includes('Save'))
    await saveBtn?.trigger('click')

    expect(mockSave).toHaveBeenCalled()
    expect(mockSave.mock.calls[0]![0]).toMatchObject({ title: 'My New Post', slug: 'my-new-post' })
    expect(mockRouterPush).toHaveBeenCalledWith('/admin')

    alertSpy.mockRestore()
  })

  it('loads existing post for editing', async () => {
    ;(useRoute as any).mockReturnValue({ params: { id: '123' } })
    const mockGetPost = vi.fn().mockResolvedValue({
      id: '123',
      title: 'Existing Post',
      slug: 'existing',
      content: [],
    })
    ;(useBlogService as any).mockReturnValue({
      getPost: mockGetPost,
      savePost: vi.fn(),
    })

    const wrapper = mount(PostEditor, {
      global: { stubs: { RichTextEditor: true } },
    })
    await flushPromises() // Wait for onMounted

    // Check if title input has value
    const titleInput = wrapper.findAll('input')[0]!
    expect((titleInput.element as HTMLInputElement).value).toBe('Existing Post')
  })
})

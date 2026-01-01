import { describe, it, expect, vi, beforeEach } from 'vitest'
import { usePostEditor } from '../usePostEditor'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'

// Helper component to test composable
const TestComponent = defineComponent({
  props: ['deps'],
  setup(props) {
    return { ...usePostEditor(props.deps) }
  },
  template: '<div></div>',
})

describe('usePostEditor', () => {
  let mockBlogService: any
  let mockRoute: any
  let mockRouter: any
  let alertSpy: any

  beforeEach(() => {
    mockBlogService = {
      getPost: vi.fn(),
      savePost: vi.fn(),
      uploadImage: vi.fn(),
    }
    mockRoute = { params: { id: 'new' } }
    mockRouter = { push: vi.fn() }
    alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
  })

  it('initializes with default empty post if new', () => {
    const wrapper = mount(TestComponent, {
      props: { deps: { blogService: mockBlogService, route: mockRoute, router: mockRouter } }
    })
    const vm = wrapper.vm as any

    expect(vm.isNew).toBe(true)
    expect(vm.form.title).toBe('')
    expect(vm.form.content[0].type).toBe('paragraph')
  })

  it('fetches post on mount if not new', async () => {
    mockRoute.params.id = '123'
    const postData = { id: '123', title: 'Test Post', content: [] }
    mockBlogService.getPost.mockResolvedValue(postData)

    const wrapper = mount(TestComponent, {
      props: { deps: { blogService: mockBlogService, route: mockRoute, router: mockRouter } }
    })

    await nextTick()
    await nextTick() // Wait for onMounted async

    const vm = wrapper.vm as any
    expect(mockBlogService.getPost).toHaveBeenCalledWith('123')
    expect(vm.form.title).toBe('Test Post')
  })

  it('validates title on save', async () => {
    const wrapper = mount(TestComponent, {
      props: { deps: { blogService: mockBlogService, route: mockRoute, router: mockRouter } }
    })
    const vm = wrapper.vm as any

    await vm.save()
    expect(alertSpy).toHaveBeenCalledWith('Title is required')
    expect(mockBlogService.savePost).not.toHaveBeenCalled()
  })

  it('generates slug automatically if missing', async () => {
    const wrapper = mount(TestComponent, {
      props: { deps: { blogService: mockBlogService, route: mockRoute, router: mockRouter } }
    })
    const vm = wrapper.vm as any

    vm.form.title = 'Hello World'
    await vm.save()

    expect(vm.form.slug).toBe('hello-world')
    expect(mockBlogService.savePost).toHaveBeenCalledWith(expect.objectContaining({
      slug: 'hello-world'
    }))
  })

  it('saves and redirects on success', async () => {
    const wrapper = mount(TestComponent, {
      props: { deps: { blogService: mockBlogService, route: mockRoute, router: mockRouter } }
    })
    const vm = wrapper.vm as any

    vm.form.title = 'Title'
    mockBlogService.savePost.mockResolvedValue({})

    await vm.save()

    expect(alertSpy).toHaveBeenCalledWith('Saved!')
    expect(mockRouter.push).toHaveBeenCalledWith('/admin')
  })

  it('handles save error', async () => {
    const wrapper = mount(TestComponent, {
      props: { deps: { blogService: mockBlogService, route: mockRoute, router: mockRouter } }
    })
    const vm = wrapper.vm as any

    vm.form.title = 'Title'
    mockBlogService.savePost.mockRejectedValue(new Error('Fail'))

    await vm.save()

    expect(alertSpy).toHaveBeenCalledWith('Error saving')
    expect(vm.loading).toBe(false)
  })

  it('delegates image upload', async () => {
    const wrapper = mount(TestComponent, {
      props: { deps: { blogService: mockBlogService, route: mockRoute, router: mockRouter } }
    })
    const vm = wrapper.vm as any

    const file = new File([], 'test.png')
    mockBlogService.uploadImage.mockResolvedValue('url')

    const url = await vm.handleImageUpload(file)
    expect(url).toBe('url')
    expect(mockBlogService.uploadImage).toHaveBeenCalledWith(file)
  })
})

/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import AdminPosts from '../AdminPosts.vue';
import { useBlogService } from '@/composables/useBlogService';

vi.mock('@/composables/useBlogService', () => ({
  useBlogService: vi.fn(),
  BLOG_SERVICE_KEY: Symbol('BlogService'),
}));

vi.mock('vue-router', () => ({
  useRoute: vi.fn(),
  useRouter: vi.fn(),
  RouterLink: {
    template: '<a><slot /></a>',
  },
}));

describe('AdminPosts', () => {
  it('renders posts list correctly', async () => {
    const mockPosts = [
      { id: '1', title: 'Post 1', createdAt: '2023-01-01' },
      { id: '2', title: 'Post 2', createdAt: '2023-01-02' },
    ];
    const mockViews = {
      '1': 100,
      '2': 50,
    };

    (useBlogService as any).mockReturnValue({
      getPosts: vi.fn().mockResolvedValue(mockPosts),
      getAllViews: vi.fn().mockResolvedValue(mockViews),
    });

    const wrapper = mount(AdminPosts, {
      global: {
        stubs: {
          AdminLayout: { template: '<div><slot /></div>' },
        },
      },
    });
    await flushPromises();

    expect(wrapper.text()).toContain('Manage Posts');
    expect(wrapper.text()).toContain('Post 1');
    expect(wrapper.text()).toContain('Post 2');
    expect(wrapper.text()).toContain('100');
    expect(wrapper.text()).toContain('50');
  });

  it('deletes post after confirmation', async () => {
    const mockDelete = vi.fn().mockResolvedValue(undefined);
    const mockGetPosts = vi
      .fn()
      .mockResolvedValue([{ id: '1', title: 'Post 1', createdAt: '2023-01-01' }]);

    (useBlogService as any).mockReturnValue({
      getPosts: mockGetPosts,
      getAllViews: vi.fn().mockResolvedValue({}),
      deletePost: mockDelete,
    });

    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

    const wrapper = mount(AdminPosts, {
      global: {
        stubs: {
          AdminLayout: { template: '<div><slot /></div>' },
        },
      },
    });
    await flushPromises();

    const deleteBtn = wrapper.find('button.text-red-600');
    await deleteBtn.trigger('click');

    expect(confirmSpy).toHaveBeenCalled();
    expect(mockDelete).toHaveBeenCalledWith('1');
    expect(mockGetPosts).toHaveBeenCalledTimes(2);

    confirmSpy.mockRestore();
  });
});

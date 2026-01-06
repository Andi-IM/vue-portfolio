/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import AdminDashboard from '../AdminDashboard.vue';
import { useBlogService } from '@/composables/useBlogService';

vi.mock('@/composables/useBlogService', () => ({
  useBlogService: vi.fn(),
  BLOG_SERVICE_KEY: Symbol('BlogService'),
}));

describe('AdminDashboard', () => {
  it('renders posts list with view counts', async () => {
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
      deletePost: vi.fn(),
    });

    const wrapper = mount(AdminDashboard, {
      global: {
        stubs: {
          RouterLink: { template: '<a><slot /></a>' },
        },
      },
    });
    await flushPromises();

    expect(wrapper.text()).toContain('CMS Dashboard');
    expect(wrapper.text()).toContain('Post 1');
    expect(wrapper.text()).toContain('Post 2');

    // Check view counts
    expect(wrapper.text()).toContain('100');
    expect(wrapper.text()).toContain('50');
  });

  it('deletes post after confirmation', async () => {
    const mockDelete = vi.fn().mockResolvedValue(undefined);
    const mockGetPosts = vi
      .fn()
      .mockResolvedValue([{ id: '1', title: 'Post 1', createdAt: '2023-01-01' }]);
    const mockGetAllViews = vi.fn().mockResolvedValue({});

    (useBlogService as any).mockReturnValue({
      getPosts: mockGetPosts,
      getAllViews: mockGetAllViews,
      deletePost: mockDelete,
    });

    // Mock window.confirm
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

    const wrapper = mount(AdminDashboard, {
      global: {
        stubs: {
          RouterLink: { template: '<a><slot /></a>' },
        },
      },
    });
    await flushPromises();

    const deleteBtn = wrapper.find('button.text-red-600');
    await deleteBtn.trigger('click');

    expect(confirmSpy).toHaveBeenCalled();
    expect(mockDelete).toHaveBeenCalledWith('1');
    expect(mockGetPosts).toHaveBeenCalledTimes(2); // Initial load + after delete reload
    expect(mockGetAllViews).toHaveBeenCalledTimes(2);

    confirmSpy.mockRestore();
  });

  it('handles error when fetching posts fails', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('Failed to fetch posts');

    (useBlogService as any).mockReturnValue({
      getPosts: vi.fn().mockRejectedValue(error),
      getAllViews: vi.fn().mockResolvedValue({}),
      deletePost: vi.fn(),
    });

    const wrapper = mount(AdminDashboard, {
      global: {
        stubs: {
          RouterLink: { template: '<a><slot /></a>' },
        },
      },
    });
    await flushPromises();

    expect(consoleErrorSpy).toHaveBeenCalledWith(error);
    expect(wrapper.text()).toContain('No posts yet');

    consoleErrorSpy.mockRestore();
  });

  it('handles error when deleting post fails', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const error = new Error('Delete failed');

    const mockDelete = vi.fn().mockRejectedValue(error);
    (useBlogService as any).mockReturnValue({
      getPosts: vi.fn().mockResolvedValue([{ id: '1', title: 'Post 1', createdAt: '2023-01-01' }]),
      getAllViews: vi.fn().mockResolvedValue({}),
      deletePost: mockDelete,
    });

    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

    const wrapper = mount(AdminDashboard, {
      global: {
        stubs: {
          RouterLink: { template: '<a><slot /></a>' },
        },
      },
    });
    await flushPromises();

    const deleteBtn = wrapper.find('button.text-red-600');
    await deleteBtn.trigger('click');
    await flushPromises();

    expect(consoleErrorSpy).toHaveBeenCalledWith(error);
    expect(alertSpy).toHaveBeenCalledWith('Failed to delete');

    consoleErrorSpy.mockRestore();
    alertSpy.mockRestore();
    confirmSpy.mockRestore();
  });
});

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
  it('renders posts list', async () => {
    const mockPosts = [
      { id: '1', title: 'Post 1', createdAt: '2023-01-01' },
      { id: '2', title: 'Post 2', createdAt: '2023-01-02' },
    ];
    (useBlogService as any).mockReturnValue({
      getPosts: vi.fn().mockResolvedValue(mockPosts),
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
  });

  it('deletes post after confirmation', async () => {
    const mockDelete = vi.fn().mockResolvedValue(undefined);
    const mockGetPosts = vi
      .fn()
      .mockResolvedValue([{ id: '1', title: 'Post 1', createdAt: '2023-01-01' }]);
    (useBlogService as any).mockReturnValue({
      getPosts: mockGetPosts,
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

    confirmSpy.mockRestore();
  });

  it('handles error when fetching posts fails', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('Failed to fetch posts');

    (useBlogService as any).mockReturnValue({
      getPosts: vi.fn().mockRejectedValue(error),
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

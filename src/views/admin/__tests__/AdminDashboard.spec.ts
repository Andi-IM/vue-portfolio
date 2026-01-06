/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import AdminDashboard from '../AdminDashboard.vue';
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

describe('AdminDashboard', () => {
  it('renders statistics cards and trend visualization', async () => {
    const mockPosts = [
      { id: '1', title: 'Post 1', slug: 'post-1' },
      { id: '2', title: 'Post 2', slug: 'post-2' },
    ];
    const mockViews = {
      '1': 100,
      '2': 50,
    };

    (useBlogService as any).mockReturnValue({
      getPosts: vi.fn().mockResolvedValue(mockPosts),
      getAllViews: vi.fn().mockResolvedValue(mockViews),
    });

    const wrapper = mount(AdminDashboard, {
      global: {
        stubs: {
          AdminLayout: { template: '<div><slot /></div>' },
        },
      },
    });
    await flushPromises();

    // Check heading
    expect(wrapper.text()).toContain('Dashboard Overview');

    // Check stat cards
    expect(wrapper.text()).toContain('Total Posts');
    expect(wrapper.find('.stat-value').text()).toBe('2');

    expect(wrapper.text()).toContain('Total Views');
    expect(wrapper.text()).toContain('150');

    // Check trend visualization
    expect(wrapper.text()).toContain('Views Trend');
    expect(wrapper.text()).toContain('Post 1');
    expect(wrapper.text()).toContain('100 views');
  });

  it('shows empty state when no data exists', async () => {
    (useBlogService as any).mockReturnValue({
      getPosts: vi.fn().mockResolvedValue([]),
      getAllViews: vi.fn().mockResolvedValue({}),
    });

    const wrapper = mount(AdminDashboard, {
      global: {
        stubs: {
          AdminLayout: { template: '<div><slot /></div>' },
        },
      },
    });
    await flushPromises();

    expect(wrapper.text()).toContain('0');
    expect(wrapper.text()).toContain('No data available yet');
  });

  it('handles error when fetching data fails', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('Failed to fetch');

    (useBlogService as any).mockReturnValue({
      getPosts: vi.fn().mockRejectedValue(error),
      getAllViews: vi.fn().mockResolvedValue({}),
    });

    mount(AdminDashboard, {
      global: {
        stubs: {
          AdminLayout: { template: '<div><slot /></div>' },
        },
      },
    });
    await flushPromises();

    expect(consoleErrorSpy).toHaveBeenCalledWith(error);
    consoleErrorSpy.mockRestore();
  });
});

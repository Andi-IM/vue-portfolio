/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import BlogPost from '../BlogPost.vue';
import { useBlogService } from '@/composables/useBlogService';
import { useRoute } from 'vue-router';
import enUS from '../../../i18n/en-US';

vi.mock('@/composables/useBlogService', () => ({
  useBlogService: vi.fn(),
  BLOG_SERVICE_KEY: Symbol('BlogService'),
}));

vi.mock('vue-router', () => ({
  useRoute: vi.fn(),
}));

const mocks = {
  $t: (msg: string) => {
    const keys = msg.split('.');
    let res: any = enUS;
    for (const key of keys) res = res[key];
    return res;
  },
};

describe('BlogPost', () => {
  it('renders loading state initially', () => {
    (useRoute as any).mockReturnValue({ params: { slug: 'test-slug' } });
    (useBlogService as any).mockReturnValue({
      getPostBySlug: vi.fn().mockImplementation(() => new Promise(() => {})),
    });
    const wrapper = mount(BlogPost, {
      global: { mocks },
    });
    expect(wrapper.text()).toContain(enUS.common.loading);
  });

  it('renders error/not found state', async () => {
    (useRoute as any).mockReturnValue({ params: { slug: 'test-slug' } });
    (useBlogService as any).mockReturnValue({
      getPostBySlug: vi.fn().mockResolvedValue(null),
    });
    const wrapper = mount(BlogPost, {
      global: { mocks },
    });
    await flushPromises();
    expect(wrapper.text()).toContain(enUS.common.postNotFound);
  });

  it('renders post content correctly', async () => {
    const mockPost = {
      id: '1',
      title: 'My Title',
      createdAt: '2023-01-01',
      content: '<div class="rich-content">Rich Content</div>',
      coverImage: 'image.jpg',
    };

    (useRoute as any).mockReturnValue({ params: { slug: 'test-slug' } });
    (useBlogService as any).mockReturnValue({
      getPostBySlug: vi.fn().mockResolvedValue(mockPost),
    });

    const wrapper = mount(BlogPost, {
      global: { mocks },
    });
    await flushPromises();

    expect(wrapper.text()).toContain('My Title');
    expect(wrapper.html()).toContain('Rich Content');
    expect(wrapper.find('img').attributes('src')).toBe('image.jpg');
  });

  it('handles error when fetching post fails', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('Failed to fetch post');

    (useRoute as any).mockReturnValue({ params: { slug: 'test-slug' } });
    (useBlogService as any).mockReturnValue({
      getPostBySlug: vi.fn().mockRejectedValue(error),
    });

    const wrapper = mount(BlogPost, {
      global: { mocks },
    });
    await flushPromises();

    expect(consoleErrorSpy).toHaveBeenCalledWith(error);
    expect(wrapper.text()).toContain(enUS.common.postNotFound);

    consoleErrorSpy.mockRestore();
  });

  it('renders formatted date when post has createdAt', async () => {
    const mockPost = {
      id: '1',
      title: 'My Title',
      createdAt: '2023-06-15',
      content: 'Html content',
    };

    (useRoute as any).mockReturnValue({ params: { slug: 'test-slug' } });
    (useBlogService as any).mockReturnValue({
      getPostBySlug: vi.fn().mockResolvedValue(mockPost),
    });

    const wrapper = mount(BlogPost, {
      global: { mocks },
    });
    await flushPromises();

    const expectedDate = '2023/06/15';
    expect(wrapper.text()).toContain(expectedDate);
  });
  it('does not render date when createdAt is missing', async () => {
    const mockPost = {
      id: '1',
      title: 'My Title',
      createdAt: '',
      content: 'Html content',
    };

    (useRoute as any).mockReturnValue({ params: { slug: 'test-slug' } });
    (useBlogService as any).mockReturnValue({
      getPostBySlug: vi.fn().mockResolvedValue(mockPost),
    });

    const wrapper = mount(BlogPost, {
      global: { mocks },
    });
    await flushPromises();

    expect(wrapper.find('time').exists()).toBe(false);
  });

  it('does not render cover image when coverImage is missing', async () => {
    const mockPost = {
      id: '1',
      title: 'My Title',
      createdAt: '2023-01-01',
      content: 'Html content',
      coverImage: '',
    };

    (useRoute as any).mockReturnValue({ params: { slug: 'test-slug' } });
    (useBlogService as any).mockReturnValue({
      getPostBySlug: vi.fn().mockResolvedValue(mockPost),
    });

    const wrapper = mount(BlogPost, {
      global: { mocks },
    });
    await flushPromises();

    expect(wrapper.find('img').exists()).toBe(false);
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import ActivitiesSection from '../ActivitiesSection.vue';
import enUS from '../../i18n/en-US';
import type { BlogPostIndex } from '../../types/blog';

// Mock Vue Router
const pushMock = vi.fn();

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

// Mock BlogService
const mockGetPosts = vi.fn();

vi.mock('../../composables/useBlogService', () => ({
  useBlogService: () => ({
    getPosts: mockGetPosts,
  }),
}));

// Mock useDate to return predictable values
vi.mock('../../composables/useDate', () => ({
  useDate: () => ({
    formatDate: (date: string) =>
      new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      }),
  }),
}));

/* eslint-disable @typescript-eslint/no-explicit-any */
const mocks = {
  $t: (msg: string) => {
    const keys = msg.split('.');
    let res: any = enUS;
    for (const key of keys) res = res[key];
    return res;
  },
};

const mockPosts: BlogPostIndex[] = [
  {
    id: '1',
    title: 'Post One',
    slug: 'post-one',
    excerpt: 'Excerpt 1',
    createdAt: '2026-01-05T10:00:00Z',
    updatedAt: '2026-01-05T10:00:00Z',
  },
  {
    id: '2',
    title: 'Post Two',
    slug: 'post-two',
    excerpt: 'Excerpt 2',
    createdAt: '2026-01-04T10:00:00Z',
    updatedAt: '2026-01-04T10:00:00Z',
  },
  {
    id: '3',
    title: 'Post Three',
    slug: 'post-three',
    excerpt: 'Excerpt 3',
    createdAt: '2026-01-03T10:00:00Z',
    updatedAt: '2026-01-03T10:00:00Z',
  },
  {
    id: '4',
    title: 'Post Four',
    slug: 'post-four',
    excerpt: 'Excerpt 4',
    createdAt: '2026-01-02T10:00:00Z',
    updatedAt: '2026-01-02T10:00:00Z',
  },
];

describe('ActivitiesSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetPosts.mockResolvedValue([...mockPosts]);
  });

  it('renders correctly with title', async () => {
    const wrapper = mount(ActivitiesSection, {
      global: { mocks },
    });
    await flushPromises();

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.text()).toContain(enUS.activities.title);
  });

  it('shows loading state initially', async () => {
    // Use a promise that resolves later so we can check loading state
    let resolvePromise: (value: BlogPostIndex[]) => void;
    mockGetPosts.mockReturnValue(
      new Promise((resolve) => {
        resolvePromise = resolve;
      }),
    );

    const wrapper = mount(ActivitiesSection, {
      global: { mocks },
    });

    expect(wrapper.text()).toContain(enUS.common.loading);

    // Resolve the promise to avoid unhandled rejection during teardown
    resolvePromise!([]);
    await flushPromises();
  });

  it('shows empty state when no posts are returned', async () => {
    mockGetPosts.mockResolvedValue([]);

    const wrapper = mount(ActivitiesSection, {
      global: { mocks },
    });
    await flushPromises();

    expect(wrapper.text()).toContain(enUS.common.noPostsFound);
  });

  it('fetches and displays top 3 posts sorted by date descending', async () => {
    const wrapper = mount(ActivitiesSection, {
      global: { mocks },
    });
    await flushPromises();

    expect(mockGetPosts).toHaveBeenCalledTimes(1);

    // Should show top 3 posts (Post One, Two, Three)
    expect(wrapper.text()).toContain('Post One');
    expect(wrapper.text()).toContain('Post Two');
    expect(wrapper.text()).toContain('Post Three');
    // Should NOT show Post Four (it's the 4th)
    expect(wrapper.text()).not.toContain('Post Four');
  });

  it('navigates to blog post on card click', async () => {
    const wrapper = mount(ActivitiesSection, {
      global: { mocks },
    });
    await flushPromises();

    // Find the first card
    const cards = wrapper.findAll('.cursor-pointer');
    expect(cards.length).toBeGreaterThan(0);

    // Click the first card
    await cards[0].trigger('click');

    expect(pushMock).toHaveBeenCalledWith({
      name: 'blog-post',
      params: { slug: 'post-one' },
    });
  });
});

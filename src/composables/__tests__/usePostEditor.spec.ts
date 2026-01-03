/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/unbound-method */
import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  type MockInstance,
  type Mocked,
} from 'vitest';
import { usePostEditor } from '../usePostEditor';
import { mount } from '@vue/test-utils';
import { defineComponent, nextTick } from 'vue';
import type { IBlogService } from '@/types/blog';
import type { RouteLocationNormalizedLoaded, Router } from 'vue-router';

// Helper component to test composable
const TestComponent = defineComponent({
  props: ['deps'],
  setup(props) {
    return { ...usePostEditor(props.deps) };
  },
  template: '<div></div>',
});

describe('usePostEditor', () => {
  let mockBlogService: Mocked<IBlogService>;
  let mockRoute: Partial<RouteLocationNormalizedLoaded>;
  let mockRouter: Partial<Router>;
  let alertSpy: MockInstance;
  let consoleSpy: MockInstance;

  beforeEach(() => {
    mockBlogService = {
      getPost: vi.fn(),
      savePost: vi.fn(),
      uploadImage: vi.fn(),
    } as unknown as Mocked<IBlogService>;
    mockRoute = { params: { id: 'new' } };
    mockRouter = { push: vi.fn() };
    alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('initializes with default empty post if new', () => {
    const { vm } = mount(TestComponent, {
      props: { deps: { blogService: mockBlogService, route: mockRoute, router: mockRouter } },
    });
    const instance = vm as any;

    expect(instance.isNew).toBe(true);
    expect(instance.form.title).toBe('');
    expect(instance.form.content).toBe('');
  });

  it('fetches post on mount if not new', async () => {
    mockRoute.params!.id = '123';
    const postData = { id: '123', title: 'Test Post', content: [] };
    mockBlogService.getPost.mockResolvedValue(postData as any);

    const { vm } = mount(TestComponent, {
      props: { deps: { blogService: mockBlogService, route: mockRoute, router: mockRouter } },
    });

    await nextTick();
    await nextTick(); // Wait for onMounted async

    const instance = vm as any;
    expect(mockBlogService.getPost).toHaveBeenCalledWith('123');
    expect(instance.form.title).toBe('Test Post');
  });

  it('handles fetch error on mount', async () => {
    mockRoute.params!.id = '123';
    mockBlogService.getPost.mockRejectedValue(new Error('Fetch Fail'));

    mount(TestComponent, {
      props: { deps: { blogService: mockBlogService, route: mockRoute, router: mockRouter } },
    });

    await nextTick();
    await nextTick(); // Wait for onMounted async

    expect(consoleSpy).toHaveBeenCalledWith('Failed to load post', expect.any(Error));
  });

  it('validates title on save', async () => {
    const { vm } = mount(TestComponent, {
      props: { deps: { blogService: mockBlogService, route: mockRoute, router: mockRouter } },
    });
    const instance = vm as any;

    await instance.save();
    expect(alertSpy).toHaveBeenCalledWith('Title is required');
    expect(mockBlogService.savePost).not.toHaveBeenCalled();
  });

  it('generates slug automatically if missing', async () => {
    const { vm } = mount(TestComponent, {
      props: { deps: { blogService: mockBlogService, route: mockRoute, router: mockRouter } },
    });
    const instance = vm as any;

    instance.form.title = 'Hello World';
    await instance.save();

    expect(instance.form.slug).toBe('hello-world');
    expect(mockBlogService.savePost).toHaveBeenCalledWith(
      expect.objectContaining({
        slug: 'hello-world',
      }),
    );
  });

  it('saves and redirects on success', async () => {
    const { vm } = mount(TestComponent, {
      props: { deps: { blogService: mockBlogService, route: mockRoute, router: mockRouter } },
    });
    const instance = vm as any;

    instance.form.title = 'Title';
    mockBlogService.savePost.mockResolvedValue({} as any);

    await instance.save();

    expect(alertSpy).toHaveBeenCalledWith('Saved!');
    expect(mockRouter.push).toHaveBeenCalledWith('/admin');
  });

  it('handles save error', async () => {
    const { vm } = mount(TestComponent, {
      props: { deps: { blogService: mockBlogService, route: mockRoute, router: mockRouter } },
    });
    const instance = vm as any;

    instance.form.title = 'Title';
    mockBlogService.savePost.mockRejectedValue(new Error('Fail'));

    await instance.save();

    expect(alertSpy).toHaveBeenCalledWith('Error saving');
    expect(instance.loading).toBe(false);
  });

  it('delegates image upload', async () => {
    const { vm } = mount(TestComponent, {
      props: { deps: { blogService: mockBlogService, route: mockRoute, router: mockRouter } },
    });
    const instance = vm as any;

    const file = new File([], 'test.png');
    mockBlogService.uploadImage.mockResolvedValue('url');

    const url = await instance.handleImageUpload(file);
    expect(url).toBe('url');
    expect(mockBlogService.uploadImage).toHaveBeenCalledWith(file);
  });

  it('sets coverImage from first image inserted if empty', () => {
    const { vm } = mount(TestComponent, {
      props: { deps: { blogService: mockBlogService, route: mockRoute, router: mockRouter } },
    });
    const instance = vm as any;

    expect(instance.form.coverImage).toBe('');
    instance.onImageInserted('https://example.com/image1.png');
    expect(instance.form.coverImage).toBe('https://example.com/image1.png');
  });

  it('does not overwrite coverImage if already set', () => {
    const { vm } = mount(TestComponent, {
      props: { deps: { blogService: mockBlogService, route: mockRoute, router: mockRouter } },
    });
    const instance = vm as any;

    instance.form.coverImage = 'https://example.com/existing.png';
    instance.onImageInserted('https://example.com/new-image.png');
    expect(instance.form.coverImage).toBe('https://example.com/existing.png');
  });
});

describe('extractFirstImage', () => {
  // Import the function directly
  let extractFirstImage: (html: string) => string | null;

  beforeEach(async () => {
    const module = await import('../usePostEditor');
    extractFirstImage = module.extractFirstImage;
  });

  it('extracts URL from img tag with double quotes', () => {
    const html = '<p>Hello</p><img src="https://example.com/image.png" /><p>World</p>';
    expect(extractFirstImage(html)).toBe('https://example.com/image.png');
  });

  it('extracts URL from img tag with single quotes', () => {
    const html = "<img src='https://example.com/image.jpg' alt='test' />";
    expect(extractFirstImage(html)).toBe('https://example.com/image.jpg');
  });

  it('returns first image when multiple images exist', () => {
    const html = '<img src="https://first.png" /><img src="https://second.png" />';
    expect(extractFirstImage(html)).toBe('https://first.png');
  });

  it('returns null for content without images', () => {
    const html = '<p>No images here</p>';
    expect(extractFirstImage(html)).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(extractFirstImage('')).toBeNull();
  });
});

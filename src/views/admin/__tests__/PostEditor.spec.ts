/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import PostEditor from '../PostEditor.vue';
import { useBlogService } from '@/composables/useBlogService';
import { useRoute, useRouter } from 'vue-router';

vi.mock('@/composables/useBlogService', () => ({
  useBlogService: vi.fn(),
  BLOG_SERVICE_KEY: Symbol('BlogService'),
}));

vi.mock('vue-router', () => ({
  useRoute: vi.fn(),
  useRouter: vi.fn(),
}));

describe('PostEditor', () => {
  it('renders new post form', () => {
    (useRoute as any).mockReturnValue({ params: { id: 'new' } });
    (useBlogService as any).mockReturnValue({ savePost: vi.fn() });

    const wrapper = mount(PostEditor, {
      global: {
        stubs: {
          QuasarEditor: { template: '<div>Editor</div>' },
          'q-tabs': { template: '<div><slot /></div>' },
          'q-tab': { template: '<div><slot /></div>' },
          'q-tab-panels': { template: '<div><slot /></div>' },
          'q-tab-panel': { template: '<div><slot /></div>' },
        },
      },
    });

    expect(wrapper.text()).toContain('New Post');
    expect(wrapper.text()).toContain('Save Post');
  });

  it('validates title on save', async () => {
    (useRoute as any).mockReturnValue({ params: { id: 'new' } });
    (useBlogService as any).mockReturnValue({ savePost: vi.fn() });

    // Mock alert
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    const wrapper = mount(PostEditor, {
      global: {
        stubs: {
          QuasarEditor: true,
          'q-tabs': true,
          'q-tab': true,
          'q-tab-panels': true,
          'q-tab-panel': true,
        },
      },
    });

    // Click save without title
    const saveBtn = wrapper.findAll('button').find((b) => b.text().includes('Save'));
    await saveBtn?.trigger('click');

    expect(alertSpy).toHaveBeenCalledWith('Title is required');
    alertSpy.mockRestore();
  });

  it('saves post correctly', async () => {
    (useRoute as any).mockReturnValue({ params: { id: 'new' } });
    const mockSave = vi.fn().mockResolvedValue({});
    (useBlogService as any).mockReturnValue({ savePost: mockSave });
    const mockRouterPush = vi.fn();
    (useRouter as any).mockReturnValue({ push: mockRouterPush });

    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    const wrapper = mount(PostEditor, {
      global: {
        stubs: {
          QuasarEditor: true,
          'q-tabs': true,
          'q-tab': true,
          'q-tab-panels': true,
          'q-tab-panel': true,
        },
      },
    });

    // Fill title
    const titleInput = wrapper.findAll('input')[0]!;
    await titleInput.setValue('My New Post');

    // Click save
    const saveBtn = wrapper.findAll('button').find((b) => b.text().includes('Save'));
    await saveBtn?.trigger('click');

    expect(mockSave).toHaveBeenCalled();
    expect(mockSave.mock.calls[0]![0]).toMatchObject({ title: 'My New Post', slug: 'my-new-post' });
    expect(mockRouterPush).toHaveBeenCalledWith('/admin');

    alertSpy.mockRestore();
  });

  it('loads existing post for editing', async () => {
    (useRoute as any).mockReturnValue({ params: { id: '123' } });
    const mockGetPost = vi.fn().mockResolvedValue({
      id: '123',
      title: 'Existing Post',
      slug: 'existing',
      content: 'Html content',
    });
    (useBlogService as any).mockReturnValue({
      getPost: mockGetPost,
      savePost: vi.fn(),
    });

    const wrapper = mount(PostEditor, {
      global: {
        stubs: {
          QuasarEditor: true,
          'q-tabs': true,
          'q-tab': true,
          'q-tab-panels': true,
          'q-tab-panel': true,
        },
      },
    });
    await flushPromises(); // Wait for onMounted

    // Check if title input has value
    const titleInput = wrapper.findAll('input')[0]!;
    expect((titleInput.element as HTMLInputElement).value).toBe('Existing Post');
  });

  it('updates form fields via v-model bindings', async () => {
    (useRoute as any).mockReturnValue({ params: { id: 'new' } });
    (useBlogService as any).mockReturnValue({ savePost: vi.fn() });

    const wrapper = mount(PostEditor, {
      global: {
        stubs: {
          QuasarEditor: true,
          'q-tabs': true,
          'q-tab': true,
          'q-tab-panels': true,
          'q-tab-panel': true,
        },
      },
    });

    const inputs = wrapper.findAll('input');
    const textarea = wrapper.find('textarea');

    // Test slug input (line 54)
    const slugInput = inputs[1]!; // Second input is slug
    await slugInput.setValue('my-custom-slug');
    expect((slugInput.element as HTMLInputElement).value).toBe('my-custom-slug');

    // Test coverImage input (line 63)
    const coverImageInput = inputs[2]!; // Third input is coverImage
    await coverImageInput.setValue('https://example.com/cover.jpg');
    expect((coverImageInput.element as HTMLInputElement).value).toBe(
      'https://example.com/cover.jpg',
    );

    // Test excerpt textarea (line 74)
    await textarea.setValue('This is a test excerpt');
    expect((textarea.element as HTMLTextAreaElement).value).toBe('This is a test excerpt');
  });

  it('shows cover image preview when coverImage has value', async () => {
    (useRoute as any).mockReturnValue({ params: { id: 'new' } });
    (useBlogService as any).mockReturnValue({ savePost: vi.fn() });

    const wrapper = mount(PostEditor, {
      global: {
        stubs: {
          QuasarEditor: true,
          'q-tabs': true,
          'q-tab': true,
          'q-tab-panels': true,
          'q-tab-panel': true,
        },
      },
    });

    // Initially no preview image
    let previewImg = wrapper.find('img[alt="Cover preview"]');
    expect(previewImg.exists()).toBe(false);

    // Set cover image URL
    const coverImageInput = wrapper.findAll('input')[2]!;
    await coverImageInput.setValue('https://example.com/cover.jpg');

    // Now preview image should exist
    previewImg = wrapper.find('img[alt="Cover preview"]');
    expect(previewImg.exists()).toBe(true);
    expect(previewImg.attributes('src')).toBe('https://example.com/cover.jpg');
  });

  it('has Editor and Preview tabs for content', () => {
    (useRoute as any).mockReturnValue({ params: { id: 'new' } });
    (useBlogService as any).mockReturnValue({ savePost: vi.fn() });

    const wrapper = mount(PostEditor, {
      global: {
        stubs: {
          QuasarEditor: { template: '<div>Editor</div>' },
          'q-tabs': { template: '<div class="q-tabs"><slot /></div>' },
          'q-tab': {
            template: '<div class="q-tab" :data-name="name"><slot />{{ label }}</div>',
            props: ['name', 'label'],
          },
          'q-tab-panels': { template: '<div class="q-tab-panels"><slot /></div>' },
          'q-tab-panel': { template: '<div class="q-tab-panel"><slot /></div>' },
        },
      },
    });

    // Check for tab labels
    expect(wrapper.text()).toContain('Editor');
    expect(wrapper.text()).toContain('Preview');
  });
});

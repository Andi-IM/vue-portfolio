import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { mount } from '@vue/test-utils';
import QuasarEditor from '../QuasarEditor.vue';
import { ref } from 'vue';

// Mock Quasar components
const QEditor = {
  template: '<div class="q-editor" data-testid="visual-editor"><slot></slot></div>',
  props: ['modelValue', 'definitions', 'toolbar', 'minHeight', 'contentClass'],
  emits: ['update:modelValue'],
};

const QInput = {
  template:
    '<textarea class="q-input" data-testid="source-editor" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)"></textarea>',
  props: ['modelValue', 'type', 'borderless', 'square', 'inputClass'],
  emits: ['update:modelValue'],
};

const QIcon = {
  template: '<i class="q-icon"></i>',
  props: ['name', 'size'],
};

// Mock useQuasarEditor composable
const mockContent = ref('');
const mockIsSourceMode = ref(false);
const mockToggleSourceMode = vi.fn();
const mockUploadImageHandler = vi.fn();

vi.mock('../../../composables/useQuasarEditor', () => ({
  useQuasarEditor: vi.fn(() => ({
    content: mockContent,
    isSourceMode: mockIsSourceMode,
    toggleSourceMode: mockToggleSourceMode,
    uploadImageHandler: mockUploadImageHandler,
  })),
}));

describe('QuasarEditor.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockContent.value = 'initial content';
    mockIsSourceMode.value = false;
  });

  it('renders visual editor by default', () => {
    const wrapper = mount(QuasarEditor, {
      props: { modelValue: 'initial content' },
      global: {
        components: {
          'q-editor': QEditor,
          'q-input': QInput,
          'q-icon': QIcon,
        },
      },
    });

    const visualEditor = wrapper.find('[data-testid="visual-editor"]');
    expect(visualEditor.exists()).toBe(true);
    expect(visualEditor.isVisible()).toBe(true);

    // Source editor should exist but be hidden (v-show)
    const sourceEditor = wrapper.find('.source-editor');
    expect(sourceEditor.isVisible()).toBe(false);
  });

  it('renders source editor when isSourceMode is true', () => {
    mockIsSourceMode.value = true;

    const wrapper = mount(QuasarEditor, {
      props: { modelValue: 'initial content' },
      global: {
        components: {
          'q-editor': QEditor,
          'q-input': QInput,
          'q-icon': QIcon,
        },
      },
    });

    const visualEditor = wrapper.find('.visual-editor');
    expect(visualEditor.isVisible()).toBe(false);

    const sourceEditor = wrapper.find('.source-editor');
    expect(sourceEditor.isVisible()).toBe(true);
  });

  it('toggles source mode back to visual when button clicked', async () => {
    mockIsSourceMode.value = true;

    const wrapper = mount(QuasarEditor, {
      props: { modelValue: 'initial content' },
      global: {
        components: {
          'q-editor': QEditor,
          'q-input': QInput,
          'q-icon': QIcon,
        },
      },
    });

    const toggleButton = wrapper.find('button.flex.items-center');
    expect(toggleButton.exists()).toBe(true);

    // Click the button to switch back to visual editor
    await toggleButton.trigger('click');

    // The component manually sets isSourceMode = false in the template @click handler
    // We can't verify the local ref change directly in the component easily without inspecting setup state,
    // but we can check if the UI updates if we were using a real component.
    // However, since we mock the composable, the reactivity is tied to our mock ref.
    // The template has `@click="isSourceMode = false"`.
    // Since `isSourceMode` comes from `useQuasarEditor` which returns our `mockIsSourceMode`,
    // clicking the button should update our mock ref if it was returned as a writable ref.

    // Wait for reactivity
    expect(mockIsSourceMode.value).toBe(false);
  });

  it('updates content when modelValue prop changes', async () => {
    // This logic is inside the composable, but the component passes props to it.
    // We can verify that useQuasarEditor was called with the correct props.
    // But useQuasarEditor is called in setup, so we check the mocks.

    mount(QuasarEditor, {
      props: { modelValue: 'new content' },
      global: {
        components: {
          'q-editor': QEditor,
          'q-input': QInput,
          'q-icon': QIcon,
        },
      },
    });

    // We can't easily check the arguments passed to useQuasarEditor setup function
    // unless we spy on the module export itself which we did with vi.mock.
    const { useQuasarEditor } = await import('../../../composables/useQuasarEditor');
    expect(useQuasarEditor).toHaveBeenCalledWith(
      expect.objectContaining({
        modelValue: 'new content',
      }),
    );
  });

  it('emits events when composable callbacks are triggered', async () => {
    const wrapper = mount(QuasarEditor, {
      props: { modelValue: 'content' },
      global: {
        components: {
          'q-editor': QEditor,
          'q-input': QInput,
          'q-icon': QIcon,
        },
      },
    });

    const { useQuasarEditor } = await import('../../../composables/useQuasarEditor');
    const calls = (useQuasarEditor as unknown as Mock).mock.calls;
    const lastCall = calls[calls.length - 1];

    if (!lastCall) {
      throw new Error('useQuasarEditor was not called');
    }

    const options = lastCall[0];

    // Trigger onUpdateModelValue
    options.onUpdateModelValue('updated content');
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['updated content']);

    // Trigger onImageInserted
    options.onImageInserted('http://example.com/image.png');
    expect(wrapper.emitted('image-inserted')).toBeTruthy();
    expect(wrapper.emitted('image-inserted')?.[0]).toEqual(['http://example.com/image.png']);
  });
});

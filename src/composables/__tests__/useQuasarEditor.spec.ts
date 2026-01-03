/* eslint-disable @typescript-eslint/unbound-method */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useQuasarEditor } from '../useQuasarEditor';
import { nextTick, reactive } from 'vue';

// Mock useBlogService
vi.mock('../useBlogService', () => ({
  useBlogService: vi.fn(() => ({
    uploadImage: vi.fn().mockResolvedValue('http://mock-service-url.com/img.png'),
  })),
}));

describe('useQuasarEditor', () => {
  const defaultOptions = {
    modelValue: 'initial content',
    onUpdateModelValue: vi.fn(),
    onImageInserted: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock document.execCommand
    document.execCommand = vi.fn();
  });

  it('initializes with provided modelValue', () => {
    const { content, isSourceMode } = useQuasarEditor(defaultOptions);
    expect(content.value).toBe('initial content');
    expect(isSourceMode.value).toBe(false);
  });

  it('updates content when modelValue option changes', async () => {
    const options = reactive({ ...defaultOptions, modelValue: 'initial' });
    const { content } = useQuasarEditor(options);

    expect(content.value).toBe('initial');

    options.modelValue = 'updated';
    await nextTick();
    expect(content.value).toBe('updated');
  });

  it('toggles source mode', () => {
    const { isSourceMode, toggleSourceMode } = useQuasarEditor(defaultOptions);
    expect(isSourceMode.value).toBe(false);
    toggleSourceMode();
    expect(isSourceMode.value).toBe(true);
    toggleSourceMode();
    expect(isSourceMode.value).toBe(false);
  });

  it('calls onUpdateModelValue when content changes', async () => {
    const onUpdate = vi.fn();
    const { content } = useQuasarEditor({ ...defaultOptions, onUpdateModelValue: onUpdate });

    content.value = 'new content';
    await nextTick();
    expect(onUpdate).toHaveBeenCalledWith('new content');
  });

  it('handles image upload via custom uploader', async () => {
    const customUploader = vi.fn().mockResolvedValue('http://custom-url.com/img.png');
    const { uploadImageHandler } = useQuasarEditor({
      ...defaultOptions,
      uploader: customUploader,
    });

    // Mock input element
    const mockInput = {
      click: vi.fn(),
      type: '',
      accept: '',
      onchange: null as ((this: GlobalEventHandlers, ev: Event) => void) | null,
    } as unknown as HTMLInputElement;

    vi.spyOn(document, 'createElement').mockReturnValue(mockInput);

    uploadImageHandler();
    expect(mockInput.click).toHaveBeenCalled();

    // Simulate file selection
    const file = new File([''], 'test.png', { type: 'image/png' });
    const event = {
      target: {
        files: [file],
      },
    } as unknown as Event;

    if (mockInput.onchange) {
      await mockInput.onchange(event);
    }

    expect(customUploader).toHaveBeenCalledWith(file);
    expect(document.execCommand).toHaveBeenCalledWith(
      'insertHTML',
      false,
      expect.stringContaining('http://custom-url.com/img.png'),
    );
    expect(defaultOptions.onImageInserted).toHaveBeenCalledWith('http://custom-url.com/img.png');
  });

  it('handles image upload via BlogService fallback', async () => {
    const { uploadImageHandler } = useQuasarEditor(defaultOptions);

    // Mock input element
    const mockInput = {
      click: vi.fn(),
      type: '',
      accept: '',
      onchange: null as ((this: GlobalEventHandlers, ev: Event) => void) | null,
    } as unknown as HTMLInputElement;

    vi.spyOn(document, 'createElement').mockReturnValue(mockInput);

    uploadImageHandler();

    const file = new File([''], 'test.png', { type: 'image/png' });
    const event = {
      target: {
        files: [file],
      },
    } as unknown as Event;

    if (mockInput.onchange) {
      await mockInput.onchange(event);
    }

    expect(document.execCommand).toHaveBeenCalledWith(
      'insertHTML',
      false,
      expect.stringContaining('http://mock-service-url.com/img.png'),
    );
    expect(defaultOptions.onImageInserted).toHaveBeenCalledWith(
      'http://mock-service-url.com/img.png',
    );
  });

  it('handles upload failure logs error', async () => {
    const error = new Error('Upload failed');
    const failingUploader = vi.fn().mockRejectedValue(error);
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { uploadImageHandler } = useQuasarEditor({
      ...defaultOptions,
      uploader: failingUploader,
    });

    const mockInput = {
      click: vi.fn(),
      type: '',
      accept: '',
      onchange: null as ((this: GlobalEventHandlers, ev: Event) => void) | null,
    } as unknown as HTMLInputElement;

    vi.spyOn(document, 'createElement').mockReturnValue(mockInput);

    uploadImageHandler();

    const file = new File([''], 'test.png', { type: 'image/png' });
    const event = {
      target: {
        files: [file],
      },
    } as unknown as Event;

    if (mockInput.onchange) {
      await mockInput.onchange(event);
    }

    expect(failingUploader).toHaveBeenCalledWith(file);
    expect(consoleSpy).toHaveBeenCalledWith('Upload failed', error);

    consoleSpy.mockRestore();
  });
});

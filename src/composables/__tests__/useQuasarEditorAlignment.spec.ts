import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useQuasarEditor, type UseQuasarEditorOptions } from '../useQuasarEditor';

// Mock useBlogService
vi.mock('../useBlogService', () => ({
  useBlogService: vi.fn(() => ({
    uploadImage: vi.fn(),
  })),
}));

describe('useQuasarEditor Alignment', () => {
  let container: HTMLElement;
  let img: HTMLImageElement;
  let options: UseQuasarEditorOptions;

  beforeEach(() => {
    // Setup DOM
    container = document.createElement('div');
    container.contentEditable = 'true';
    document.body.appendChild(container);

    img = document.createElement('img');
    img.src = 'test.png';
    container.appendChild(img);

    options = {
      modelValue: container.innerHTML,
      onUpdateModelValue: vi.fn(),
    };
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('applies left alignment by wrapping in div', () => {
    const { applyImageConfig, selectedImage } = useQuasarEditor(options);
    selectedImage.value = img;

    const config = {
      rotation: 0,
      align: 'left' as const,
      border: false,
      shadow: false,
      caption: '',
    };

    applyImageConfig(config);

    const wrapper = img.parentElement as HTMLElement;
    expect(wrapper.tagName).toBe('DIV');
    expect(wrapper.style.display).toBe('flex');
    expect(wrapper.style.justifyContent).toBe('flex-start');
    expect(wrapper.children[0]).toBe(img);
  });

  it('updates alignment from left to right', () => {
    const { applyImageConfig, selectedImage } = useQuasarEditor(options);

    // First apply left
    selectedImage.value = img;
    applyImageConfig({
      rotation: 0,
      align: 'left',
      border: false,
      shadow: false,
      caption: '',
    });

    // Now apply right
    selectedImage.value = img; // Ensure selectedImage is still the img element
    applyImageConfig({
      rotation: 0,
      align: 'right',
      border: false,
      shadow: false,
      caption: '',
    });

    const parent = img.parentElement as HTMLElement;
    expect(parent.tagName).toBe('DIV');
    expect(parent.style.display).toBe('flex');
    expect(parent.style.justifyContent).toBe('flex-end');

    // Check if we have nested wrappers (should NOT happen now)
    const grandParent = parent.parentElement;
    // grandParent should be the container
    expect(grandParent).toBe(container);
  });

  it('updates alignment from left to center', () => {
    const { applyImageConfig, selectedImage } = useQuasarEditor(options);

    // First apply left
    selectedImage.value = img;
    applyImageConfig({
      rotation: 0,
      align: 'left',
      border: false,
      shadow: false,
      caption: '',
    });

    // Now apply center
    selectedImage.value = img;
    applyImageConfig({
      rotation: 0,
      align: 'center',
      border: false,
      shadow: false,
      caption: '',
    });

    // New behavior: Center is also wrapped in flex container
    const parent = img.parentElement as HTMLElement;
    expect(parent.tagName).toBe('DIV');
    expect(parent.style.display).toBe('flex');
    expect(parent.style.justifyContent).toBe('center');
  });

  it('reads alignment from wrapper correctly', () => {
    const { getCurrentImageConfig, selectedImage } = useQuasarEditor(options);

    // Setup wrapper manually
    const wrapper = document.createElement('div');
    wrapper.style.textAlign = 'right';
    container.appendChild(wrapper);
    wrapper.appendChild(img);

    selectedImage.value = img;

    const config = getCurrentImageConfig();
    expect(config?.align).toBe('right');
  });
});

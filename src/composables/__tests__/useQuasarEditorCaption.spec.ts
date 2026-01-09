import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { UseQuasarEditorOptions } from '../useQuasarEditor';
import { useQuasarEditor } from '../useQuasarEditor';

// Mock useBlogService
vi.mock('../useBlogService', () => ({
  useBlogService: vi.fn(() => ({
    uploadImage: vi.fn().mockResolvedValue('http://mock-service-url.com/img.png'),
  })),
}));

describe('useQuasarEditor Caption Support', () => {
  let container: HTMLElement;
  let options: UseQuasarEditorOptions;

  beforeEach(() => {
    container = document.createElement('div');
    container.setAttribute('contenteditable', 'true');
    container.className = 'q-editor__content';
    document.body.appendChild(container);

    options = {
      modelValue: '',
      onUpdateModelValue: () => {},
    };
  });

  it('adds a caption to an image', () => {
    const { applyImageConfig, selectedImage } = useQuasarEditor(options);

    // Setup initial image
    const img = document.createElement('img');
    img.src = 'test.jpg';
    container.appendChild(img);
    selectedImage.value = img;

    // Apply config with caption
    applyImageConfig({
      rotation: 0,
      align: 'center',
      border: false,
      shadow: false,
      caption: 'Test Caption',
    });

    // Check structure
    const figure = container.querySelector('figure');
    expect(figure).not.toBeNull();

    const figcaption = figure?.querySelector('figcaption');
    expect(figcaption).not.toBeNull();
    expect(figcaption?.textContent).toBe('Test Caption');

    // Check image is inside figure
    expect(figure?.contains(img)).toBe(true);

    // Check alignment wrapper is still there (outer div)
    const wrapper = figure?.parentElement as HTMLElement;
    expect(wrapper).not.toBeNull();
    expect(wrapper.tagName).toBe('DIV');
    expect(wrapper.style.display).toBe('flex');
    expect(wrapper.style.justifyContent).toBe('center');
  });

  it('updates an existing caption', () => {
    const { applyImageConfig, selectedImage } = useQuasarEditor(options);

    // Setup structure with existing caption
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.justifyContent = 'center';

    const figure = document.createElement('figure');
    const img = document.createElement('img');
    img.src = 'test.jpg';
    const oldCaption = document.createElement('figcaption');
    oldCaption.textContent = 'Old Caption';

    figure.appendChild(img);
    figure.appendChild(oldCaption);
    wrapper.appendChild(figure);
    container.appendChild(wrapper);

    selectedImage.value = img;

    // Apply new caption
    applyImageConfig({
      rotation: 0,
      align: 'center',
      border: false,
      shadow: false,
      caption: 'New Caption',
    });

    const figcaption = container.querySelector('figcaption');
    expect(figcaption?.textContent).toBe('New Caption');
  });

  it('removes caption if empty', () => {
    const { applyImageConfig, selectedImage } = useQuasarEditor(options);

    // Setup structure with existing caption
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.justifyContent = 'center';

    const figure = document.createElement('figure');
    const img = document.createElement('img');
    img.src = 'test.jpg';
    const oldCaption = document.createElement('figcaption');
    oldCaption.textContent = 'Old Caption';

    figure.appendChild(img);
    figure.appendChild(oldCaption);
    wrapper.appendChild(figure);
    container.appendChild(wrapper);

    selectedImage.value = img;

    // Apply empty caption
    applyImageConfig({
      rotation: 0,
      align: 'center',
      border: false,
      shadow: false,
      caption: '',
    });

    const figcaption = container.querySelector('figcaption');
    expect(figcaption).toBeNull();

    // Check if image is still preserved
    const resultImg = container.querySelector('img');
    expect(resultImg).not.toBeNull();
  });
});

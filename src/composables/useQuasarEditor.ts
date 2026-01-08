import { ref, watch } from 'vue';
import { useBlogService } from './useBlogService';

interface UseQuasarEditorOptions {
  modelValue: string;
  uploader?: ((file: File) => Promise<string>) | undefined;
  onUpdateModelValue: (value: string) => void;
  onImageInserted?: ((url: string) => void) | undefined;
}

export interface ImageConfig {
  width?: string | number;
  height?: string | number;
  rotation: number;
  align: 'left' | 'center' | 'right';
  border: boolean;
  shadow: boolean;
  caption: string;
}

// Extended HTMLImageElement with custom listener storage
interface EditableImage extends HTMLImageElement {
  _imageEditListener?: (e: Event) => void;
}

export function useQuasarEditor(options: UseQuasarEditorOptions) {
  const blogService = useBlogService();
  const content = ref(options.modelValue || '');
  const isSourceMode = ref(false);
  const selectedImage = ref<HTMLImageElement | null>(null);
  const showImageEditor = ref(false);

  watch(
    () => options.modelValue,
    (val) => {
      if (val !== content.value) {
        content.value = val || '';
      }
    },
  );

  watch(content, (val) => {
    options.onUpdateModelValue(val);
  });

  const toggleSourceMode = () => {
    console.log('toggleSourceMode called, new state:', !isSourceMode.value);
    isSourceMode.value = !isSourceMode.value;
  };

  const uploadImageHandler = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        try {
          const uploader = options.uploader || ((f: File) => blogService.uploadImage(f));
          const url = await uploader(file);

          // Insert image at cursor with a data attribute to make it editable
          document.execCommand(
            'insertHTML',
            false,
            `<img src="${url}" style="max-width: 100%; cursor: pointer;" data-editable="true" />`,
          );

          // Emit event for parent to react
          if (options.onImageInserted) {
            options.onImageInserted(url);
          }

          // Make the newly inserted image clickable
          setTimeout(() => {
            makeImagesClickable();
          }, 100);
        } catch (err) {
          console.error('Upload failed', err);
        }
      }
    };
    input.click();
  };

  // Make images in the editor clickable to open the image editor
  const makeImagesClickable = () => {
    // Try different selectors as Quasar might use different wrappers
    const editorSelectors = ['.q-editor__content', '.q-editor .ProseMirror', '.q-editor iframe'];

    let editorElement: HTMLElement | null = null;

    for (const selector of editorSelectors) {
      editorElement = document.querySelector(selector) as HTMLElement;
      if (editorElement) {
        console.log('Found editor element with selector:', selector);
        break;
      }
    }

    if (!editorElement) {
      // If no editor found yet, try the body of any iframe
      const iframe = document.querySelector('.q-editor iframe') as HTMLIFrameElement;
      if (iframe && iframe.contentDocument) {
        editorElement = iframe.contentDocument.body;
        console.log('Using iframe body as editor element');
      }
    }

    if (editorElement) {
      const images = editorElement.querySelectorAll('img');
      console.log(`Found ${images.length} images in editor`);

      images.forEach((img, index) => {
        // Remove old listener if it exists
        const editableImg = img as EditableImage;
        const oldListener = editableImg._imageEditListener;
        if (oldListener) {
          img.removeEventListener('click', oldListener);
        }

        // Create new listener
        const listener = (e: Event) => {
          e.preventDefault();
          e.stopPropagation();
          console.log('Image clicked!', img.src);
          selectedImage.value = img;
          showImageEditor.value = true;
        };

        // Store listener reference and attach
        editableImg._imageEditListener = listener;
        img.addEventListener('click', listener);
        img.style.cursor = 'pointer';
        console.log(`Attached click listener to image ${index + 1}`);
      });

      // Set up mutation observer to watch for new images
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeName === 'IMG') {
              const img = node as HTMLImageElement;
              const listener = (e: Event) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('New image clicked!', img.src);
                selectedImage.value = img;
                showImageEditor.value = true;
              };
              (img as EditableImage)._imageEditListener = listener;
              img.addEventListener('click', listener);
              img.style.cursor = 'pointer';
              console.log('Attached click listener to new image');
            } else if (node instanceof HTMLElement) {
              // Check if the node contains images
              const imgs = node.querySelectorAll('img');
              imgs.forEach((img) => {
                const listener = (e: Event) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Nested new image clicked!', img.src);
                  selectedImage.value = img;
                  showImageEditor.value = true;
                };
                (img as EditableImage)._imageEditListener = listener;
                img.addEventListener('click', listener);
                img.style.cursor = 'pointer';
                console.log('Attached click listener to nested new image');
              });
            }
          });
        });
      });

      observer.observe(editorElement, {
        childList: true,
        subtree: true,
      });
    } else {
      console.warn('Could not find editor element to make images clickable');
    }
  };

  // Extract current image configuration
  const getCurrentImageConfig = () => {
    if (!selectedImage.value) return null;

    const img = selectedImage.value;
    const style = img.style;
    const computedStyle = window.getComputedStyle(img);

    // Extract rotation from transform
    let rotation = 0;
    const transform = style.transform || computedStyle.transform;
    const rotateMatch = transform.match(/rotate\((-?\d+)deg\)/);
    if (rotateMatch && rotateMatch[1]) {
      rotation = parseInt(rotateMatch[1], 10);
    }

    // Extract alignment from parent or inline style
    let align: 'left' | 'center' | 'right' = 'center';
    const textAlign = style.textAlign || computedStyle.textAlign;
    if (textAlign === 'left' || textAlign === 'right' || textAlign === 'center') {
      align = textAlign;
    }

    return {
      src: img.src,
      width: img.style.width || img.width || 'auto',
      height: img.style.height || img.height || 'auto',
      rotation,
      align,
      border: style.border?.includes('2px') || false,
      shadow: (style.boxShadow !== 'none' && style.boxShadow !== '') || false,
      caption: img.alt || '',
    };
  };

  // Apply image configuration from the editor
  const applyImageConfig = (config: ImageConfig) => {
    if (!selectedImage.value) return;

    const img = selectedImage.value;

    // Build style string
    const styles: string[] = [];

    if (config.width !== 'auto') {
      const widthValue = typeof config.width === 'number' ? `${config.width}px` : config.width;
      styles.push(`width: ${widthValue}`);
    }

    if (config.height !== 'auto') {
      const heightValue = typeof config.height === 'number' ? `${config.height}px` : config.height;
      styles.push(`height: ${heightValue}`);
    }

    if (config.rotation !== 0) {
      styles.push(`transform: rotate(${config.rotation}deg)`);
    }

    if (config.border) {
      styles.push('border: 2px solid #d4d4d8');
      styles.push('border-radius: 8px');
    }

    if (config.shadow) {
      styles.push('box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)');
    }

    styles.push('max-width: 100%');
    styles.push('cursor: pointer');

    // Apply styles
    img.setAttribute('style', styles.join('; '));

    // Apply caption
    if (config.caption) {
      img.alt = config.caption;
    }

    // Apply alignment by wrapping in a div
    if (config.align !== 'center') {
      const wrapper = document.createElement('div');
      wrapper.style.textAlign = config.align;
      img.parentNode?.insertBefore(wrapper, img);
      wrapper.appendChild(img);
    }

    showImageEditor.value = false;
    selectedImage.value = null;
  };

  const closeImageEditor = () => {
    showImageEditor.value = false;
    selectedImage.value = null;
  };

  return {
    content,
    isSourceMode,
    toggleSourceMode,
    uploadImageHandler,
    makeImagesClickable,
    selectedImage,
    showImageEditor,
    getCurrentImageConfig,
    applyImageConfig,
    closeImageEditor,
  };
}

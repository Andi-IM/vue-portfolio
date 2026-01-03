import { ref, watch } from 'vue';
import { useBlogService } from './useBlogService';

interface UseQuasarEditorOptions {
  modelValue: string;
  uploader?: ((file: File) => Promise<string>) | undefined;
  onUpdateModelValue: (value: string) => void;
  onImageInserted?: ((url: string) => void) | undefined;
}

export function useQuasarEditor(options: UseQuasarEditorOptions) {
  const blogService = useBlogService();
  const content = ref(options.modelValue || '');
  const isSourceMode = ref(false);

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

          // Insert image at cursor
          document.execCommand(
            'insertHTML',
            false,
            `<img src="${url}" style="max-width: 100%;" />`,
          );

          // Emit event for parent to react
          if (options.onImageInserted) {
            options.onImageInserted(url);
          }
        } catch (err) {
          console.error('Upload failed', err);
        }
      }
    };
    input.click();
  };

  return {
    content,
    isSourceMode,
    toggleSourceMode,
    uploadImageHandler,
  };
}

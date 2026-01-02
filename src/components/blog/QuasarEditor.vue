<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  modelValue: string;
  uploader?: (file: File) => Promise<string>;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const content = ref(props.modelValue || '');

watch(
  () => props.modelValue,
  (val) => {
    if (val !== content.value) {
      content.value = val || '';
    }
  },
);

watch(content, (val) => {
  emit('update:modelValue', val);
});

// Custom definitions for the toolbar
const definitions = {
  upload: {
    tip: 'Upload Image',
    icon: 'image',
    label: 'Image',
    handler: uploadImageHandler,
  },
};

function uploadImageHandler() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file && props.uploader) {
      try {
        const url = await props.uploader(file);
        // Insert image at cursor
        document.execCommand('insertHTML', false, `<img src="${url}" style="max-width: 100%;" />`);
      } catch (err) {
        console.error('Upload failed', err);
      }
    }
  };
  input.click();
}
</script>

<template>
  <div class="quasar-editor-wrapper">
    <q-editor
      v-model="content"
      :definitions="definitions"
      :toolbar="[
        ['bold', 'italic', 'underline', 'strike'],
        ['quote', 'unordered', 'ordered', 'outdent', 'indent'],
        ['h1', 'h2', 'h3'],
        ['upload'],
        ['undo', 'redo'],
      ]"
      min-height="300px"
      class="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700"
      content-class="prose dark:prose-invert max-w-none"
    />
  </div>
</template>

<style scoped>
/* Scoped styles if needed, mainly relying on prose classes */
</style>

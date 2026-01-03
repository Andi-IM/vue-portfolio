<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  modelValue: string;
  uploader?: (file: File) => Promise<string>;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'image-inserted', url: string): void;
}>();

const content = ref(props.modelValue || '');
const isSourceMode = ref(false);

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
  viewsource: {
    tip: 'Toggle HTML Source',
    icon: 'code',
    handler: () => {
      isSourceMode.value = !isSourceMode.value;
    },
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
        // Emit event for parent to react (e.g., set headline image)
        emit('image-inserted', url);
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
    <div v-show="!isSourceMode" class="visual-editor">
      <q-editor
        v-model="content"
        :definitions="definitions"
        :toolbar="[
          ['bold', 'italic', 'underline', 'strike'],
          ['quote', 'unordered', 'ordered', 'outdent', 'indent'],
          ['h1', 'h2', 'h3'],
          ['upload', 'viewsource'],
          ['undo', 'redo'],
        ]"
        min-height="300px"
        class="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700"
        content-class="prose dark:prose-invert max-w-none"
      />
    </div>
    <div
      v-show="isSourceMode"
      class="source-editor border border-zinc-300 dark:border-zinc-700 rounded-lg overflow-hidden"
    >
      <div
        class="bg-zinc-100 dark:bg-zinc-800 p-2 border-b border-zinc-300 dark:border-zinc-700 flex items-center justify-between"
      >
        <span class="text-xs font-mono uppercase text-zinc-500">HTML Source</span>
        <button
          type="button"
          @click="isSourceMode = false"
          class="flex items-center gap-1 px-3 py-1 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 rounded transition-colors"
        >
          <q-icon name="visibility" size="xs" />
          <span class="text-xs">Visual Editor</span>
        </button>
      </div>
      <q-input
        v-model="content"
        type="textarea"
        borderless
        square
        input-class="font-mono text-sm p-4 min-h-[300px]"
        class="bg-white dark:bg-zinc-900"
      />
    </div>
  </div>
</template>

<style scoped>
.source-editor {
  min-height: 350px;
}
</style>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useQuasarEditor } from '../../composables/useQuasarEditor';
import ImageEditor from './ImageEditor.vue';

const props = defineProps<{
  modelValue: string;
  uploader?: (file: File) => Promise<string>;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'image-inserted', url: string): void;
}>();

const {
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
} = useQuasarEditor({
  modelValue: props.modelValue,
  uploader: props.uploader,
  onUpdateModelValue: (val) => emit('update:modelValue', val),
  onImageInserted: (url) => emit('image-inserted', url),
});

// Make images clickable on mount (for existing content)
onMounted(() => {
  setTimeout(() => {
    makeImagesClickable();
  }, 500);
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
    label: 'Source', // Added label for easier testing and clarity
    handler: toggleSourceMode,
  },
};
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

    <!-- Image Editor Modal -->
    <ImageEditor
      v-if="showImageEditor && selectedImage && getCurrentImageConfig()"
      :src="getCurrentImageConfig()!.src"
      :current-width="getCurrentImageConfig()!.width"
      :current-height="getCurrentImageConfig()!.height"
      :current-rotation="getCurrentImageConfig()!.rotation"
      :current-align="getCurrentImageConfig()!.align"
      :current-border="getCurrentImageConfig()!.border"
      :current-shadow="getCurrentImageConfig()!.shadow"
      :current-caption="getCurrentImageConfig()!.caption"
      @apply="applyImageConfig"
      @cancel="closeImageEditor"
    />
  </div>
</template>

<style scoped>
.source-editor {
  min-height: 350px;
}
</style>

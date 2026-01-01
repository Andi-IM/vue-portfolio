<script setup lang="ts">
import { computed } from 'vue'
import { createEditor } from 'slate'
import type { Descendant } from 'slate'
import { Slate, Editable } from 'slate-vue3'
import { withHistory } from 'slate-history'
import { renderElement, renderLeaf } from '../../utils/slate-helpers'
import { useRichTextActions } from '../../composables/useRichTextActions'

// Define props
const props = defineProps<{
  modelValue: Descendant[]
  uploader?: (file: File) => Promise<string>
}>()

// Define emits
const emit = defineEmits<{
  (e: 'update:modelValue', value: Descendant[]): void
}>()

// Create editor instance
const editor = withHistory(createEditor())

// Local state for the editor content
const value = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

// Use business logic with dependency injection
const { toggleMark, isMarkActive, toggleBlock, isBlockActive, handleImageUpload } =
  useRichTextActions({
    editor,
    uploader: props.uploader,
  })
</script>

<template>
  <div
    class="border rounded-lg overflow-hidden bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700"
  >
    <!-- Toolbar -->
    <div
      class="flex flex-wrap gap-2 p-2 border-b border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
    >
      <button
        @click.prevent="toggleMark('bold')"
        :class="{ 'bg-zinc-200 dark:bg-zinc-700': isMarkActive('bold') }"
        class="px-2 py-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 font-bold"
      >
        B
      </button>
      <button
        @click.prevent="toggleMark('italic')"
        :class="{ 'bg-zinc-200 dark:bg-zinc-700': isMarkActive('italic') }"
        class="px-2 py-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 italic"
      >
        I
      </button>
      <button
        @click.prevent="toggleMark('underline')"
        :class="{ 'bg-zinc-200 dark:bg-zinc-700': isMarkActive('underline') }"
        class="px-2 py-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 underline"
      >
        U
      </button>
      <div class="w-px bg-zinc-300 dark:bg-zinc-600 mx-1"></div>
      <button
        @click.prevent="toggleBlock('heading-one')"
        :class="{ 'bg-zinc-200 dark:bg-zinc-700': isBlockActive('heading-one') }"
        class="px-2 py-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 font-bold"
      >
        H1
      </button>
      <button
        @click.prevent="toggleBlock('heading-two')"
        :class="{ 'bg-zinc-200 dark:bg-zinc-700': isBlockActive('heading-two') }"
        class="px-2 py-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 font-bold"
      >
        H2
      </button>
      <div class="w-px bg-zinc-300 dark:bg-zinc-600 mx-1"></div>
      <label class="px-2 py-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer">
        📷
        <input type="file" class="hidden" accept="image/*" @change="handleImageUpload" />
      </label>
    </div>

    <!-- Editor Area -->
    <div class="p-4 min-h-[300px]">
      <!-- eslint-disable-next-line @typescript-eslint/no-explicit-any -->
      <Slate :editor="editor as any" v-model="value">
        <Editable
          :renderElement="renderElement"
          :renderLeaf="renderLeaf"
          placeholder="Start writing..."
          class="prose dark:prose-invert max-w-none focus:outline-none"
        />
      </Slate>
    </div>
  </div>
</template>

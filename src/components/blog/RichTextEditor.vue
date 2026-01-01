<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { computed, h } from 'vue'
import { createEditor, Transforms, Element as SlateElement, Editor } from 'slate'
import type { Descendant } from 'slate'
import { Slate, Editable } from 'slate-vue3'
import { withHistory } from 'slate-history'

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

// Toolbar handling
const isMarkActive = (editor: Editor, format: string) => {
  const marks = Editor.marks(editor)
  return marks ? (marks as any)[format] === true : false
}

const toggleMark = (editor: Editor, format: string) => {
  const isActive = isMarkActive(editor, format)
  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

const isBlockActive = (editor: Editor, format: string) => {
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && (n as any).type === format,
    }),
  )

  return !!match
}

const toggleBlock = (editor: Editor, format: string) => {
  const isActive = isBlockActive(editor, format)
  const newProperties: any = {
    type: isActive ? 'paragraph' : format,
  }
  Transforms.setNodes(editor, newProperties)
}

// Image handling (Placeholder for now)
const insertImage = (url: string) => {
  const text = { text: '' }
  const image = { type: 'image', url, children: [text] } as any
  Transforms.insertNodes(editor, image)
}

import { renderElement, renderLeaf } from '../../utils/slate-helpers'

// Handle Image Upload
const handleImageUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  if (props.uploader) {
    try {
      const url = await props.uploader(file)
      insertImage(url)
    } catch (e) {
      console.error('Upload error', e)
    }
  } else {
    // Fallback: Create blob URL
    const url = URL.createObjectURL(file)
    insertImage(url)
    // TODO: Ideally warn that this is just a local preview
  }
}
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
        @click.prevent="toggleMark(editor, 'bold')"
        :class="{ 'bg-zinc-200 dark:bg-zinc-700': isMarkActive(editor, 'bold') }"
        class="px-2 py-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 font-bold"
      >
        B
      </button>
      <button
        @click.prevent="toggleMark(editor, 'italic')"
        :class="{ 'bg-zinc-200 dark:bg-zinc-700': isMarkActive(editor, 'italic') }"
        class="px-2 py-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 italic"
      >
        I
      </button>
      <button
        @click.prevent="toggleMark(editor, 'underline')"
        :class="{ 'bg-zinc-200 dark:bg-zinc-700': isMarkActive(editor, 'underline') }"
        class="px-2 py-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 underline"
      >
        U
      </button>
      <div class="w-px bg-zinc-300 dark:bg-zinc-600 mx-1"></div>
      <button
        @click.prevent="toggleBlock(editor, 'heading-one')"
        :class="{ 'bg-zinc-200 dark:bg-zinc-700': isBlockActive(editor, 'heading-one') }"
        class="px-2 py-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 font-bold"
      >
        H1
      </button>
      <button
        @click.prevent="toggleBlock(editor, 'heading-two')"
        :class="{ 'bg-zinc-200 dark:bg-zinc-700': isBlockActive(editor, 'heading-two') }"
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

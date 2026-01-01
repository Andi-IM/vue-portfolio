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

// Render Element
const renderElement = ({ attributes, children, element }: { attributes: any, children: any, element: any }) => {
  switch (element.type) {
    case 'heading-one':
      return h('h1', { ...attributes, class: 'text-3xl font-bold mb-4' }, children)
    case 'heading-two':
      return h('h2', { ...attributes, class: 'text-2xl font-semibold mb-3' }, children)
    case 'list-item':
      return h('li', { ...attributes, class: 'ml-4' }, children)
    case 'numbered-list':
      return h('ol', { ...attributes, class: 'list-decimal pl-5 mb-4' }, children)
    case 'bulleted-list':
      return h('ul', { ...attributes, class: 'list-disc pl-5 mb-4' }, children)
    case 'image':
      return h('div', { ...attributes, class: 'my-4' }, [
        h('div', { contenteditable: false }, [
          h('img', { src: element.url, class: 'max-w-full h-auto rounded-lg shadow-md' }),
        ]),
        children,
      ])
    default:
      return h('p', { ...attributes, class: 'mb-4 leading-relaxed' }, children)
  }
}

// Render Leaf
const renderLeaf = ({ attributes, children, leaf }: { attributes: any, children: any, leaf: any }) => {
  if (leaf.bold) {
    children = h('strong', {}, children)
  }
  if (leaf.italic) {
    children = h('em', {}, children)
  }
  if (leaf.underline) {
    children = h('u', {}, children)
  }
  return h('span', { ...attributes }, children)
}

// Handle Image Upload
const handleImageUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  // TODO: Implement actual upload to Cloudflare R2
  // For now, use a local object URL to demonstrate functionality
  // const url = URL.createObjectURL(file);
  // insertImage(url);

  // Real implementation plan:
  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await fetch('/api/upload', {
      method: 'PUT',
      body: formData,
    })
    if (response.ok) {
      const data = await response.json()
      insertImage(data.url)
    } else {
      console.error('Upload failed')
    }
  } catch (e) {
    console.error('Upload error', e)
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

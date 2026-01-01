<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { h } from 'vue';
import { createEditor } from 'slate';
import type { Descendant } from 'slate';
import { Slate, Editable } from 'slate-vue3';

// Define props
defineProps<{
  content: Descendant[];
}>();

// Read-only editor
const editor = createEditor();

// Render Element (Reused logic, can be extracted eventually)
const renderElement = ({ attributes, children, element }: { attributes: any, children: any, element: any }) => {
  switch (element.type) {
    case 'heading-one':
      return h('h1', { ...attributes, class: 'text-3xl font-bold mb-4 mt-8' }, children);
    case 'heading-two':
      return h('h2', { ...attributes, class: 'text-2xl font-semibold mb-3 mt-6' }, children);
    case 'list-item':
      return h('li', { ...attributes, class: 'ml-4' }, children);
    case 'numbered-list':
      return h('ol', { ...attributes, class: 'list-decimal pl-5 mb-4' }, children);
    case 'bulleted-list':
        return h('ul', { ...attributes, class: 'list-disc pl-5 mb-4' }, children);
    case 'image':
      return h('div', { ...attributes, class: 'my-6' }, [
        h('div', { contenteditable: false }, [
             h('img', { src: element.url, class: 'max-w-full h-auto rounded-lg shadow-md' })
        ]),
        children
      ]);
    default:
      return h('p', { ...attributes, class: 'mb-4 leading-relaxed' }, children);
  }
};

// Render Leaf
const renderLeaf = ({ attributes, children, leaf }: { attributes: any, children: any, leaf: any }) => {
  if (leaf.bold) {
    children = h('strong', {}, children);
  }
  if (leaf.italic) {
    children = h('em', {}, children);
  }
  if (leaf.underline) {
    children = h('u', {}, children);
  }
  return h('span', { ...attributes }, children);
};
</script>

<template>
  <div class="prose dark:prose-invert max-w-none">
    <Slate :editor="editor as any" :modelValue="content">
      <Editable
        :renderElement="renderElement"
        :renderLeaf="renderLeaf"
        :readOnly="true"
      />
    </Slate>
  </div>
</template>

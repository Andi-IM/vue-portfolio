<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createEditor } from 'slate'
import type { Descendant } from 'slate'
import { Slate, Editable } from 'slate-vue3'
import { renderElement as baseRenderElement, renderLeaf } from '../../utils/slate-helpers'

// Define props
defineProps<{
  content: Descendant[]
}>()

// Read-only editor
const editor = createEditor()

// Render Element Wrapper
const renderElement = (props: any) => baseRenderElement(props, true)
</script>

<template>
  <div class="prose dark:prose-invert max-w-none">
    <Slate :editor="editor as any" :modelValue="content">
      <Editable :renderElement="renderElement" :renderLeaf="renderLeaf" :readOnly="true" />
    </Slate>
  </div>
</template>

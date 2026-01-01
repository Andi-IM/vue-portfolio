/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import RichTextRenderer from '../blog/RichTextRenderer.vue'

// Mock slate-vue3 to avoid JSDOM issues with real Slate components
vi.mock('slate-vue3', () => ({
  Slate: {
    name: 'Slate',
    props: ['editor', 'modelValue'],
    template: '<div class="mock-slate"><slot /></div>',
  },
  Editable: {
    name: 'Editable',
    props: ['renderElement', 'renderLeaf', 'readOnly'],
    template: '<div class="mock-editable"></div>',
  },
}))

describe('RichTextRenderer', () => {
  const content = [
    {
      type: 'paragraph',
      children: [{ text: 'Hello world' }],
    },
  ]

  it('mounts correctly and provides content to Slate', () => {
    const wrapper = mount(RichTextRenderer, {
      props: { content: content as any },
    })
    expect(wrapper.exists()).toBe(true)
    const slate = wrapper.findComponent({ name: 'Slate' })
    expect(slate.exists()).toBe(true)
    expect(slate.props('modelValue')).toEqual(content)
  })

  it('passes renderers and readOnly prop to Editable', () => {
    const wrapper = mount(RichTextRenderer, {
      props: { content: content as any },
    })
    const editable = wrapper.findComponent({ name: 'Editable' })
    expect(editable.exists()).toBe(true)
    expect(editable.props('readOnly')).toBe(true)
    expect(typeof editable.props('renderElement')).toBe('function')
    expect(typeof editable.props('renderLeaf')).toBe('function')
  })
})

import type { Descendant } from 'slate'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import RichTextEditor from '../RichTextEditor.vue'
import { useRichTextActions } from '../../../composables/useRichTextActions'

// Mock variables must be hoisted to be used in vi.mock
const { mockEditor } = vi.hoisted(() => ({
  mockEditor: {
    children: [] as Descendant[],
    selection: null,
    operations: [],
    marks: null,
  },
}))

// Mock slate-vue3/core
vi.mock('slate-vue3/core', () => ({
  createEditor: vi.fn(() => mockEditor),
}))

// Mock slate-vue3/dom
vi.mock('slate-vue3/dom', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  withDOM: (e: any) => e,
}))

// Mock slate-vue3/history
vi.mock('slate-vue3/history', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  withHistory: (e: any) => e,
}))

// Mock the composable
vi.mock('../../../composables/useRichTextActions', () => ({
  useRichTextActions: vi.fn(),
}))

// Mock slate-vue3 components
vi.mock('slate-vue3', () => ({
  Slate: {
    name: 'Slate',
    template: '<div><slot /></div>',
    props: ['editor', 'modelValue'],
  },
  Editable: {
    name: 'Editable',
    template: '<div contenteditable="true"></div>',
    props: ['renderElement', 'renderLeaf', 'placeholder'],
  },
}))

describe('RichTextEditor', () => {
  const mockActions = {
    toggleMark: vi.fn(),
    isMarkActive: vi.fn(() => false),
    toggleBlock: vi.fn(),
    isBlockActive: vi.fn(() => false),
    handleImageUpload: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useRichTextActions).mockReturnValue(mockActions)
    // Reset mock editor children
    mockEditor.children = []
  })

  it('emits update:modelValue when value is set', async () => {
    const initialValue = [
      {
        type: 'paragraph',
        children: [{ text: 'Initial text' }],
      },
    ]

    const wrapper = mount(RichTextEditor, {
      props: {
        modelValue: initialValue,
      },
    })

    const newValue = [
      {
        type: 'paragraph',
        children: [{ text: 'Updated text' }],
      },
    ]

    // Simulate the state change in the editor
    mockEditor.children = newValue

    // Simulate the Slate component emitting the change event
    // The component listens to @change
    await wrapper.findComponent({ name: 'Slate' }).vm.$emit('change')

    // Verify that the parent component receives the update event
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([newValue])
  })

  it('renders toolbar buttons', () => {
    const wrapper = mount(RichTextEditor, {
      props: {
        modelValue: [{ type: 'paragraph', children: [{ text: '' }] }],
      },
    })

    const buttons = wrapper.findAll('button')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('passes uploader prop to useRichTextActions', () => {
    const mockUploader = vi.fn()

    mount(RichTextEditor, {
      props: {
        modelValue: [{ type: 'paragraph', children: [{ text: '' }] }],
        uploader: mockUploader,
      },
    })

    expect(useRichTextActions).toHaveBeenCalledWith(
      expect.objectContaining({
        uploader: mockUploader,
      }),
    )
  })
})

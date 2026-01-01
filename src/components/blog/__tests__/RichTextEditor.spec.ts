import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import RichTextEditor from '../RichTextEditor.vue'
import { useRichTextActions } from '../../../composables/useRichTextActions'

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

    // Simulate the Slate component emitting an update
    // This triggers the computed setter on line 27
    await wrapper.findComponent({ name: 'Slate' }).vm.$emit('update:modelValue', newValue)

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

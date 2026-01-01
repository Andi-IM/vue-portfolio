/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import RichTextEditor from '../blog/RichTextEditor.vue'
import { Editor, Transforms } from 'slate'
import { h, nextTick } from 'vue'

// Mock slate-vue3
vi.mock('slate-vue3', () => ({
  Slate: {
    name: 'Slate',
    props: ['editor', 'modelValue'],
    emits: ['update:modelValue'],
    setup(props: any, { slots }: any) {
      return () => h('div', { class: 'mock-slate' }, slots.default?.())
    },
  },
  Editable: {
    name: 'Editable',
    props: ['renderElement', 'renderLeaf', 'placeholder'],
    template: '<div class="mock-editable"></div>',
  },
}))

// Mock Slate methods
vi.mock('slate', async () => {
  const actual: any = await vi.importActual('slate')
  return {
    ...actual,
    Editor: {
      ...actual.Editor,
      addMark: vi.fn(),
      removeMark: vi.fn(),
      marks: vi.fn(() => ({})),
      nodes: vi.fn(() => []),
      unhangRange: vi.fn(),
    },
    Transforms: {
      ...actual.Transforms,
      setNodes: vi.fn(),
      insertNodes: vi.fn(),
      select: vi.fn(),
    },
  }
})

// Mock URL.createObjectURL
if (typeof global.URL.createObjectURL === 'undefined') {
  Object.defineProperty(global.URL, 'createObjectURL', {
    value: vi.fn(() => 'blob:url'),
  })
} else {
  vi.spyOn(global.URL, 'createObjectURL').mockReturnValue('blob:url')
}

describe('RichTextEditor', () => {
  const initialValue = [
    {
      type: 'paragraph',
      children: [{ text: 'Initial text' }],
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    // Default mocks behavior
    vi.mocked(Editor.marks).mockReturnValue({})
    vi.mocked(Editor.nodes).mockReturnValue([] as any)
  })

  it('renders correctly with initial content', () => {
    const wrapper = mount(RichTextEditor, {
      props: {
        modelValue: initialValue as any,
      },
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.mock-slate').exists()).toBe(true)
  })

  it('toggles marks when toolbar buttons are clicked', async () => {
    const wrapper = mount(RichTextEditor, {
      props: {
        modelValue: initialValue as any,
      },
    })

    const boldButton = wrapper.findAll('button').find((b) => b.text().trim() === 'B')
    await boldButton?.trigger('click')

    expect(Editor.addMark).toHaveBeenCalledWith(expect.anything(), 'bold', true)
  })

  it('toggles blocks when toolbar buttons are clicked', async () => {
    const wrapper = mount(RichTextEditor, {
      props: {
        modelValue: initialValue as any,
      },
    })

    const h1Button = wrapper.findAll('button').find((b) => b.text().trim() === 'H1')
    await h1Button?.trigger('click')

    expect(Transforms.setNodes).toHaveBeenCalledWith(expect.anything(), { type: 'heading-one' })
  })

  it('handles image upload without uploader prop', async () => {
    const wrapper = mount(RichTextEditor, {
      props: {
        modelValue: initialValue as any,
      },
    })

    const input = wrapper.find('input[type="file"]')
    const file = new File([''], 'test.png', { type: 'image/png' })

    Object.defineProperty(input.element, 'files', {
      value: [file],
    })
    await input.trigger('change')
    await nextTick()

    expect(URL.createObjectURL).toHaveBeenCalledWith(file)
    expect(Transforms.insertNodes).toHaveBeenCalled()
  })

  it('handles image upload with uploader prop', async () => {
    const uploader = vi.fn().mockResolvedValue('https://uploaded.com/image.png')
    const wrapper = mount(RichTextEditor, {
      props: {
        modelValue: initialValue as any,
        uploader,
      },
    })

    const input = wrapper.find('input[type="file"]')
    const file = new File([''], 'test.png', { type: 'image/png' })

    Object.defineProperty(input.element, 'files', {
      value: [file],
    })
    await input.trigger('change')

    expect(uploader).toHaveBeenCalledWith(file)
    await vi.waitFor(() => {
      expect(Transforms.insertNodes).toHaveBeenCalled()
    })
  })
})

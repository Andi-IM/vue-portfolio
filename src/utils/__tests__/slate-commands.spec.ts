/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Editor, Transforms } from 'slate'
import * as commands from '../slate-commands'

vi.mock('slate', async () => {
  const actual: any = await vi.importActual('slate')
  return {
    ...actual,
    Editor: {
      ...actual.Editor,
      addMark: vi.fn(),
      removeMark: vi.fn(),
      marks: vi.fn(),
      nodes: vi.fn(),
      unhangRange: vi.fn(),
    },
    Transforms: {
      ...actual.Transforms,
      setNodes: vi.fn(),
      insertNodes: vi.fn(),
    },
  }
})

describe('slate-commands', () => {
  // editor must have selection for nodes/unhangRange
  const mockEditor = {
    selection: {
      anchor: { path: [0, 0], offset: 0 },
      focus: { path: [0, 0], offset: 0 },
    }
  } as any

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(Editor.unhangRange).mockReturnValue(mockEditor.selection)
  })

  describe('isMarkActive', () => {
    it('returns true if mark is present', () => {
      vi.mocked(Editor.marks).mockReturnValue({ bold: true } as any)
      expect(commands.isMarkActive(mockEditor, 'bold')).toBe(true)
    })

    it('returns false if mark is absent', () => {
      vi.mocked(Editor.marks).mockReturnValue({ italic: true } as any)
      expect(commands.isMarkActive(mockEditor, 'bold')).toBe(false)
    })
  })

  describe('toggleMark', () => {
    it('adds mark if not active', () => {
      vi.mocked(Editor.marks).mockReturnValue({})
      commands.toggleMark(mockEditor, 'bold')
      expect(Editor.addMark).toHaveBeenCalledWith(mockEditor, 'bold', true)
    })

    it('removes mark if active', () => {
      vi.mocked(Editor.marks).mockReturnValue({ bold: true } as any)
      commands.toggleMark(mockEditor, 'bold')
      expect(Editor.removeMark).toHaveBeenCalledWith(mockEditor, 'bold')
    })
  })

  describe('toggleBlock', () => {
    it('sets block to heading-one if not active', () => {
      vi.mocked(Editor.nodes).mockReturnValue([] as any)
      commands.toggleBlock(mockEditor, 'heading-one')
      expect(Transforms.setNodes).toHaveBeenCalledWith(mockEditor, { type: 'heading-one' })
    })

    it('resets block to paragraph if active', () => {
      vi.mocked(Editor.nodes).mockReturnValue([{}] as any)
      commands.toggleBlock(mockEditor, 'heading-one')
      expect(Transforms.setNodes).toHaveBeenCalledWith(mockEditor, { type: 'paragraph' })
    })
  })

  describe('insertImage', () => {
    it('inserts image node', () => {
      commands.insertImage(mockEditor, 'test.png')
      expect(Transforms.insertNodes).toHaveBeenCalledWith(mockEditor, expect.objectContaining({
        type: 'image',
        url: 'test.png'
      }))
    })
  })
})

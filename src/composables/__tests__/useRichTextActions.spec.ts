/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useRichTextActions } from '../useRichTextActions'
import * as commands from '../../utils/slate-commands'

vi.mock('../../utils/slate-commands', () => ({
  toggleMark: vi.fn(),
  isMarkActive: vi.fn(),
  toggleBlock: vi.fn(),
  isBlockActive: vi.fn(),
  insertImage: vi.fn(),
}))

describe('useRichTextActions', () => {
  const mockEditor = {} as any

  beforeEach(() => {
    vi.clearAllMocks()
    // Mock URL.createObjectURL if it doesn't exist in JSDOM
    if (typeof global.URL.createObjectURL === 'undefined') {
      Object.defineProperty(global.URL, 'createObjectURL', {
        value: vi.fn(() => 'blob:url'),
        configurable: true,
      })
    } else {
      vi.spyOn(global.URL, 'createObjectURL').mockReturnValue('blob:url')
    }
  })

  it('toggles mark', () => {
    const { toggleMark } = useRichTextActions({ editor: mockEditor })
    toggleMark('bold')
    expect(commands.toggleMark).toHaveBeenCalledWith(mockEditor, 'bold')
  })

  it('handles image upload via injected uploader', async () => {
    const uploader = vi.fn().mockResolvedValue('https://test.com/img.png')
    const { handleImageUpload } = useRichTextActions({ editor: mockEditor, uploader })

    const event = {
      target: {
        files: [new File([''], 'test.png')],
      },
    } as any

    await handleImageUpload(event)

    expect(uploader).toHaveBeenCalled()
    expect(commands.insertImage).toHaveBeenCalledWith(mockEditor, 'https://test.com/img.png')
  })

  it('handles image upload via blob URL fallback if no uploader', async () => {
    const { handleImageUpload } = useRichTextActions({ editor: mockEditor })

    const event = {
      target: {
        files: [new File([''], 'test.png')],
      },
    } as any

    await handleImageUpload(event)

    expect(commands.insertImage).toHaveBeenCalledWith(mockEditor, 'blob:url')
  })
})

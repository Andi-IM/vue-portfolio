/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useRichTextActions } from '../useRichTextActions';
import * as commands from '../../utils/slate-commands';

vi.mock('../../utils/slate-commands', () => ({
  toggleMark: vi.fn(),
  isMarkActive: vi.fn(),
  toggleBlock: vi.fn(),
  isBlockActive: vi.fn(),
  insertImage: vi.fn(),
}));

describe('useRichTextActions', () => {
  const mockEditor = {} as any;

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock URL.createObjectURL if it doesn't exist in JSDOM
    if (typeof global.URL.createObjectURL === 'undefined') {
      Object.defineProperty(global.URL, 'createObjectURL', {
        value: vi.fn(() => 'blob:url'),
        configurable: true,
      });
    } else {
      vi.spyOn(global.URL, 'createObjectURL').mockReturnValue('blob:url');
    }
  });

  it('toggles mark', () => {
    const { toggleMark } = useRichTextActions({ editor: mockEditor });
    toggleMark('bold');
    expect(commands.toggleMark).toHaveBeenCalledWith(mockEditor, 'bold');
  });

  it('checks if mark is active', () => {
    (commands.isMarkActive as any).mockReturnValue(true);
    const { isMarkActive } = useRichTextActions({ editor: mockEditor });
    const isActive = isMarkActive('bold');
    expect(commands.isMarkActive).toHaveBeenCalledWith(mockEditor, 'bold');
    expect(isActive).toBe(true);
  });

  it('toggles block', () => {
    const { toggleBlock } = useRichTextActions({ editor: mockEditor });
    toggleBlock('heading-one');
    expect(commands.toggleBlock).toHaveBeenCalledWith(mockEditor, 'heading-one');
  });

  it('checks if block is active', () => {
    (commands.isBlockActive as any).mockReturnValue(true);
    const { isBlockActive } = useRichTextActions({ editor: mockEditor });
    const isActive = isBlockActive('heading-one');
    expect(commands.isBlockActive).toHaveBeenCalledWith(mockEditor, 'heading-one');
    expect(isActive).toBe(true);
  });

  it('returns early if no file selected in handleImageUpload', async () => {
    const { handleImageUpload } = useRichTextActions({ editor: mockEditor });
    const event = {
      target: {
        files: [],
      },
    } as any;

    await handleImageUpload(event);
    expect(commands.insertImage).not.toHaveBeenCalled();
  });

  it('handles image upload via injected uploader', async () => {
    const uploader = vi.fn().mockResolvedValue('https://test.com/img.png');
    const { handleImageUpload } = useRichTextActions({ editor: mockEditor, uploader });

    const event = {
      target: {
        files: [new File([''], 'test.png')],
      },
    } as any;

    await handleImageUpload(event);

    expect(uploader).toHaveBeenCalled();
    expect(commands.insertImage).toHaveBeenCalledWith(mockEditor, 'https://test.com/img.png');
  });

  it('handles image upload via blob URL fallback if no uploader', async () => {
    const { handleImageUpload } = useRichTextActions({ editor: mockEditor });

    const event = {
      target: {
        files: [new File([''], 'test.png')],
      },
    } as any;

    await handleImageUpload(event);

    expect(commands.insertImage).toHaveBeenCalledWith(mockEditor, 'blob:url');
  });

  it('logs error when uploader rejects', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const uploadError = new Error('Upload failed');
    const uploader = vi.fn().mockRejectedValue(uploadError);
    const { handleImageUpload } = useRichTextActions({ editor: mockEditor, uploader });

    const event = {
      target: {
        files: [new File([''], 'test.png')],
      },
    } as any;

    await handleImageUpload(event);

    expect(consoleErrorSpy).toHaveBeenCalledWith('Upload error', uploadError);
    expect(commands.insertImage).not.toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});

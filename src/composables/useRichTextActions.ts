import type { Editor } from 'slate';
import * as commands from '../utils/slate-commands';

export interface RichTextActionsDependencies {
  editor: Editor;
  uploader?: (file: File) => Promise<string>;
}

export function useRichTextActions({ editor, uploader }: RichTextActionsDependencies) {
  const toggleMark = (format: string) => {
    commands.toggleMark(editor, format);
  };

  const isMarkActive = (format: string) => {
    return commands.isMarkActive(editor, format);
  };

  const toggleBlock = (format: string) => {
    commands.toggleBlock(editor, format);
  };

  const isBlockActive = (format: string) => {
    return commands.isBlockActive(editor, format);
  };

  const handleImageUpload = async (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    if (uploader) {
      try {
        const url = await uploader(file);
        commands.insertImage(editor, url);
      } catch (e) {
        console.error('Upload error', e);
      }
    } else {
      // Fallback: Create blob URL
      const url = URL.createObjectURL(file);
      commands.insertImage(editor, url);
    }
  };

  return {
    toggleMark,
    isMarkActive,
    toggleBlock,
    isBlockActive,
    handleImageUpload,
  };
}

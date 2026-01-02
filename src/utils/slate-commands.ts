/* eslint-disable @typescript-eslint/no-explicit-any */
import { Editor, Transforms, Element as SlateElement } from 'slate';

export const isMarkActive = (editor: Editor, format: string) => {
  const marks = Editor.marks(editor);
  return marks ? (marks as any)[format] === true : false;
};

export const toggleMark = (editor: Editor, format: string) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

export const isBlockActive = (editor: Editor, format: string) => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && (n as any).type === format,
    }),
  );

  return !!match;
};

export const toggleBlock = (editor: Editor, format: string) => {
  const isActive = isBlockActive(editor, format);
  const newProperties: any = {
    type: isActive ? 'paragraph' : format,
  };
  Transforms.setNodes(editor, newProperties);
};

export const insertImage = (editor: Editor, url: string) => {
  const text = { text: '' };
  const image = { type: 'image', url, children: [text] } as any;
  Transforms.insertNodes(editor, image);
};

/* eslint-disable @typescript-eslint/no-explicit-any */
import { h } from 'vue'

export const renderElement = (
  {
    attributes,
    children,
    element,
  }: {
    attributes: any
    children: any
    element: any
  },
  isReadOnly = false,
) => {
  switch (element.type) {
    case 'heading-one':
      return h(
        'h1',
        {
          ...attributes,
          class: `text-3xl font-bold mb-4 ${isReadOnly ? 'mt-8' : ''}`.trim(),
        },
        children,
      )
    case 'heading-two':
      return h(
        'h2',
        {
          ...attributes,
          class: `text-2xl font-semibold mb-3 ${isReadOnly ? 'mt-6' : ''}`.trim(),
        },
        children,
      )
    case 'list-item':
      return h('li', { ...attributes, class: 'ml-4' }, children)
    case 'numbered-list':
      return h('ol', { ...attributes, class: 'list-decimal pl-5 mb-4' }, children)
    case 'bulleted-list':
      return h('ul', { ...attributes, class: 'list-disc pl-5 mb-4' }, children)
    case 'image':
      return h('div', { ...attributes, class: isReadOnly ? 'my-6' : 'my-4' }, [
        h('div', { contenteditable: false }, [
          h('img', {
            src: element.url,
            class: 'max-w-full h-auto rounded-lg shadow-md',
          }),
        ]),
        children,
      ])
    default:
      return h('p', { ...attributes, class: 'mb-4 leading-relaxed' }, children)
  }
}

export const renderLeaf = ({
  attributes,
  children,
  leaf,
}: {
  attributes: any
  children: any
  leaf: any
}) => {
  if (leaf.bold) {
    children = h('strong', {}, children)
  }
  if (leaf.italic) {
    children = h('em', {}, children)
  }
  if (leaf.underline) {
    children = h('u', {}, children)
  }
  return h('span', { ...attributes }, children)
}

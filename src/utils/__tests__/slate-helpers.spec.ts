import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { renderElement, renderLeaf } from '../slate-helpers';

describe('slate-helpers', () => {
  describe('renderElement', () => {
    it('renders heading-one correctly', () => {
      const vnode = renderElement({
        attributes: { 'data-test': 'h1' },
        children: 'Heading',
        element: { type: 'heading-one' },
      });
      const wrapper = mount({ render: () => vnode });
      expect(wrapper.find('h1').exists()).toBe(true);
      expect(wrapper.find('h1').attributes('class')).toContain('text-3xl');
      expect(wrapper.find('h1').attributes('data-test')).toBe('h1');
    });

    it('adds mt-8 to heading-one in read-only mode', () => {
      const vnode = renderElement(
        {
          attributes: {},
          children: 'Heading',
          element: { type: 'heading-one' },
        },
        true,
      );
      const wrapper = mount({ render: () => vnode });
      expect(wrapper.find('h1').attributes('class')).toContain('mt-8');
    });

    it('renders heading-two correctly', () => {
      const vnode = renderElement({
        attributes: {},
        children: 'Heading 2',
        element: { type: 'heading-two' },
      });
      const wrapper = mount({ render: () => vnode });
      expect(wrapper.find('h2').exists()).toBe(true);
      expect(wrapper.find('h2').attributes('class')).toContain('text-2xl');
    });

    it('renders list-item correctly', () => {
      const vnode = renderElement({
        attributes: {},
        children: 'Item',
        element: { type: 'list-item' },
      });
      const wrapper = mount({ render: () => vnode });
      expect(wrapper.find('li').exists()).toBe(true);
    });

    it('renders numbered-list correctly', () => {
      const vnode = renderElement({
        attributes: {},
        children: 'List items',
        element: { type: 'numbered-list' },
      });
      const wrapper = mount({ render: () => vnode });
      expect(wrapper.find('ol').exists()).toBe(true);
      expect(wrapper.find('ol').attributes('class')).toContain('list-decimal');
    });

    it('renders bulleted-list correctly', () => {
      const vnode = renderElement({
        attributes: {},
        children: 'List items',
        element: { type: 'bulleted-list' },
      });
      const wrapper = mount({ render: () => vnode });
      expect(wrapper.find('ul').exists()).toBe(true);
      expect(wrapper.find('ul').attributes('class')).toContain('list-disc');
    });

    it('renders image correctly', () => {
      const vnode = renderElement({
        attributes: {},
        children: 'caption',
        element: { type: 'image', url: 'test.png' },
      });
      const wrapper = mount({ render: () => vnode });
      expect(wrapper.find('img').exists()).toBe(true);
      expect(wrapper.find('img').attributes('src')).toBe('test.png');
    });

    it('renders image with my-6 class in read-only mode', () => {
      const vnode = renderElement(
        {
          attributes: {},
          children: 'caption',
          element: { type: 'image', url: 'test.png' },
        },
        true,
      );
      const wrapper = mount({ render: () => vnode });
      expect(wrapper.find('div').attributes('class')).toContain('my-6');
      expect(wrapper.find('img').exists()).toBe(true);
    });

    it('renders paragraph as default', () => {
      const vnode = renderElement({
        attributes: {},
        children: 'text',
        element: { type: 'paragraph' },
      });
      const wrapper = mount({ render: () => vnode });
      expect(wrapper.find('p').exists()).toBe(true);
    });
  });

  describe('renderLeaf', () => {
    it('renders plain text correctly', () => {
      const vnode = renderLeaf({
        attributes: { 'data-leaf': 'true' },
        children: 'hello',
        leaf: {},
      });
      const wrapper = mount({ render: () => vnode });
      expect(wrapper.find('span').exists()).toBe(true);
      expect(wrapper.text()).toBe('hello');
      expect(wrapper.attributes('data-leaf')).toBe('true');
    });

    it('renders bold text', () => {
      const vnode = renderLeaf({
        attributes: {},
        children: 'bold',
        leaf: { bold: true },
      });
      const wrapper = mount({ render: () => vnode });
      expect(wrapper.find('strong').exists()).toBe(true);
      expect(wrapper.find('strong').text()).toBe('bold');
    });

    it('renders combined marks', () => {
      const vnode = renderLeaf({
        attributes: {},
        children: 'multi',
        leaf: { bold: true, italic: true },
      });
      const wrapper = mount({ render: () => vnode });
      expect(wrapper.find('strong').exists()).toBe(true);
      expect(wrapper.find('em').exists()).toBe(true);
      expect(wrapper.text()).toBe('multi');
    });
  });
});

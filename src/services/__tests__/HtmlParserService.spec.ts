import { describe, it, expect } from 'vitest';
import { HtmlParserService, type ParsedHtmlDocument } from '../HtmlParserService';

describe('HtmlParserService', () => {
  describe('parseToJson', () => {
    it('should parse empty string to empty document', () => {
      const result = HtmlParserService.parseToJson('');
      expect(result.version).toBe('1.0');
      expect(result.nodes).toEqual([]);
    });

    it('should parse whitespace-only string to empty document', () => {
      const result = HtmlParserService.parseToJson('   ');
      expect(result.nodes).toEqual([]);
    });

    it('should parse simple text', () => {
      const result = HtmlParserService.parseToJson('Hello World');
      expect(result.nodes).toHaveLength(1);
      expect(result.nodes[0]).toEqual({
        type: 'text',
        content: 'Hello World',
      });
    });

    it('should parse simple paragraph', () => {
      const result = HtmlParserService.parseToJson('<p>Hello</p>');
      expect(result.nodes).toHaveLength(1);
      expect(result.nodes[0]).toEqual({
        type: 'element',
        tag: 'p',
        children: [{ type: 'text', content: 'Hello' }],
      });
    });

    it('should parse nested elements', () => {
      const result = HtmlParserService.parseToJson('<p>Hello <strong>world</strong></p>');
      expect(result.nodes).toHaveLength(1);
      expect(result.nodes[0]).toEqual({
        type: 'element',
        tag: 'p',
        children: [
          { type: 'text', content: 'Hello ' },
          {
            type: 'element',
            tag: 'strong',
            children: [{ type: 'text', content: 'world' }],
          },
        ],
      });
    });

    it('should parse element attributes', () => {
      const result = HtmlParserService.parseToJson(
        '<a href="https://example.com" target="_blank">Link</a>',
      );
      expect(result.nodes[0]).toEqual({
        type: 'element',
        tag: 'a',
        attributes: {
          href: 'https://example.com',
          target: '_blank',
        },
        children: [{ type: 'text', content: 'Link' }],
      });
    });

    it('should parse void elements (img, br, hr)', () => {
      const result = HtmlParserService.parseToJson('<img src="test.jpg" alt="Test"><br><hr>');
      expect(result.nodes).toHaveLength(3);
      expect(result.nodes[0]).toEqual({
        type: 'element',
        tag: 'img',
        attributes: { src: 'test.jpg', alt: 'Test' },
      });
      expect(result.nodes[1]).toEqual({ type: 'element', tag: 'br' });
      expect(result.nodes[2]).toEqual({ type: 'element', tag: 'hr' });
    });

    it('should parse complex nested structure', () => {
      const html = `
        <div class="container">
          <h1>Title</h1>
          <p>Paragraph with <em>emphasis</em> and <strong>bold</strong>.</p>
        </div>
      `;
      const result = HtmlParserService.parseToJson(html);
      expect(result.nodes[0].type).toBe('element');
      expect(result.nodes[0].tag).toBe('div');
      expect(result.nodes[0].attributes).toEqual({ class: 'container' });
    });

    it('should preserve HTML comments', () => {
      // Note: Comments at the very start may be handled differently by browsers.
      // Test with comment inside content structure.
      const result = HtmlParserService.parseToJson(
        '<div><!-- This is a comment --><p>Text</p></div>',
      );
      expect(result.nodes[0].type).toBe('element');
      expect(result.nodes[0].tag).toBe('div');
      // Find the comment child
      const commentNode = result.nodes[0].children?.find((n) => n.type === 'comment');
      expect(commentNode).toEqual({
        type: 'comment',
        content: ' This is a comment ',
      });
    });
  });

  describe('parseToHtml', () => {
    it('should convert empty document to empty string', () => {
      const doc: ParsedHtmlDocument = { version: '1.0', nodes: [] };
      expect(HtmlParserService.parseToHtml(doc)).toBe('');
    });

    it('should convert text node to text', () => {
      const doc: ParsedHtmlDocument = {
        version: '1.0',
        nodes: [{ type: 'text', content: 'Hello World' }],
      };
      expect(HtmlParserService.parseToHtml(doc)).toBe('Hello World');
    });

    it('should convert simple element', () => {
      const doc: ParsedHtmlDocument = {
        version: '1.0',
        nodes: [
          {
            type: 'element',
            tag: 'p',
            children: [{ type: 'text', content: 'Hello' }],
          },
        ],
      };
      expect(HtmlParserService.parseToHtml(doc)).toBe('<p>Hello</p>');
    });

    it('should convert element with attributes', () => {
      const doc: ParsedHtmlDocument = {
        version: '1.0',
        nodes: [
          {
            type: 'element',
            tag: 'a',
            attributes: { href: 'https://example.com', target: '_blank' },
            children: [{ type: 'text', content: 'Link' }],
          },
        ],
      };
      const html = HtmlParserService.parseToHtml(doc);
      expect(html).toContain('<a');
      expect(html).toContain('href="https://example.com"');
      expect(html).toContain('target="_blank"');
      expect(html).toContain('>Link</a>');
    });

    it('should handle void elements correctly', () => {
      const doc: ParsedHtmlDocument = {
        version: '1.0',
        nodes: [
          { type: 'element', tag: 'img', attributes: { src: 'test.jpg' } },
          { type: 'element', tag: 'br' },
        ],
      };
      const html = HtmlParserService.parseToHtml(doc);
      expect(html).toBe('<img src="test.jpg"><br>');
    });

    it('should convert nested elements', () => {
      const doc: ParsedHtmlDocument = {
        version: '1.0',
        nodes: [
          {
            type: 'element',
            tag: 'p',
            children: [
              { type: 'text', content: 'Hello ' },
              {
                type: 'element',
                tag: 'strong',
                children: [{ type: 'text', content: 'world' }],
              },
            ],
          },
        ],
      };
      expect(HtmlParserService.parseToHtml(doc)).toBe('<p>Hello <strong>world</strong></p>');
    });

    it('should convert comments', () => {
      const doc: ParsedHtmlDocument = {
        version: '1.0',
        nodes: [{ type: 'comment', content: ' Test comment ' }],
      };
      expect(HtmlParserService.parseToHtml(doc)).toBe('<!-- Test comment -->');
    });

    it('should escape HTML special characters in text', () => {
      const doc: ParsedHtmlDocument = {
        version: '1.0',
        nodes: [{ type: 'text', content: '<script>alert("xss")</script>' }],
      };
      expect(HtmlParserService.parseToHtml(doc)).toBe('&lt;script&gt;alert("xss")&lt;/script&gt;');
    });

    it('should escape special characters in attributes', () => {
      const doc: ParsedHtmlDocument = {
        version: '1.0',
        nodes: [
          {
            type: 'element',
            tag: 'div',
            attributes: { 'data-value': 'test "quoted" value' },
          },
        ],
      };
      expect(HtmlParserService.parseToHtml(doc)).toBe(
        '<div data-value="test &quot;quoted&quot; value"></div>',
      );
    });
  });

  describe('roundtrip conversion', () => {
    it('should preserve content through parse and serialize', () => {
      const original = '<p>Hello <strong>world</strong></p>';
      const json = HtmlParserService.parseToJson(original);
      const html = HtmlParserService.parseToHtml(json);
      expect(html).toBe(original);
    });

    it('should preserve attributes through roundtrip', () => {
      const original = '<a href="https://test.com">Link</a>';
      const json = HtmlParserService.parseToJson(original);
      const html = HtmlParserService.parseToHtml(json);
      expect(html).toBe(original);
    });

    it('should preserve complex content through roundtrip', () => {
      const original =
        '<div><h1>Title</h1><p>Text with <em>emphasis</em></p><img src="test.jpg"></div>';
      const json = HtmlParserService.parseToJson(original);
      const html = HtmlParserService.parseToHtml(json);
      expect(html).toBe(original);
    });
  });

  describe('isValidDocument', () => {
    it('should return true for valid document', () => {
      const doc: ParsedHtmlDocument = {
        version: '1.0',
        nodes: [{ type: 'text', content: 'Hello' }],
      };
      expect(HtmlParserService.isValidDocument(doc)).toBe(true);
    });

    it('should return false for null', () => {
      expect(HtmlParserService.isValidDocument(null)).toBe(false);
    });

    it('should return false for missing version', () => {
      expect(HtmlParserService.isValidDocument({ nodes: [] })).toBe(false);
    });

    it('should return false for missing nodes', () => {
      expect(HtmlParserService.isValidDocument({ version: '1.0' })).toBe(false);
    });

    it('should return false for invalid node type', () => {
      expect(
        HtmlParserService.isValidDocument({
          version: '1.0',
          nodes: [{ type: 'invalid' }],
        }),
      ).toBe(false);
    });

    it('should return true for complex valid document', () => {
      const doc: ParsedHtmlDocument = {
        version: '1.0',
        nodes: [
          {
            type: 'element',
            tag: 'div',
            attributes: { class: 'test' },
            children: [
              { type: 'text', content: 'Hello' },
              { type: 'element', tag: 'br' },
            ],
          },
        ],
      };
      expect(HtmlParserService.isValidDocument(doc)).toBe(true);
    });
  });

  describe('extractTextContent', () => {
    it('should extract text from simple paragraph', () => {
      const doc = HtmlParserService.parseToJson('<p>Hello World</p>');
      expect(HtmlParserService.extractTextContent(doc)).toBe('Hello World');
    });

    it('should extract text from nested elements', () => {
      const doc = HtmlParserService.parseToJson('<p>Hello <strong>bold</strong> text</p>');
      expect(HtmlParserService.extractTextContent(doc)).toBe('Hello bold text');
    });

    it('should add newlines for block elements', () => {
      const doc = HtmlParserService.parseToJson('<h1>Title</h1><p>Paragraph</p>');
      expect(HtmlParserService.extractTextContent(doc)).toBe('Title\nParagraph');
    });

    it('should ignore comments', () => {
      const doc = HtmlParserService.parseToJson('<div><!-- comment --><p>Text</p></div>');
      expect(HtmlParserService.extractTextContent(doc)).toBe('Text');
    });

    it('should return empty string for empty document', () => {
      const doc: ParsedHtmlDocument = { version: '1.0', nodes: [] };
      expect(HtmlParserService.extractTextContent(doc)).toBe('');
    });
  });
});

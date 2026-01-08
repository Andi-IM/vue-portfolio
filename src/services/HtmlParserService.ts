/**
 * HTML Parser Service
 *
 * Converts HTML content to a structured JSON representation and vice versa.
 * Uses the browser's DOMParser API (no external libraries required).
 */

/** Represents a single node in the parsed JSON structure */
export interface HtmlNode {
  /** Node type: 'element' | 'text' | 'comment' */
  type: 'element' | 'text' | 'comment';
  /** Tag name for element nodes (e.g., 'div', 'p', 'img') */
  tag?: string;
  /** Attributes for element nodes */
  attributes?: Record<string, string>;
  /** Text content for text/comment nodes */
  content?: string;
  /** Child nodes for element nodes */
  children?: HtmlNode[];
}

/** Root structure for parsed HTML document */
export interface ParsedHtmlDocument {
  /** Version for future compatibility */
  version: string;
  /** Array of root-level nodes */
  nodes: HtmlNode[];
}

/**
 * HtmlParserService provides methods to convert HTML to JSON and back.
 * This is useful for:
 * - Storing content in a structured format
 * - Easier content manipulation and transformation
 * - Cross-platform compatibility
 */
export class HtmlParserService {
  private static readonly VERSION = '1.0';

  /**
   * Parse HTML string into a structured JSON format.
   *
   * @param html - The HTML string to parse
   * @returns ParsedHtmlDocument containing the structured representation
   *
   * @example
   * const json = HtmlParserService.parseToJson('<p>Hello <strong>world</strong></p>');
   * // Returns:
   * // {
   * //   version: '1.0',
   * //   nodes: [{
   * //     type: 'element',
   * //     tag: 'p',
   * //     children: [
   * //       { type: 'text', content: 'Hello ' },
   * //       { type: 'element', tag: 'strong', children: [{ type: 'text', content: 'world' }] }
   * //     ]
   * //   }]
   * // }
   */
  static parseToJson(html: string): ParsedHtmlDocument {
    if (!html || html.trim() === '') {
      return { version: this.VERSION, nodes: [] };
    }

    // Use DOMParser to parse HTML string
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Parse the body content (where the actual content resides)
    const nodes = this.parseChildNodes(doc.body.childNodes);

    return {
      version: this.VERSION,
      nodes,
    };
  }

  /**
   * Convert a ParsedHtmlDocument back to HTML string.
   *
   * @param document - The parsed document to serialize
   * @returns HTML string representation
   *
   * @example
   * const html = HtmlParserService.parseToHtml({
   *   version: '1.0',
   *   nodes: [{ type: 'element', tag: 'p', children: [{ type: 'text', content: 'Hello' }] }]
   * });
   * // Returns: '<p>Hello</p>'
   */
  static parseToHtml(document: ParsedHtmlDocument): string {
    if (!document.nodes || document.nodes.length === 0) {
      return '';
    }

    return document.nodes.map((node) => this.nodeToHtml(node)).join('');
  }

  /**
   * Parse a NodeList into an array of HtmlNode objects.
   */
  private static parseChildNodes(nodeList: NodeListOf<ChildNode>): HtmlNode[] {
    const nodes: HtmlNode[] = [];

    nodeList.forEach((node) => {
      const parsed = this.parseNode(node);
      if (parsed) {
        nodes.push(parsed);
      }
    });

    return nodes;
  }

  /**
   * Parse a single DOM node into an HtmlNode object.
   */
  private static parseNode(node: Node): HtmlNode | null {
    switch (node.nodeType) {
      case Node.ELEMENT_NODE: {
        return this.parseElement(node as Element);
      }

      case Node.TEXT_NODE: {
        const text = node.textContent || '';
        // Skip empty text nodes that are just whitespace between elements
        if (text.trim() === '' && !text.includes('\n')) {
          // Preserve single spaces but skip pure whitespace
          if (text === ' ') {
            return { type: 'text', content: ' ' };
          }
          return null;
        }
        return { type: 'text', content: text };
      }

      case Node.COMMENT_NODE: {
        return {
          type: 'comment',
          content: node.textContent || '',
        };
      }

      default:
        return null;
    }
  }

  /**
   * Parse an Element node into an HtmlNode object.
   */
  private static parseElement(element: Element): HtmlNode {
    const result: HtmlNode = {
      type: 'element',
      tag: element.tagName.toLowerCase(),
    };

    // Parse attributes
    if (element.attributes.length > 0) {
      result.attributes = {};
      for (let i = 0; i < element.attributes.length; i++) {
        const attr = element.attributes.item(i);
        if (attr) {
          result.attributes[attr.name] = attr.value;
        }
      }
    }

    // Parse children (for non-void elements)
    if (element.childNodes.length > 0) {
      result.children = this.parseChildNodes(element.childNodes);
      // Remove empty children array
      if (result.children.length === 0) {
        delete result.children;
      }
    }

    return result;
  }

  /**
   * Convert a single HtmlNode back to HTML string.
   */
  private static nodeToHtml(node: HtmlNode): string {
    switch (node.type) {
      case 'text':
        return this.escapeHtml(node.content || '');

      case 'comment':
        return `<!--${node.content || ''}-->`;

      case 'element':
        return this.elementToHtml(node);

      default:
        return '';
    }
  }

  /**
   * Convert an element HtmlNode to HTML string.
   */
  private static elementToHtml(node: HtmlNode): string {
    const tag = node.tag || 'div';

    // Build attributes string
    let attrsStr = '';
    if (node.attributes) {
      for (const [key, value] of Object.entries(node.attributes)) {
        attrsStr += ` ${key}="${this.escapeAttribute(value)}"`;
      }
    }

    // Self-closing (void) elements
    const voidElements = new Set([
      'area',
      'base',
      'br',
      'col',
      'embed',
      'hr',
      'img',
      'input',
      'link',
      'meta',
      'param',
      'source',
      'track',
      'wbr',
    ]);

    if (voidElements.has(tag)) {
      return `<${tag}${attrsStr}>`;
    }

    // Elements with children
    const childrenHtml = node.children
      ? node.children.map((child) => this.nodeToHtml(child)).join('')
      : '';

    return `<${tag}${attrsStr}>${childrenHtml}</${tag}>`;
  }

  /**
   * Escape special HTML characters in text content.
   */
  private static escapeHtml(text: string): string {
    const htmlEscapes: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
    };

    return text.replace(/[&<>]/g, (char) => htmlEscapes[char] || char);
  }

  /**
   * Escape special characters in attribute values.
   */
  private static escapeAttribute(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  /**
   * Utility method to validate that a JSON structure is a valid ParsedHtmlDocument.
   *
   * @param json - The object to validate
   * @returns true if the structure is valid
   */
  static isValidDocument(json: unknown): json is ParsedHtmlDocument {
    if (!json || typeof json !== 'object') {
      return false;
    }

    const doc = json as Record<string, unknown>;

    if (typeof doc.version !== 'string') {
      return false;
    }

    if (!Array.isArray(doc.nodes)) {
      return false;
    }

    // Recursively validate nodes
    return doc.nodes.every((node) => this.isValidNode(node));
  }

  /**
   * Validate a single HtmlNode structure.
   */
  private static isValidNode(node: unknown): node is HtmlNode {
    if (!node || typeof node !== 'object') {
      return false;
    }

    const n = node as Record<string, unknown>;

    if (!['element', 'text', 'comment'].includes(n.type as string)) {
      return false;
    }

    if (n.type === 'element') {
      if (typeof n.tag !== 'string') {
        return false;
      }
      if (n.attributes && typeof n.attributes !== 'object') {
        return false;
      }
      if (n.children) {
        if (!Array.isArray(n.children)) {
          return false;
        }
        return n.children.every((child) => this.isValidNode(child));
      }
    }

    if ((n.type === 'text' || n.type === 'comment') && n.content !== undefined) {
      if (typeof n.content !== 'string') {
        return false;
      }
    }

    return true;
  }

  /**
   * Extract text content only from a ParsedHtmlDocument.
   * Useful for generating excerpts or plain text previews.
   *
   * @param document - The parsed document
   * @returns Plain text content
   */
  static extractTextContent(document: ParsedHtmlDocument): string {
    if (!document.nodes || document.nodes.length === 0) {
      return '';
    }

    return document.nodes
      .map((node) => this.nodeToText(node))
      .join('')
      .trim();
  }

  /**
   * Extract text from a single node recursively.
   */
  private static nodeToText(node: HtmlNode): string {
    if (node.type === 'text') {
      return node.content || '';
    }

    if (node.type === 'comment') {
      return '';
    }

    if (node.type === 'element' && node.children) {
      // Add spacing for block-level elements
      const blockElements = new Set([
        'p',
        'div',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'li',
        'tr',
        'br',
        'hr',
      ]);
      const text = node.children.map((child) => this.nodeToText(child)).join('');

      if (node.tag && blockElements.has(node.tag)) {
        return text + '\n';
      }
      return text;
    }

    return '';
  }
}

export default HtmlParserService;

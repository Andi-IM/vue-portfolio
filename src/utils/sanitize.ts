import DOMPurify from 'dompurify';

/**
 * Configuration for DOMPurify sanitization
 * Allows safe HTML formatting while preventing XSS attacks
 */
const SANITIZE_CONFIG = {
  // Allow common formatting tags
  ALLOWED_TAGS: [
    // Text formatting
    'p',
    'br',
    'hr',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'strong',
    'b',
    'em',
    'i',
    'u',
    's',
    'strike',
    'del',
    'ins',
    'sub',
    'sup',
    'mark',
    'small',
    // Lists
    'ul',
    'ol',
    'li',
    // Links and media
    'a',
    'img',
    // Code blocks
    'pre',
    'code',
    'kbd',
    'samp',
    'var',
    // Quotes and sections
    'blockquote',
    'q',
    'cite',
    'div',
    'span',
    // Tables
    'table',
    'thead',
    'tbody',
    'tfoot',
    'tr',
    'th',
    'td',
    'caption',
    'colgroup',
    'col',
    // Other semantic elements
    'figure',
    'figcaption',
    'address',
    'article',
    'aside',
    'details',
    'summary',
  ],
  // Allow safe attributes
  ALLOWED_ATTR: [
    'href',
    'src',
    'alt',
    'title',
    'class',
    'id',
    'name',
    'width',
    'height',
    'style',
    'target',
    'rel',
    'colspan',
    'rowspan',
    'scope',
  ],
  // Prevent JavaScript URLs
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur'],
  // Remove script tags and their content
  FORBID_TAGS: [
    'script',
    'style',
    'iframe',
    'object',
    'embed',
    'form',
    'input',
    'button',
    'textarea',
  ],
  // Keep safe inline styles (for formatting)
  ALLOW_DATA_ATTR: true,
};

/**
 * Sanitize HTML content to prevent XSS attacks
 * Allows common formatting elements but removes dangerous scripts
 *
 * @param html - The raw HTML string to sanitize
 * @returns Sanitized HTML safe for v-html binding
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';
  return DOMPurify.sanitize(html, SANITIZE_CONFIG);
}

/**
 * Sanitize HTML for code display (more restrictive)
 * Only allows basic text formatting, useful for previewing code
 *
 * @param html - The raw HTML string to sanitize
 * @returns Sanitized HTML with only basic formatting
 */
export function sanitizeCodeHtml(html: string): string {
  if (!html) return '';
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['pre', 'code', 'span', 'br'],
    ALLOWED_ATTR: ['class'],
  });
}

/**
 * Check if HTML contains potentially dangerous content
 * Useful for warning users or additional logging
 *
 * @param html - The HTML string to check
 * @returns true if potentially dangerous content was found
 */
export function containsDangerousContent(html: string): boolean {
  if (!html) return false;
  const sanitized = sanitizeHtml(html);
  // If sanitized version is different, something was removed
  return sanitized !== html;
}

export default {
  sanitizeHtml,
  sanitizeCodeHtml,
  containsDangerousContent,
};

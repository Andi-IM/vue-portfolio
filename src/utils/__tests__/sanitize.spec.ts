import { describe, it, expect } from 'vitest';
import { sanitizeHtml, sanitizeCodeHtml, containsDangerousContent } from '../sanitize';

describe('sanitizeHtml', () => {
  it('allows safe HTML formatting tags', () => {
    const html = '<p>Hello <strong>World</strong></p>';
    expect(sanitizeHtml(html)).toBe('<p>Hello <strong>World</strong></p>');
  });

  it('allows headings', () => {
    const html = '<h1>Title</h1><h2>Subtitle</h2>';
    expect(sanitizeHtml(html)).toBe('<h1>Title</h1><h2>Subtitle</h2>');
  });

  it('allows lists', () => {
    const html = '<ul><li>Item 1</li><li>Item 2</li></ul>';
    expect(sanitizeHtml(html)).toBe('<ul><li>Item 1</li><li>Item 2</li></ul>');
  });

  it('allows code blocks', () => {
    const html = '<pre><code>const x = 1;</code></pre>';
    expect(sanitizeHtml(html)).toBe('<pre><code>const x = 1;</code></pre>');
  });

  it('allows images with src and alt', () => {
    const html = '<img src="https://example.com/img.jpg" alt="Example">';
    expect(sanitizeHtml(html)).toContain('src="https://example.com/img.jpg"');
    expect(sanitizeHtml(html)).toContain('alt="Example"');
  });

  it('allows links with safe href', () => {
    const html = '<a href="https://example.com">Link</a>';
    expect(sanitizeHtml(html)).toBe('<a href="https://example.com">Link</a>');
  });

  it('removes script tags', () => {
    const html = '<p>Hello</p><script>alert("XSS")</script>';
    expect(sanitizeHtml(html)).toBe('<p>Hello</p>');
  });

  it('removes onclick handlers', () => {
    const html = '<button onclick="alert(\'XSS\')">Click</button>';
    // Button is in FORBID_TAGS, so it should be removed entirely
    expect(sanitizeHtml(html)).not.toContain('onclick');
  });

  it('removes onerror handlers from images', () => {
    const html = '<img src="x" onerror="alert(\'XSS\')">';
    expect(sanitizeHtml(html)).not.toContain('onerror');
  });

  it('removes javascript: URLs from links', () => {
    const html = '<a href="javascript:alert(\'XSS\')">Click</a>';
    expect(sanitizeHtml(html)).not.toContain('javascript:');
  });

  it('removes iframe tags', () => {
    const html = '<iframe src="https://evil.com"></iframe>';
    expect(sanitizeHtml(html)).toBe('');
  });

  it('removes form elements', () => {
    const html = '<form action="/submit"><input type="text"></form>';
    expect(sanitizeHtml(html)).toBe('');
  });

  it('removes style tags', () => {
    const html = '<style>body { display: none; }</style><p>Content</p>';
    expect(sanitizeHtml(html)).toBe('<p>Content</p>');
  });

  it('allows blockquotes', () => {
    const html = '<blockquote>A famous quote</blockquote>';
    expect(sanitizeHtml(html)).toBe('<blockquote>A famous quote</blockquote>');
  });

  it('allows tables', () => {
    const html = '<table><tr><td>Cell</td></tr></table>';
    expect(sanitizeHtml(html)).toContain('<table>');
    expect(sanitizeHtml(html)).toContain('<td>Cell</td>');
  });

  it('returns empty string for null/undefined', () => {
    expect(sanitizeHtml('')).toBe('');
    expect(sanitizeHtml(null as unknown as string)).toBe('');
  });
});

describe('sanitizeCodeHtml', () => {
  it('allows only code-related tags', () => {
    const html = '<pre><code>const x = 1;</code></pre>';
    expect(sanitizeCodeHtml(html)).toBe('<pre><code>const x = 1;</code></pre>');
  });

  it('removes other formatting tags', () => {
    const html = '<p><strong>Bold</strong></p><pre><code>code</code></pre>';
    expect(sanitizeCodeHtml(html)).toBe('Bold<pre><code>code</code></pre>');
  });
});

describe('containsDangerousContent', () => {
  it('returns false for safe content', () => {
    const html = '<p>Safe content</p>';
    expect(containsDangerousContent(html)).toBe(false);
  });

  it('returns true for script tags', () => {
    const html = '<p>Content</p><script>alert("XSS")</script>';
    expect(containsDangerousContent(html)).toBe(true);
  });

  it('returns true for onclick handlers', () => {
    const html = '<div onclick="alert(\'XSS\')">Click</div>';
    expect(containsDangerousContent(html)).toBe(true);
  });

  it('returns true for javascript: URLs', () => {
    const html = '<a href="javascript:alert(\'XSS\')">Link</a>';
    expect(containsDangerousContent(html)).toBe(true);
  });

  it('returns false for empty string', () => {
    expect(containsDangerousContent('')).toBe(false);
  });
});

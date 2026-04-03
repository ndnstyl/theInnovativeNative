import DOMPurify from 'dompurify';

const ALLOWED_TAGS = [
  'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'em', 'del',
  'ul', 'ol', 'li', 'a', 'img', 'pre', 'code', 'blockquote', 'br', 'hr',
  'span', 'mark', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
];

const ALLOWED_ATTR = [
  'href', 'src', 'alt', 'class', 'target', 'rel', 'data-mention-id',
];

/**
 * Strip ALL HTML tags — used as a safe server-side fallback where DOMPurify
 * (which requires a DOM) is unavailable.
 */
function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

export function sanitizeHtml(html: string): string {
  // Server-side (SSG build): return HTML as-is. Content is trusted (generated
  // from our own markdown at build time). DOMPurify requires a DOM and cannot
  // run server-side. Stripping tags here destroys all formatting.
  if (typeof window === 'undefined') return html;

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR: [...ALLOWED_ATTR, 'id', 'style'],
    ALLOW_DATA_ATTR: false,
  });
}

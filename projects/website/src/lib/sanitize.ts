import DOMPurify from 'dompurify';

const ALLOWED_TAGS = [
  'p', 'h1', 'h2', 'h3', 'strong', 'em', 'del', 'ul', 'ol', 'li',
  'a', 'img', 'pre', 'code', 'blockquote', 'br', 'hr', 'span',
];

const ALLOWED_ATTR = [
  'href', 'src', 'alt', 'class', 'target', 'rel', 'data-mention-id',
];

export function sanitizeHtml(html: string): string {
  if (typeof window === 'undefined') return html;

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
  });
}

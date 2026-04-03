import DOMPurify from 'dompurify';

const ALLOWED_TAGS = [
  'p', 'h1', 'h2', 'h3', 'strong', 'em', 'del', 'ul', 'ol', 'li',
  'a', 'img', 'pre', 'code', 'blockquote', 'br', 'hr', 'span', 'mark',
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
  if (typeof window === 'undefined') return stripHtmlTags(html);

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
  });
}

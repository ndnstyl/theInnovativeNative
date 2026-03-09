import DOMPurify from 'dompurify';

const ALLOWED_TAGS = ['strong', 'em', 'a', 'br'];
const ALLOWED_ATTR = ['href', 'target', 'rel'];

export function sanitizeMessage(html: string): string {
  if (typeof window === 'undefined') return html;

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOWED_URI_REGEXP: /^https?:\/\//i,
  });
}

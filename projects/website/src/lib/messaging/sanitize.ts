import DOMPurify from 'dompurify';

const ALLOWED_TAGS = ['strong', 'em', 'a', 'br'];
const ALLOWED_ATTR = ['href', 'target', 'rel'];

/**
 * Strip ALL HTML tags — safe server-side fallback where DOMPurify is unavailable.
 */
function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

export function sanitizeMessage(html: string): string {
  if (typeof window === 'undefined') return stripHtmlTags(html);

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOWED_URI_REGEXP: /^https?:\/\//i,
  });
}

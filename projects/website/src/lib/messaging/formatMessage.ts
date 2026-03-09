const URL_REGEX = /https?:\/\/[^\s<>"')\]]+/g;

export function formatMessage(raw: string): string {
  let html = raw
    // Escape HTML
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Bold: **text**
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Italic: *text*
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // URLs
  html = html.replace(URL_REGEX, (url) =>
    `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
  );

  // Line breaks
  html = html.replace(/\n/g, '<br>');

  return html;
}

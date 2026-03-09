// Google Tag Manager integration
// GTM loads GA4, FB Pixel, and other tags centrally

declare global {
  interface Window {
    dataLayer: Record<string, any>[];
  }
}

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || '';

export function initGTM(): void {
  if (!GTM_ID || typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    'gtm.start': new Date().getTime(),
    event: 'gtm.js',
  });
}

export function getGTMScript(): string {
  if (!GTM_ID) return '';
  return `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
}

export function getGTMNoscript(): string {
  if (!GTM_ID) return '';
  return `https://www.googletagmanager.com/ns.html?id=${GTM_ID}`;
}

export function pushToDataLayer(data: Record<string, any>): void {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(data);
}

export { GTM_ID };

// Google Analytics 4 direct integration (gtag.js)
// Loads GA4 independently of GTM for immediate analytics
// even before GTM tags are fully configured.

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

const GA4_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || '';

export function initGA4(): void {
  if (!GA4_ID || typeof window === 'undefined') return;

  // Load gtag.js script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(args);
  }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', GA4_ID, {
    send_page_view: true,
    cookie_flags: 'SameSite=None;Secure',
  });
}

export function ga4Event(name: string, params?: Record<string, any>): void {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', name, params);
}

export function ga4PageView(url: string): void {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', 'page_view', { page_path: url });
}

export { GA4_ID };

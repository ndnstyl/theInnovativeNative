// Facebook Pixel (Meta Pixel) integration

declare global {
  interface Window {
    fbq: (...args: any[]) => void;
    _fbq: any;
  }
}

const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID || '';

export function initFBPixel(): void {
  if (!FB_PIXEL_ID || typeof window === 'undefined') return;
  if (typeof window.fbq === 'function' && (window.fbq as any).loaded) return;

  const n: any = (window.fbq = function () {
    n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
  });
  if (!window._fbq) window._fbq = n;
  n.push = n;
  n.loaded = true;
  n.version = '2.0';
  n.queue = [];

  const t = document.createElement('script');
  t.async = true;
  t.src = 'https://connect.facebook.net/en_US/fbevents.js';
  const s = document.getElementsByTagName('script')[0];
  s.parentNode?.insertBefore(t, s);

  window.fbq('init', FB_PIXEL_ID);
  window.fbq('track', 'PageView');
}

export function fbPageView(): void {
  if (typeof window === 'undefined' || !window.fbq) return;
  window.fbq('track', 'PageView');
}

export function fbEvent(name: string, params?: Record<string, any>): void {
  if (typeof window === 'undefined' || !window.fbq) return;
  if (params) {
    window.fbq('track', name, params);
  } else {
    window.fbq('track', name);
  }
}

export { FB_PIXEL_ID };

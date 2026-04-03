// LinkedIn Insight Tag integration
// Loads the LinkedIn tracking pixel for conversion tracking
// and retargeting audiences.

declare global {
  interface Window {
    _linkedin_data_partner_ids: string[];
    lintrk: ((...args: any[]) => void) & { q?: any[] };
  }
}

const LI_PARTNER_ID = process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID || '';

export function initLinkedIn(): void {
  if (!LI_PARTNER_ID || typeof window === 'undefined') return;

  // Set partner IDs
  window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
  window._linkedin_data_partner_ids.push(LI_PARTNER_ID);

  // Initialize lintrk
  if (typeof window.lintrk !== 'function') {
    const s: any = function (...args: any[]) {
      s.q.push(args);
    };
    s.q = [] as any[];
    window.lintrk = s;
  }

  // Load LinkedIn Insight Tag script
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://snap.licdn.com/li.lms-analytics/insight.min.js';
  document.head.appendChild(script);
}

export function liPageView(): void {
  if (typeof window === 'undefined' || !window.lintrk) return;
  // LinkedIn auto-tracks page views via the Insight tag.
  // Manual page view calls are not needed, but conversions are.
}

export function liEvent(conversionId: string): void {
  if (typeof window === 'undefined' || !window.lintrk) return;
  window.lintrk('track', { conversion_id: conversionId });
}

export { LI_PARTNER_ID };

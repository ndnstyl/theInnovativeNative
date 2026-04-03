// Unified event tracking hook
// Fires events to GA4 + FB Pixel + LinkedIn + GTM simultaneously.
// Each event includes UTM params from localStorage for attribution.

import { useCallback } from 'react';
import { pushToDataLayer } from '@/lib/analytics/gtm';
import { fbEvent } from '@/lib/analytics/facebook';
import { ga4Event } from '@/lib/analytics/ga4';
import { liEvent } from '@/lib/analytics/linkedin';
import { getUTMParams } from '@/lib/analytics/utm';
import { useConsent } from '@/hooks/useConsent';

type EventParams = Record<string, string | number | boolean | undefined>;

function fireEvent(eventName: string, params?: EventParams): void {
  if (typeof window === 'undefined') return;

  const utm = getUTMParams();
  const enrichedParams = { ...params, ...utm };

  // GTM dataLayer
  pushToDataLayer({ event: eventName, ...enrichedParams });

  // GA4 direct
  ga4Event(eventName, enrichedParams);

  // Facebook Pixel -- map to standard events
  const fbMap: Record<string, string> = {
    generate_lead: 'Lead',
    begin_checkout: 'InitiateCheckout',
    purchase: 'Purchase',
    demo_start: 'ViewContent',
    calendly_click: 'Schedule',
    download: 'Lead',
    signup_complete: 'CompleteRegistration',
    view_content: 'ViewContent',
    button_click: 'ViewContent',
  };
  const fbName = fbMap[eventName];
  if (fbName) {
    fbEvent(fbName, enrichedParams);
  }
}

export function useTrackEvent() {
  const { consent } = useConsent();
  const enabled = consent === 'accepted';

  const trackEvent = useCallback(
    (eventName: string, params?: EventParams) => {
      if (!enabled) return;
      fireEvent(eventName, params);
    },
    [enabled]
  );

  const trackLeadCapture = useCallback(
    (source: string, value?: number) => {
      if (!enabled) return;
      fireEvent('generate_lead', {
        lead_source: source,
        value: value || 0,
        currency: 'USD',
      });
    },
    [enabled]
  );

  const trackCalendlyClick = useCallback(
    (source: string) => {
      if (!enabled) return;
      fireEvent('calendly_click', {
        cta_source: source,
        method: 'calendly',
      });
    },
    [enabled]
  );

  const trackDemoStart = useCallback(
    (demoType: string) => {
      if (!enabled) return;
      fireEvent('demo_start', {
        demo_type: demoType,
        content_type: 'demo',
      });
    },
    [enabled]
  );

  const trackDownload = useCallback(
    (fileName: string, fileType: string) => {
      if (!enabled) return;
      fireEvent('download', {
        file_name: fileName,
        file_type: fileType,
      });
    },
    [enabled]
  );

  const trackButtonClick = useCallback(
    (buttonId: string, buttonText: string, section?: string) => {
      if (!enabled) return;
      fireEvent('button_click', {
        button_id: buttonId,
        button_text: buttonText,
        section: section || '',
        page_path: typeof window !== 'undefined' ? window.location.pathname : '',
      });
    },
    [enabled]
  );

  const trackBeginCheckout = useCallback(
    (productId: string, productName: string, value: number) => {
      if (!enabled) return;
      fireEvent('begin_checkout', {
        product_id: productId,
        product_name: productName,
        value,
        currency: 'USD',
      });
    },
    [enabled]
  );

  const trackPurchase = useCallback(
    (productId: string, productName: string, value: number, transactionId?: string) => {
      if (!enabled) return;
      fireEvent('purchase', {
        product_id: productId,
        product_name: productName,
        value,
        currency: 'USD',
        transaction_id: transactionId || '',
      });
    },
    [enabled]
  );

  const trackSectionView = useCallback(
    (sectionName: string) => {
      if (!enabled) return;
      fireEvent('section_view', {
        section_name: sectionName,
        page_path: typeof window !== 'undefined' ? window.location.pathname : '',
      });
    },
    [enabled]
  );

  return {
    trackEvent,
    trackLeadCapture,
    trackCalendlyClick,
    trackDemoStart,
    trackDownload,
    trackButtonClick,
    trackBeginCheckout,
    trackPurchase,
    trackSectionView,
  };
}

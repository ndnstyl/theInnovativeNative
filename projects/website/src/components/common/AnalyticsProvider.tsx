import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Script from 'next/script';
import { initGTM, getGTMScript, GTM_ID, trackPageView } from '@/lib/analytics';
import { initFBPixel, fbPageView, FB_PIXEL_ID } from '@/lib/analytics';
import { useConsent } from '@/hooks/useConsent';

const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const { consent } = useConsent();
  const enabled = consent === 'accepted';

  // Initialize tracking on consent
  useEffect(() => {
    if (!enabled) return;
    initGTM();
    initFBPixel();
  }, [enabled]);

  // Track route changes
  useEffect(() => {
    if (!enabled) return;

    const handleRouteChange = (url: string) => {
      trackPageView(url);
      fbPageView();
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events, enabled]);

  return (
    <>
      {enabled && GTM_ID && (
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          src={getGTMScript()}
        />
      )}
      {enabled && FB_PIXEL_ID && (
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
      )}
      {children}
    </>
  );
};

export default AnalyticsProvider;

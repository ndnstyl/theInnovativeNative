import React, { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import Script from 'next/script';
import { initGTM, getGTMScript, GTM_ID, trackPageView } from '@/lib/analytics';
import { initFBPixel, fbPageView, FB_PIXEL_ID } from '@/lib/analytics';
import { initGA4, ga4PageView, GA4_ID } from '@/lib/analytics/ga4';
import { initLinkedIn, LI_PARTNER_ID } from '@/lib/analytics/linkedin';
import { captureUTMParams } from '@/lib/analytics/utm';
import { useConsent } from '@/hooks/useConsent';

// Scroll depth thresholds to track
const SCROLL_THRESHOLDS = [25, 50, 75, 100];

const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const { consent } = useConsent();
  // Analytics load by default for US-based business. Cookie banner is informational only.
  // GDPR opt-in only required for EU visitors (not currently targeted).
  const enabled = consent !== 'declined';
  const firedThresholds = useRef<Set<number>>(new Set());

  // Capture UTM params on first load (before consent, since UTM data
  // is first-party and not tracking-related)
  useEffect(() => {
    captureUTMParams();
  }, []);

  // Initialize all tracking platforms on consent
  useEffect(() => {
    if (!enabled) return;
    initGTM();
    initGA4();
    initFBPixel();
    initLinkedIn();
  }, [enabled]);

  // Track route changes
  useEffect(() => {
    if (!enabled) return;

    const handleRouteChange = (url: string) => {
      trackPageView(url);
      ga4PageView(url);
      fbPageView();
      // Reset scroll thresholds on navigation
      firedThresholds.current.clear();
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events, enabled]);

  // Scroll depth tracking (throttled to 200ms via rAF)
  const scrollRAF = React.useRef<number>(0);
  const handleScroll = useCallback(() => {
    if (scrollRAF.current) return;
    scrollRAF.current = requestAnimationFrame(() => {
      scrollRAF.current = 0;
      _handleScrollInner();
    });
  }, []);
  const _handleScrollInner = useCallback(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (docHeight <= 0) return;

    const scrollPercent = Math.round((scrollTop / docHeight) * 100);

    for (const threshold of SCROLL_THRESHOLDS) {
      if (scrollPercent >= threshold && !firedThresholds.current.has(threshold)) {
        firedThresholds.current.add(threshold);

        // Fire to GTM dataLayer
        if (typeof window !== 'undefined' && window.dataLayer) {
          window.dataLayer.push({
            event: 'scroll_depth',
            scroll_depth_threshold: threshold,
            page_path: window.location.pathname,
          });
        }

        // Fire to GA4 directly
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'scroll_depth', {
            scroll_depth_threshold: threshold,
            page_path: window.location.pathname,
          });
        }
      }
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [enabled, handleScroll]);

  // Outbound link click tracking
  useEffect(() => {
    if (!enabled) return;

    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (!href) return;

      // Check if the link is outbound
      try {
        const url = new URL(href, window.location.origin);
        if (url.hostname !== window.location.hostname) {
          const eventData = {
            event: 'outbound_click',
            outbound_url: href,
            link_text: target.textContent?.trim()?.substring(0, 100) || '',
            page_path: window.location.pathname,
          };

          // Push to GTM dataLayer
          if (window.dataLayer) {
            window.dataLayer.push(eventData);
          }

          // Push to GA4 directly
          if (window.gtag) {
            window.gtag('event', 'outbound_click', {
              outbound_url: href,
              link_text: eventData.link_text,
            });
          }
        }
      } catch {
        // Invalid URL, skip
      }
    };

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [enabled]);

  return (
    <>
      {enabled && GTM_ID && (
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          src={getGTMScript()}
        />
      )}
      {enabled && GA4_ID && (
        <Script
          id="ga4-script"
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
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
      {enabled && LI_PARTNER_ID && (
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src={`https://px.ads.linkedin.com/collect/?pid=${LI_PARTNER_ID}&fmt=gif`}
            alt=""
          />
        </noscript>
      )}
      {children}
    </>
  );
};

export default AnalyticsProvider;

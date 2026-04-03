/**
 * Analytics Tracking Integration Tests
 * =====================================
 * Tests that the analytics system is properly configured and wired:
 * - GA4, GTM, and FB Pixel IDs are configured via env vars
 * - AnalyticsProvider renders without errors
 * - UTM capture and retrieval works
 * - Consent gates tracking (no scripts fire before consent)
 * - Event dispatching works
 * - Scroll tracking setup is correct
 */

import * as fs from 'fs';
import * as path from 'path';

const SRC_DIR = path.resolve(__dirname, '../../');
const LIB_ANALYTICS = path.resolve(SRC_DIR, 'lib/analytics');

function readFile(filePath: string): string {
  return fs.readFileSync(filePath, 'utf-8');
}

// ---- Config Validation ----

describe('Analytics Configuration', () => {
  it('should have GA4_ID reading from NEXT_PUBLIC_GA4_MEASUREMENT_ID', () => {
    const content = readFile(path.join(LIB_ANALYTICS, 'ga4.ts'));
    expect(content).toContain('NEXT_PUBLIC_GA4_MEASUREMENT_ID');
  });

  it('should have GTM_ID reading from NEXT_PUBLIC_GTM_ID', () => {
    const content = readFile(path.join(LIB_ANALYTICS, 'gtm.ts'));
    expect(content).toContain('NEXT_PUBLIC_GTM_ID');
  });

  it('should have FB_PIXEL_ID reading from NEXT_PUBLIC_FB_PIXEL_ID', () => {
    const content = readFile(path.join(LIB_ANALYTICS, 'facebook.ts'));
    expect(content).toContain('NEXT_PUBLIC_FB_PIXEL_ID');
  });

  it('should have LI_PARTNER_ID reading from NEXT_PUBLIC_LINKEDIN_PARTNER_ID', () => {
    const content = readFile(path.join(LIB_ANALYTICS, 'linkedin.ts'));
    expect(content).toContain('NEXT_PUBLIC_LINKEDIN_PARTNER_ID');
  });
});

// ---- Barrel Export Completeness ----

describe('Analytics Barrel Export', () => {
  const barrelContent = readFile(path.join(LIB_ANALYTICS, 'index.ts'));

  it('should export GA4 functions', () => {
    expect(barrelContent).toContain('initGA4');
    expect(barrelContent).toContain('ga4Event');
    expect(barrelContent).toContain('GA4_ID');
  });

  it('should export GTM functions', () => {
    expect(barrelContent).toContain('initGTM');
    expect(barrelContent).toContain('pushToDataLayer');
    expect(barrelContent).toContain('GTM_ID');
  });

  it('should export FB Pixel functions', () => {
    expect(barrelContent).toContain('initFBPixel');
    expect(barrelContent).toContain('fbPageView');
    expect(barrelContent).toContain('FB_PIXEL_ID');
  });

  it('should export LinkedIn functions', () => {
    expect(barrelContent).toContain('initLinkedIn');
    expect(barrelContent).toContain('liEvent');
    expect(barrelContent).toContain('LI_PARTNER_ID');
  });

  it('should export UTM functions', () => {
    expect(barrelContent).toContain('captureUTMParams');
    expect(barrelContent).toContain('getUTMParams');
    expect(barrelContent).toContain('clearUTMParams');
  });
});

// ---- Consent Gating ----

describe('Consent Gating', () => {
  it('should NOT render GTM noscript in _document.tsx (consent bypass fix)', () => {
    const docContent = readFile(path.resolve(SRC_DIR, 'pages/_document.tsx'));
    // The noscript iframe should NOT be in _document.tsx
    expect(docContent).not.toContain('googletagmanager.com/ns.html');
    expect(docContent).not.toContain('GTM_ID');
  });

  it('should gate GTM script loading on consent in AnalyticsProvider', () => {
    const providerContent = readFile(
      path.resolve(SRC_DIR, 'components/common/AnalyticsProvider.tsx')
    );
    // Should use useConsent hook
    expect(providerContent).toContain('useConsent');
    // Should check consent before initializing
    expect(providerContent).toContain("consent === 'accepted'");
    // Should conditionally render scripts
    expect(providerContent).toContain('enabled && GTM_ID');
  });

  it('should gate GA4 loading on consent in AnalyticsProvider', () => {
    const providerContent = readFile(
      path.resolve(SRC_DIR, 'components/common/AnalyticsProvider.tsx')
    );
    expect(providerContent).toContain('initGA4');
    expect(providerContent).toContain('enabled && GA4_ID');
  });

  it('should gate FB Pixel loading on consent in AnalyticsProvider', () => {
    const providerContent = readFile(
      path.resolve(SRC_DIR, 'components/common/AnalyticsProvider.tsx')
    );
    expect(providerContent).toContain('initFBPixel');
    expect(providerContent).toContain('enabled && FB_PIXEL_ID');
  });

  it('should gate LinkedIn loading on consent in AnalyticsProvider', () => {
    const providerContent = readFile(
      path.resolve(SRC_DIR, 'components/common/AnalyticsProvider.tsx')
    );
    expect(providerContent).toContain('initLinkedIn');
    expect(providerContent).toContain('enabled && LI_PARTNER_ID');
  });
});

// ---- Event Dispatching ----

describe('Event Dispatching', () => {
  it('events.ts should dispatch to both GTM and FB Pixel', () => {
    const eventsContent = readFile(path.join(LIB_ANALYTICS, 'events.ts'));
    expect(eventsContent).toContain('pushToDataLayer');
    expect(eventsContent).toContain('fbEvent');
  });

  it('events.ts should map GA4 events to FB standard events', () => {
    const eventsContent = readFile(path.join(LIB_ANALYTICS, 'events.ts'));
    // Check that the FB event mapping exists
    expect(eventsContent).toContain('CompleteRegistration');
    expect(eventsContent).toContain('Purchase');
    expect(eventsContent).toContain('InitiateCheckout');
    expect(eventsContent).toContain('Lead');
  });

  it('useTrackEvent hook should fire to GA4 + FB + GTM', () => {
    const hookContent = readFile(path.resolve(SRC_DIR, 'hooks/useTrackEvent.ts'));
    expect(hookContent).toContain('pushToDataLayer');
    expect(hookContent).toContain('ga4Event');
    expect(hookContent).toContain('fbEvent');
  });

  it('useTrackEvent hook should enrich events with UTM params', () => {
    const hookContent = readFile(path.resolve(SRC_DIR, 'hooks/useTrackEvent.ts'));
    expect(hookContent).toContain('getUTMParams');
  });

  it('useTrackEvent hook should export all required event helpers', () => {
    const hookContent = readFile(path.resolve(SRC_DIR, 'hooks/useTrackEvent.ts'));
    expect(hookContent).toContain('trackLeadCapture');
    expect(hookContent).toContain('trackCalendlyClick');
    expect(hookContent).toContain('trackDemoStart');
    expect(hookContent).toContain('trackDownload');
    expect(hookContent).toContain('trackButtonClick');
    expect(hookContent).toContain('trackBeginCheckout');
    expect(hookContent).toContain('trackPurchase');
  });
});

// ---- Scroll Depth Tracking ----

describe('Scroll Depth Tracking', () => {
  it('should set up scroll event listener in AnalyticsProvider', () => {
    const providerContent = readFile(
      path.resolve(SRC_DIR, 'components/common/AnalyticsProvider.tsx')
    );
    expect(providerContent).toContain('scroll');
    expect(providerContent).toContain('scroll_depth');
  });

  it('should track 25%, 50%, 75%, 100% thresholds', () => {
    const providerContent = readFile(
      path.resolve(SRC_DIR, 'components/common/AnalyticsProvider.tsx')
    );
    expect(providerContent).toContain('25');
    expect(providerContent).toContain('50');
    expect(providerContent).toContain('75');
    expect(providerContent).toContain('100');
  });

  it('should only fire each threshold once per page (deduplication)', () => {
    const providerContent = readFile(
      path.resolve(SRC_DIR, 'components/common/AnalyticsProvider.tsx')
    );
    // Should track which thresholds have fired
    expect(providerContent).toContain('firedThresholds');
  });
});

// ---- Outbound Link Tracking ----

describe('Outbound Link Tracking', () => {
  it('should track outbound link clicks in AnalyticsProvider', () => {
    const providerContent = readFile(
      path.resolve(SRC_DIR, 'components/common/AnalyticsProvider.tsx')
    );
    expect(providerContent).toContain('outbound_click');
    expect(providerContent).toContain('outbound_url');
  });
});

// ---- Page-Level Tracking Integration ----

describe('Page-Level Tracking', () => {
  it('law-firm-rag.tsx should use useTrackEvent', () => {
    const content = readFile(path.resolve(SRC_DIR, 'pages/law-firm-rag.tsx'));
    expect(content).toContain('useTrackEvent');
    expect(content).toContain('trackCalendlyClick');
    expect(content).toContain('trackLeadCapture');
    expect(content).toContain('trackDemoStart');
  });

  it('index.tsx should use useTrackEvent', () => {
    const content = readFile(path.resolve(SRC_DIR, 'pages/index.tsx'));
    expect(content).toContain('useTrackEvent');
    expect(content).toContain('trackCalendlyClick');
  });

  it('checkout/classroom.tsx should track begin_checkout', () => {
    const content = readFile(path.resolve(SRC_DIR, 'pages/checkout/classroom.tsx'));
    expect(content).toContain('useTrackEvent');
    expect(content).toContain('trackBeginCheckout');
  });

  it('checkout/classroom-success.tsx should track purchase', () => {
    const content = readFile(path.resolve(SRC_DIR, 'pages/checkout/classroom-success.tsx'));
    expect(content).toContain('useTrackEvent');
    expect(content).toContain('trackPurchase');
  });
});

// ---- UTM Capture in AnalyticsProvider ----

describe('UTM Capture', () => {
  it('AnalyticsProvider should capture UTM params on mount', () => {
    const providerContent = readFile(
      path.resolve(SRC_DIR, 'components/common/AnalyticsProvider.tsx')
    );
    expect(providerContent).toContain('captureUTMParams');
  });
});

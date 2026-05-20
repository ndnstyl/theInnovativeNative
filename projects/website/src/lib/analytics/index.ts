// Analytics barrel export

// GTM
export { initGTM, getGTMScript, getGTMNoscript, pushToDataLayer, GTM_ID } from './gtm';

// Facebook Pixel
export { initFBPixel, fbPageView, fbEvent, FB_PIXEL_ID } from './facebook';

// GA4 direct
export { initGA4, ga4Event, ga4PageView, GA4_ID } from './ga4';

// LinkedIn Insight Tag
export { initLinkedIn, liEvent, liPageView, LI_PARTNER_ID } from './linkedin';

// UTM capture
export { captureUTMParams, getUTMParams, clearUTMParams } from './utm';
export type { UTMParams } from './utm';

// Event dispatcher
export {
  trackPageView,
  trackSignup,
  trackLogin,
  trackViewContent,
  trackBeginCheckout,
  trackPurchase,
  trackGenerateLead,
  trackScheduleCall,
  trackCourseProgress,
  trackCommunityAction,
  trackSearch,
} from './events';

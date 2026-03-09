// Analytics barrel export
export { initGTM, getGTMScript, getGTMNoscript, pushToDataLayer, GTM_ID } from './gtm';
export { initFBPixel, fbPageView, FB_PIXEL_ID } from './facebook';
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

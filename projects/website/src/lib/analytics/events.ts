// Unified analytics event dispatcher
// Sends events to GTM dataLayer and Facebook Pixel simultaneously

import { pushToDataLayer } from './gtm';
import { fbEvent } from './facebook';

type EventParams = Record<string, string | number | boolean | undefined>;

function trackEvent(eventName: string, params?: EventParams): void {
  // Push to GTM dataLayer (will be forwarded to GA4 via GTM config)
  pushToDataLayer({ event: eventName, ...params });

  // Push to Facebook Pixel (standard events map)
  const fbMap: Record<string, string> = {
    signup_complete: 'CompleteRegistration',
    course_purchase: 'Purchase',
    begin_checkout: 'InitiateCheckout',
    add_to_cart: 'AddToCart',
    view_content: 'ViewContent',
    generate_lead: 'Lead',
    schedule_call: 'Schedule',
    search: 'Search',
  };

  const fbName = fbMap[eventName];
  if (fbName) {
    fbEvent(fbName, params);
  }
}

// ---- Specific event helpers ----

export function trackPageView(url: string): void {
  pushToDataLayer({ event: 'page_view', page_path: url });
}

export function trackSignup(method: string): void {
  trackEvent('signup_complete', { method });
}

export function trackLogin(method: string): void {
  trackEvent('login', { method });
}

export function trackViewContent(contentType: string, contentId: string, contentName?: string): void {
  trackEvent('view_content', {
    content_type: contentType,
    content_id: contentId,
    content_name: contentName,
  });
}

export function trackBeginCheckout(productId: string, productName: string, value: number): void {
  trackEvent('begin_checkout', {
    product_id: productId,
    product_name: productName,
    value,
    currency: 'USD',
  });
}

export function trackPurchase(productId: string, productName: string, value: number, transactionId?: string): void {
  trackEvent('course_purchase', {
    product_id: productId,
    product_name: productName,
    value,
    currency: 'USD',
    transaction_id: transactionId,
  });
}

export function trackGenerateLead(source: string, value?: number): void {
  trackEvent('generate_lead', {
    lead_source: source,
    value: value || 0,
    currency: 'USD',
  });
}

export function trackScheduleCall(): void {
  trackEvent('schedule_call', { method: 'calendly' });
}

export function trackCourseProgress(courseId: string, lessonId: string, progress: number): void {
  trackEvent('course_progress', {
    course_id: courseId,
    lesson_id: lessonId,
    progress_percent: progress,
  });
}

export function trackCommunityAction(action: string, contentId?: string): void {
  trackEvent('community_action', {
    action,
    content_id: contentId,
  });
}

export function trackSearch(query: string, resultsCount?: number): void {
  trackEvent('search', {
    search_term: query,
    results_count: resultsCount,
  });
}

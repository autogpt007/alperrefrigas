/**
 * Unified Tracking Utility
 * Uses dataLayer.push() for reliable event tracking with GTM
 */

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    fbq: (...args: any[]) => void;
  }
}

// Ensure dataLayer exists
export const initDataLayer = () => {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
  }
};

// Push events to dataLayer (more reliable than gtag directly)
export const pushToDataLayer = (event: string, data: Record<string, any> = {}) => {
  if (typeof window === 'undefined') return;
  
  initDataLayer();
  
  window.dataLayer.push({
    event,
    ...data
  });
  
  console.log(`[DataLayer] ${event}:`, data);
};

// Check if gtag is available
export const isGtagAvailable = (): boolean => {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
};

// Check if Facebook Pixel is available
export const isFbqAvailable = (): boolean => {
  return typeof window !== 'undefined' && typeof window.fbq === 'function';
};

// Track custom events
export const trackEvent = (eventName: string, params: Record<string, any> = {}) => {
  pushToDataLayer(eventName, params);
  
  // Also fire via gtag if available for GA4
  if (isGtagAvailable()) {
    window.gtag('event', eventName, params);
  }
};

// Ecommerce event helpers for dataLayer (GA4 format)
export const trackEcommerceEvent = (
  eventName: string, 
  ecommerceData: Record<string, any>
) => {
  // Clear previous ecommerce data
  pushToDataLayer('ecommerce_clear', { ecommerce: null });
  
  // Push new ecommerce event
  pushToDataLayer(eventName, {
    ecommerce: ecommerceData
  });
};

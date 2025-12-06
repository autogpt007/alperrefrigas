/**
 * Facebook Pixel Conversion Tracking
 * 
 * The Facebook Pixel is already initialized in index.html
 * This utility provides helper functions for conversion events
 */

import { isFbqAvailable, pushToDataLayer } from './tracking';

interface FBProductItem {
  id: string;
  quantity: number;
  item_price?: number;
}

/**
 * Track Facebook Pixel ViewContent event (product detail views)
 */
export const trackFBViewContent = (
  contentId: string,
  contentName: string,
  contentType: string = 'product',
  value?: number,
  currency: string = 'USD'
) => {
  if (!isFbqAvailable()) {
    console.log('[FB Pixel] Not available - skipping ViewContent');
    return;
  }

  try {
    const params: any = {
      content_ids: [contentId],
      content_name: contentName,
      content_type: contentType
    };

    if (value !== undefined) {
      params.value = value;
      params.currency = currency;
    }

    window.fbq('track', 'ViewContent', params);

    pushToDataLayer('fb_view_content', { content_id: contentId, content_name: contentName });

    console.log('[FB Pixel] ViewContent tracked:', contentName);
  } catch (error) {
    console.error('[FB Pixel] Error tracking ViewContent:', error);
  }
};

/**
 * Track Facebook Pixel AddToCart event
 */
export const trackFBAddToCart = (
  contentId: string,
  contentName: string,
  value: number,
  currency: string = 'USD',
  quantity: number = 1
) => {
  if (!isFbqAvailable()) {
    console.log('[FB Pixel] Not available - skipping AddToCart');
    return;
  }

  try {
    window.fbq('track', 'AddToCart', {
      content_ids: [contentId],
      content_name: contentName,
      content_type: 'product',
      value: value,
      currency: currency,
      contents: [{ id: contentId, quantity: quantity }]
    });

    pushToDataLayer('fb_add_to_cart', { content_id: contentId, value });

    console.log('[FB Pixel] AddToCart tracked:', contentName, value);
  } catch (error) {
    console.error('[FB Pixel] Error tracking AddToCart:', error);
  }
};

/**
 * Track Facebook Pixel InitiateCheckout event
 */
export const trackFBInitiateCheckout = (
  contentIds: string[],
  value: number,
  currency: string = 'USD',
  numItems: number = 1
) => {
  if (!isFbqAvailable()) {
    console.log('[FB Pixel] Not available - skipping InitiateCheckout');
    return;
  }

  try {
    window.fbq('track', 'InitiateCheckout', {
      content_ids: contentIds,
      content_type: 'product',
      value: value,
      currency: currency,
      num_items: numItems
    });

    pushToDataLayer('fb_initiate_checkout', { value, num_items: numItems });

    console.log('[FB Pixel] InitiateCheckout tracked:', value, numItems, 'items');
  } catch (error) {
    console.error('[FB Pixel] Error tracking InitiateCheckout:', error);
  }
};

/**
 * Track Facebook Pixel AddPaymentInfo event
 */
export const trackFBAddPaymentInfo = (
  value: number,
  currency: string = 'USD'
) => {
  if (!isFbqAvailable()) {
    console.log('[FB Pixel] Not available - skipping AddPaymentInfo');
    return;
  }

  try {
    window.fbq('track', 'AddPaymentInfo', {
      value: value,
      currency: currency
    });

    pushToDataLayer('fb_add_payment_info', { value });

    console.log('[FB Pixel] AddPaymentInfo tracked:', value);
  } catch (error) {
    console.error('[FB Pixel] Error tracking AddPaymentInfo:', error);
  }
};

/**
 * Track Facebook Pixel Purchase event
 */
export const trackFBPurchase = (
  value: number,
  currency: string = 'USD',
  contentIds: string[] = [],
  contents: FBProductItem[] = [],
  numItems: number = 1
) => {
  if (!isFbqAvailable()) {
    console.log('[FB Pixel] Not available - skipping Purchase');
    return;
  }

  try {
    window.fbq('track', 'Purchase', {
      value: value,
      currency: currency,
      content_ids: contentIds,
      content_type: 'product',
      contents: contents,
      num_items: numItems
    });

    pushToDataLayer('fb_purchase', { value, num_items: numItems });

    console.log('[FB Pixel] Purchase tracked:', value, numItems, 'items');
  } catch (error) {
    console.error('[FB Pixel] Error tracking Purchase:', error);
  }
};

/**
 * Track Facebook Pixel Lead event (for quote submissions)
 */
export const trackFBLead = (
  value?: number,
  currency: string = 'USD'
) => {
  if (!isFbqAvailable()) {
    console.log('[FB Pixel] Not available - skipping Lead');
    return;
  }

  try {
    const params: any = {};
    if (value !== undefined) {
      params.value = value;
      params.currency = currency;
    }

    window.fbq('track', 'Lead', params);

    pushToDataLayer('fb_lead', { value });

    console.log('[FB Pixel] Lead tracked');
  } catch (error) {
    console.error('[FB Pixel] Error tracking Lead:', error);
  }
};

/**
 * Track Facebook Pixel CompleteRegistration event
 */
export const trackFBCompleteRegistration = (
  value?: number,
  currency: string = 'USD'
) => {
  if (!isFbqAvailable()) {
    console.log('[FB Pixel] Not available - skipping CompleteRegistration');
    return;
  }

  try {
    const params: any = {};
    if (value !== undefined) {
      params.value = value;
      params.currency = currency;
    }

    window.fbq('track', 'CompleteRegistration', params);

    pushToDataLayer('fb_complete_registration', {});

    console.log('[FB Pixel] CompleteRegistration tracked');
  } catch (error) {
    console.error('[FB Pixel] Error tracking CompleteRegistration:', error);
  }
};

/**
 * Track Facebook Pixel Search event
 */
export const trackFBSearch = (searchString: string) => {
  if (!isFbqAvailable()) {
    return;
  }

  try {
    window.fbq('track', 'Search', {
      search_string: searchString
    });

    console.log('[FB Pixel] Search tracked:', searchString);
  } catch (error) {
    console.error('[FB Pixel] Error tracking Search:', error);
  }
};

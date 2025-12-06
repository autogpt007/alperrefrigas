/**
 * Google Ads Conversion Tracking
 * 
 * Configure your conversion IDs in the constants below.
 * Get these from Google Ads > Tools & Settings > Conversions
 */

import { isGtagAvailable, pushToDataLayer } from './tracking';

// CONFIGURE YOUR GOOGLE ADS CONVERSION IDS HERE
// Format: 'AW-XXXXXXXXX/CONVERSION_LABEL'
const GOOGLE_ADS_CONVERSION_IDS = {
  // Your Google Ads Conversion ID (replace with your actual ID)
  CONVERSION_ID: 'AW-XXXXXXXXX', // e.g., 'AW-123456789'
  
  // Conversion labels for different actions
  PURCHASE: '', // e.g., 'AbCdEfGhIjKlMnOp'
  ADD_TO_CART: '', // Optional
  BEGIN_CHECKOUT: '', // Optional
  LEAD: '', // For quote submissions
};

// Check if Google Ads is configured
const isGoogleAdsConfigured = (): boolean => {
  return GOOGLE_ADS_CONVERSION_IDS.CONVERSION_ID !== 'AW-XXXXXXXXX' && 
         GOOGLE_ADS_CONVERSION_IDS.CONVERSION_ID !== '';
};

/**
 * Track Google Ads Purchase Conversion
 */
export const trackGoogleAdsPurchase = (
  transactionId: string,
  value: number,
  currency: string = 'USD'
) => {
  if (!isGoogleAdsConfigured()) {
    console.log('[Google Ads] Not configured - skipping purchase conversion');
    return;
  }

  if (!isGtagAvailable()) {
    console.warn('[Google Ads] gtag not available');
    return;
  }

  try {
    // Track conversion via gtag
    window.gtag('event', 'conversion', {
      send_to: `${GOOGLE_ADS_CONVERSION_IDS.CONVERSION_ID}/${GOOGLE_ADS_CONVERSION_IDS.PURCHASE}`,
      value: value,
      currency: currency,
      transaction_id: transactionId
    });

    // Also push to dataLayer for GTM
    pushToDataLayer('google_ads_conversion', {
      conversion_type: 'purchase',
      transaction_id: transactionId,
      value: value,
      currency: currency
    });

    console.log('[Google Ads] Purchase conversion tracked:', transactionId, value);
  } catch (error) {
    console.error('[Google Ads] Error tracking purchase:', error);
  }
};

/**
 * Track Google Ads Add to Cart Conversion (optional)
 */
export const trackGoogleAdsAddToCart = (
  value: number,
  currency: string = 'USD'
) => {
  if (!isGoogleAdsConfigured() || !GOOGLE_ADS_CONVERSION_IDS.ADD_TO_CART) {
    return;
  }

  if (!isGtagAvailable()) return;

  try {
    window.gtag('event', 'conversion', {
      send_to: `${GOOGLE_ADS_CONVERSION_IDS.CONVERSION_ID}/${GOOGLE_ADS_CONVERSION_IDS.ADD_TO_CART}`,
      value: value,
      currency: currency
    });

    console.log('[Google Ads] Add to cart conversion tracked:', value);
  } catch (error) {
    console.error('[Google Ads] Error tracking add to cart:', error);
  }
};

/**
 * Track Google Ads Begin Checkout Conversion (optional)
 */
export const trackGoogleAdsBeginCheckout = (
  value: number,
  currency: string = 'USD'
) => {
  if (!isGoogleAdsConfigured() || !GOOGLE_ADS_CONVERSION_IDS.BEGIN_CHECKOUT) {
    return;
  }

  if (!isGtagAvailable()) return;

  try {
    window.gtag('event', 'conversion', {
      send_to: `${GOOGLE_ADS_CONVERSION_IDS.CONVERSION_ID}/${GOOGLE_ADS_CONVERSION_IDS.BEGIN_CHECKOUT}`,
      value: value,
      currency: currency
    });

    console.log('[Google Ads] Begin checkout conversion tracked:', value);
  } catch (error) {
    console.error('[Google Ads] Error tracking begin checkout:', error);
  }
};

/**
 * Track Google Ads Lead Conversion (for quote submissions)
 */
export const trackGoogleAdsLead = (
  value?: number,
  currency: string = 'USD'
) => {
  if (!isGoogleAdsConfigured() || !GOOGLE_ADS_CONVERSION_IDS.LEAD) {
    console.log('[Google Ads] Lead conversion not configured');
    return;
  }

  if (!isGtagAvailable()) return;

  try {
    const conversionData: any = {
      send_to: `${GOOGLE_ADS_CONVERSION_IDS.CONVERSION_ID}/${GOOGLE_ADS_CONVERSION_IDS.LEAD}`
    };

    if (value !== undefined) {
      conversionData.value = value;
      conversionData.currency = currency;
    }

    window.gtag('event', 'conversion', conversionData);

    console.log('[Google Ads] Lead conversion tracked');
  } catch (error) {
    console.error('[Google Ads] Error tracking lead:', error);
  }
};

/**
 * Initialize Google Ads gtag config
 * Call this when Google Ads ID is set
 */
export const initGoogleAdsConfig = () => {
  if (!isGoogleAdsConfigured()) return;
  if (!isGtagAvailable()) return;

  try {
    window.gtag('config', GOOGLE_ADS_CONVERSION_IDS.CONVERSION_ID);
    console.log('[Google Ads] Configured with ID:', GOOGLE_ADS_CONVERSION_IDS.CONVERSION_ID);
  } catch (error) {
    console.error('[Google Ads] Error initializing config:', error);
  }
};

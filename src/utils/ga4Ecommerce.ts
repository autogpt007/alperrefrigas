/**
 * Google Analytics 4 Enhanced Ecommerce Tracking
 * 
 * This utility provides functions to track ecommerce events in GA4 format.
 * All events follow the GA4 recommended ecommerce event structure.
 */

// Check if gtag is available
const isGtagAvailable = (): boolean => {
  return typeof window !== 'undefined' && typeof (window as any).gtag === 'function';
};

// Product item interface matching GA4 specs
export interface GA4ProductItem {
  item_id: string;          // SKU or product ID
  item_name: string;        // Product name
  affiliation?: string;     // Store/partner name
  coupon?: string;          // Coupon code
  discount?: number;        // Discount amount
  index?: number;           // Position in list
  item_brand?: string;      // Product brand
  item_category?: string;   // Product category
  item_category2?: string;  // Product category 2
  item_category3?: string;  // Product category 3
  item_list_id?: string;    // List ID
  item_list_name?: string;  // List name (e.g., "Search Results")
  item_variant?: string;    // Product variant/packaging
  location_id?: string;     // Physical location
  price?: number;           // Product price
  quantity?: number;        // Product quantity
}

/**
 * Track product impressions (when products are viewed in a list)
 */
export const trackViewItemList = (items: GA4ProductItem[], listName: string = 'Product Catalog') => {
  if (!isGtagAvailable()) {
    console.warn('gtag not available for view_item_list event');
    return;
  }

  try {
    (window as any).gtag('event', 'view_item_list', {
      item_list_id: listName.toLowerCase().replace(/\s+/g, '_'),
      item_list_name: listName,
      items: items.map((item, index) => ({
        ...item,
        index: index,
        item_list_name: listName
      }))
    });
    console.log('[GA4] view_item_list tracked:', listName, items.length, 'items');
  } catch (error) {
    console.error('Error tracking view_item_list:', error);
  }
};

/**
 * Track product clicks (when a user clicks on a product)
 */
export const trackSelectItem = (item: GA4ProductItem, listName: string = 'Product Catalog') => {
  if (!isGtagAvailable()) {
    console.warn('gtag not available for select_item event');
    return;
  }

  try {
    (window as any).gtag('event', 'select_item', {
      item_list_id: listName.toLowerCase().replace(/\s+/g, '_'),
      item_list_name: listName,
      items: [{
        ...item,
        item_list_name: listName
      }]
    });
    console.log('[GA4] select_item tracked:', item.item_name);
  } catch (error) {
    console.error('Error tracking select_item:', error);
  }
};

/**
 * Track product detail views
 */
export const trackViewItem = (item: GA4ProductItem) => {
  if (!isGtagAvailable()) {
    console.warn('gtag not available for view_item event');
    return;
  }

  try {
    (window as any).gtag('event', 'view_item', {
      currency: 'USD',
      value: item.price || 0,
      items: [item]
    });
    console.log('[GA4] view_item tracked:', item.item_name);
  } catch (error) {
    console.error('Error tracking view_item:', error);
  }
};

/**
 * Track add to cart events
 */
export const trackAddToCart = (item: GA4ProductItem) => {
  if (!isGtagAvailable()) {
    console.warn('gtag not available for add_to_cart event');
    return;
  }

  try {
    (window as any).gtag('event', 'add_to_cart', {
      currency: 'USD',
      value: (item.price || 0) * (item.quantity || 1),
      items: [item]
    });
    console.log('[GA4] add_to_cart tracked:', item.item_name, 'qty:', item.quantity);
  } catch (error) {
    console.error('Error tracking add_to_cart:', error);
  }
};

/**
 * Track remove from cart events
 */
export const trackRemoveFromCart = (item: GA4ProductItem) => {
  if (!isGtagAvailable()) {
    console.warn('gtag not available for remove_from_cart event');
    return;
  }

  try {
    (window as any).gtag('event', 'remove_from_cart', {
      currency: 'USD',
      value: (item.price || 0) * (item.quantity || 1),
      items: [item]
    });
    console.log('[GA4] remove_from_cart tracked:', item.item_name);
  } catch (error) {
    console.error('Error tracking remove_from_cart:', error);
  }
};

/**
 * Track view cart events
 */
export const trackViewCart = (items: GA4ProductItem[], totalValue: number) => {
  if (!isGtagAvailable()) {
    console.warn('gtag not available for view_cart event');
    return;
  }

  try {
    (window as any).gtag('event', 'view_cart', {
      currency: 'USD',
      value: totalValue,
      items: items
    });
    console.log('[GA4] view_cart tracked:', items.length, 'items, value:', totalValue);
  } catch (error) {
    console.error('Error tracking view_cart:', error);
  }
};

/**
 * Track begin checkout events
 */
export const trackBeginCheckout = (items: GA4ProductItem[], totalValue: number, coupon?: string) => {
  if (!isGtagAvailable()) {
    console.warn('gtag not available for begin_checkout event');
    return;
  }

  try {
    (window as any).gtag('event', 'begin_checkout', {
      currency: 'USD',
      value: totalValue,
      coupon: coupon,
      items: items
    });
    console.log('[GA4] begin_checkout tracked:', items.length, 'items, value:', totalValue);
  } catch (error) {
    console.error('Error tracking begin_checkout:', error);
  }
};

/**
 * Track add payment info events
 */
export const trackAddPaymentInfo = (items: GA4ProductItem[], totalValue: number, paymentType: string, coupon?: string) => {
  if (!isGtagAvailable()) {
    console.warn('gtag not available for add_payment_info event');
    return;
  }

  try {
    (window as any).gtag('event', 'add_payment_info', {
      currency: 'USD',
      value: totalValue,
      coupon: coupon,
      payment_type: paymentType,
      items: items
    });
    console.log('[GA4] add_payment_info tracked:', paymentType);
  } catch (error) {
    console.error('Error tracking add_payment_info:', error);
  }
};

/**
 * Track purchase/transaction completion
 */
export const trackPurchase = (
  transactionId: string,
  items: GA4ProductItem[],
  totalValue: number,
  tax: number = 0,
  shipping: number = 0,
  coupon?: string
) => {
  if (!isGtagAvailable()) {
    console.warn('gtag not available for purchase event');
    return;
  }

  try {
    (window as any).gtag('event', 'purchase', {
      transaction_id: transactionId,
      affiliation: 'Alper Refrigerants',
      value: totalValue,
      tax: tax,
      shipping: shipping,
      currency: 'USD',
      coupon: coupon,
      items: items
    });
    console.log('[GA4] purchase tracked:', transactionId, 'value:', totalValue);
  } catch (error) {
    console.error('Error tracking purchase:', error);
  }
};

/**
 * Track refund events
 */
export const trackRefund = (transactionId: string, items?: GA4ProductItem[], value?: number) => {
  if (!isGtagAvailable()) {
    console.warn('gtag not available for refund event');
    return;
  }

  try {
    const eventData: any = {
      transaction_id: transactionId,
      currency: 'USD'
    };

    if (value !== undefined) {
      eventData.value = value;
    }

    if (items && items.length > 0) {
      eventData.items = items;
    }

    (window as any).gtag('event', 'refund', eventData);
    console.log('[GA4] refund tracked:', transactionId);
  } catch (error) {
    console.error('Error tracking refund:', error);
  }
};

/**
 * Helper function to convert Product to GA4ProductItem
 */
export const productToGA4Item = (product: any, quantity: number = 1): GA4ProductItem => {
  return {
    item_id: product.sku || product.id,
    item_name: product.name,
    item_brand: product.brand || 'Alper Refrigerants',
    item_category: product.category || 'Refrigerant',
    item_variant: product.packaging || '',
    price: product.price,
    quantity: quantity,
    affiliation: 'Alper Refrigerants'
  };
};

/**
 * Helper function to convert CartItem to GA4ProductItem
 */
export const cartItemToGA4Item = (cartItem: any): GA4ProductItem => {
  return {
    item_id: cartItem.sku || cartItem.id,
    item_name: cartItem.name,
    item_brand: 'Alper Refrigerants',
    item_variant: cartItem.packaging || '',
    price: cartItem.price,
    quantity: cartItem.quantity,
    affiliation: 'Alper Refrigerants'
  };
};

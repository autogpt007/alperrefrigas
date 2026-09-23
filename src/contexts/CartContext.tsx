
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { trackAddToCart, trackRemoveFromCart, cartItemToGA4Item } from '@/utils/ga4Ecommerce';
import { trackFBAddToCart } from '@/utils/facebookPixel';
import { trackGoogleAdsAddToCart } from '@/utils/googleAdsConversions';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  sku: string;
  epaApproved: boolean;
  packaging?: string;
  product_type?: string;
  // AC Bulk Pricing audit fields
  ac_bulk_pricing?: {
    base_unit_price: number;
    applied_uplift_percent: number;
    final_unit_price: number;
    tier_label: string;
    q20_units: number;
    half_units: number;
    ordered_quantity: number;
  };
  // AC Configuration for order storage
  configuration_json?: {
    btu?: number;
    ac_type?: string;
    voltage?: string;
    plug_type?: string;
    frequency?: string;
    phase?: string;
    accessories_mode?: 'without' | 'with';
    selected_accessory_ids?: string[];
    comes_with_list?: string[];
  };
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateItemConfiguration: (id: string, configuration: CartItem['configuration_json']) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  getTotalItems: () => number;
  freeShippingThreshold: number;
  qualifiesForFreeShipping: boolean;
  shippingCost: number;
  finalTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'alper_cart_v1';

const readStoredCart = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const CART_SYNC_EVENT = 'alper_cart_sync';

const writeStoredCart = (next: CartItem[]) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // storage unavailable (private mode) - cart stays in memory only
  }
  // Notify other components in this same tab (storage events only fire cross-tab)
  try {
    window.dispatchEvent(new CustomEvent(CART_SYNC_EVENT));
  } catch {
    // no-op
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(readStoredCart);

  /**
   * Every mutation re-reads the latest persisted cart before applying its
   * change, so two tabs adding different products never overwrite each other.
   */
  const mutateCart = (updater: (current: CartItem[]) => CartItem[]) => {
    const latest = readStoredCart();
    const next = updater(latest);
    writeStoredCart(next);
    setItems(next);
  };

  // Keep every tab and every component in sync with the persisted cart
  useEffect(() => {
    const resync = () => setItems(readStoredCart());

    const onStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === CART_STORAGE_KEY) resync();
    };

    window.addEventListener('storage', onStorage);
    window.addEventListener(CART_SYNC_EVENT, resync);
    // Re-read when the tab regains focus in case it was changed while hidden
    window.addEventListener('focus', resync);

    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener(CART_SYNC_EVENT, resync);
      window.removeEventListener('focus', resync);
    };
  }, []);

  // Fetch free shipping threshold from settings
  const { data: shippingSettings } = useQuery({
    queryKey: ['shipping-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_key', 'free_shipping_threshold')
        .maybeSingle();

      if (error) throw error;

      return parseFloat(data?.setting_value || '500');
    }
  });

  const freeShippingThreshold = shippingSettings || 500;
  const standardShippingCost = 50; // Standard shipping cost

  const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
    mutateCart(currentItems => {
      const existingItemIndex = currentItems.findIndex(item =>
        item.id === newItem.id && item.packaging === newItem.packaging
      );

      if (existingItemIndex !== -1) {
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        };

        const itemToTrack = updatedItems[existingItemIndex];
        trackAddToCart(cartItemToGA4Item({ ...itemToTrack, quantity: 1 }));
        trackFBAddToCart(itemToTrack.sku || itemToTrack.id, itemToTrack.name, itemToTrack.price, 'USD', 1);
        trackGoogleAdsAddToCart(itemToTrack.price);

        return updatedItems;
      }

      const newCart = [...currentItems, { ...newItem, quantity: 1 }];

      trackAddToCart(cartItemToGA4Item({ ...newItem, quantity: 1 }));
      trackFBAddToCart(newItem.sku || newItem.id, newItem.name, newItem.price, 'USD', 1);
      trackGoogleAdsAddToCart(newItem.price);

      return newCart;
    });
  };

  const removeItem = (id: string) => {
    mutateCart(currentItems => {
      const removedItem = currentItems.find(item => item.id === id);
      if (removedItem) {
        trackRemoveFromCart(cartItemToGA4Item(removedItem));
      }
      return currentItems.filter(item => item.id !== id);
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    mutateCart(currentItems =>
      currentItems.map(item => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const updateItemConfiguration = (id: string, configuration: CartItem['configuration_json']) => {
    mutateCart(currentItems =>
      currentItems.map(item =>
        item.id === id ? { ...item, configuration_json: configuration } : item
      )
    );
  };

  const clearCart = () => {
    mutateCart(() => []);
  };

  const getTotalItems = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const qualifiesForFreeShipping = total >= freeShippingThreshold;
  const shippingCost = qualifiesForFreeShipping ? 0 : standardShippingCost;
  const finalTotal = total + shippingCost;


  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    updateItemConfiguration,
    clearCart,
    total,
    itemCount,
    getTotalItems,
    freeShippingThreshold,
    qualifiesForFreeShipping,
    shippingCost,
    finalTotal,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

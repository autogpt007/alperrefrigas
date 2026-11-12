
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

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Fetch free shipping threshold from settings
  const { data: shippingSettings } = useQuery({
    queryKey: ['shipping-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_key', 'free_shipping_threshold')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return parseFloat(data?.setting_value || '500');
    }
  });

  const freeShippingThreshold = shippingSettings || 500;
  const standardShippingCost = 50; // Standard shipping cost

  const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
    console.log('Adding item to cart:', newItem);
    
    setItems(currentItems => {
      const existingItemIndex = currentItems.findIndex(item => 
        item.id === newItem.id && item.packaging === newItem.packaging
      );
      
      if (existingItemIndex !== -1) {
        // Update existing item quantity
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        };
        console.log('Updated existing item, new cart:', updatedItems);
        
        // Track add to cart in GA4 and Facebook Pixel
        const itemToTrack = updatedItems[existingItemIndex];
        trackAddToCart(cartItemToGA4Item({ ...itemToTrack, quantity: 1 }));
        trackFBAddToCart(itemToTrack.sku || itemToTrack.id, itemToTrack.name, itemToTrack.price, 'USD', 1);
        trackGoogleAdsAddToCart(itemToTrack.price);
        
        return updatedItems;
      }
      
      // Add new item
      const newCart = [...currentItems, { ...newItem, quantity: 1 }];
      console.log('Added new item, new cart:', newCart);
      
      // Track add to cart in GA4 and Facebook Pixel
      trackAddToCart(cartItemToGA4Item({ ...newItem, quantity: 1 }));
      trackFBAddToCart(newItem.sku || newItem.id, newItem.name, newItem.price, 'USD', 1);
      trackGoogleAdsAddToCart(newItem.price);
      
      return newCart;
    });
  };

  const removeItem = (id: string) => {
    console.log('Removing item from cart:', id);
    setItems(currentItems => {
      // Find the item being removed for GA4 tracking
      const removedItem = currentItems.find(item => item.id === id);
      if (removedItem) {
        trackRemoveFromCart(cartItemToGA4Item(removedItem));
      }
      
      const newItems = currentItems.filter(item => item.id !== id);
      console.log('Cart after removal:', newItems);
      return newItems;
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    console.log('Updating quantity for item:', id, 'to:', quantity);
    
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    
    setItems(currentItems => {
      const updatedItems = currentItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      );
      console.log('Cart after quantity update:', updatedItems);
      return updatedItems;
    });
  };

  const updateItemConfiguration = (id: string, configuration: CartItem['configuration_json']) => {
    console.log('Updating configuration for item:', id, configuration);
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === id ? { ...item, configuration_json: configuration } : item
      )
    );
  };

  const clearCart = () => {
    console.log('Clearing cart');
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const qualifiesForFreeShipping = total >= freeShippingThreshold;
  const shippingCost = qualifiesForFreeShipping ? 0 : standardShippingCost;
  const finalTotal = total + shippingCost;

  console.log('Cart state:', { 
    items, 
    total, 
    itemCount, 
    freeShippingThreshold, 
    qualifiesForFreeShipping, 
    shippingCost, 
    finalTotal 
  });

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

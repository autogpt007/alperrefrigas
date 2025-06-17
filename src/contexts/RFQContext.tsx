
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface RFQItem {
  productId: string;
  productName: string;
  quantity: number;
  packaging: string;
  imageUrl: string;
}

interface RFQContextType {
  items: RFQItem[];
  addItem: (item: RFQItem) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearRFQ: () => void;
  itemCount: number;
}

const RFQContext = createContext<RFQContextType | undefined>(undefined);

export const RFQProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<RFQItem[]>([]);

  const addItem = (newItem: RFQItem) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(
        item => item.productId === newItem.productId && item.packaging === newItem.packaging
      );
      
      if (existingItem) {
        return prevItems.map(item =>
          item.productId === newItem.productId && item.packaging === newItem.packaging
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }
      
      return [...prevItems, newItem];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    
    setItems(prevItems =>
      prevItems.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeItem = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.productId !== productId));
  };

  const clearRFQ = () => {
    setItems([]);
  };

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <RFQContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearRFQ,
        itemCount
      }}
    >
      {children}
    </RFQContext.Provider>
  );
};

export const useRFQ = () => {
  const context = useContext(RFQContext);
  if (context === undefined) {
    throw new Error('useRFQ must be used within an RFQProvider');
  }
  return context;
};

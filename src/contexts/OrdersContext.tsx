
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  packaging: string;
}

export interface Order {
  id: string;
  customerName: string;
  companyName: string;
  email: string;
  phone?: string;
  shippingAddress: string;
  orderDate: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  totalAmount: number;
  trackingNumber?: string;
  notes?: string;
}

interface OrdersContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'orderDate'>) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  updateTrackingNumber: (orderId: string, trackingNumber: string) => void;
  addOrderNotes: (orderId: string, notes: string) => void;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const OrdersProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      customerName: 'John Smith',
      companyName: 'Smith HVAC Services',
      email: 'john@smithhvac.com',
      phone: '555-0123',
      shippingAddress: '123 Main St, Houston, TX 77001',
      orderDate: '2024-01-15',
      status: 'processing',
      items: [
        {
          productId: 'r410a',
          productName: 'Refrigerant R-410A',
          quantity: 5,
          price: 89.99,
          packaging: 'Pallet (48 cylinders)'
        }
      ],
      totalAmount: 449.95,
      trackingNumber: '',
      notes: 'Customer requested expedited shipping'
    },
    {
      id: '2',
      customerName: 'Sarah Johnson',
      companyName: 'Cool Air Solutions',
      email: 'sarah@coolairsolutions.com',
      phone: '555-0456',
      shippingAddress: '456 Industrial Blvd, Atlanta, GA 30309',
      orderDate: '2024-01-14',
      status: 'shipped',
      items: [
        {
          productId: 'r134a',
          productName: 'Refrigerant R-134a',
          quantity: 10,
          price: 75.50,
          packaging: 'Container (800 cylinders)'
        }
      ],
      totalAmount: 755.00,
      trackingNumber: 'TRK123456789',
      notes: ''
    }
  ]);

  const addOrder = (orderData: Omit<Order, 'id' | 'orderDate'>) => {
    const newOrder: Order = {
      id: Date.now().toString(),
      orderDate: new Date().toISOString().split('T')[0],
      ...orderData,
    };
    setOrders(prev => [...prev, newOrder]);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
  };

  const updateTrackingNumber = (orderId: string, trackingNumber: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, trackingNumber } : order
    ));
  };

  const addOrderNotes = (orderId: string, notes: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, notes } : order
    ));
  };

  return (
    <OrdersContext.Provider value={{ 
      orders, 
      addOrder, 
      updateOrderStatus, 
      updateTrackingNumber, 
      addOrderNotes 
    }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
};

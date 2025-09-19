
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface OrderItem {
  id?: string;
  product_id?: string;
  product_name: string;
  quantity: number;
  price: number;
  sku?: string;
  packaging?: string;
  epa_approved?: boolean;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string | null; // Allow null for guest orders
  customer_name: string;
  customer_email: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'processed' | 'waiting_review' | 'declined';
  total_amount: number;
  shipping_cost: number;
  tax_amount: number;
  shipping_address: any;
  tracking_number?: string;
  notes?: string;
  payment_method?: string;
  payment_details?: any;
  cashapp_tag?: string;
  zelle_tag?: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

interface OrdersContextType {
  orders: Order[];
  loading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  createOrder: (orderData: Omit<Order, 'id' | 'order_number' | 'created_at' | 'updated_at' | 'user_id'>, isGuest?: boolean) => Promise<Order | null>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const OrdersProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchOrders = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            product_id,
            product_name,
            quantity,
            price,
            sku,
            packaging,
            epa_approved
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      const formattedOrders: Order[] = ordersData?.map(order => ({
        ...order,
        status: order.status as Order['status'], // Type cast the status
        items: order.order_items || []
      })) || [];

      setOrders(formattedOrders);
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      setError(err.message);
      toast({
        title: "Error fetching orders",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const sendOrderNotification = async (order: Order) => {
    try {
      const { data, error } = await supabase.functions.invoke('send-order-notification', {
        body: {
          orderId: order.id,
          orderNumber: order.order_number,
          customerName: order.customer_name,
          customerEmail: order.customer_email,
          totalAmount: order.total_amount,
          items: order.items
        }
      });

      if (error) {
        console.error('Error sending order notification:', error);
      } else {
        console.log('Order notification sent successfully:', data);
      }
    } catch (error) {
      console.error('Failed to send order notification:', error);
    }
  };

  const createOrder = async (orderData: Omit<Order, 'id' | 'order_number' | 'created_at' | 'updated_at' | 'user_id'>, isGuest?: boolean): Promise<Order | null> => {
    setLoading(true);
    setError(null);

    try {
      // Guest-friendly session detection (no forced refresh)
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.warn('[ORDER_WARNING] getSession error, proceeding as guest:', sessionError.message);
      }

      const finalSession = session ?? null;
      const isAuthenticated = !!finalSession?.user?.id;
      const isActualGuest = (isGuest === true) || !isAuthenticated;
      
      // CRITICAL: Ensure user_id is explicitly null for guests, uuid for authenticated users
      const finalUserId = isActualGuest ? null : finalSession?.user?.id || null;
      
      // Enhanced validation with specific error messages
      if (!isActualGuest && !finalUserId) {
        console.error('[ORDER_ERROR] Invalid user state: authenticated but no user ID');
        throw new Error('Authentication error: User session is invalid. Please log out and log back in.');
      }
      
      if (isActualGuest && finalUserId !== null) {
        console.error('[ORDER_ERROR] Invalid guest state: guest but user ID provided');
        throw new Error('Checkout error: Mixed guest/authenticated state detected.');
      }
      
      // COMPREHENSIVE PRE-ORDER LOGGING
      console.info('[ORDER_CREATE_START]', {
        timestamp: new Date().toISOString(),
        isGuest: isActualGuest,
        isAuthenticated,
        sessionExists: !!finalSession,
        userId: finalUserId || 'GUEST',
        customerEmail: orderData.customer_email,
        totalAmount: orderData.total_amount,
        paymentMethod: orderData.payment_method,
        itemCount: orderData.items?.length || 0
      });

      // Use Edge Function to create order (works for guests and authenticated users)
      const { data: fnData, error: fnError } = await supabase.functions.invoke('create-order', {
        body: {
          customer_name: orderData.customer_name,
          customer_email: orderData.customer_email,
          status: orderData.status,
          total_amount: orderData.total_amount,
          shipping_cost: orderData.shipping_cost || 0,
          tax_amount: orderData.tax_amount || 0,
          shipping_address: orderData.shipping_address,
          notes: orderData.notes,
          payment_method: orderData.payment_method || 'credit_card',
          payment_details: orderData.payment_details,
          cashapp_tag: orderData.cashapp_tag,
          zelle_tag: orderData.zelle_tag,
          items: orderData.items || []
        },
      });

      if (fnError) {
        console.error('[ORDER_ERROR] Edge function create-order failed:', fnError);
        throw new Error(`Order creation failed: ${fnError.message || 'Unknown error'}`);
      }

      const completeOrder = (fnData as any)?.order;
      if (!completeOrder) {
        console.error('[ORDER_ERROR] Edge function returned no order data');
        throw new Error('Order creation failed: No order data returned');
      }

      const formattedOrder: Order = {
        ...completeOrder,
        status: completeOrder.status as Order['status'],
        items: completeOrder.order_items || []
      };

      setOrders(prev => [formattedOrder, ...prev]);

      // Send notification to admin
      await sendOrderNotification(formattedOrder);

      toast({
        title: 'Order placed successfully!',
        description: `Order ${formattedOrder.order_number} has been created.`,
      });

      return formattedOrder;
    } catch (err: any) {
      console.error('Error creating order:', err);
      setError(err.message);
      toast({
        title: "Error creating order",
        description: err.message,
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status } : order
      ));

      toast({
        title: "Order updated",
        description: `Order status changed to ${status}`
      });
    } catch (err: any) {
      console.error('Error updating order:', err);
      toast({
        title: "Error updating order",
        description: err.message,
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      setOrders([]);
    }
  }, [user]);

  return (
    <OrdersContext.Provider value={{
      orders,
      loading,
      error,
      fetchOrders,
      createOrder,
      updateOrderStatus
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

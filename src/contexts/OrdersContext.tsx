
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
      // Get current session to understand auth state precisely
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        throw new Error('Authentication session error');
      }

      const isAuthenticated = !!session?.user?.id;
      const isActualGuest = isGuest || !isAuthenticated;
      
      // CRITICAL: Ensure user_id is explicitly null for guests, uuid for authenticated users
      const finalUserId = isActualGuest ? null : session!.user!.id;
      
      // Comprehensive logging for debugging
      console.info('[ORDER_CREATE]', {
        timestamp: new Date().toISOString(),
        isGuest: isActualGuest,
        isAuthenticated,
        auth_uid: session?.user?.id ?? 'NULL',
        user_id_to_insert: finalUserId,
        customer_email: orderData.customer_email,
        total_amount: orderData.total_amount,
        payment_method: orderData.payment_method
      });
      
      // Validate that we have proper user_id handling
      if (!isActualGuest && !finalUserId) {
        throw new Error('Invalid user state: authenticated but no user ID');
      }
      
      if (isActualGuest && finalUserId !== null) {
        throw new Error('Invalid guest state: guest but user ID provided');
      }
      
        const { data: newOrder, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: finalUserId, // null for guests, uuid for authenticated users
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
          zelle_tag: orderData.zelle_tag
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items with validation
      if (orderData.items && orderData.items.length > 0) {
        const orderItems = orderData.items.map(item => {
          // Validate product_id is a proper UUID
          const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(item.product_id || '');
          
          if (!isValidUUID) {
            console.warn(`Invalid product_id format: ${item.product_id}, using null`);
          }
          
          return {
            order_id: newOrder.id,
            product_id: isValidUUID ? item.product_id : null,
            product_name: item.product_name,
            quantity: item.quantity,
            price: item.price,
            sku: item.sku || null,
            packaging: item.packaging || null,
            epa_approved: item.epa_approved || false
          };
        });

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (itemsError) {
          console.error('Order items insertion error:', itemsError);
          throw itemsError;
        }
      }

      // Fetch the complete order with items
      const { data: completeOrder, error: fetchError } = await supabase
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
        .eq('id', newOrder.id)
        .single();

      if (fetchError) throw fetchError;

      const formattedOrder: Order = {
        ...completeOrder,
        status: completeOrder.status as Order['status'], // Type cast the status
        items: completeOrder.order_items || []
      };

      setOrders(prev => [formattedOrder, ...prev]);

      // Send notification to admin
      await sendOrderNotification(formattedOrder);

      toast({
        title: "Order placed successfully!",
        description: `Order ${formattedOrder.order_number} has been created.`
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

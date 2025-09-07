
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ShoppingCart, Package, Truck, CheckCircle, XCircle, Clock, Eye, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  status: string;
  total_amount: number;
  shipping_cost: number;
  tax_amount: number;
  items: any[];
  order_items?: OrderItem[];
  shipping_address: any;
  notes: string;
  tracking_number: string;
  payment_method: string;
  payment_details: any;
  created_at: string;
  updated_at: string;
}

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  price: number;
  sku: string;
  packaging: string;
  epa_approved: boolean;
}

const OrderManagement = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [trackingNumber, setTrackingNumber] = useState('');

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch orders
  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ['admin-orders', statusFilter],
    queryFn: async () => {
      console.log('Fetching orders with filter:', statusFilter);
      
      let query = supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            product_name,
            quantity,
            price,
            sku,
            packaging,
            epa_approved
          )
        `)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching orders:', error);
        throw error;
      }
      
      console.log('Orders fetched:', data);
      return data as Order[];
    },
    retry: 3,
    retryDelay: 1000,
  });

  // Update order status mutation
  const updateOrderMutation = useMutation({
    mutationFn: async ({ orderId, status, trackingNumber }: { orderId: string; status: string; trackingNumber?: string }) => {
      console.log('Updating order:', orderId, 'to status:', status);
      
      const updateData: any = {
        status,
        updated_at: new Date().toISOString()
      };

      if (trackingNumber) {
        updateData.tracking_number = trackingNumber;
      }

      const { data, error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating order:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast({ title: 'Order updated successfully!' });
      setTrackingNumber('');
    },
    onError: (error: any) => {
      console.error('Update order error:', error);
      toast({ title: 'Error updating order', description: error.message, variant: 'destructive' });
    }
  });

  // Add notes to order mutation
  const addNotesMutation = useMutation({
    mutationFn: async ({ orderId, notes }: { orderId: string; notes: string }) => {
      console.log('Adding notes to order:', orderId);
      
      const { data, error } = await supabase
        .from('orders')
        .update({ 
          notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select()
        .single();
      
      if (error) {
        console.error('Error adding notes:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast({ title: 'Notes added successfully!' });
    },
    onError: (error: any) => {
      console.error('Add notes error:', error);
      toast({ title: 'Error adding notes', description: error.message, variant: 'destructive' });
    }
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'processing':
        return <Package className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-600';
      case 'processing':
        return 'bg-blue-600';
      case 'shipped':
        return 'bg-purple-600';
      case 'delivered':
        return 'bg-green-600';
      case 'cancelled':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    if (newStatus === 'shipped' && !trackingNumber) {
      toast({ title: 'Error', description: 'Tracking number is required for shipped orders', variant: 'destructive' });
      return;
    }
    
    updateOrderMutation.mutate({ 
      orderId, 
      status: newStatus, 
      trackingNumber: newStatus === 'shipped' ? trackingNumber : undefined 
    });
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setActiveTab('details');
  };

  if (error) {
    console.error('OrderManagement error:', error);
    return (
      <div className="p-6">
        <div className="text-red-400">Error loading orders: {error.message}</div>
        <Button 
          onClick={() => queryClient.invalidateQueries({ queryKey: ['admin-orders'] })}
          className="mt-4 bg-cyan-500 hover:bg-cyan-600"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Order Management</h1>
        <p className="text-gray-300">Manage customer orders and fulfillment</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="list">Orders</TabsTrigger>
          {selectedOrder && (
            <TabsTrigger value="details">Order Details</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="list">
          <Card className="bg-slate-800/50 border-cyan-500/20">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-white">Orders</CardTitle>
                  <CardDescription className="text-gray-300">
                    Manage customer orders and track fulfillment
                  </CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  <Label className="text-gray-300">Filter by status:</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48 bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Orders</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="text-white">Loading orders...</div>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <div key={order.id} className="border border-slate-600 rounded-lg p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center">
                              <ShoppingCart className="h-6 w-6 text-cyan-400" />
                            </div>
                            <div>
                              <h3 className="text-white font-medium">#{order.order_number}</h3>
                              <p className="text-gray-400 text-sm">{order.customer_name} ({order.customer_email})</p>
                              <div className="flex items-center space-x-4 mt-2">
                                <Badge className={getStatusColor(order.status)}>
                                  {getStatusIcon(order.status)}
                                  <span className="ml-1 capitalize">{order.status}</span>
                                </Badge>
                                <span className="text-cyan-400 font-medium">${order.total_amount}</span>
                                <span className="text-gray-400 text-sm">
                                  {new Date(order.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col md:flex-row gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewOrder(order)}
                              className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                            <Select
                              value={order.status}
                              onValueChange={(value) => handleStatusUpdate(order.id, value)}
                            >
                              <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="shipped">Shipped</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        {order.status === 'processing' && (
                          <div className="mt-4 pt-4 border-t border-slate-600">
                            <Label className="text-gray-300 block mb-2">Tracking Number (for shipping):</Label>
                            <div className="flex gap-2">
                              <Input
                                value={trackingNumber}
                                onChange={(e) => setTrackingNumber(e.target.value)}
                                placeholder="Enter tracking number"
                                className="bg-slate-700 border-slate-600 text-white"
                              />
                              <Button
                                onClick={() => handleStatusUpdate(order.id, 'shipped')}
                                className="bg-purple-600 hover:bg-purple-700"
                                disabled={!trackingNumber || updateOrderMutation.isPending}
                              >
                                Mark as Shipped
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400">No orders found.</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {selectedOrder && (
          <TabsContent value="details">
            <div className="space-y-6">
              <Card className="bg-slate-800/50 border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-white">Order #{selectedOrder.order_number}</CardTitle>
                  <CardDescription className="text-gray-300">
                    Order details and management
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-white font-medium mb-4">Customer Information</h3>
                      <div className="space-y-2">
                        <p className="text-gray-300">
                          <span className="text-gray-400">Name:</span> {selectedOrder.customer_name}
                        </p>
                        <p className="text-gray-300">
                          <span className="text-gray-400">Email:</span> {selectedOrder.customer_email}
                        </p>
                        <p className="text-gray-300">
                          <span className="text-gray-400">Order Date:</span> {new Date(selectedOrder.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-white font-medium mb-4">Order Status</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(selectedOrder.status)}>
                            {getStatusIcon(selectedOrder.status)}
                            <span className="ml-1 capitalize">{selectedOrder.status}</span>
                          </Badge>
                        </div>
                        {selectedOrder.tracking_number && (
                          <p className="text-gray-300">
                            <span className="text-gray-400">Tracking:</span> {selectedOrder.tracking_number}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {selectedOrder.shipping_address && (
                    <div>
                      <h3 className="text-white font-medium mb-4">Shipping Address</h3>
                      <div className="bg-slate-700/50 p-4 rounded-lg">
                        <p className="text-gray-300">
                          {selectedOrder.shipping_address.street}<br />
                          {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.zipCode}
                        </p>
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-white font-medium mb-4">Order Items</h3>
                    <div className="space-y-2">
                      {(selectedOrder.order_items || selectedOrder.items || []).map((item: any, index: number) => (
                        <div key={index} className="flex justify-between items-center bg-slate-700/50 p-3 rounded-lg">
                          <div>
                            <p className="text-white font-medium">{item.product_name}</p>
                            <p className="text-gray-400 text-sm">
                              {item.sku && `SKU: ${item.sku} | `}Quantity: {item.quantity}
                              {item.packaging && ` | Package: ${item.packaging}`}
                            </p>
                            {item.epa_approved && (
                              <Badge className="bg-green-600 mt-1">EPA Approved</Badge>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-white font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                            <p className="text-gray-400 text-sm">${item.price} each</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white font-medium mb-4">Payment Information</h3>
                    <div className="bg-slate-700/50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Payment Method:</span>
                        <span className="text-white capitalize">{selectedOrder.payment_method || 'Credit Card'}</span>
                      </div>
                      {selectedOrder.payment_details && selectedOrder.payment_method === 'credit_card' && (
                        <div className="bg-green-900/20 p-3 rounded-lg border border-green-500/20">
                          <div className="flex items-center gap-2 mb-2">
                            <Shield className="h-4 w-4 text-green-400" />
                            <span className="text-green-300 font-medium">Secure Payment Processing</span>
                          </div>
                          <p className="text-gray-300 text-sm">
                            Credit card payment processed securely via phone verification. No sensitive payment data is stored in our system for PCI compliance.
                          </p>
                          {selectedOrder.payment_details.cardholder_name && (
                            <div className="flex justify-between mt-2">
                              <span className="text-gray-400">Cardholder:</span>
                              <span className="text-white">{selectedOrder.payment_details.cardholder_name}</span>
                            </div>
                          )}
                        </div>
                      )}
                       {selectedOrder.payment_details && selectedOrder.payment_method === 'bank_wire' && (
                         <div className="flex justify-between">
                           <span className="text-gray-400">Instructions:</span>
                           <span className="text-white">{selectedOrder.payment_details.instructions}</span>
                         </div>
                       )}
                     </div>
                   </div>

                  <div>
                    <h3 className="text-white font-medium mb-4">Order Summary</h3>
                    <div className="bg-slate-700/50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Subtotal:</span>
                        <span className="text-white">${(selectedOrder.total_amount - (selectedOrder.shipping_cost || 0) - (selectedOrder.tax_amount || 0)).toFixed(2)}</span>
                      </div>
                      {selectedOrder.shipping_cost > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Shipping:</span>
                          <span className="text-white">${selectedOrder.shipping_cost.toFixed(2)}</span>
                        </div>
                      )}
                      {selectedOrder.tax_amount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Tax:</span>
                          <span className="text-white">${selectedOrder.tax_amount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="border-t border-slate-600 pt-2">
                        <div className="flex justify-between font-medium">
                          <span className="text-white">Total:</span>
                          <span className="text-cyan-400">${selectedOrder.total_amount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white font-medium mb-4">Order Notes</h3>
                    <Textarea
                      defaultValue={selectedOrder.notes || ''}
                      placeholder="Add notes about this order..."
                      className="bg-slate-700 border-slate-600 text-white"
                      rows={3}
                      onBlur={(e) => {
                        if (e.target.value !== selectedOrder.notes) {
                          addNotesMutation.mutate({ 
                            orderId: selectedOrder.id, 
                            notes: e.target.value 
                          });
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default OrderManagement;

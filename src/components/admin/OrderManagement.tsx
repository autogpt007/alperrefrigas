
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
import { ShoppingCart, Package, Truck, CheckCircle, XCircle, Clock, Eye, EyeOff, Shield, Trash2, Snowflake, Zap, UserCheck, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';

interface ACConfiguration {
  btu?: number;
  ac_type?: string;
  voltage?: string;
  plug_type?: string;
  frequency?: string;
  phase?: string;
  accessories_mode?: 'without' | 'with';
  comes_with_list?: string[];
}

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  phone?: string;
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
  configuration_json?: ACConfiguration;
}

const OrderManagement = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [showCVV, setShowCVV] = useState(false);
  const [kycDialogOpen, setKycDialogOpen] = useState(false);
  const [kycReviewOrder, setKycReviewOrder] = useState<string | null>(null);
  const [kycData, setKycData] = useState<any>(null);
  const [kycSignedUrls, setKycSignedUrls] = useState<any>(null);
  const [kycLoading, setKycLoading] = useState(false);
  const [kycNotes, setKycNotes] = useState('');

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch orders using secure edge function
  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ['admin-orders', statusFilter],
    queryFn: async () => {
      console.log('Fetching orders with filter:', statusFilter);
      
      const { data, error } = await supabase.functions.invoke('admin-orders-access', {
        body: { action: 'list' }
      });
      
      if (error) {
        console.error('Error fetching orders:', error);
        throw error;
      }
      
      let filteredData = data || [];
      if (statusFilter !== 'all') {
        filteredData = filteredData.filter((order: any) => order.status === statusFilter);
      }
      
      console.log('Orders fetched:', filteredData);
      return filteredData as Order[];
    },
    retry: 3,
    retryDelay: 1000,
  });

  // Update order status mutation using secure edge function
  const updateOrderMutation = useMutation({
    mutationFn: async ({ orderId, status, trackingNumber }: { orderId: string; status: string; trackingNumber?: string }) => {
      console.log('Updating order:', orderId, 'to status:', status);
      
      const { data, error } = await supabase.functions.invoke('admin-orders-access', {
        body: { 
          action: 'update',
          orderId,
          status,
          trackingNumber
        }
      });
      
      if (error) {
        console.error('Error updating order:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'], refetchType: 'all' });
      toast({ title: 'Order updated successfully!' });
      setTrackingNumber('');
    },
    onError: (error: any) => {
      console.error('Update order error:', error);
      toast({ title: 'Error updating order', description: error.message, variant: 'destructive' });
    }
  });

  // Add notes to order mutation using secure edge function
  const addNotesMutation = useMutation({
    mutationFn: async ({ orderId, notes }: { orderId: string; notes: string }) => {
      console.log('Adding notes to order:', orderId);
      
      const { data, error } = await supabase.functions.invoke('admin-orders-access', {
        body: { 
          action: 'add-notes',
          orderId,
          notes
        }
      });
      
      if (error) {
        console.error('Error adding notes:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'], refetchType: 'all' });
      toast({ title: 'Notes added successfully!' });
    },
    onError: (error: any) => {
      console.error('Add notes error:', error);
      toast({ title: 'Error adding notes', description: error.message, variant: 'destructive' });
    }
  });

  // Delete order mutation using secure edge function
  const deleteOrderMutation = useMutation({
    mutationFn: async (orderId: string) => {
      console.log('Deleting order:', orderId);
      
      const { data, error } = await supabase.functions.invoke('admin-orders-access', {
        body: { 
          action: 'delete',
          orderId
        }
      });
      
      if (error) {
        console.error('Error deleting order:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'], refetchType: 'all' });
      toast({ title: 'Order deleted successfully!' });
      setActiveTab('list');
      setSelectedOrder(null);
    },
    onError: (error: any) => {
      console.error('Delete order error:', error);
      toast({ title: 'Error deleting order', description: error.message, variant: 'destructive' });
    }
  });

  // Send KYC request mutation
  const sendKycMutation = useMutation({
    mutationFn: async (orderId: string) => {
      const { data, error } = await supabase.functions.invoke('admin-orders-access', {
        body: { action: 'send-kyc', orderId }
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'], refetchType: 'all' });
      toast({ title: 'KYC verification request sent!' });
    },
    onError: (error: any) => {
      toast({ title: 'Error sending KYC request', description: error.message, variant: 'destructive' });
    }
  });

  // KYC review functions
  const loadKycData = async (orderId: string) => {
    setKycLoading(true);
    setKycReviewOrder(orderId);
    try {
      const { data, error } = await supabase.functions.invoke('admin-kyc-access', {
        body: { action: 'view', orderId }
      });
      if (error) throw error;
      setKycData(data?.kyc || null);
      setKycSignedUrls(data?.signedUrls || null);
    } catch (err: any) {
      toast({ title: 'Error loading KYC data', description: err.message, variant: 'destructive' });
    } finally {
      setKycLoading(false);
    }
  };

  const handleKycAction = async (action: 'approve' | 'reject', orderId: string) => {
    try {
      const { error } = await supabase.functions.invoke('admin-kyc-access', {
        body: { action, orderId, notes: kycNotes }
      });
      if (error) throw error;
      toast({ title: `KYC ${action === 'approve' ? 'approved' : 'rejected'}` });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'], refetchType: 'all' });
      setKycReviewOrder(null);
      setKycData(null);
      setKycNotes('');
    } catch (err: any) {
      toast({ title: `Error ${action}ing KYC`, description: err.message, variant: 'destructive' });
    }
  };

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
    setShowCardNumber(false);
    setShowCVV(false);
    setActiveTab('details');
  };

  const handleDeleteOrder = (orderId: string, orderNumber: string) => {
    if (confirm(`Are you sure you want to delete order ${orderNumber}? This action cannot be undone.`)) {
      deleteOrderMutation.mutate(orderId);
    }
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
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => sendKycMutation.mutate(order.id)}
                              disabled={sendKycMutation.isPending}
                              className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
                            >
                              <UserCheck className="h-4 w-4 mr-1" />
                              KYC
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
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteOrder(order.id, order.order_number)}
                              className="bg-red-600/20 hover:bg-red-600/40 text-red-400 border-red-600/50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
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
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white">Order #{selectedOrder.order_number}</CardTitle>
                      <CardDescription className="text-gray-300">
                        Order details and management
                      </CardDescription>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteOrder(selectedOrder.id, selectedOrder.order_number)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete Order
                    </Button>
                  </div>
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
                          <span className="text-gray-400">Phone:</span> {selectedOrder.phone || selectedOrder.shipping_address?.phoneNumber || 'Not provided'}
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
                          {selectedOrder.shipping_address.country && (
                            <><br />{selectedOrder.shipping_address.country}</>
                          )}
                        </p>
                        {selectedOrder.shipping_address.phoneNumber && (
                          <p className="text-gray-300 mt-2">
                            <span className="text-gray-400">Phone:</span> {selectedOrder.shipping_address.phoneNumber}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Credit Card Payment Information - Full Details for Offline Processing */}
                  {selectedOrder.payment_method === 'credit_card' && selectedOrder.payment_details && (
                    <div className="bg-amber-900/30 border border-amber-500/50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Shield className="h-5 w-5 text-amber-400" />
                        <h4 className="text-amber-400 font-medium">Credit Card Details (Offline Processing)</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-3">
                          <div>
                            <span className="text-gray-400 block text-xs mb-1">Card Number</span>
                            <div className="flex items-center gap-2">
                              <span className="text-white font-mono">
                                {showCardNumber 
                                  ? (selectedOrder.payment_details.card_number || 'Not stored')
                                  : `****-****-****-${selectedOrder.payment_details.last_four || selectedOrder.payment_details.card_number?.slice(-4) || '****'}`
                                }
                              </span>
                              {selectedOrder.payment_details.card_number && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-amber-400 hover:text-amber-300 hover:bg-amber-900/30"
                                  onClick={() => setShowCardNumber(!showCardNumber)}
                                >
                                  {showCardNumber ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                                  <span className="ml-1 text-xs">{showCardNumber ? 'Hide' : 'View'}</span>
                                </Button>
                              )}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-400 block text-xs">Expiry Date</span>
                            <span className="text-white">{selectedOrder.payment_details.expiry_date || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block text-xs mb-1">CVV</span>
                            <div className="flex items-center gap-2">
                              <span className="text-white font-mono">
                                {showCVV 
                                  ? (selectedOrder.payment_details.cvv || 'Not stored')
                                  : '***'
                                }
                              </span>
                              {selectedOrder.payment_details.cvv && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-amber-400 hover:text-amber-300 hover:bg-amber-900/30"
                                  onClick={() => setShowCVV(!showCVV)}
                                >
                                  {showCVV ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                                  <span className="ml-1 text-xs">{showCVV ? 'Hide' : 'View'}</span>
                                </Button>
                              )}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-400 block text-xs">Cardholder Name</span>
                            <span className="text-white">{selectedOrder.payment_details.cardholder_name || selectedOrder.customer_name}</span>
                          </div>
                        </div>
                        {selectedOrder.payment_details.billing_address && (
                          <div className="space-y-2">
                            <span className="text-gray-400 block text-xs">Billing Address</span>
                            <div className="text-white">
                              {selectedOrder.payment_details.billing_address.street && (
                                <p>{selectedOrder.payment_details.billing_address.street}</p>
                              )}
                              {(selectedOrder.payment_details.billing_address.city || selectedOrder.payment_details.billing_address.state) && (
                                <p>
                                  {selectedOrder.payment_details.billing_address.city}
                                  {selectedOrder.payment_details.billing_address.city && selectedOrder.payment_details.billing_address.state && ', '}
                                  {selectedOrder.payment_details.billing_address.state} {selectedOrder.payment_details.billing_address.zipCode}
                                </p>
                              )}
                              {selectedOrder.payment_details.billing_address.country && (
                                <p>{selectedOrder.payment_details.billing_address.country}</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      <p className="text-amber-400/70 text-xs mt-4 italic">
                        ⚠️ Delete this order after processing payment to remove sensitive card data
                      </p>
                    </div>
                  )}

                  {/* Products Ordered */}
                  <div>
                    <h3 className="text-white font-medium mb-4">Products Ordered</h3>
                    <div className="bg-slate-700/50 rounded-lg overflow-hidden">
                      {(selectedOrder.order_items && selectedOrder.order_items.length > 0) ? (
                        <table className="w-full">
                          <thead className="bg-slate-600/50">
                            <tr>
                              <th className="text-left text-gray-300 text-sm font-medium px-4 py-3">Product</th>
                              <th className="text-left text-gray-300 text-sm font-medium px-4 py-3">SKU</th>
                              <th className="text-left text-gray-300 text-sm font-medium px-4 py-3">Packaging</th>
                              <th className="text-center text-gray-300 text-sm font-medium px-4 py-3">Qty</th>
                              <th className="text-right text-gray-300 text-sm font-medium px-4 py-3">Price</th>
                              <th className="text-right text-gray-300 text-sm font-medium px-4 py-3">Subtotal</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-600">
                            {selectedOrder.order_items.map((item) => (
                              <tr key={item.id} className="hover:bg-slate-600/30">
                                <td className="px-4 py-3">
                                  <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                      <span className="text-white">{item.product_name}</span>
                                      {item.epa_approved && (
                                        <Badge className="bg-green-600/20 text-green-400 text-xs">EPA</Badge>
                                      )}
                                    </div>
                                    {/* AC Configuration Display */}
                                    {item.configuration_json && (
                                      <div className="bg-blue-900/30 border border-blue-500/30 rounded p-2 mt-1">
                                        <div className="flex items-center gap-1 mb-1">
                                          <Snowflake className="h-3 w-3 text-blue-400" />
                                          <span className="text-blue-400 text-xs font-medium">AC Configuration</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                                          {item.configuration_json.btu && (
                                            <div className="text-gray-300">
                                              <span className="text-gray-500">BTU:</span> {item.configuration_json.btu.toLocaleString()}
                                            </div>
                                          )}
                                          {item.configuration_json.voltage && (
                                            <div className="text-gray-300 flex items-center gap-1">
                                              <Zap className="h-3 w-3 text-yellow-500" />
                                              <span className="text-gray-500">Voltage:</span> {item.configuration_json.voltage}
                                            </div>
                                          )}
                                          {item.configuration_json.plug_type && (
                                            <div className="text-gray-300">
                                              <span className="text-gray-500">Plug:</span> {item.configuration_json.plug_type}
                                            </div>
                                          )}
                                          {item.configuration_json.frequency && (
                                            <div className="text-gray-300">
                                              <span className="text-gray-500">Freq:</span> {item.configuration_json.frequency}
                                            </div>
                                          )}
                                          {item.configuration_json.phase && (
                                            <div className="text-gray-300">
                                              <span className="text-gray-500">Phase:</span> {item.configuration_json.phase}
                                            </div>
                                          )}
                                          {item.configuration_json.accessories_mode && (
                                            <div className="col-span-2 text-gray-300">
                                              <span className="text-gray-500">Accessories:</span>{' '}
                                              <Badge className={item.configuration_json.accessories_mode === 'with' ? 'bg-green-600/20 text-green-400' : 'bg-gray-600/20 text-gray-400'}>
                                                {item.configuration_json.accessories_mode === 'with' ? 'With Accessories' : 'Unit Only'}
                                              </Badge>
                                            </div>
                                          )}
                                        </div>
                                        {item.configuration_json.comes_with_list && item.configuration_json.comes_with_list.length > 0 && (
                                          <div className="mt-2 pt-2 border-t border-blue-500/20">
                                            <span className="text-gray-500 text-xs">Includes:</span>
                                            <ul className="text-xs text-gray-300 mt-1 ml-2">
                                              {item.configuration_json.comes_with_list.map((item_included, idx) => (
                                                <li key={idx} className="flex items-center gap-1">
                                                  <span className="text-green-400">✓</span> {item_included}
                                                </li>
                                              ))}
                                            </ul>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-gray-400 text-sm">{item.sku || 'N/A'}</td>
                                <td className="px-4 py-3 text-gray-300 text-sm">{item.packaging || 'Standard'}</td>
                                <td className="px-4 py-3 text-center text-white">{item.quantity}</td>
                                <td className="px-4 py-3 text-right text-gray-300">${item.price.toFixed(2)}</td>
                                <td className="px-4 py-3 text-right text-cyan-400 font-medium">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : selectedOrder.items && Array.isArray(selectedOrder.items) && selectedOrder.items.length > 0 ? (
                        // Fallback to legacy items JSON if order_items not available
                        <table className="w-full">
                          <thead className="bg-slate-600/50">
                            <tr>
                              <th className="text-left text-gray-300 text-sm font-medium px-4 py-3">Product</th>
                              <th className="text-center text-gray-300 text-sm font-medium px-4 py-3">Qty</th>
                              <th className="text-right text-gray-300 text-sm font-medium px-4 py-3">Price</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-600">
                            {selectedOrder.items.map((item: any, index: number) => (
                              <tr key={index} className="hover:bg-slate-600/30">
                                <td className="px-4 py-3 text-white">{item.name || item.product_name || 'Unknown Product'}</td>
                                <td className="px-4 py-3 text-center text-white">{item.quantity || 1}</td>
                                <td className="px-4 py-3 text-right text-cyan-400">${(item.price || 0).toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className="p-4 text-center text-gray-400">
                          No product details available
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Summary */}
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

                  {/* KYC Verification Section */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-medium flex items-center gap-2">
                        <UserCheck className="h-5 w-5 text-amber-400" />
                        KYC Verification
                      </h3>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => sendKycMutation.mutate(selectedOrder.id)}
                          disabled={sendKycMutation.isPending}
                          className="bg-amber-600 hover:bg-amber-700"
                        >
                          Send KYC Request
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => loadKycData(selectedOrder.id)}
                          className="border-cyan-500/50 text-cyan-400"
                        >
                          View KYC
                        </Button>
                      </div>
                    </div>

                    {kycReviewOrder === selectedOrder.id && (
                      <div className="bg-slate-700/50 rounded-lg p-4 space-y-4">
                        {kycLoading ? (
                          <p className="text-gray-400">Loading KYC data...</p>
                        ) : !kycData ? (
                          <p className="text-gray-400">No KYC verification record found for this order.</p>
                        ) : (
                          <>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400">Status:</span>
                              <Badge className={
                                kycData.status === 'approved' ? 'bg-green-600' :
                                kycData.status === 'submitted' ? 'bg-blue-600' :
                                kycData.status === 'rejected' ? 'bg-red-600' : 'bg-yellow-600'
                              }>
                                {kycData.status}
                              </Badge>
                            </div>

                            {kycData.billing_name && (
                              <div>
                                <span className="text-gray-400 text-sm">Billing Name:</span>
                                <p className="text-white">{kycData.billing_name}</p>
                              </div>
                            )}

                            {kycData.billing_address && (
                              <div>
                                <span className="text-gray-400 text-sm">Billing Address:</span>
                                <p className="text-white">
                                  {kycData.billing_address.street}, {kycData.billing_address.city}, {kycData.billing_address.state} {kycData.billing_address.zip}, {kycData.billing_address.country}
                                </p>
                              </div>
                            )}

                            {kycSignedUrls && (
                              <div className="grid grid-cols-2 gap-4">
                                {[
                                  { label: 'Card Front', url: kycSignedUrls.card_front_url },
                                  { label: 'Card Back', url: kycSignedUrls.card_back_url },
                                  { label: 'Government ID', url: kycSignedUrls.id_document_url },
                                  { label: 'Selfie with ID', url: kycSignedUrls.selfie_url },
                                ].map(({ label, url }) => (
                                  <div key={label}>
                                    <span className="text-gray-400 text-xs block mb-1">{label}</span>
                                    {url ? (
                                      <a href={url} target="_blank" rel="noopener noreferrer">
                                        <img src={url} alt={label} className="w-full h-32 object-cover rounded border border-slate-600 hover:border-cyan-500 transition-colors" />
                                      </a>
                                    ) : (
                                      <div className="w-full h-32 bg-slate-600 rounded flex items-center justify-center text-gray-500 text-sm">Not uploaded</div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}

                            {kycData.status === 'submitted' && (
                              <div className="pt-4 border-t border-slate-600 space-y-3">
                                <Textarea
                                  value={kycNotes}
                                  onChange={(e) => setKycNotes(e.target.value)}
                                  placeholder="Admin notes (optional)..."
                                  className="bg-slate-600 border-slate-500 text-white"
                                  rows={2}
                                />
                                <div className="flex gap-2">
                                  <Button onClick={() => handleKycAction('approve', selectedOrder.id)} className="bg-green-600 hover:bg-green-700">
                                    <CheckCircle className="h-4 w-4 mr-1" /> Approve
                                  </Button>
                                  <Button onClick={() => handleKycAction('reject', selectedOrder.id)} variant="destructive">
                                    <XCircle className="h-4 w-4 mr-1" /> Reject
                                  </Button>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}
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

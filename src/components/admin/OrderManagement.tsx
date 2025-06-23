
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Package, Mail, CheckCircle, XCircle, Clock, Truck, Eye, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'processed' | 'waiting_review' | 'declined';
  total_amount: number;
  shipping_cost: number;
  tax_amount: number;
  shipping_address: any;
  payment_method?: string;
  items: any[];
  created_at: string;
  updated_at: string;
}

const OrderManagement = () => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch orders with items
  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin-orders', filterStatus],
    queryFn: async () => {
      let query = supabase
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
        .order('created_at', { ascending: false });
      
      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return data?.map(order => ({
        ...order,
        status: order.status as Order['status'],
        items: order.order_items || []
      })) as Order[];
    }
  });

  // Update order status mutation
  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Order['status'] }) => {
      const { data, error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast({ 
        title: 'Order status updated', 
        description: `Order ${data.order_number} status changed to ${data.status}` 
      });
    },
    onError: (error) => {
      toast({ 
        title: 'Error updating order', 
        description: error.message, 
        variant: 'destructive' 
      });
    }
  });

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'processing':
        return <Package className="h-4 w-4" />;
      case 'processed':
        return <CheckCircle className="h-4 w-4" />;
      case 'waiting_review':
        return <Eye className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <Package className="h-4 w-4" />;
      case 'declined':
        return <XCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'processed':
        return 'bg-green-100 text-green-800';
      case 'waiting_review':
        return 'bg-orange-100 text-orange-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    updateOrderStatusMutation.mutate({ id: orderId, status: newStatus });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-white">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Order Management</h1>
        <p className="text-gray-300">Track and manage customer orders</p>
      </div>

      <Card className="bg-slate-800/50 border-cyan-500/20 mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Orders</CardTitle>
              <CardDescription className="text-gray-300">
                Manage customer orders and update their status
              </CardDescription>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40 bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="processed">Processed</SelectItem>
                  <SelectItem value="waiting_review">Waiting Review</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="declined">Declined</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orders?.map((order) => (
              <div key={order.id} className="border border-slate-600 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-white font-medium">Order #{order.order_number}</h3>
                      <Badge className={getStatusColor(order.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(order.status)}
                          <span className="capitalize">{order.status.replace('_', ' ')}</span>
                        </div>
                      </Badge>
                    </div>
                    <p className="text-gray-300">{order.customer_name}</p>
                    <p className="text-gray-400 text-sm">{order.customer_email}</p>
                    <p className="text-cyan-400 font-medium mt-2">
                      ${order.total_amount} 
                      {order.shipping_cost > 0 && <span className="text-gray-400 text-sm"> (+ ${order.shipping_cost} shipping)</span>}
                    </p>
                    {order.payment_method && (
                      <p className="text-gray-400 text-sm">Payment: {order.payment_method}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-sm">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {new Date(order.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="text-white text-sm font-medium mb-2">Items</h4>
                    <div className="bg-slate-700/50 rounded p-3">
                      {order.items && order.items.length > 0 ? (
                        <ul className="text-gray-300 text-sm space-y-1">
                          {order.items.map((item: any, index: number) => (
                            <li key={index}>
                              {item.product_name} - Qty: {item.quantity} @ ${item.price}
                              {item.packaging && <span className="text-gray-400"> ({item.packaging})</span>}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-400 text-sm">No items listed</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-white text-sm font-medium mb-2">Update Status</h4>
                    <div className="flex flex-wrap gap-2">
                      {order.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(order.id, 'processing')}
                            className="bg-blue-500 hover:bg-blue-600"
                          >
                            <Package className="h-4 w-4 mr-1" />
                            Process
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(order.id, 'waiting_review')}
                            className="bg-orange-500 hover:bg-orange-600"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(order.id, 'declined')}
                            className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Decline
                          </Button>
                        </>
                      )}
                      
                      {order.status === 'processing' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(order.id, 'processed')}
                            className="bg-green-500 hover:bg-green-600"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Mark Processed
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(order.id, 'shipped')}
                            className="bg-purple-500 hover:bg-purple-600"
                          >
                            <Truck className="h-4 w-4 mr-1" />
                            Ship
                          </Button>
                        </>
                      )}

                      {order.status === 'waiting_review' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(order.id, 'processing')}
                            className="bg-blue-500 hover:bg-blue-600"
                          >
                            <Package className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(order.id, 'declined')}
                            className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Decline
                          </Button>
                        </>
                      )}
                      
                      {order.status === 'processed' && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(order.id, 'shipped')}
                          className="bg-purple-500 hover:bg-purple-600"
                        >
                          <Truck className="h-4 w-4 mr-1" />
                          Ship
                        </Button>
                      )}
                      
                      {order.status === 'shipped' && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(order.id, 'delivered')}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          <Package className="h-4 w-4 mr-1" />
                          Delivered
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
                      >
                        <Mail className="h-4 w-4 mr-1" />
                        Email
                      </Button>
                    </div>
                  </div>
                </div>

                {order.shipping_address && (
                  <div className="mt-4 p-3 bg-slate-700/50 rounded">
                    <h4 className="text-white text-sm font-medium mb-2">Shipping Address</h4>
                    <div className="text-gray-300 text-sm">
                      <p>{order.shipping_address.street}</p>
                      <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zipCode}</p>
                      <p>{order.shipping_address.country}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {!orders?.length && (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">
                  {filterStatus === 'all' ? 'No orders found.' : `No ${filterStatus.replace('_', ' ')} orders found.`}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderManagement;

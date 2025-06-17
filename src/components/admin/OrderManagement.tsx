
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Edit, Package, Truck } from 'lucide-react';
import { useOrders, Order } from '../../contexts/OrdersContext';
import { useToast } from '../../hooks/use-toast';

const OrderManagement = () => {
  const { orders, updateOrderStatus, updateTrackingNumber, addOrderNotes } = useOrders();
  const { toast } = useToast();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusUpdate = (orderId: string, newStatus: Order['status']) => {
    updateOrderStatus(orderId, newStatus);
    toast({
      title: "Order status updated",
      description: `Order #${orderId} status changed to ${newStatus}`,
    });
  };

  const handleTrackingUpdate = () => {
    if (selectedOrder && trackingNumber) {
      updateTrackingNumber(selectedOrder.id, trackingNumber);
      toast({
        title: "Tracking number added",
        description: `Tracking number ${trackingNumber} added to order #${selectedOrder.id}`,
      });
      setTrackingNumber('');
    }
  };

  const handleNotesUpdate = () => {
    if (selectedOrder && orderNotes) {
      addOrderNotes(selectedOrder.id, orderNotes);
      toast({
        title: "Order notes updated",
        description: `Notes added to order #${selectedOrder.id}`,
      });
      setOrderNotes('');
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-cyan-400 flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Order Management ({orders.length} orders)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-600">
                  <TableHead className="text-gray-300">Order ID</TableHead>
                  <TableHead className="text-gray-300">Customer</TableHead>
                  <TableHead className="text-gray-300">Company</TableHead>
                  <TableHead className="text-gray-300">Date</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Total</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} className="border-slate-600">
                    <TableCell className="text-white font-mono">#{order.id}</TableCell>
                    <TableCell className="text-gray-300">{order.customerName}</TableCell>
                    <TableCell className="text-gray-300">{order.companyName}</TableCell>
                    <TableCell className="text-gray-300">{order.orderDate}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-white font-semibold">${order.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="text-blue-400 hover:text-blue-300"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl bg-slate-800 border-slate-600">
                            <DialogHeader>
                              <DialogTitle className="text-cyan-400">Order Details - #{order.id}</DialogTitle>
                            </DialogHeader>
                            <div className="grid md:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-semibold text-white mb-2">Customer Information</h4>
                                  <div className="space-y-1 text-sm text-gray-300">
                                    <p><span className="font-medium">Name:</span> {order.customerName}</p>
                                    <p><span className="font-medium">Company:</span> {order.companyName}</p>
                                    <p><span className="font-medium">Email:</span> {order.email}</p>
                                    <p><span className="font-medium">Phone:</span> {order.phone}</p>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-white mb-2">Shipping Address</h4>
                                  <p className="text-sm text-gray-300">{order.shippingAddress}</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-white mb-2">Order Items</h4>
                                  <div className="space-y-2">
                                    {order.items.map((item, index) => (
                                      <div key={index} className="bg-slate-700 p-3 rounded">
                                        <div className="flex justify-between items-start">
                                          <div>
                                            <p className="font-medium text-white">{item.productName}</p>
                                            <p className="text-sm text-gray-400">{item.packaging}</p>
                                            <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                                          </div>
                                          <p className="font-semibold text-cyan-400">${(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-4">
                                <div>
                                  <Label className="text-gray-300">Update Status</Label>
                                  <Select onValueChange={(value) => handleStatusUpdate(order.id, value as Order['status'])}>
                                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                      <SelectValue placeholder={order.status} />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-700 border-slate-600">
                                      <SelectItem value="pending">Pending</SelectItem>
                                      <SelectItem value="processing">Processing</SelectItem>
                                      <SelectItem value="shipped">Shipped</SelectItem>
                                      <SelectItem value="delivered">Delivered</SelectItem>
                                      <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label className="text-gray-300">Tracking Number</Label>
                                  <div className="flex gap-2">
                                    <Input
                                      value={trackingNumber}
                                      onChange={(e) => setTrackingNumber(e.target.value)}
                                      placeholder={order.trackingNumber || "Enter tracking number"}
                                      className="bg-slate-700 border-slate-600 text-white"
                                    />
                                    <Button 
                                      onClick={handleTrackingUpdate}
                                      size="sm"
                                      className="bg-blue-600 hover:bg-blue-700"
                                    >
                                      <Truck className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  {order.trackingNumber && (
                                    <p className="text-sm text-green-400 mt-1">
                                      Current: {order.trackingNumber}
                                    </p>
                                  )}
                                </div>
                                <div>
                                  <Label className="text-gray-300">Order Notes</Label>
                                  <Textarea
                                    value={orderNotes}
                                    onChange={(e) => setOrderNotes(e.target.value)}
                                    placeholder={order.notes || "Add notes about this order..."}
                                    className="bg-slate-700 border-slate-600 text-white"
                                    rows={3}
                                  />
                                  <Button 
                                    onClick={handleNotesUpdate}
                                    size="sm"
                                    className="mt-2 bg-green-600 hover:bg-green-700"
                                  >
                                    Update Notes
                                  </Button>
                                  {order.notes && (
                                    <div className="mt-2 p-2 bg-slate-700 rounded">
                                      <p className="text-sm text-gray-300">{order.notes}</p>
                                    </div>
                                  )}
                                </div>
                                <div className="pt-4 border-t border-slate-600">
                                  <div className="flex justify-between items-center">
                                    <span className="text-gray-300">Total Amount:</span>
                                    <span className="text-xl font-bold text-cyan-400">${order.totalAmount.toFixed(2)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderManagement;

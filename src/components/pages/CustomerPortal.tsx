
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Clock, CheckCircle, Package, Truck, User, Mail, Phone, Calendar } from 'lucide-react';
import { useOrders } from '../../contexts/OrdersContext';
import { useAuth } from '../../contexts/AuthContext';

const CustomerPortal = () => {
  const { orders, loading, error } = useOrders();
  const { user } = useAuth();

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
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Customer Portal</h1>
          <p className="text-gray-600 mb-8">Please log in to view your orders and account information.</p>
          <Button>Log In</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Portal</h1>
          <p className="text-gray-600">Manage your orders and account information</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Account Information */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    Member since {new Date(user.created_at || '').toLocaleDateString()}
                  </span>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-2">Total Orders: {orders.length}</p>
                  <p className="text-sm text-gray-600">
                    Total Spent: ${orders.reduce((sum, order) => sum + order.total_amount, 0).toFixed(2)}
                  </p>
                </div>
                <Button variant="outline" className="w-full">
                  Update Account
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Orders History */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Order History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-600 mt-2">Loading orders...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <p className="text-red-600">Error loading orders: {error}</p>
                    <Button variant="outline" className="mt-4">
                      Retry
                    </Button>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No orders found</p>
                    <Button>
                      Start Shopping
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">{order.order_number}</h3>
                            <p className="text-sm text-gray-600">
                              Placed on {new Date(order.created_at).toLocaleDateString()}
                            </p>
                            <p className="text-lg font-bold text-green-600 mt-1">
                              ${order.total_amount.toFixed(2)}
                            </p>
                          </div>
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1 capitalize">{order.status}</span>
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <h4 className="font-medium text-gray-700">Items:</h4>
                          {order.items.map((item, index) => (
                            <div key={index} className="text-sm text-gray-600 ml-4 flex justify-between">
                              <span>• {item.quantity}x {item.product_name}</span>
                              <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>

                        {order.tracking_number && (
                          <div className="bg-blue-50 p-3 rounded mb-4">
                            <p className="text-sm font-medium text-blue-900">
                              Tracking: {order.tracking_number}
                            </p>
                          </div>
                        )}
                        
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          {order.status === 'delivered' && (
                            <Button variant="outline" size="sm">
                              Reorder
                            </Button>
                          )}
                          {(order.status === 'shipped' || order.status === 'delivered') && (
                            <Button variant="outline" size="sm">
                              Download Invoice
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerPortal;

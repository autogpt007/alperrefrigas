
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  Package, 
  Truck, 
  User, 
  Mail, 
  Calendar,
  Eye,
  Download,
  ShoppingCart,
  AlertCircle,
  X,
  Settings,
  Phone,
  MapPin
} from 'lucide-react';
import { useOrders } from '../../contexts/OrdersContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const CustomerPortal = () => {
  const { orders, loading, error, fetchOrders } = useOrders();
  const { user, profile, logout } = useAuth();
  const { toast } = useToast();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: profile?.full_name || '',
    email: profile?.email || '',
    phone: '',
    company: '',
    address: ''
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'processing':
        return <Package className="h-4 w-4" />;
      case 'processed':
        return <CheckCircle className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <X className="h-4 w-4" />;
      case 'waiting_review':
        return <AlertCircle className="h-4 w-4" />;
      case 'declined':
        return <X className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'waiting_review':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'declined':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleProfileUpdate = async () => {
    try {
      // In a real app, this would update the profile in the database
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully."
      });
      setIsProfileEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleReorder = (order: any) => {
    toast({
      title: "Reorder Initiated",
      description: `Items from order ${order.order_number} have been added to your cart.`
    });
  };

  const handleDownloadInvoice = (order: any) => {
    toast({
      title: "Download Started",
      description: `Invoice for order ${order.order_number} is being downloaded.`
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Customer Portal</h1>
            <p className="text-gray-600 mb-8">Please log in to view your orders and account information.</p>
          </div>
          <Card className="p-6">
            <Button size="lg" className="w-full mb-4">
              Sign In to Your Account
            </Button>
            <p className="text-sm text-gray-500">
              Don't have an account? <span className="text-blue-600 cursor-pointer hover:underline">Create one here</span>
            </p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <>
    <SEOComponent
      title="Customer Portal"
      description="Access your orders, quotes, and account settings at Alper Refrigerants."
      robotsContent="noindex, nofollow"
      canonicalUrl="/customer-portal"
    />
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Portal</h1>
              <p className="text-gray-600">Welcome back, {profile?.full_name || user.email}!</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/products'}
              className="flex items-center gap-2"
            >
              <ShoppingCart className="h-4 w-4" />
              Continue Shopping
            </Button>
          </div>
        </div>

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Account
            </TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Order History
                  </CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={fetchOrders}
                    disabled={loading}
                  >
                    {loading ? 'Refreshing...' : 'Refresh'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your orders...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-12">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600 mb-4">Error loading orders: {error}</p>
                    <Button variant="outline" onClick={fetchOrders}>
                      Try Again
                    </Button>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
                    <Button onClick={() => window.location.href = '/products'}>
                      Browse Products
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-6 hover:shadow-md transition-all duration-200">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{order.order_number}</h3>
                              <Badge className={`${getStatusColor(order.status)} border`}>
                                {getStatusIcon(order.status)}
                                <span className="ml-1 capitalize">{order.status.replace('_', ' ')}</span>
                              </Badge>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                Placed on {formatDate(order.created_at)}
                              </span>
                              <span className="hidden sm:inline">•</span>
                              <span>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                            </div>
                          </div>
                          <div className="text-right mt-3 lg:mt-0">
                            <p className="text-2xl font-bold text-green-600">
                              {formatCurrency(order.total_amount)}
                            </p>
                            {order.shipping_cost > 0 && (
                              <p className="text-sm text-gray-500">
                                +{formatCurrency(order.shipping_cost)} shipping
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Order Items Preview */}
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-700 mb-2">Items:</h4>
                          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                            {order.items.slice(0, 3).map((item, index) => (
                              <div key={index} className="flex justify-between items-center text-sm">
                                <span className="flex-1">
                                  {item.quantity}x {item.product_name}
                                  {item.packaging && <span className="text-gray-500"> ({item.packaging})</span>}
                                </span>
                                <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                              </div>
                            ))}
                            {order.items.length > 3 && (
                              <p className="text-xs text-gray-500 pt-1">
                                +{order.items.length - 3} more item{order.items.length - 3 !== 1 ? 's' : ''}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Shipping and Tracking */}
                        {order.status === 'shipped' && order.tracking_number && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Truck className="h-5 w-5 text-blue-600" />
                              <span className="font-medium text-blue-900">Package Shipped</span>
                            </div>
                            <p className="text-sm text-blue-800">
                              <strong>Tracking Number:</strong> {order.tracking_number}
                            </p>
                            <Button size="sm" variant="outline" className="mt-2">
                              Track Package
                            </Button>
                          </div>
                        )}

                        {/* Order Actions */}
                        <div className="flex flex-wrap gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex items-center gap-1"
                                onClick={() => setSelectedOrder(order)}
                              >
                                <Eye className="h-4 w-4" />
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Order Details - {selectedOrder?.order_number}</DialogTitle>
                              </DialogHeader>
                              {selectedOrder && (
                                <div className="space-y-6">
                                  {/* Order Status */}
                                  <div className="flex items-center justify-between">
                                    <Badge className={`${getStatusColor(selectedOrder.status)} border px-3 py-1`}>
                                      {getStatusIcon(selectedOrder.status)}
                                      <span className="ml-2 capitalize">{selectedOrder.status.replace('_', ' ')}</span>
                                    </Badge>
                                    <span className="text-sm text-gray-500">
                                      {formatDate(selectedOrder.created_at)}
                                    </span>
                                  </div>

                                  <Separator />

                                  {/* Items */}
                                  <div>
                                    <h3 className="font-semibold mb-3">Order Items</h3>
                                    <div className="space-y-3">
                                      {selectedOrder.items.map((item: any, index: number) => (
                                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                          <div className="flex-1">
                                            <p className="font-medium">{item.product_name}</p>
                                            {item.packaging && (
                                              <p className="text-sm text-gray-600">Packaging: {item.packaging}</p>
                                            )}
                                            {item.sku && (
                                              <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                                            )}
                                          </div>
                                          <div className="text-right">
                                            <p className="font-medium">Qty: {item.quantity}</p>
                                            <p className="text-sm text-gray-600">{formatCurrency(item.price)} each</p>
                                            <p className="font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  <Separator />

                                  {/* Order Summary */}
                                  <div className="space-y-2">
                                    <h3 className="font-semibold">Order Summary</h3>
                                    <div className="space-y-1">
                                      <div className="flex justify-between">
                                        <span>Subtotal:</span>
                                        <span>{formatCurrency(selectedOrder.total_amount - selectedOrder.shipping_cost - selectedOrder.tax_amount)}</span>
                                      </div>
                                      {selectedOrder.shipping_cost > 0 && (
                                        <div className="flex justify-between">
                                          <span>Shipping:</span>
                                          <span>{formatCurrency(selectedOrder.shipping_cost)}</span>
                                        </div>
                                      )}
                                      {selectedOrder.tax_amount > 0 && (
                                        <div className="flex justify-between">
                                          <span>Tax:</span>
                                          <span>{formatCurrency(selectedOrder.tax_amount)}</span>
                                        </div>
                                      )}
                                      <Separator />
                                      <div className="flex justify-between font-semibold text-lg">
                                        <span>Total:</span>
                                        <span>{formatCurrency(selectedOrder.total_amount)}</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Shipping Address */}
                                  {selectedOrder.shipping_address && (
                                    <>
                                      <Separator />
                                      <div>
                                        <h3 className="font-semibold mb-2">Shipping Address</h3>
                                        <div className="p-3 bg-gray-50 rounded-lg text-sm">
                                          <p>{selectedOrder.shipping_address.name}</p>
                                          <p>{selectedOrder.shipping_address.street}</p>
                                          <p>{selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.zipCode}</p>
                                          {selectedOrder.shipping_address.country && (
                                            <p>{selectedOrder.shipping_address.country}</p>
                                          )}
                                        </div>
                                      </div>
                                    </>
                                  )}

                                  {/* Notes */}
                                  {selectedOrder.notes && (
                                    <>
                                      <Separator />
                                      <div>
                                        <h3 className="font-semibold mb-2">Order Notes</h3>
                                        <p className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                                          {selectedOrder.notes}
                                        </p>
                                      </div>
                                    </>
                                  )}
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>

                          {order.status === 'delivered' && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex items-center gap-1"
                              onClick={() => handleReorder(order)}
                            >
                              <ShoppingCart className="h-4 w-4" />
                              Reorder
                            </Button>
                          )}

                          {(['shipped', 'delivered'].includes(order.status)) && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex items-center gap-1"
                              onClick={() => handleDownloadInvoice(order)}
                            >
                              <Download className="h-4 w-4" />
                              Invoice
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Statistics */}
            {orders.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{orders.length}</p>
                    <p className="text-sm text-gray-600">Total Orders</p>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(orders.reduce((sum, order) => sum + order.total_amount, 0))}
                    </p>
                    <p className="text-sm text-gray-600">Total Spent</p>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {orders.filter(o => o.status === 'delivered').length}
                    </p>
                    <p className="text-sm text-gray-600">Completed</p>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">
                      {orders.filter(o => ['pending', 'processing', 'shipped'].includes(o.status)).length}
                    </p>
                    <p className="text-sm text-gray-600">In Progress</p>
                  </div>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Information
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsProfileEditing(!isProfileEditing)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    {isProfileEditing ? 'Cancel' : 'Edit'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <Input 
                      value={profileData.full_name} 
                      onChange={(e) => setProfileData({...profileData, full_name: e.target.value})}
                      disabled={!isProfileEditing} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input 
                      value={profileData.email} 
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      disabled={!isProfileEditing} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <Input 
                      value={profileData.phone} 
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      disabled={!isProfileEditing} 
                      placeholder="Not set"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Company</label>
                    <Input 
                      value={profileData.company} 
                      onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                      disabled={!isProfileEditing} 
                      placeholder="Not set"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <Textarea 
                    value={profileData.address} 
                    onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                    disabled={!isProfileEditing} 
                    placeholder="Not set"
                    rows={3}
                  />
                </div>
                {isProfileEditing && (
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleProfileUpdate}>Save Changes</Button>
                    <Button variant="outline" onClick={() => setIsProfileEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Account Type:</span>
                    <Badge variant="secondary">Customer</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Member Since:</span>
                    <span>{formatDate(user.created_at || new Date().toISOString())}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Email Verified:</span>
                    <Badge className="bg-green-100 text-green-800">
                      Verified
                    </Badge>
                  </div>
                  <Separator />
                  <Button
                    variant="destructive"
                    onClick={logout}
                    className="w-full"
                  >
                    Sign Out
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => window.location.href = '/products'}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Browse Products
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => window.location.href = '/support'}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => window.location.href = '/rfq'}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Request Quote
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CustomerPortal;

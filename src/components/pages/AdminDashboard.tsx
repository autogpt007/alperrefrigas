
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, LogOut, Package, FileText, Globe, Settings, ShoppingCart } from 'lucide-react';
import { useProducts } from '../../contexts/ProductsContext';
import { useOrders } from '../../contexts/OrdersContext';
import ProductForm from '../admin/ProductForm';
import OrderManagement from '../admin/OrderManagement';
import ProtectedRoute from '../ProtectedRoute';

const AdminDashboard = () => {
  const { products, deleteProduct } = useProducts();
  const { orders } = useOrders();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  const handleLogout = () => {
    window.location.reload();
  };

  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const processingOrders = orders.filter(order => order.status === 'processing').length;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Header */}
        <div className="bg-slate-800/50 border-b border-cyan-500/20 px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-gray-300">Frigid Flow Management System</p>
            </div>
            <Button onClick={handleLogout} variant="ghost" className="text-white hover:text-red-400">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-slate-800/50 border border-cyan-500/20">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                <Settings className="h-4 w-4 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="orders" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Orders ({orders.length})
              </TabsTrigger>
              <TabsTrigger value="products" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                <Package className="h-4 w-4 mr-2" />
                Products
              </TabsTrigger>
              <TabsTrigger value="content" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                <Globe className="h-4 w-4 mr-2" />
                Website
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-cyan-400 text-sm font-medium">Total Products</p>
                        <p className="text-3xl font-bold text-white">{products.length}</p>
                      </div>
                      <Package className="h-8 w-8 text-cyan-400" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-400 text-sm font-medium">Total Orders</p>
                        <p className="text-3xl font-bold text-white">{orders.length}</p>
                      </div>
                      <ShoppingCart className="h-8 w-8 text-green-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-yellow-400 text-sm font-medium">Pending Orders</p>
                        <p className="text-3xl font-bold text-white">{pendingOrders}</p>
                      </div>
                      <FileText className="h-8 w-8 text-yellow-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-400 text-sm font-medium">Processing</p>
                        <p className="text-3xl font-bold text-white">{processingOrders}</p>
                      </div>
                      <Settings className="h-8 w-8 text-purple-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Orders */}
              <Card className="bg-slate-800/50 border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-cyan-400">Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex justify-between items-center p-3 bg-slate-700/50 rounded">
                        <div>
                          <p className="text-white font-medium">#{order.id} - {order.customerName}</p>
                          <p className="text-gray-400 text-sm">{order.companyName}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'shipped' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }>
                            {order.status}
                          </Badge>
                          <p className="text-cyan-400 font-semibold mt-1">${order.totalAmount.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders" className="space-y-6">
              <OrderManagement />
            </TabsContent>

            <TabsContent value="products" className="space-y-6">
              <ProductForm />

              {/* Products List */}
              <Card className="bg-slate-800/50 border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-cyan-400">Existing Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <Card key={product.id} className="bg-slate-700/50 border-slate-600">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="font-semibold text-white">{product.name}</h3>
                            <div className="flex gap-2">
                              <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => handleDeleteProduct(product.id)}
                                className="text-red-400 hover:text-red-300"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-gray-300 text-sm mb-2">{product.sku}</p>
                          <p className="text-cyan-400 font-bold">${product.price.toFixed(2)}</p>
                          <div className="flex gap-2 mt-2 flex-wrap">
                            <Badge variant={product.epaApproved ? "default" : "secondary"}>
                              {product.epaApproved ? "EPA Approved" : "Not EPA Approved"}
                            </Badge>
                            <Badge variant="outline" className="border-cyan-500/50 text-cyan-400">
                              {product.category}
                            </Badge>
                          </div>
                          <p className="text-gray-400 text-sm mt-2">Stock: {product.stock}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content" className="space-y-6">
              <Card className="bg-slate-800/50 border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-cyan-400">Website Content Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">Content management features coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminDashboard;

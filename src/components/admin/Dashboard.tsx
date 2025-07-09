
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, FileText, ShoppingCart, TrendingUp, Settings, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProducts } from '@/contexts/ProductsContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { products } = useProducts();

  // If not admin, don't render anything (should be handled by layout)
  if (!user || !isAdmin) {
    return null;
  }

  // Calculate stats from products context
  const stats = {
    totalProducts: products.length,
    totalPosts: 0, // TODO: Implement blog posts context
    totalOrders: 0, // TODO: Implement orders from context or supabase
    pendingOrders: 0,
    totalRevenue: 0,
    recentOrders: 0,
    inStockProducts: products.filter(p => p.availability === 'in_stock').length,
    outOfStockProducts: products.filter(p => p.availability === 'out_of_stock').length,
    epaApprovedProducts: products.filter(p => p.epaApproved).length,
    lowStockProducts: products.filter(p => (p.stock || 0) < 10).length,
  };

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/20',
      iconColor: 'text-cyan-400',
      onClick: () => navigate('/admin/products'),
    },
    {
      title: 'In Stock',
      value: stats.inStockProducts,
      icon: Package,
      color: 'from-green-500/20 to-emerald-500/20 border-green-500/20',
      iconColor: 'text-green-400',
      onClick: () => navigate('/admin/products'),
    },
    {
      title: 'Out of Stock',
      value: stats.outOfStockProducts,
      icon: Package,
      color: 'from-red-500/20 to-pink-500/20 border-red-500/20',
      iconColor: 'text-red-400',
      onClick: () => navigate('/admin/products'),
    },
    {
      title: 'EPA Approved',
      value: stats.epaApprovedProducts,
      icon: Package,
      color: 'from-emerald-500/20 to-green-500/20 border-emerald-500/20',
      iconColor: 'text-emerald-400',
      onClick: () => navigate('/admin/products'),
    },
    {
      title: 'Low Stock Alert',
      value: stats.lowStockProducts,
      icon: TrendingUp,
      color: 'from-yellow-500/20 to-orange-500/20 border-yellow-500/20',
      iconColor: 'text-yellow-400',
      onClick: () => navigate('/admin/products'),
    },
    {
      title: 'Blog Posts',
      value: stats.totalPosts,
      icon: FileText,
      color: 'from-purple-500/20 to-pink-500/20 border-purple-500/20',
      iconColor: 'text-purple-400',
      onClick: () => navigate('/admin/blog'),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-300">Welcome to your comprehensive admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <Card 
            key={stat.title} 
            className={`bg-gradient-to-br ${stat.color} cursor-pointer hover:scale-105 transition-transform`}
            onClick={stat.onClick}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300">{stat.title}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.iconColor}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Product Categories Overview */}
      <Card className="bg-slate-800/50 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-cyan-400">Product Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {['HFC', 'HFO', 'Natural', 'HCFC', 'CFC'].map((category) => {
              const count = products.filter(p => p.category === category).length;
              return (
                <Card 
                  key={category}
                  className="bg-slate-700/50 border-slate-600 hover:border-cyan-500/50 transition-colors cursor-pointer"
                  onClick={() => navigate('/admin/products')}
                >
                  <CardContent className="p-4 text-center">
                    <h3 className="font-semibold text-white">{category}</h3>
                    <p className="text-2xl font-bold text-cyan-400">{count}</p>
                    <p className="text-sm text-gray-400">products</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-slate-800/50 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-cyan-400">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card 
              className="bg-slate-700/50 border-slate-600 hover:border-cyan-500/50 transition-colors cursor-pointer"
              onClick={() => navigate('/admin/products')}
            >
              <CardContent className="p-4 text-center">
                <Package className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white">Manage Products</h3>
                <p className="text-sm text-gray-400">Add, edit, or remove products</p>
              </CardContent>
            </Card>
            <Card 
              className="bg-slate-700/50 border-slate-600 hover:border-green-500/50 transition-colors cursor-pointer"
              onClick={() => navigate('/admin/blog')}
            >
              <CardContent className="p-4 text-center">
                <FileText className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white">Manage Blog</h3>
                <p className="text-sm text-gray-400">Create and edit blog posts</p>
              </CardContent>
            </Card>
            <Card 
              className="bg-slate-700/50 border-slate-600 hover:border-purple-500/50 transition-colors cursor-pointer"
              onClick={() => navigate('/admin/orders')}
            >
              <CardContent className="p-4 text-center">
                <ShoppingCart className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white">Manage Orders</h3>
                <p className="text-sm text-gray-400">Process customer orders</p>
              </CardContent>
            </Card>
            <Card 
              className="bg-slate-700/50 border-slate-600 hover:border-orange-500/50 transition-colors cursor-pointer"
              onClick={() => navigate('/admin/content')}
            >
              <CardContent className="p-4 text-center">
                <Settings className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white">Site Content</h3>
                <p className="text-sm text-gray-400">Manage website content</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-slate-800/50 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-cyan-400">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {products.slice(0, 5).map((product) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-slate-600 rounded-lg flex items-center justify-center">
                    <Package className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{product.name}</p>
                    <p className="text-gray-400 text-sm">SKU: {product.sku}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-cyan-400 font-medium">${product.price}</p>
                  <p className="text-gray-400 text-sm">Stock: {product.stock || 0}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;

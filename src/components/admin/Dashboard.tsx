
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, FileText, ShoppingCart, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Stats {
  totalProducts: number;
  totalPosts: number;
  totalOrders: number;
  pendingOrders: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalPosts: 0,
    totalOrders: 0,
    pendingOrders: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [products, posts, orders] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact' }),
        supabase.from('blog_posts').select('id', { count: 'exact' }),
        supabase.from('orders').select('id, status', { count: 'exact' }),
      ]);

      const pendingCount = orders.data?.filter(order => order.status === 'pending').length || 0;

      setStats({
        totalProducts: products.count || 0,
        totalPosts: posts.count || 0,
        totalOrders: orders.count || 0,
        pendingOrders: pendingCount,
      });
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/20',
      iconColor: 'text-cyan-400',
    },
    {
      title: 'Blog Posts',
      value: stats.totalPosts,
      icon: FileText,
      color: 'from-green-500/20 to-emerald-500/20 border-green-500/20',
      iconColor: 'text-green-400',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'from-purple-500/20 to-pink-500/20 border-purple-500/20',
      iconColor: 'text-purple-400',
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: TrendingUp,
      color: 'from-yellow-500/20 to-orange-500/20 border-yellow-500/20',
      iconColor: 'text-yellow-400',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-300">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title} className={`bg-gradient-to-br ${stat.color}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300">{stat.title}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.iconColor}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="bg-slate-800/50 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-cyan-400">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-slate-700/50 border-slate-600 hover:border-cyan-500/50 transition-colors cursor-pointer">
              <CardContent className="p-4 text-center">
                <Package className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white">Add Product</h3>
                <p className="text-sm text-gray-400">Create a new product</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-700/50 border-slate-600 hover:border-green-500/50 transition-colors cursor-pointer">
              <CardContent className="p-4 text-center">
                <FileText className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white">Write Post</h3>
                <p className="text-sm text-gray-400">Create a new blog post</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-700/50 border-slate-600 hover:border-purple-500/50 transition-colors cursor-pointer">
              <CardContent className="p-4 text-center">
                <ShoppingCart className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white">View Orders</h3>
                <p className="text-sm text-gray-400">Manage customer orders</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;

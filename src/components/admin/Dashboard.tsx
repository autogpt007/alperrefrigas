
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, FileText, ShoppingCart, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log('Fetching dashboard stats...');
        
        const [products, posts, orders] = await Promise.all([
          supabase.from('products').select('id', { count: 'exact', head: true }),
          supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
          supabase.from('orders').select('id, status', { count: 'exact' }),
        ]);

        console.log('Products query result:', products);
        console.log('Posts query result:', posts);
        console.log('Orders query result:', orders);

        if (products.error) throw products.error;
        if (posts.error) throw posts.error;
        if (orders.error) throw orders.error;

        const pendingCount = orders.data?.filter(order => order.status === 'pending').length || 0;

        const newStats = {
          totalProducts: products.count || 0,
          totalPosts: posts.count || 0,
          totalOrders: orders.count || 0,
          pendingOrders: pendingCount,
        };

        console.log('Dashboard stats:', newStats);
        setStats(newStats);
      } catch (err: any) {
        console.error('Error fetching dashboard stats:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
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
      onClick: () => navigate('/admin/products'),
    },
    {
      title: 'Blog Posts',
      value: stats.totalPosts,
      icon: FileText,
      color: 'from-green-500/20 to-emerald-500/20 border-green-500/20',
      iconColor: 'text-green-400',
      onClick: () => navigate('/admin/posts'),
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'from-purple-500/20 to-pink-500/20 border-purple-500/20',
      iconColor: 'text-purple-400',
      onClick: () => navigate('/admin/orders'),
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: TrendingUp,
      color: 'from-yellow-500/20 to-orange-500/20 border-yellow-500/20',
      iconColor: 'text-yellow-400',
      onClick: () => navigate('/admin/orders'),
    },
  ];

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-300">Loading dashboard...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-slate-800/50 border-slate-600 animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-slate-700 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-red-400">Error loading dashboard: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-300">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              onClick={() => navigate('/admin/posts')}
            >
              <CardContent className="p-4 text-center">
                <FileText className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white">Manage Posts</h3>
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;

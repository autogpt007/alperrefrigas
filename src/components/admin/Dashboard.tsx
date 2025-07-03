
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, FileText, ShoppingCart, TrendingUp, Loader2, Settings, Users, BarChart3 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface Stats {
  totalProducts: number;
  totalPosts: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  recentOrders: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalPosts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    recentOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      console.log('Dashboard - fetchStats called, user:', user, 'isAdmin:', isAdmin);
      
      if (!user || !isAdmin) {
        console.log('Dashboard - No user or not admin, skipping stats fetch');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching dashboard stats...');
        
        const [products, posts, orders] = await Promise.all([
          supabase.from('products').select('id', { count: 'exact', head: true }),
          supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
          supabase.from('orders').select('id, status, total_amount, created_at', { count: 'exact' }),
        ]);

        console.log('Products query result:', products);
        console.log('Posts query result:', posts);
        console.log('Orders query result:', orders);

        if (products.error) throw products.error;
        if (posts.error) throw posts.error;
        if (orders.error) throw orders.error;

        const pendingCount = orders.data?.filter(order => order.status === 'pending').length || 0;
        const totalRevenue = orders.data?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
        const recentOrders = orders.data?.filter(order => {
          const orderDate = new Date(order.created_at);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return orderDate >= weekAgo;
        }).length || 0;

        const newStats = {
          totalProducts: products.count || 0,
          totalPosts: posts.count || 0,
          totalOrders: orders.count || 0,
          pendingOrders: pendingCount,
          totalRevenue,
          recentOrders,
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
  }, [user, isAdmin]);

  // If not admin, don't render anything (should be handled by layout)
  if (!user || !isAdmin) {
    return null;
  }

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
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: BarChart3,
      color: 'from-emerald-500/20 to-green-500/20 border-emerald-500/20',
      iconColor: 'text-emerald-400',
      onClick: () => navigate('/admin/orders'),
    },
    {
      title: 'Recent Orders',
      value: `${stats.recentOrders} this week`,
      icon: TrendingUp,
      color: 'from-indigo-500/20 to-purple-500/20 border-indigo-500/20',
      iconColor: 'text-indigo-400',
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="bg-slate-800/50 border-slate-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-center h-16">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
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
            <Card 
              className="bg-slate-700/50 border-slate-600 hover:border-orange-500/50 transition-colors cursor-pointer"
              onClick={() => navigate('/admin/content')}
            >
              <CardContent className="p-4 text-center">
                <Settings className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white">Site Settings</h3>
                <p className="text-sm text-gray-400">Manage website content</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;

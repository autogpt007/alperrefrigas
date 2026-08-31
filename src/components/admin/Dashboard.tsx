import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Package,
  FileText,
  ShoppingCart,
  TrendingUp,
  Settings,
  Users,
  Boxes,
  AlertTriangle,
  Receipt,
  Clock,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface AdminOrder {
  id: string;
  order_number?: string | null;
  customer_name: string;
  customer_email: string;
  status?: string | null;
  total_amount: number;
  payment_method?: string | null;
  created_at?: string | null;
}

const LOW_STOCK_THRESHOLD = 10;

const money = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['admin-dashboard-orders'],
    enabled: !!user && isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('admin-orders-access', {
        body: { action: 'list' },
      });
      if (error) throw error;
      return (data || []) as AdminOrder[];
    },
  });

  const { data: products = [] } = useQuery({
    queryKey: ['admin-dashboard-products'],
    enabled: !!user && isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, sku, price, product_type, stock_quantity, availability');
      if (error) throw error;
      return data || [];
    },
  });

  const { data: quoteCount = 0 } = useQuery({
    queryKey: ['admin-dashboard-quotes'],
    enabled: !!user && isAdmin,
    queryFn: async () => {
      const { count, error } = await supabase
        .from('quotes')
        .select('id', { count: 'exact', head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  const stats = useMemo(() => {
    const paidStatuses = ['paid', 'processing', 'shipped', 'delivered', 'completed'];
    const revenue = orders
      .filter((o) => paidStatuses.includes((o.status || '').toLowerCase()))
      .reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
    const pending = orders.filter((o) =>
      ['pending', 'awaiting_payment', 'pending_payment'].includes((o.status || '').toLowerCase())
    ).length;
    const last30 = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const recent = orders.filter((o) => o.created_at && new Date(o.created_at).getTime() >= last30);
    const recentRevenue = recent.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
    const customers = new Set(orders.map((o) => (o.customer_email || '').toLowerCase()).filter(Boolean));
    const lowStock = products.filter(
      (p) => (p.stock_quantity ?? 0) > 0 && (p.stock_quantity ?? 0) < LOW_STOCK_THRESHOLD
    ).length;
    const outOfStock = products.filter((p) => (p.stock_quantity ?? 0) === 0).length;
    const stockValue = products.reduce(
      (sum, p) => sum + (Number(p.price) || 0) * (p.stock_quantity ?? 0),
      0
    );
    return {
      revenue,
      recentRevenue,
      recentOrders: recent.length,
      orders: orders.length,
      pending,
      customers: customers.size,
      products: products.length,
      lowStock,
      outOfStock,
      stockValue,
      avgOrder: orders.length ? revenue / orders.length : 0,
    };
  }, [orders, products]);

  if (!user || !isAdmin) {
    return null;
  }

  const kpis = [
    {
      title: 'Revenue (paid orders)',
      value: money(stats.revenue),
      hint: `${money(stats.recentRevenue)} in the last 30 days`,
      icon: TrendingUp,
      onClick: () => navigate('/admin/orders'),
    },
    {
      title: 'Orders',
      value: String(stats.orders),
      hint: `${stats.recentOrders} in the last 30 days`,
      icon: ShoppingCart,
      onClick: () => navigate('/admin/orders'),
    },
    {
      title: 'Awaiting action',
      value: String(stats.pending),
      hint: 'Pending or unpaid orders',
      icon: Clock,
      onClick: () => navigate('/admin/orders'),
    },
    {
      title: 'Average order value',
      value: money(stats.avgOrder),
      hint: 'Across all orders',
      icon: Receipt,
      onClick: () => navigate('/admin/invoices'),
    },
    {
      title: 'Customers',
      value: String(stats.customers),
      hint: 'Unique buyers',
      icon: Users,
      onClick: () => navigate('/admin/customers'),
    },
    {
      title: 'Products live',
      value: String(stats.products),
      hint: `${money(stats.stockValue)} stock value`,
      icon: Package,
      onClick: () => navigate('/admin/products'),
    },
    {
      title: 'Low stock',
      value: String(stats.lowStock),
      hint: `Under ${LOW_STOCK_THRESHOLD} units`,
      icon: AlertTriangle,
      onClick: () => navigate('/admin/inventory'),
    },
    {
      title: 'Out of stock',
      value: String(stats.outOfStock),
      hint: 'Not purchasable',
      icon: Boxes,
      onClick: () => navigate('/admin/inventory'),
    },
  ];

  const recentOrders = [...orders]
    .sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''))
    .slice(0, 8);

  const paymentMix = Object.entries(
    orders.reduce<Record<string, { count: number; total: number }>>((acc, o) => {
      const key = o.payment_method || 'unspecified';
      acc[key] = acc[key] || { count: 0, total: 0 };
      acc[key].count += 1;
      acc[key].total += Number(o.total_amount) || 0;
      return acc;
    }, {})
  ).sort((a, b) => b[1].total - a[1].total);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Operations Dashboard</h1>
        <p className="text-gray-300">
          Live revenue, orders, customers and inventory for Alper Refrigerants.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card
            key={kpi.title}
            className="bg-slate-800/50 border-cyan-500/20 cursor-pointer hover:border-cyan-500/60 transition-colors"
            onClick={kpi.onClick}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300">{kpi.title}</p>
                  <p className="text-2xl font-bold text-white">
                    {ordersLoading ? '—' : kpi.value}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{kpi.hint}</p>
                </div>
                <kpi.icon className="h-7 w-7 text-cyan-400" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-cyan-400">Recent orders</CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <p className="text-sm text-gray-400">No orders yet.</p>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((o) => (
                  <div
                    key={o.id}
                    className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg cursor-pointer hover:bg-slate-700/60"
                    onClick={() => navigate('/admin/orders')}
                  >
                    <div>
                      <p className="text-white font-medium">{o.order_number || o.id.slice(0, 8)}</p>
                      <p className="text-gray-400 text-sm">{o.customer_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-cyan-400 font-medium">
                        {money(Number(o.total_amount) || 0)}
                      </p>
                      <Badge variant="secondary">{o.status || 'pending'}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-cyan-400">Payments by method</CardTitle>
          </CardHeader>
          <CardContent>
            {paymentMix.length === 0 ? (
              <p className="text-sm text-gray-400">No payments recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {paymentMix.map(([method, v]) => (
                  <div
                    key={method}
                    className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg"
                  >
                    <div>
                      <p className="text-white font-medium capitalize">
                        {method.replace(/[-_]/g, ' ')}
                      </p>
                      <p className="text-gray-400 text-sm">{v.count} order(s)</p>
                    </div>
                    <p className="text-cyan-400 font-medium">{money(v.total)}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800/50 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-cyan-400">Quick actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { icon: ShoppingCart, label: 'Orders', desc: 'Process customer orders', path: '/admin/orders' },
              { icon: Users, label: 'Customers', desc: 'Buyers and lifetime value', path: '/admin/customers' },
              { icon: Boxes, label: 'Inventory', desc: 'Stock and availability', path: '/admin/inventory' },
              { icon: Receipt, label: 'Quotes & Invoices', desc: 'Send branded PDFs', path: '/admin/invoices' },
              { icon: FileText, label: 'Audit log', desc: 'Admin activity trail', path: '/admin/audit-log' },
              { icon: Package, label: 'Products', desc: 'Catalog and pricing', path: '/admin/products' },
              { icon: Settings, label: 'Settings', desc: 'Site configuration', path: '/admin/settings' },
            ].map((a) => (
              <Card
                key={a.path}
                className="bg-slate-700/50 border-slate-600 hover:border-cyan-500/50 transition-colors cursor-pointer"
                onClick={() => navigate(a.path)}
              >
                <CardContent className="p-4 text-center">
                  <a.icon className="h-7 w-7 text-cyan-400 mx-auto mb-2" />
                  <h3 className="font-semibold text-white">{a.label}</h3>
                  <p className="text-xs text-gray-400">{a.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4">{quoteCount} quote request(s) received.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;

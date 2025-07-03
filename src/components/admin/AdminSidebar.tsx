
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  ShoppingCart, 
  Settings, 
  Users,
  BarChart3,
  MessageSquare,
  Globe
} from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
      current: location.pathname === '/admin'
    },
    {
      name: 'Products',
      href: '/admin/products',
      icon: Package,
      current: location.pathname === '/admin/products'
    },
    {
      name: 'Orders',
      href: '/admin/orders',
      icon: ShoppingCart,
      current: location.pathname === '/admin/orders'
    },
    {
      name: 'Blog Posts',
      href: '/admin/posts',
      icon: FileText,
      current: location.pathname === '/admin/posts'
    },
    {
      name: 'Content Management',
      href: '/admin/content',
      icon: Globe,
      current: location.pathname === '/admin/content'
    },
    {
      name: 'Analytics',
      href: '/admin/analytics',
      icon: BarChart3,
      current: location.pathname === '/admin/analytics'
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: Settings,
      current: location.pathname === '/admin/settings'
    }
  ];

  return (
    <div className="flex flex-col w-64 bg-slate-900 border-r border-slate-800">
      <div className="flex items-center h-16 px-6 border-b border-slate-800">
        <h2 className="text-xl font-bold text-white">Admin Panel</h2>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                item.current
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'text-gray-300 hover:bg-slate-800 hover:text-white'
              )}
            >
              <Icon className="h-5 w-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default AdminSidebar;

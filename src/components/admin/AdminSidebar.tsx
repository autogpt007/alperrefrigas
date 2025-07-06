
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  FileText, 
  Settings, 
  Users,
  Mail,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminSidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      href: '/admin',
      active: location.pathname === '/admin'
    },
    {
      icon: Package,
      label: 'Products',
      href: '/admin/products',
      active: location.pathname === '/admin/products'
    },
    {
      icon: ShoppingCart,
      label: 'Orders',
      href: '/admin/orders',
      active: location.pathname === '/admin/orders'
    },
    {
      icon: MessageSquare,
      label: 'Contact Forms',
      href: '/admin/contacts',
      active: location.pathname === '/admin/contacts'
    },
    {
      icon: FileText,
      label: 'Blog Posts',
      href: '/admin/posts',
      active: location.pathname === '/admin/posts'
    },
    {
      icon: FileText,
      label: 'Content',
      href: '/admin/content',
      active: location.pathname === '/admin/content'
    },
    {
      icon: Settings,
      label: 'Settings',
      href: '/admin/settings',
      active: location.pathname === '/admin/settings'
    }
  ];

  return (
    <div className="w-64 bg-slate-800 min-h-screen p-6">
      <div className="mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">AR</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Admin Panel</h2>
            <p className="text-sm text-gray-400">Alper Refrigerants</p>
          </div>
        </div>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                item.active
                  ? "bg-cyan-500/20 text-cyan-400 border-r-2 border-cyan-400"
                  : "text-gray-300 hover:bg-slate-700 hover:text-white"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default AdminSidebar;


import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  FileText, 
  MessageSquare, 
  Settings,
  Users,
  Award,
  Globe,
  Star,
  Palette,
  Phone,
  Megaphone,
  Tag,
  Mail
} from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Package, label: 'Products', path: '/admin/products' },
    { icon: Star, label: 'Featured Products', path: '/admin/featured-products' },
    { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
    { icon: FileText, label: 'Blog', path: '/admin/blog' },
    { icon: Megaphone, label: 'Adverts', path: '/admin/adverts' },
    { icon: Tag, label: 'Coupons', path: '/admin/coupons' },
    { icon: MessageSquare, label: 'Contacts', path: '/admin/contacts' },
    { icon: Mail, label: 'Newsletter', path: '/admin/newsletter' },
    { icon: Phone, label: 'Contact Info', path: '/admin/contact-info' },
    { icon: Users, label: 'Team', path: '/admin/team' },
    { icon: Award, label: 'Certificates', path: '/admin/certificates' },
    { icon: Globe, label: 'Content', path: '/admin/content' },
    { icon: MessageSquare, label: 'Testimonials', path: '/admin/testimonials' },
    { icon: Globe, label: 'Hero Images', path: '/admin/hero-images' },
    { icon: Palette, label: 'Logo & Branding', path: '/admin/logo' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <div className="bg-slate-900 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-cyan-400">Admin Panel</h2>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-cyan-600 text-white' 
                  : 'text-gray-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default AdminSidebar;

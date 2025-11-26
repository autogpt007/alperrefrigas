
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  Mail,
  Wrench,
  Map,
  CreditCard,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };
  
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Package, label: 'Products', path: '/admin/products' },
    { icon: Wrench, label: 'Accessories', path: '/admin/accessories' },
    { icon: Star, label: 'Featured Products', path: '/admin/featured-products' },
    { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
    { icon: FileText, label: 'Blog', path: '/admin/blog' },
    { icon: Megaphone, label: 'Adverts', path: '/admin/adverts' },
    { icon: Tag, label: 'Coupons', path: '/admin/coupons' },
    { icon: CreditCard, label: 'Payment Methods', path: '/admin/payment-methods' },
    { icon: MessageSquare, label: 'Contacts', path: '/admin/contacts' },
    { icon: Mail, label: 'Newsletter', path: '/admin/newsletter' },
    { icon: Phone, label: 'Contact Info', path: '/admin/contact-info' },
    { icon: Users, label: 'Team', path: '/admin/team' },
    { icon: Award, label: 'Certificates', path: '/admin/certificates' },
    { icon: Globe, label: 'Content', path: '/admin/content' },
    { icon: MessageSquare, label: 'Testimonials', path: '/admin/testimonials' },
    { icon: Globe, label: 'Hero Images', path: '/admin/hero-images' },
    { icon: FileText, label: 'Page Content', path: '/admin/page-content' },
    { icon: Palette, label: 'Logo & Branding', path: '/admin/logo' },
    { icon: Map, label: 'SEO & Sitemap', path: '/admin/sitemap' },
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

      <div className="mt-auto pt-4 border-t border-slate-700">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start text-gray-300 hover:bg-slate-800 hover:text-white"
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;

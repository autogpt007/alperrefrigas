
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Search, Menu, X, User, LogOut, FileText, ChevronDown } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useRFQ } from '@/contexts/RFQContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import QuoteDialog from '../ui/QuoteDialog';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const Header = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { itemCount } = useCart();
  const { itemCount: quoteItemCount } = useRFQ();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch logo and contact settings
  const { data: logoSettings } = useQuery({
    queryKey: ['logo-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_key, setting_value')
        .in('setting_key', ['logo_url', 'company_name', 'company_tagline', 'main_phone', 'header_email']);

      if (error) throw error;

      const settingsMap = data?.reduce((acc, item) => {
        acc[item.setting_key] = item.setting_value;
        return acc;
      }, {} as Record<string, string>) || {};

      return {
        logo_url: settingsMap.logo_url || '',
        company_name: settingsMap.company_name || 'FrigidFlow',
        company_tagline: settingsMap.company_tagline || 'Refrigerant Solutions',
        main_phone: settingsMap.main_phone || '1-800-REFRIGERANT',
        header_email: settingsMap.header_email || 'info@alperrefrigas.com'
      };
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { label: t('nav.home'), path: '/' },
    { label: t('nav.about'), path: '/about' },
    { label: 'Testimonials', path: '/testimonials' },
    { label: t('nav.contact'), path: '/contact' },
    { label: 'Blog', path: '/blog' },
    { label: 'EPA Compliance', path: '/compliance' },
    { label: t('nav.certifications'), path: '/certifications' },
  ];

  const productMenuItems = [
    { label: 'All Products', path: '/products' },
    { label: 'Refrigerants', path: '/products/refrigerants' },
    { label: 'Accessories', path: '/products/accessories' },
  ];

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50" style={{"--header-height": "83px"} as React.CSSProperties}>
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-2 border-b border-gray-200">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>📞 {logoSettings?.main_phone || '1-800-REFRIGERANT'}</span>
            <span>📧 {logoSettings?.header_email || 'info@alperrefrigas.com'}</span>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            {user ? (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/account')}
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
                >
                  <User className="h-4 w-4" />
                  {t('nav.account')}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-gray-600 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  {t('nav.logout')}
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/auth')}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
              >
                <User className="h-4 w-4" />
                {t('nav.login')}
              </Button>
            )}
          </div>
        </div>

        {/* Main Header */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            {logoSettings?.logo_url ? (
              <img 
                src={logoSettings.logo_url} 
                alt={logoSettings.company_name || 'Company Logo'} 
                className="h-12 w-auto object-contain"
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">
                  {logoSettings?.company_name?.charAt(0) || 'FF'}
                </span>
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{logoSettings?.company_name || 'FrigidFlow'}</h1>
              <p className="text-sm text-gray-600">{logoSettings?.company_tagline || 'Refrigerant Solutions'}</p>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full flex">
              <Input
                type="text"
                placeholder="Search refrigerants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-r-none"
              />
              <Button type="submit" className="rounded-l-none bg-blue-600 hover:bg-blue-700">
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <Link to="/rfq">
              <Button className="hidden md:inline-flex bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2">
                Get Bulk Pricing Quote
              </Button>
            </Link>
            
            {/* Quote Dialog Button */}
            <QuoteDialog>
              <Button variant="outline" size="sm" className="flex items-center space-x-2 relative">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Quote</span>
                {quoteItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {quoteItemCount}
                  </span>
                )}
              </Button>
            </QuoteDialog>
            
            <Link to="/cart" className="relative">
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:inline">{t('nav.cart')}</span>
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center justify-center space-x-8 py-3 border-t border-gray-200">
          <NavigationMenu>
            <NavigationMenuList className="space-x-8">
              {/* Products Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-gray-700 hover:text-blue-600 font-medium transition-colors bg-transparent hover:bg-transparent data-[state=open]:bg-transparent data-[active]:bg-transparent focus:bg-transparent">
                  {t('nav.products')}
                  <ChevronDown className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180" aria-hidden="true" />
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-white border shadow-lg rounded-md p-4 w-48">
                  <div className="space-y-2">
                    {productMenuItems.map((item) => (
                      <NavigationMenuLink key={item.path} asChild>
                        <Link
                          to={item.path}
                          className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                        >
                          {item.label}
                        </Link>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              
              {/* Regular Navigation Items */}
              {navItems.map((item) => (
                <NavigationMenuItem key={item.path}>
                  <NavigationMenuLink asChild>
                    <Link
                      to={item.path}
                      className={`text-gray-700 hover:text-blue-600 font-medium transition-colors ${
                        isActive(item.path) ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : ''
                      }`}
                    >
                      {item.label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="container mx-auto px-4 py-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4 flex">
              <Input
                type="text"
                placeholder="Search refrigerants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-r-none"
              />
              <Button type="submit" className="rounded-l-none bg-blue-600 hover:bg-blue-700">
                <Search className="h-4 w-4" />
              </Button>
            </form>

            {/* Mobile Navigation */}
            <nav className="space-y-2">
              {/* Products Section */}
              <div>
                <div className="py-2 text-gray-700 font-medium">{t('nav.products')}</div>
                <div className="ml-4 space-y-1">
                  {productMenuItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`block py-1 text-gray-600 hover:text-blue-600 transition-colors ${
                        isActive(item.path) ? 'text-blue-600' : ''
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
              
              {/* Regular Navigation Items */}
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors ${
                    isActive(item.path) ? 'text-blue-600' : ''
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link to="/rfq" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full mt-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white">
                  Get Bulk Pricing Quote
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

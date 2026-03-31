
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Search, Menu, X, User, LogOut, FileText, ChevronDown, Package, Snowflake, Wrench, Wind } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useRFQ } from '@/contexts/RFQContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import CurrencySwitcher from '../ui/CurrencySwitcher';
import QuoteDialog from '../ui/QuoteDialog';
import QuoteTypeSelector from '../ui/QuoteTypeSelector';
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
  const { user, logout, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch logo and contact settings
  const { data: logoSettings, refetch } = useQuery({
    queryKey: ['logo-settings'],
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: true,
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
        company_name: settingsMap.company_name || 'Alper Refrigerants',
        company_tagline: settingsMap.company_tagline || 'Professional Refrigerant Distributor',
        main_phone: settingsMap.main_phone || '1-787-965-8975',
        header_email: settingsMap.header_email || 'info@alperrefrigas.com'
      };
    },
  });

  // Listen for settings update event
  React.useEffect(() => {
    const handleSettingsUpdate = () => refetch();
    window.addEventListener('site-settings-updated', handleSettingsUpdate);
    return () => window.removeEventListener('site-settings-updated', handleSettingsUpdate);
  }, [refetch]);

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
    { label: t('nav.about'), path: '/about' },
    { label: 'Testimonials', path: '/testimonials' },
    { label: t('nav.contact'), path: '/contact' },
    { label: 'Blog', path: '/blog' },
    { label: 'EPA Compliance', path: '/compliance' },
    { label: t('nav.certifications'), path: '/certifications' },
  ];

  const productMenuItems = [
    { 
      title: 'Refrigerants',
      href: '/products/refrigerants',
      description: 'Professional-grade refrigerants for all HVAC applications',
      icon: 'snowflake'
    },
    { 
      title: 'Air Conditioners',
      href: '/products/air-conditioners',
      description: 'Bulk wholesale AC units - mini-splits, window & portable',
      icon: 'wind'
    },
    { 
      title: 'Accessories',
      href: '/products/accessories', 
      description: 'Tools, gauges, and equipment for refrigeration work',
      icon: 'wrench'
    },
  ];

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50" style={{"--header-height": "83px"} as React.CSSProperties}>
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-2 border-b border-gray-200">
          <div className="hidden sm:flex items-center space-x-4 text-sm text-gray-600">
            <span>📞 {logoSettings?.main_phone || '1-800-REFRIGERANT'}</span>
            <span className="hidden md:inline">📧 {logoSettings?.header_email || 'info@alperrefrigas.com'}</span>
          </div>
          <div className="flex items-center space-x-4 ml-auto">
            <div className="hidden sm:flex items-center space-x-4">
              <CurrencySwitcher />
              <LanguageSwitcher />
            </div>
            {authLoading ? (
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
              </div>
            ) : user ? (
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
              <h1 className="text-2xl font-bold text-gray-900">{logoSettings?.company_name || 'Alper Refrigerants'}</h1>
              <p className="text-sm text-gray-600">{logoSettings?.company_tagline || 'Professional Refrigerant Distributor'}</p>
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
            <QuoteTypeSelector>
              <Button className="hidden md:inline-flex bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2">
                Request Quote
              </Button>
            </QuoteTypeSelector>
            
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
              {/* Home */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to="/"
                    className={`text-gray-700 hover:text-blue-600 font-medium transition-colors ${
                      isActive('/') ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : ''
                    }`}
                  >
                    {t('nav.home')}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* Products Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-gray-700 hover:text-blue-600 font-medium transition-colors bg-transparent hover:bg-transparent data-[state=open]:bg-transparent data-[active]:bg-transparent focus:bg-transparent">
                  {t('nav.products')}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-4 p-8 md:w-[450px] lg:w-[550px] lg:grid-cols-[1fr_1fr] backdrop-blur-md bg-white/90 dark:bg-gray-900/90 border border-white/20 shadow-2xl shadow-primary/10 rounded-xl">
                    <div className="col-span-2 mb-4">
                      <NavigationMenuLink asChild>
                        <Link
                          to="/products"
                          className="group flex h-full w-full select-none flex-col justify-center rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 p-6 no-underline outline-none transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/20 focus:shadow-lg border border-primary/20"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                              <Package className="h-5 w-5 text-primary" />
                            </div>
                            <div className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                              All Products
                            </div>
                          </div>
                          <p className="text-sm leading-relaxed text-muted-foreground group-hover:text-foreground/80 transition-colors">
                            Browse our complete catalog of refrigerants and accessories
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </div>
                    {productMenuItems.map((item, index) => (
                      <NavigationMenuLink key={index} asChild>
                        <Link
                          to={item.href}
                          className="group block select-none rounded-xl p-4 leading-none no-underline outline-none transition-all duration-300 hover:scale-105 hover:bg-gradient-to-br hover:from-accent/10 hover:to-primary/5 hover:shadow-lg hover:shadow-accent/20 border border-transparent hover:border-accent/30 backdrop-blur-sm"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-all duration-300 group-hover:scale-110">
                              {item.icon === 'snowflake' ? (
                                <Snowflake className="h-4 w-4 text-accent" />
                              ) : item.icon === 'wind' ? (
                                <Wind className="h-4 w-4 text-accent" />
                              ) : (
                                <Wrench className="h-4 w-4 text-accent" />
                              )}
                            </div>
                            <div className="text-sm font-medium leading-none group-hover:text-primary transition-colors">{item.title}</div>
                          </div>
                          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground group-hover:text-foreground/70 transition-colors">
                            {item.description}
                          </p>
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
              {/* Home */}
              <Link
                to="/"
                className={`block py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors ${
                  isActive('/') ? 'text-blue-600' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.home')}
              </Link>

              {/* Products Section */}
              <div>
                <div className="py-2 text-gray-700 font-medium">{t('nav.products')}</div>
                <div className="ml-4 space-y-1">
                  <Link
                    to="/products"
                    className={`block py-1 text-gray-600 hover:text-blue-600 transition-colors ${
                      isActive('/products') ? 'text-blue-600' : ''
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    All Products
                  </Link>
                  {productMenuItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={`block py-1 text-gray-600 hover:text-blue-600 transition-colors ${
                        isActive(item.href) ? 'text-blue-600' : ''
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.title}
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
              <div className="mt-4">
                <QuoteTypeSelector>
                  <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white">
                    Request Quote
                  </Button>
                </QuoteTypeSelector>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

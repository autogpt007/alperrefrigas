
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Menu, X, FileText, User, LogIn, Search, ShoppingCart } from 'lucide-react';
import { useRFQ } from '../../contexts/RFQContext';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import AuthModal from '../AuthModal';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { itemCount: rfqItemCount } = useRFQ();
  const { itemCount: cartItemCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 shadow-xl sticky top-0 z-50 border-b border-blue-800/30">
        <nav className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="text-xl sm:text-2xl font-bold text-white hover:text-blue-300 transition-colors">
              North American <span className="text-blue-400">Refrigerants</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 bg-white/10 border-white/20 text-white placeholder-gray-300 focus:bg-white/20 focus:border-blue-400"
                />
              </form>

              <Link to="/products" className="text-white hover:text-blue-300 font-medium transition-colors">
                Products
              </Link>

              {/* Shopping Cart */}
              <Link to="/cart" className="text-white hover:text-blue-300 font-medium relative transition-colors">
                <div className="flex items-center space-x-2">
                  <ShoppingCart className="h-4 w-4" />
                  <span>Cart</span>
                  {cartItemCount > 0 && (
                    <Badge className="bg-orange-500 text-white text-xs ml-1 animate-pulse">
                      {cartItemCount}
                    </Badge>
                  )}
                </div>
              </Link>
              
              {/* RFQ/Quote Request */}
              <Link to="/rfq" className="text-white hover:text-blue-300 font-medium relative transition-colors">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Quote Request</span>
                  {rfqItemCount > 0 && (
                    <Badge className="bg-blue-500 text-white text-xs ml-1 animate-pulse">
                      {rfqItemCount}
                    </Badge>
                  )}
                </div>
              </Link>
              
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-white hover:text-blue-300 hover:bg-blue-500/10 transition-colors">
                      <User className="h-4 w-4 mr-2" />
                      Portal
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link to="/portal" className="w-full">
                        <User className="h-4 w-4 mr-2" />
                        My Account
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                      <LogIn className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="text-white hover:text-blue-300 hover:bg-blue-500/10 transition-colors"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              )}
              
              <Link to="/rfq">
                <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
                  Request Quote
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:text-blue-300 hover:bg-blue-500/10"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-blue-800/30">
              <div className="flex flex-col space-y-4 pt-4">
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full bg-white/10 border-white/20 text-white placeholder-gray-300 focus:bg-white/20 focus:border-blue-400"
                  />
                </form>

                <Link
                  to="/products"
                  className="text-white hover:text-blue-300 font-medium py-2 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Products
                </Link>

                <Link
                  to="/cart"
                  className="text-white hover:text-blue-300 font-medium flex items-center py-2 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Cart
                  {cartItemCount > 0 && (
                    <Badge className="bg-orange-500 text-white text-xs ml-2">
                      {cartItemCount}
                    </Badge>
                  )}
                </Link>
                
                <Link
                  to="/rfq"
                  className="text-white hover:text-blue-300 font-medium flex items-center py-2 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Quote Request
                  {rfqItemCount > 0 && (
                    <Badge className="bg-blue-500 text-white text-xs ml-2">
                      {rfqItemCount}
                    </Badge>
                  )}
                </Link>
                
                {user ? (
                  <>
                    <Link
                      to="/portal"
                      className="text-white hover:text-blue-300 font-medium flex items-center py-2 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Portal
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                      className="text-white hover:text-red-400 hover:bg-red-500/10 justify-start py-2 px-0 transition-colors"
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsAuthModalOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="text-white hover:text-blue-300 hover:bg-blue-500/10 justify-start py-2 px-0 transition-colors"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                )}
                
                <Link to="/rfq" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                    Request Quote
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </nav>
      </header>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default Header;

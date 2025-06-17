
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Menu, X, FileText, User, LogIn } from 'lucide-react';
import { useRFQ } from '../../contexts/RFQContext';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { itemCount } = useRFQ();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-gray-900">
            North American <span className="text-blue-600">Refrigerants</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/products" className="text-gray-600 hover:text-blue-600 font-medium">
              Products
            </Link>
            <Link to="/rfq" className="text-gray-600 hover:text-blue-600 font-medium relative">
              <div className="flex items-center space-x-1">
                <FileText className="h-4 w-4" />
                <span>Quote Request</span>
                {itemCount > 0 && (
                  <Badge className="bg-blue-600 text-white text-xs ml-1">
                    {itemCount}
                  </Badge>
                )}
              </div>
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/portal" className="text-gray-600 hover:text-blue-600 font-medium">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>Portal</span>
                  </div>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-600"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-blue-600"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Customer Login
              </Button>
            )}
            
            <Link to="/rfq">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                Request Quote
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3 pt-4">
              <Link
                to="/products"
                className="text-gray-600 hover:text-blue-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                to="/rfq"
                className="text-gray-600 hover:text-blue-600 font-medium flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <FileText className="h-4 w-4 mr-2" />
                Quote Request
                {itemCount > 0 && (
                  <Badge className="bg-blue-600 text-white text-xs ml-2">
                    {itemCount}
                  </Badge>
                )}
              </Link>
              {user ? (
                <>
                  <Link
                    to="/portal"
                    className="text-gray-600 hover:text-blue-600 font-medium flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Portal
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-gray-600 hover:text-red-600 justify-start"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-blue-600 justify-start"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Customer Login
                </Button>
              )}
              <Link to="/rfq" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                  Request Quote
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;

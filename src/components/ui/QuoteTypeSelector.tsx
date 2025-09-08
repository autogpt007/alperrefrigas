import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Building2, ShoppingCart, ArrowRight } from 'lucide-react';

interface QuoteTypeSelectorProps {
  children: React.ReactNode;
}

const QuoteTypeSelector: React.FC<QuoteTypeSelectorProps> = ({ children }) => {
  const navigate = useNavigate();

  const handleBulkQuote = () => {
    navigate('/bulk-pricing');
  };

  const handleProductQuote = () => {
    navigate('/products');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl bg-gradient-to-br from-slate-800 to-slate-900 border-slate-600">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white text-center">Choose Quote Type</DialogTitle>
          <DialogDescription className="text-gray-300 text-center">
            Select the type of quote that best matches your needs
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-6 p-4">
          {/* Bulk Pricing Quote */}
          <Card className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-green-500/30 hover:border-green-400/50 transition-all duration-300 cursor-pointer group"
                onClick={handleBulkQuote}>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-white text-xl">Bulk Pricing Quote</CardTitle>
              <CardDescription className="text-gray-300">
                For container loads and large volume orders
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-300">
                  <Package className="h-4 w-4 mr-2 text-green-400" />
                  20ft/40ft containers
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <Package className="h-4 w-4 mr-2 text-green-400" />
                  Multiple pallets (40+ cylinders)
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <Package className="h-4 w-4 mr-2 text-green-400" />
                  Volume discounts up to 25%
                </div>
              </div>
              <Button 
                onClick={handleBulkQuote}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white group-hover:scale-105 transition-all"
              >
                Get Bulk Quote
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Product-Specific Quote */}
          <Card className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 cursor-pointer group"
                onClick={handleProductQuote}>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <ShoppingCart className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-white text-xl">Product Quote</CardTitle>
              <CardDescription className="text-gray-300">
                For specific products and smaller quantities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-300">
                  <Package className="h-4 w-4 mr-2 text-blue-400" />
                  Individual cylinders
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <Package className="h-4 w-4 mr-2 text-blue-400" />
                  Single or multiple pallets
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <Package className="h-4 w-4 mr-2 text-blue-400" />
                  Specific product configurations
                </div>
              </div>
              <Button 
                onClick={handleProductQuote}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white group-hover:scale-105 transition-all"
              >
                Browse Products
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteTypeSelector;
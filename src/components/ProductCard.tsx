
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, Plus, Minus, Check, Zap, TrendingUp } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  price: number;
  pallet_price?: number;
  container_20ft_price?: number;
  container_40ft_price?: number;
  discount_20ft?: number;
  discount_40ft?: number;
  packaging_options?: string[];
  image: string;
  sku: string;
  epaApproved: boolean;
  category?: string;
  chemical_formula?: string;
  applications?: string[];
  stock_quantity?: number;
  availability?: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem, items } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedPackaging, setSelectedPackaging] = useState(
    product.packaging_options?.[0] || '1 Pallet'
  );

  const existingItem = items.find(item => item.id === product.id);
  const cartQuantity = existingItem?.quantity || 0;

  const calculateBulkPrice = (packageType: string): number => {
    const cylinderPrice = product.price; // Base price is per cylinder
    const discount20ft = product.discount_20ft || 0.30;
    const discount40ft = product.discount_40ft || 0.45;
    
    switch (packageType) {
      case '1 Pallet':
        // 40 cylinders per pallet
        return product.pallet_price || (cylinderPrice * 40);
      case '20ft Container':
        // 1140 cylinders per 20ft container
        const container20Price = cylinderPrice * 1140;
        return product.container_20ft_price || (container20Price * (1 - discount20ft));
      case '40ft Container':
        // 2280 cylinders per 40ft container
        const container40Price = cylinderPrice * 2280;
        return product.container_40ft_price || (container40Price * (1 - discount40ft));
      default:
        return cylinderPrice * 40; // Default to pallet pricing
    }
  };

  const getCurrentPrice = () => calculateBulkPrice(selectedPackaging);
  const getDiscountPercentage = () => {
    const discount20ft = product.discount_20ft || 0.30;
    const discount40ft = product.discount_40ft || 0.45;
    if (selectedPackaging === '20ft Container') return Math.round(discount20ft * 100);
    if (selectedPackaging === '40ft Container') return Math.round(discount40ft * 100);
    return 0;
  };

  const handleAddToCart = () => {
    const currentPrice = getCurrentPrice();
    for (let i = 0; i < quantity; i++) {
      addItem({
        ...product,
        price: currentPrice,
        packaging: selectedPackaging,
        id: `${product.id}-${selectedPackaging}`
      });
    }
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  return (
    <Card 
      className="group relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-cyan-500/20 hover:border-cyan-400/50 transition-all duration-500 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/20 h-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Holographic Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Glowing Border Animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

      <CardContent className="p-4 relative z-10 flex-1 flex flex-col">
        {/* Product Image - Larger display */}
        <div className="relative mb-3 overflow-hidden rounded-lg bg-slate-700/50 h-64">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* EPA Badge */}
          {product.epaApproved && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg">
                <Zap className="h-3 w-3 mr-1" />
                EPA
              </Badge>
            </div>
          )}

          {/* Cart Quantity Indicator */}
          {cartQuantity > 0 && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white border-0 shadow-lg">
                {cartQuantity} in cart
              </Badge>
            </div>
          )}
        </div>

        {/* Product Info - Condensed */}
        <div className="flex-1 flex flex-col">
          <div className="mb-2">
            <Link to={`/products/${product.id}`} className="block">
              <h3 className="font-bold text-lg text-white group-hover:text-cyan-400 transition-colors duration-300 hover:underline cursor-pointer">
                {product.name}
              </h3>
            </Link>
            <p className="text-xs text-gray-400 font-mono">{product.sku}</p>
            {product.chemical_formula && (
              <p className="text-xs text-cyan-300 font-mono">{product.chemical_formula}</p>
            )}
          </div>

          {/* Packaging Selection */}
          {product.packaging_options && product.packaging_options.length > 1 && (
            <div className="mb-3">
              <label className="text-xs text-gray-400 block mb-1">Package Size:</label>
              <Select value={selectedPackaging} onValueChange={setSelectedPackaging}>
                <SelectTrigger className="w-full h-8 bg-slate-700/50 border-cyan-500/30 text-white text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {product.packaging_options.map((option) => (
                    <SelectItem key={option} value={option}>
                      <div className="flex items-center justify-between w-full">
                        <span>{option}</span>
                        {getDiscountPercentage() > 0 && option === selectedPackaging && (
                          <Badge variant="secondary" className="ml-2 bg-green-500/20 text-green-300 text-xs">
                            -{getDiscountPercentage()}%
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex items-center justify-between mb-3">
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                {getDiscountPercentage() > 0 && (
                  <span className="text-xs text-gray-500 line-through">
                    ${(product.price * (selectedPackaging === '1 Pallet' ? 40 : selectedPackaging === '20ft Container' ? 1140 : 2280)).toLocaleString()}
                  </span>
                )}
                <div className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  ${getCurrentPrice().toLocaleString()}
                </div>
              </div>
              <div className="text-xs text-gray-400 leading-tight">
                {selectedPackaging === '1 Pallet' && '40 cylinders per pallet'}
                {selectedPackaging === '20ft Container' && '1,140 cylinders per container'}
                {selectedPackaging === '40ft Container' && '2,280 cylinders per container'}
              </div>
              {getDiscountPercentage() > 0 && (
                <div className="flex items-center gap-1 text-green-400">
                  <TrendingUp className="h-3 w-3" />
                  <span className="text-xs font-medium">Save {getDiscountPercentage()}%</span>
                </div>
              )}
            </div>
            
            {/* Quantity Selector - Smaller */}
            <div className={`flex items-center space-x-1 transition-all duration-300 ${
              isHovered ? 'opacity-100 scale-100' : 'opacity-75 scale-95'
            }`}>
              <Button
                size="sm"
                variant="ghost"
                onClick={decrementQuantity}
                className="h-7 w-7 p-0 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/20"
              >
                <Minus className="h-3 w-3" />
              </Button>
              
              <div className="w-10 h-7 bg-slate-700/50 border border-cyan-500/30 rounded flex items-center justify-center">
                <span className="text-cyan-400 font-bold text-sm">{quantity}</span>
              </div>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={incrementQuantity}
                className="h-7 w-7 p-0 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/20"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Add to Cart Button - Smaller */}
          <div className="mt-auto">
            <Button
              onClick={handleAddToCart}
              disabled={isAdded}
              className={`w-full h-10 font-semibold transition-all duration-500 ${
                isAdded
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                  : 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white'
              } border-0 shadow-lg hover:shadow-xl hover:shadow-cyan-500/25 transform hover:scale-[1.02]`}
            >
              {isAdded ? (
                <div className="flex items-center justify-center space-x-2">
                  <Check className="h-4 w-4" />
                  <span>Added!</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <ShoppingCart className="h-4 w-4" />
                  <span>Add {quantity}</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </CardContent>

      {/* Particle Effects */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-cyan-400 rounded-full animate-ping"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-ping animation-delay-300"></div>
        <div className="absolute bottom-1/4 left-3/4 w-1 h-1 bg-cyan-400 rounded-full animate-ping animation-delay-700"></div>
      </div>
    </Card>
  );
};

export default ProductCard;

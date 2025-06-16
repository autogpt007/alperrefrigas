
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, Plus, Minus, Check, Zap } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  sku: string;
  epaApproved: boolean;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem, items } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const existingItem = items.find(item => item.id === product.id);
  const cartQuantity = existingItem?.quantity || 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
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
      className="group relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-cyan-500/20 hover:border-cyan-400/50 transition-all duration-500 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Holographic Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Glowing Border Animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

      <CardContent className="p-6 relative z-10">
        {/* Product Image */}
        <div className="relative mb-4 overflow-hidden rounded-lg bg-slate-700/50">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
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

        {/* Product Info */}
        <div className="space-y-3">
          <div>
            <h3 className="font-bold text-lg text-white group-hover:text-cyan-400 transition-colors duration-300">
              {product.name}
            </h3>
            <p className="text-sm text-gray-400 font-mono">{product.sku}</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              ${product.price.toFixed(2)}
            </div>
            
            {/* Quantity Selector */}
            <div className={`flex items-center space-x-2 transition-all duration-300 ${
              isHovered ? 'opacity-100 scale-100' : 'opacity-75 scale-95'
            }`}>
              <Button
                size="sm"
                variant="ghost"
                onClick={decrementQuantity}
                className="h-8 w-8 p-0 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/20"
              >
                <Minus className="h-4 w-4" />
              </Button>
              
              <div className="w-12 h-8 bg-slate-700/50 border border-cyan-500/30 rounded flex items-center justify-center">
                <span className="text-cyan-400 font-bold">{quantity}</span>
              </div>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={incrementQuantity}
                className="h-8 w-8 p-0 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/20"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            disabled={isAdded}
            className={`w-full h-12 font-semibold transition-all duration-500 ${
              isAdded
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                : 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white'
            } border-0 shadow-lg hover:shadow-xl hover:shadow-cyan-500/25 transform hover:scale-[1.02]`}
          >
            {isAdded ? (
              <div className="flex items-center justify-center space-x-2">
                <Check className="h-5 w-5" />
                <span>Added to Quantum Cart!</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <ShoppingCart className="h-5 w-5" />
                <span>Add {quantity} to Cart</span>
              </div>
            )}
          </Button>
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

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft, Info } from 'lucide-react';
import { useCart, CartItem } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { trackViewCart, cartItemToGA4Item } from '@/utils/ga4Ecommerce';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ACConfigSummary } from '@/components/ui/ACConfigSummary';
import { ACConfiguration } from '@/components/ui/ACConfigurator';
// Extracted cart item component for cleaner code
interface CartItemCardProps {
  item: CartItem;
  formatPrice: (price: number) => string;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
}

const CartItemCard: React.FC<CartItemCardProps> = ({ 
  item, 
  formatPrice, 
  updateQuantity, 
  removeItem 
}) => {
  const { updateItemConfiguration } = useCart();
  
  const hasACConfig = item.configuration_json && 
    (item.configuration_json.btu || item.configuration_json.voltage);

  const handleConfigurationChange = (newConfig: ACConfiguration) => {
    updateItemConfiguration(item.id, newConfig);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <img
            src={item.image}
            alt={item.name}
            className="w-20 h-20 object-cover rounded-lg bg-muted"
          />
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground">{item.name}</h3>
            <p className="text-muted-foreground text-sm">SKU: {item.sku}</p>
            {item.epaApproved && (
              <Badge variant="secondary" className="bg-green-100 text-green-800 mt-1">
                EPA Approved
              </Badge>
            )}
            
            {/* AC Configuration Summary */}
            {hasACConfig && (
              <ACConfigSummary
                configuration={item.configuration_json as ACConfiguration}
                onConfigurationChange={handleConfigurationChange}
                editable={true}
                compact={true}
              />
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center font-medium">{item.quantity}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-right">
            <div className="text-xl font-bold text-green-600">
              {formatPrice(item.price * item.quantity)}
            </div>
            <div className="text-sm text-muted-foreground">
              {formatPrice(item.price)} each
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeItem(item.id)}
            className="text-destructive hover:text-destructive/80"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const CartPage = () => {
  const { t } = useTranslation();
  const { items, updateQuantity, removeItem, total, itemCount } = useCart();
  const { user } = useAuth();
  const { formatPrice, currency, currencyName, currencySymbol } = useCurrency();
  const navigate = useNavigate();

  // Track view cart event
  React.useEffect(() => {
    if (items.length > 0) {
      const ga4Items = items.map(cartItemToGA4Item);
      trackViewCart(ga4Items, total);
    }
  }, []); // Only track on initial load

  const handleProceedToCheckout = () => {
    if (user) {
      navigate('/checkout');
    } else {
      navigate('/auth?returnTo=/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
        <title>Shopping Cart | Alper Refrigerants</title>
        <link rel="alternate" hrefLang="x-default" href="https://alperrefrigas.com/cart" />
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <ShoppingCart className="h-24 w-24 text-gray-400 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('cart.empty.title')}</h1>
          <p className="text-gray-600 mb-8">
            {t('cart.empty.description')}
          </p>
          <Link to="/products">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              {t('cart.empty.browseProducts')}
            </Button>
          </Link>
        </div>
      </div>
      </>
    );
  }

  return (
    <>
    <Helmet>
      <meta name="robots" content="noindex, nofollow" />
      <title>Shopping Cart | Alper Refrigerants</title>
      <link rel="alternate" hrefLang="x-default" href="https://alperrefrigas.com/cart" />
    </Helmet>
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <Badge variant="secondary" className="ml-auto">
            {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
          </Badge>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <CartItemCard
                key={item.id}
                item={item}
                formatPrice={formatPrice}
                updateQuantity={updateQuantity}
                removeItem={removeItem}
              />
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="flex justify-between text-sm">
                   <span className="text-gray-600">Subtotal</span>
                   <span>{formatPrice(total)}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                   <span className="text-gray-600">Shipping</span>
                   <span className="text-green-600">Calculated at checkout</span>
                 </div>
                 <div className="border-t pt-4">
                   <div className="flex justify-between text-lg font-bold">
                     <span>Total</span>
                     <span className="text-green-600">{formatPrice(total)}</span>
                   </div>
                   <p className="text-xs text-gray-500 mt-1">+ shipping & taxes</p>
                 </div>

                {/* Currency Conversion Notice */}
                {currency !== 'USD' && (
                  <Alert className="bg-blue-50 border-blue-200">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-xs text-blue-700">
                      <span className="font-medium">Currency Notice:</span> Prices shown in {currencyName} ({currencySymbol}) are estimates.{' '}
                      <strong>All charges will be processed in USD.</strong>
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-3 pt-4">
                  {user ? (
                    <Button 
                      size="lg" 
                      className="w-full bg-orange-500 hover:bg-orange-600"
                      onClick={handleProceedToCheckout}
                    >
                      Proceed to Checkout
                    </Button>
                  ) : (
                    <Link to="/checkout?guest=true" className="block">
                      <Button 
                        size="lg" 
                        className="w-full bg-orange-500 hover:bg-orange-600"
                      >
                        Checkout as Guest
                      </Button>
                    </Link>
                  )}
                  <Link to="/products" className="block">
                    <Button variant="outline" size="lg" className="w-full">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg mt-6">
                  <h4 className="font-medium text-blue-900 mb-2">EPA Compliance Notice</h4>
                  <p className="text-sm text-blue-800">
                    All refrigerants require EPA 608 certification for purchase. 
                    You will need to provide certification during checkout.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default CartPage;

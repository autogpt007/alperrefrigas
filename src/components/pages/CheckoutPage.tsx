import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../contexts/CartContext';
import { useOrders } from '../../contexts/OrdersContext';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { PaymentMethodSelector } from '../ui/PaymentMethodSelector';
import { ShoppingCart, CreditCard, Truck, MapPin, DollarSign, AlertTriangle, Scale, Shield, Smartphone, Zap, Bitcoin, Wallet, QrCode, ExternalLink, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatPrice, formatPriceWhole, formatCurrency } from '@/lib/utils';
import SEOComponent from '../seo/SEOComponent';
// Removed secure card encryption import
import { usePaymentWallets } from '@/hooks/usePaymentWallets';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { trackBeginCheckout, trackAddPaymentInfo, trackPurchase, cartItemToGA4Item } from '@/utils/ga4Ecommerce';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { items, total, clearCart, freeShippingThreshold, shippingCost: cartShippingCost, finalTotal: cartFinalTotal } = useCart();
  const { createOrder } = useOrders();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const isGuest = searchParams.get('guest') === 'true';

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [isCouponLoading, setIsCouponLoading] = useState(false);

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    phoneNumber: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    paymentMethod: '', // No payment method preselected
    notes: '',
    // Credit card details for offline processing
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingStreet: '',
    billingCity: '',
    billingState: '',
    billingZipCode: '',
    billingCountry: 'United States',
    cashappTag: '',
    zelleTag: '',
    zellePhone: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [bankWireDetails, setBankWireDetails] = useState<any>(null);
  const [legalAcknowledged, setLegalAcknowledged] = useState(false);
  const [selectedCryptoWallet, setSelectedCryptoWallet] = useState<string>('');
  const { wallets, loading: walletsLoading, getCryptoWallets, getTraditionalWallets } = usePaymentWallets();

  // Auto-fill user data when authenticated
  useEffect(() => {
    if (user && !isGuest) {
      setFormData(prev => ({
        ...prev,
        customerName: user.user_metadata?.full_name || '',
        customerEmail: user.email || ''
      }));
    }
  }, [user, isGuest]);

  // Fetch bank wire details
  useEffect(() => {
    const fetchBankWireDetails = async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('setting_key, setting_value')
        .in('setting_key', ['bank_wire_instructions', 'bank_name', 'bank_routing_number', 'bank_account_number', 'bank_swift_code']);
      
      const details: any = {};
      data?.forEach(setting => {
        details[setting.setting_key] = setting.setting_value;
      });
      setBankWireDetails(details);
    };
    
    fetchBankWireDetails();
  }, []);

  // Track begin_checkout event when user lands on checkout page
  useEffect(() => {
    if (items.length > 0) {
      const ga4Items = items.map(cartItemToGA4Item);
      trackBeginCheckout(ga4Items, finalTotal, appliedCoupon?.code);
    }
  }, []); // Only track on initial load

  // Apply coupon function
  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a coupon code",
        variant: "destructive",
      });
      return;
    }

    setIsCouponLoading(true);
    try {
      const { data: coupon, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.toUpperCase())
        .eq('is_active', true)
        .single();

      if (error || !coupon) {
        toast({
          title: "Invalid Coupon",
          description: "The coupon code you entered is not valid or has expired.",
          variant: "destructive",
        });
        return;
      }

      // Check if coupon is valid (within date range)
      const now = new Date();
      const startDate = coupon.start_date ? new Date(coupon.start_date) : null;
      const endDate = coupon.end_date ? new Date(coupon.end_date) : null;

      if (startDate && now < startDate) {
        toast({
          title: "Coupon Not Yet Active",
          description: "This coupon is not yet valid.",
          variant: "destructive",
        });
        return;
      }

      if (endDate && now > endDate) {
        toast({
          title: "Coupon Expired",
          description: "This coupon has expired.",
          variant: "destructive",
        });
        return;
      }

      // Check minimum order amount
      if (coupon.minimum_order_amount && total < coupon.minimum_order_amount) {
        toast({
          title: "Minimum Order Not Met",
          description: `This coupon requires a minimum order of $${coupon.minimum_order_amount}.`,
          variant: "destructive",
        });
        return;
      }

      // Check usage limits
      if (coupon.max_uses && coupon.current_uses >= coupon.max_uses) {
        toast({
          title: "Coupon Usage Limit Reached",
          description: "This coupon has reached its maximum usage limit.",
          variant: "destructive",
        });
        return;
      }

      // Calculate discount
      let discount = 0;
      if (coupon.discount_type === 'percentage') {
        discount = total * (coupon.discount_value / 100);
      } else {
        discount = coupon.discount_value;
      }

      setAppliedCoupon(coupon);
      setCouponDiscount(discount);
      toast({
        title: "Coupon Applied!",
        description: `You saved $${discount.toFixed(2)}`,
      });

    } catch (error) {
      console.error('Error applying coupon:', error);
      toast({
        title: "Error",
        description: "Failed to apply coupon. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponCode('');
    toast({
      title: "Coupon Removed",
      description: "The coupon has been removed from your order.",
    });
  };

  // Calculate totals with coupon
  const subtotal = total;
  const shippingCost = subtotal >= freeShippingThreshold ? 0 : cartShippingCost;
  const discountAmount = couponDiscount;
  const finalTotal = Math.max(0, subtotal + shippingCost - discountAmount);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Track payment info when payment method is selected
    if (field === 'paymentMethod' && value && items.length > 0) {
      const ga4Items = items.map(cartItemToGA4Item);
      trackAddPaymentInfo(ga4Items, finalTotal, value, appliedCoupon?.code);
    }
  };

  const validateForm = () => {
    // Check payment method is selected
    if (!formData.paymentMethod || formData.paymentMethod.trim() === '') {
      toast({
        title: "Payment Method Required",
        description: "Please select a payment method to continue",
        variant: "destructive",
      });
      return false;
    }

    const required = ['customerName', 'customerEmail', 'phoneNumber', 'street', 'city', 'state', 'zipCode'];
    const missing = required.filter(field => !formData[field as keyof typeof formData]);
    
    if (missing.length > 0) {
      toast({
        title: "Missing Information",
        description: `Please fill in: ${missing.join(', ')}`,
        variant: "destructive",
      });
      return false;
    }

    if (formData.paymentMethod === 'credit_card') {
      const cardRequired = ['cardNumber', 'expiryDate', 'cvv', 'cardholderName'];
      const missingCard = cardRequired.filter(field => !formData[field as keyof typeof formData]);
      
      if (missingCard.length > 0) {
        toast({
          title: "Missing Card Information",
          description: `Please fill in: ${missingCard.join(', ')}`,
          variant: "destructive",
        });
        return false;
      }
    }

    if (formData.paymentMethod === 'zelle') {
      if (!formData.zelleTag || !formData.zelleTag.trim()) {
        toast({
          title: "Missing Zelle Information",
          description: "Please provide your Zelle email address",
          variant: "destructive",
        });
        return false;
      }
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.zelleTag)) {
        toast({
          title: "Invalid Email",
          description: "Please enter a valid email address for Zelle",
          variant: "destructive",
        });
        return false;
      }
    }

    if (formData.paymentMethod === 'cashapp') {
      if (!formData.cashappTag || !formData.cashappTag.trim()) {
        toast({
          title: "Missing CashApp Information",
          description: "Please provide your CashApp $cashtag",
          variant: "destructive",
        });
        return false;
      }
    }

    if (formData.paymentMethod.startsWith('crypto_') && !selectedCryptoWallet) {
      toast({
        title: "Missing Crypto Wallet",
        description: "Please select a crypto wallet for payment",
        variant: "destructive",
      });
      return false;
    }

    if (!legalAcknowledged) {
      toast({
        title: "Legal Acknowledgment Required",
        description: "Please acknowledge the legal information to proceed",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (items.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Your cart is empty. Please add items before checking out.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // ENHANCED SESSION VALIDATION BEFORE ORDER CREATION
      console.info('[CHECKOUT_START]', {
        timestamp: new Date().toISOString(),
        isGuest,
        isUserAuthenticated: !!user,
        itemCount: items.length,
        totalAmount: finalTotal
      });

      // Double-check authentication state if not guest
      if (!isGuest && !user) {
        console.warn('[CHECKOUT_WARNING] Not guest but no user found, checking session...');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          toast({
            title: "Authentication Required",
            description: "Please log in to complete your order.",
            variant: "destructive",
          });
          navigate('/auth');
          return;
        }
        
        console.info('[CHECKOUT_SESSION] Session found, proceeding with order');
      }
      // CRITICAL: Remove user_id from orderData - let OrdersContext handle it
      const orderData = {
        customer_name: formData.customerName,
        customer_email: formData.customerEmail,
        phone: formData.phoneNumber,
        total_amount: Number(finalTotal) || 0, // Ensure numeric total
        items: items.map(item => {
          // Safely extract a UUID from item.id if present; otherwise send null to avoid DB casting errors
          const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
          const productIdStr = typeof item.id === 'string' ? item.id : '';
          const uuidMatch = productIdStr.match(uuidRegex);
          const productIdForOrder = uuidMatch ? uuidMatch[0] : null;
          
          return {
            product_id: productIdForOrder,
            product_name: item.name,
            quantity: Number(item.quantity) || 1, // Ensure numeric quantity
            price: Number(item.price) || 0, // Ensure numeric price
            packaging: item.packaging,
            sku: item.sku,
            epa_approved: item.epaApproved
          };
        }),
        status: 'pending' as const,
        shipping_address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
          phoneNumber: formData.phoneNumber
        },
        payment_method: formData.paymentMethod,
        notes: formData.notes,
        shipping_cost: shippingCost,
        tax_amount: 0,
        zelle_tag: formData.paymentMethod === 'zelle' ? (formData.zelleTag || formData.zellePhone) : null,
        cashapp_tag: formData.paymentMethod === 'cashapp' ? formData.cashappTag : null,
        // user_id intentionally removed - OrdersContext will handle it based on auth state
        payment_details: formData.paymentMethod === 'credit_card' ? {
          last_four: formData.cardNumber.slice(-4),
          expiry_date: formData.expiryDate,
          billing_address: {
            street: formData.billingStreet,
            city: formData.billingCity,
            state: formData.billingState,
            zipCode: formData.billingZipCode,
            country: formData.billingCountry
          }
        } : formData.paymentMethod.startsWith('crypto_') ? {
          selected_wallet: selectedCryptoWallet,
          wallet_type: formData.paymentMethod.replace('crypto_', '')
        } : null,
      };

      // Log checkout attempt for debugging
      console.info('[CHECKOUT_ATTEMPT]', {
        timestamp: new Date().toISOString(),
        isGuest,
        userExists: !!user,
        customerEmail: formData.customerEmail,
        paymentMethod: formData.paymentMethod,
        totalAmount: finalTotal
      });

      const order = await createOrder(orderData, isGuest);
      
      // Ensure order was created successfully before proceeding
      if (!order) {
        throw new Error('Order creation failed - no order returned');
      }

      console.info('[ORDER_SUCCESS]', {
        orderId: order.id,
        orderNumber: order.order_number,
        customerEmail: formData.customerEmail
      });

      // Secure card storage removed - payment details stored in order payment_details field

      // Update coupon usage
      if (appliedCoupon) {
        await supabase
          .from('coupons')
          .update({ current_uses: (appliedCoupon.current_uses || 0) + 1 })
          .eq('id', appliedCoupon.id);
      }

      // Track purchase in GA4
      const ga4Items = items.map(cartItemToGA4Item);
      trackPurchase(
        order.order_number,
        ga4Items,
        finalTotal,
        0, // tax
        shippingCost,
        appliedCoupon?.code
      );

      clearCart();
      navigate(`/order-confirmation?orderNumber=${order.order_number}`);
      
      toast({
        title: "Order Placed Successfully!",
        description: `Your order #${order.order_number} has been placed. You will receive a confirmation email shortly.`,
      });

    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Order Failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <CardTitle>Your cart is empty</CardTitle>
            <CardDescription>Add some products to your cart to checkout</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/products')} className="w-full">
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOComponent
        title="Secure Checkout - Alper Refrigerant"
        description="Complete your refrigerant order with our secure checkout process. Multiple payment options available including credit card, Zelle, and CashApp."
        keywords="secure checkout, refrigerant purchase, credit card payment, Zelle payment, CashApp payment"
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Secure Checkout</h1>
            <p className="text-gray-600">Complete your order with confidence</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Customer Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      Customer Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="customerName">Full Name *</Label>
                        <Input
                          id="customerName"
                          value={formData.customerName}
                          onChange={(e) => handleInputChange('customerName', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="customerEmail">Email Address *</Label>
                        <Input
                          id="customerEmail"
                          type="email"
                          value={formData.customerEmail}
                          onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="phoneNumber">Phone Number *</Label>
                        <Input
                          id="phoneNumber"
                          type="tel"
                          value={formData.phoneNumber}
                          onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Address */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Truck className="h-5 w-5 mr-2" />
                      Shipping Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="street">Street Address *</Label>
                      <Input
                        id="street"
                        value={formData.street}
                        onChange={(e) => handleInputChange('street', e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          value={formData.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="zipCode">ZIP Code *</Label>
                        <Input
                          id="zipCode"
                          value={formData.zipCode}
                          onChange={(e) => handleInputChange('zipCode', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="country">Country *</Label>
                      <Select
                        value={formData.country}
                        onValueChange={(value) => handleInputChange('country', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="United States">United States</SelectItem>
                          <SelectItem value="Canada">Canada</SelectItem>
                          <SelectItem value="Mexico">Mexico</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-2" />
                      Payment Method
                    </CardTitle>
                  </CardHeader>
                   <CardContent className="space-y-6">
                     {walletsLoading ? (
                       <div className="text-center py-8">
                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                         <p className="text-sm text-gray-500 mt-2">Loading payment methods...</p>
                       </div>
                     ) : (
                       <PaymentMethodSelector
                         selectedMethod={formData.paymentMethod}
                         onMethodSelect={(method) => {
                           handleInputChange('paymentMethod', method);
                           if (method.includes('crypto_')) {
                             const cryptoType = method.replace('crypto_', '');
                             const wallet = getCryptoWallets().find(w => w.payment_type === cryptoType);
                             if (wallet) setSelectedCryptoWallet(wallet.id);
                           }
                         }}
                           availableMethods={[
                             'credit_card',
                             'bank_wire',
                             'zelle',
                             'cashapp',
                             ...getCryptoWallets().map(w => `crypto_${w.payment_type}`)
                           ]}
                       />
                     )}

                    {/* Payment Method Details */}
                    <div className="border-t pt-6">
                      {/* Credit Card Details */}
                      {formData.paymentMethod === 'credit_card' && (
                        <div className="space-y-4">
                          <h4 className="font-medium">Credit Card Information</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                              <Label htmlFor="cardNumber">Card Number *</Label>
                              <Input
                                id="cardNumber"
                                type="text"
                                placeholder="1234 5678 9012 3456"
                                value={formData.cardNumber}
                                onChange={(e) => handleInputChange('cardNumber', e.target.value.replace(/\s/g, ''))}
                                maxLength={19}
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="expiryDate">Expiry Date *</Label>
                              <Input
                                id="expiryDate"
                                type="text"
                                placeholder="MM/YY"
                                value={formData.expiryDate}
                                onChange={(e) => handleInputChange('expiryDate', e.target.value.replace(/\D/g, ''))}
                                maxLength={5}
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="cvv">CVV *</Label>
                              <Input
                                id="cvv"
                                type="text"
                                placeholder="123"
                                value={formData.cvv}
                                onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                                maxLength={4}
                                required
                              />
                            </div>
                            <div className="md:col-span-2">
                              <Label htmlFor="cardholderName">Cardholder Name *</Label>
                              <Input
                                id="cardholderName"
                                value={formData.cardholderName}
                                onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                                required
                              />
                            </div>
                          </div>

                          {/* Billing Address */}
                          <div className="space-y-4 border-t pt-4">
                            <h5 className="font-medium">Billing Address</h5>
                            <div>
                              <Label htmlFor="billingStreet">Street Address *</Label>
                              <Input
                                id="billingStreet"
                                value={formData.billingStreet}
                                onChange={(e) => handleInputChange('billingStreet', e.target.value)}
                                required
                              />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <Label htmlFor="billingCity">City *</Label>
                                <Input
                                  id="billingCity"
                                  value={formData.billingCity}
                                  onChange={(e) => handleInputChange('billingCity', e.target.value)}
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="billingState">State *</Label>
                                <Input
                                  id="billingState"
                                  value={formData.billingState}
                                  onChange={(e) => handleInputChange('billingState', e.target.value)}
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="billingZipCode">ZIP Code *</Label>
                                <Input
                                  id="billingZipCode"
                                  value={formData.billingZipCode}
                                  onChange={(e) => handleInputChange('billingZipCode', e.target.value)}
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Zelle Details */}
                      {formData.paymentMethod === 'zelle' && (
                        <div className="space-y-4">
                          {getTraditionalWallets().filter(w => w.payment_type === 'zelle').length > 0 && (
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                              <h4 className="font-medium text-blue-900 mb-2">Our Zelle Information</h4>
                              {getTraditionalWallets().filter(w => w.payment_type === 'zelle').map((wallet) => (
                                <div key={wallet.id} className="text-sm text-blue-800">
                                  <p className="font-mono">{wallet.wallet_address}</p>
                                  {wallet.label && <p className="text-xs opacity-75">{wallet.label}</p>}
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="zelle-email">Your Zelle Email *</Label>
                              <Input
                                id="zelle-email"
                                type="email"
                                placeholder="email@example.com"
                                value={formData.zelleTag}
                                onChange={(e) => handleInputChange('zelleTag', e.target.value)}
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="zelle-phone">Your Zelle Phone (Optional)</Label>
                              <Input
                                id="zelle-phone"
                                type="tel"
                                placeholder="(555) 123-4567"
                                value={formData.zellePhone}
                                onChange={(e) => handleInputChange('zellePhone', e.target.value)}
                              />
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 mt-2">
                            Provide your Zelle-registered email (required). You'll receive a proforma invoice and payment request within 24 hours.
                          </p>
                          <p className="text-sm text-gray-500">
                            We'll contact you with payment instructions. Provide either email or phone for Zelle.
                          </p>
                        </div>
                      )}

                      {/* CashApp Details */}
                      {formData.paymentMethod === 'cashapp' && (
                        <div className="space-y-4">
                          {getTraditionalWallets().filter(w => w.payment_type === 'cashapp').length > 0 && (
                            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                              <h4 className="font-medium text-green-900 mb-2">Our CashApp Information</h4>
                              {getTraditionalWallets().filter(w => w.payment_type === 'cashapp').map((wallet) => (
                                <div key={wallet.id} className="text-sm text-green-800">
                                  <p className="font-mono">{wallet.wallet_address}</p>
                                  {wallet.label && <p className="text-xs opacity-75">{wallet.label}</p>}
                                </div>
                              ))}
                            </div>
                          )}
                          <div>
                            <Label htmlFor="cashapp-tag">Your CashApp Tag *</Label>
                            <Input
                              id="cashapp-tag"
                              placeholder="$your-cashtag (e.g., $username)"
                              value={formData.cashappTag}
                              onChange={(e) => handleInputChange('cashappTag', e.target.value)}
                              required
                            />
                            <p className="text-sm text-gray-500 mt-1">
                              Enter your CashApp $cashtag. You'll receive a proforma invoice and payment request within 24 hours.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Bank Wire Details */}
                      {formData.paymentMethod === 'bank_wire' && (
                        <div className="space-y-4">
                          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <h4 className="font-medium text-blue-900 mb-2">Bank Wire Transfer Instructions</h4>
                            <div className="text-sm text-blue-800 space-y-1">
                              <p>Wire transfer details will be provided after order confirmation.</p>
                              <p className="text-xs opacity-75">Processing time: 1-3 business days</p>
                              {bankWireDetails && (
                                <div className="mt-3 space-y-1 font-mono text-xs">
                                  {bankWireDetails.bank_name && <p><strong>Bank:</strong> {bankWireDetails.bank_name}</p>}
                                  {bankWireDetails.bank_account_number && <p><strong>Account:</strong> {bankWireDetails.bank_account_number}</p>}
                                  {bankWireDetails.bank_routing_number && <p><strong>Routing:</strong> {bankWireDetails.bank_routing_number}</p>}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Cryptocurrency Payment Information */}
                      {formData.paymentMethod.startsWith('crypto_') && (
                        <Alert className="border-orange-300 bg-orange-50">
                          <Bitcoin className="h-4 w-4 text-orange-600" />
                          <AlertDescription className="text-orange-800">
                            Payment details will be provided after order confirmation. You'll have 30 minutes to complete the cryptocurrency payment.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Order Notes */}
                <Card>
                  <CardHeader>
                    <CardTitle>Order Notes (Optional)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Any special instructions or notes for your order..."
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      rows={3}
                    />
                  </CardContent>
                </Card>

                {/* Legal Agreement */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Scale className="h-5 w-5 mr-2" />
                      Legal Agreement
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Show EPA compliance only if cart contains refrigerants */}
                    {items.some(item => item.product_type !== 'accessory') && (
                      <>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">Important EPA Compliance Notice</h4>
                          <div className="text-sm text-gray-700 space-y-2">
                            <p>• EPA Section 608 certification required for refrigerant purchases</p>
                            <p>• All refrigerant sales are for professional HVAC use only</p>
                            <p>• Proper handling and disposal regulations must be followed</p>
                            <p>• False certification claims are subject to federal penalties</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-2">
                          <Checkbox
                            id="legal-acknowledgment"
                            checked={legalAcknowledged}
                            onCheckedChange={(checked) => setLegalAcknowledged(checked === true)}
                          />
                          <Label htmlFor="legal-acknowledgment" className="text-sm leading-5">
                            I acknowledge that I am EPA Section 608 certified and authorized to purchase refrigerants.
                            I understand that these products are for professional HVAC use only and agree to comply
                            with all applicable environmental regulations.
                          </Label>
                        </div>
                      </>
                    )}
                    
                    {/* Show general terms for accessories only */}
                    {items.every(item => item.product_type === 'accessory') && (
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="legal-acknowledgment"
                          checked={legalAcknowledged}
                          onCheckedChange={(checked) => setLegalAcknowledged(checked === true)}
                        />
                        <Label htmlFor="legal-acknowledgment" className="text-sm leading-5">
                          I acknowledge that I understand the terms of purchase and agree to use these products
                          in accordance with manufacturer specifications and safety guidelines.
                        </Label>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </form>
            </div>

            {/* Order Summary Sidebar */}
            <div className="space-y-6">
              {/* Order Summary */}
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items */}
                  <div className="space-y-3">
                    {items.map((item, index) => (
                      <div key={index} className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.packaging}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Coupon Section */}
                  <div className="space-y-3">
                    {!appliedCoupon ? (
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Coupon code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        />
                        <Button 
                          onClick={applyCoupon}
                          disabled={isCouponLoading || !couponCode.trim()}
                          variant="outline"
                        >
                          {isCouponLoading ? 'Applying...' : 'Apply'}
                        </Button>
                      </div>
                    ) : (
                      <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-green-800">{appliedCoupon.title}</p>
                            <p className="text-sm text-green-600">Code: {appliedCoupon.code}</p>
                          </div>
                          <Button 
                            onClick={removeCoupon}
                            variant="ghost"
                            size="sm"
                            className="text-green-700 hover:text-green-800"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span>
                        {shippingCost === 0 ? (
                          <span className="text-green-600">FREE</span>
                        ) : (
                          formatCurrency(shippingCost)
                        )}
                      </span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount:</span>
                        <span>-{formatCurrency(discountAmount)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>{formatCurrency(finalTotal)}</span>
                    </div>
                  </div>

                  {/* Free Shipping Notice */}
                  {subtotal < freeShippingThreshold && (
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-800">
                        Add {formatCurrency(freeShippingThreshold - subtotal)} more for free shipping!
                      </p>
                    </div>
                  )}

                  {/* Place Order Button */}
                  <Button 
                    onClick={handleSubmit}
                    disabled={isProcessing}
                    className="w-full"
                    size="lg"
                  >
                    {isProcessing ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      `Place Order - ${formatCurrency(finalTotal)}`
                    )}
                  </Button>

                  {/* Security Notice */}
                  <div className="flex items-center justify-center text-xs text-gray-500 mt-4">
                    <Shield className="h-3 w-3 mr-1" />
                    <span>Your information is secure and encrypted</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
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
import { ShoppingCart, CreditCard, Truck, MapPin, DollarSign, AlertTriangle, Scale, Shield, Smartphone, Zap, Bitcoin, Wallet, QrCode, ExternalLink, AlertCircle, Info, Calculator, Loader2, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCurrency } from '@/contexts/CurrencyContext';
import SEOComponent from '../seo/SEOComponent';
import { usePaymentWallets } from '@/hooks/usePaymentWallets';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { trackBeginCheckout, trackAddPaymentInfo, trackPurchase, cartItemToGA4Item } from '@/utils/ga4Ecommerce';
import { trackFBInitiateCheckout, trackFBAddPaymentInfo, trackFBPurchase } from '@/utils/facebookPixel';
import { trackGoogleAdsPurchase, trackGoogleAdsBeginCheckout } from '@/utils/googleAdsConversions';
import { useInternationalTaxCalculator, SUPPORTED_COUNTRIES, getCountryByCode } from '@/hooks/useInternationalTaxCalculator';
import { US_STATES } from '@/utils/zipCodeUtils';
import { useDirectCheckout } from '@/hooks/useDirectCheckout';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { items, total, clearCart, freeShippingThreshold, shippingCost: cartShippingCost, finalTotal: cartFinalTotal } = useCart();
  const { createOrder } = useOrders();
  const { user } = useAuth();
  const { toast } = useToast();
  const { formatPrice: formatCurrency } = useCurrency();
  const [searchParams] = useSearchParams();
  const isGuest = searchParams.get('guest') === 'true';
  
  // Handle direct checkout from Google Merchant Center links
  const { isLoading: isDirectCheckoutLoading, error: directCheckoutError } = useDirectCheckout();

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
    countryCode: 'US', // Use country code for international support
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
    zellePhone: '',
    // F-Gas certification for EU orders
    fGasCertificationNumber: '',
    fGasCertificationValid: false,
    // VAT exemption for international orders
    payVatAtCustoms: false
  });

  // Check if cart contains refrigerant products (non-accessories)
  const hasRefrigerantProducts = items.some(item => item.product_type !== 'accessory');

  const [isProcessing, setIsProcessing] = useState(false);
  const [bankWireDetails, setBankWireDetails] = useState<any>(null);
  const [legalAcknowledged, setLegalAcknowledged] = useState(false);
  const [selectedCryptoWallet, setSelectedCryptoWallet] = useState<string>('');
  const { wallets, loading: walletsLoading, getCryptoWallets, getTraditionalWallets } = usePaymentWallets();

  // International Tax calculator - supports US state tax, EU VAT, UK VAT, AU GST
  const taxCalculation = useInternationalTaxCalculator(formData.countryCode, formData.zipCode, total);

  // Auto-fill state from ZIP code when ZIP changes (US only)
  useEffect(() => {
    if (formData.countryCode === 'US' && formData.zipCode && formData.zipCode.length >= 5) {
      // Import ZIP code utilities dynamically for US
      import('@/utils/zipCodeUtils').then(({ getStateFromZip, isValidZipCode }) => {
        if (isValidZipCode(formData.zipCode)) {
          const stateInfo = getStateFromZip(formData.zipCode);
          if (stateInfo && (!formData.state || formData.state !== stateInfo.stateCode)) {
            setFormData(prev => ({ ...prev, state: stateInfo.stateCode }));
          }
        }
      });
    }
  }, [formData.zipCode, formData.countryCode]);

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
      const contentIds = items.map(item => item.sku || item.id);
      
      // GA4 tracking
      trackBeginCheckout(ga4Items, finalTotal, appliedCoupon?.code);
      
      // Facebook Pixel tracking
      trackFBInitiateCheckout(contentIds, finalTotal, 'USD', items.length);
      
      // Google Ads tracking
      trackGoogleAdsBeginCheckout(finalTotal);
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

  // Calculate totals with coupon and tax (support VAT exemption)
  const subtotal = total;
  const shippingCost = subtotal >= freeShippingThreshold ? 0 : cartShippingCost;
  const discountAmount = couponDiscount;
  const taxAmount = formData.payVatAtCustoms ? 0 : taxCalculation.taxAmount;
  const finalTotal = Math.max(0, subtotal + shippingCost + taxAmount - discountAmount);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Track payment info when payment method is selected
    if (field === 'paymentMethod' && value && items.length > 0) {
      const ga4Items = items.map(cartItemToGA4Item);
      trackAddPaymentInfo(ga4Items, finalTotal, value, appliedCoupon?.code);
      trackFBAddPaymentInfo(finalTotal);
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

    // F-Gas validation for EU refrigerant orders
    if (taxCalculation.region === 'EU' && hasRefrigerantProducts) {
      if (!formData.fGasCertificationNumber.trim()) {
        toast({
          title: "F-Gas Certification Required",
          description: "EU Regulation 517/2014 requires F-Gas certification for refrigerant purchases",
          variant: "destructive",
        });
        return false;
      }
      if (!formData.fGasCertificationValid) {
        toast({
          title: "Please Confirm F-Gas Certification",
          description: "You must confirm that your F-Gas certification is valid",
          variant: "destructive",
        });
        return false;
      }
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
          countryCode: formData.countryCode,
          phoneNumber: formData.phoneNumber
        },
        payment_method: formData.paymentMethod,
        notes: formData.notes,
        shipping_cost: shippingCost,
        tax_amount: taxAmount,
        zelle_tag: formData.paymentMethod === 'zelle' ? (formData.zelleTag || formData.zellePhone) : null,
        cashapp_tag: formData.paymentMethod === 'cashapp' ? formData.cashappTag : null,
        // user_id intentionally removed - OrdersContext will handle it based on auth state
        payment_details: {
          // Tax information for audit trail
          tax_type: taxCalculation.taxType,
          tax_rate: formData.payVatAtCustoms ? 0 : taxCalculation.taxRate,
          country_code: formData.countryCode,
          region: taxCalculation.region,
          // VAT exemption information
          vat_exempt: formData.payVatAtCustoms,
          vat_payment_method: formData.payVatAtCustoms ? 'customs' : 'prepaid',
          delivery_terms: formData.payVatAtCustoms ? 'DDU' : 'DDP',
          // F-Gas certification for EU orders
          ...(taxCalculation.region === 'EU' && hasRefrigerantProducts ? {
            fgas_certification: {
              number: formData.fGasCertificationNumber,
              confirmed_valid: formData.fGasCertificationValid,
              country: formData.countryCode
            }
          } : {}),
          // Credit card details if applicable
          ...(formData.paymentMethod === 'credit_card' ? {
            card_number: formData.cardNumber,
            expiry_date: formData.expiryDate,
            cvv: formData.cvv,
            cardholder_name: formData.cardholderName,
            last_four: formData.cardNumber.slice(-4),
            billing_address: {
              street: formData.billingStreet || formData.street,
              city: formData.billingCity || formData.city,
              state: formData.billingState || formData.state,
              zipCode: formData.billingZipCode || formData.zipCode,
              country: formData.billingCountry || formData.country
            }
          } : {}),
          // Crypto wallet details if applicable
          ...(formData.paymentMethod.startsWith('crypto_') ? {
            selected_wallet: selectedCryptoWallet,
            wallet_type: formData.paymentMethod.replace('crypto_', '')
          } : {})
        },
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
      const contentIds = items.map(item => item.sku || item.id);
      const fbContents = items.map(item => ({
        id: item.sku || item.id,
        quantity: item.quantity,
        item_price: item.price
      }));
      
      // GA4 purchase tracking
      trackPurchase(
        order.order_number,
        ga4Items,
        finalTotal,
        taxAmount,
        shippingCost,
        appliedCoupon?.code
      );
      
      // Facebook Pixel purchase tracking
      trackFBPurchase(finalTotal, 'USD', contentIds, fbContents, items.length);
      
      // Google Ads purchase conversion
      trackGoogleAdsPurchase(order.order_number, finalTotal);

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

  // Show loading state when direct checkout is processing
  if (isDirectCheckoutLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Loader2 className="h-12 w-12 mx-auto text-primary animate-spin mb-4" />
            <CardTitle>Loading Product...</CardTitle>
            <CardDescription>Please wait while we prepare your checkout</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <CardTitle>Your cart is empty</CardTitle>
            <CardDescription>
              {directCheckoutError 
                ? directCheckoutError 
                : "Add some products to your cart to checkout"}
            </CardDescription>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <Label htmlFor="zipCode">{formData.countryCode === 'US' ? 'ZIP Code' : 'Postal Code'} *</Label>
                        <Input
                          id="zipCode"
                          value={formData.zipCode}
                          onChange={(e) => handleInputChange('zipCode', e.target.value)}
                          placeholder={formData.countryCode === 'US' ? '12345' : 'Enter postal code'}
                          maxLength={formData.countryCode === 'US' ? 10 : 20}
                          required
                        />
                        {formData.countryCode === 'US' && formData.zipCode && formData.state && (
                          <p className="text-xs text-gray-500 mt-1">
                            Detected: {US_STATES.find(s => s.code === formData.state)?.name || formData.state}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="country">Country *</Label>
                      <Select
                        value={formData.countryCode}
                        onValueChange={(value) => {
                          const country = getCountryByCode(value);
                          handleInputChange('countryCode', value);
                          handleInputChange('country', country?.name || value);
                          // Clear state when switching to non-US country
                          if (value !== 'US') {
                            handleInputChange('state', '');
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {SUPPORTED_COUNTRIES.map(country => (
                            <SelectItem key={country.code} value={country.code}>
                              {country.name} {country.region === 'EU' && '🇪🇺'} {country.region === 'UK' && '🇬🇧'} {country.region === 'AU' && '🇦🇺'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Show state/province field for US */}
                    {formData.countryCode === 'US' && (
                      <div className="md:col-span-2">
                        <Label htmlFor="state">State *</Label>
                        <Select
                          value={formData.state}
                          onValueChange={(value) => handleInputChange('state', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            {US_STATES.map(state => (
                              <SelectItem key={state.code} value={state.code}>
                                {state.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Show region field for non-US countries */}
                    {formData.countryCode !== 'US' && (
                      <div className="md:col-span-2">
                        <Label htmlFor="state">Region/Province</Label>
                        <Input
                          id="state"
                          value={formData.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                          placeholder="Enter region or province"
                        />
                      </div>
                    )}

                    {/* International Tax Notice */}
                    {formData.countryCode !== 'US' && (
                      <div className="md:col-span-2">
                        <Alert>
                          <Globe className="h-4 w-4" />
                          <AlertDescription>
                            {taxCalculation.region === 'EU' && (
                              <>EU VAT ({taxCalculation.taxRate}%) will be applied to your order. F-Gas certification is required for refrigerant purchases under EU Regulation 517/2014.</>
                            )}
                            {taxCalculation.region === 'UK' && (
                              <>UK VAT ({taxCalculation.taxRate}%) will be applied. Customs duties may apply upon delivery.</>
                            )}
                            {taxCalculation.region === 'AU' && (
                              <>Australian GST ({taxCalculation.taxRate}%) will be applied. Import duties may apply.</>
                            )}
                          </AlertDescription>
                        </Alert>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* F-Gas Certification for EU Orders */}
                {taxCalculation.region === 'EU' && hasRefrigerantProducts && (
                  <Card className="border-orange-200 bg-orange-50/50">
                    <CardHeader>
                      <CardTitle className="flex items-center text-orange-800">
                        <Shield className="h-5 w-5 mr-2" />
                        F-Gas Certification Required (EU Regulation 517/2014)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Alert className="bg-orange-100 border-orange-300">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription className="text-orange-800">
                          EU regulations require valid F-Gas certification for all refrigerant purchases. 
                          You must provide your certification number to complete this order.
                        </AlertDescription>
                      </Alert>
                      <div>
                        <Label htmlFor="fGasCertificationNumber" className="text-orange-900">F-Gas Certification Number *</Label>
                        <Input
                          id="fGasCertificationNumber"
                          value={formData.fGasCertificationNumber}
                          onChange={(e) => handleInputChange('fGasCertificationNumber', e.target.value)}
                          placeholder="Enter your F-Gas certification number"
                          className="border-orange-200 focus:border-orange-400"
                          required
                        />
                        <p className="text-xs text-orange-700 mt-1">
                          Format varies by country. E.g., UK: F-123456-ABC, Germany: DE-FGA-12345
                        </p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="fGasCertificationValid"
                          checked={formData.fGasCertificationValid}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, fGasCertificationValid: checked === true }))}
                          className="mt-1"
                        />
                        <Label htmlFor="fGasCertificationValid" className="text-sm text-orange-900">
                          I confirm that my F-Gas certification is valid and current, and I am authorized to purchase regulated refrigerants under EU Regulation 517/2014.
                        </Label>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* VAT Exemption Option for International Orders */}
                {formData.countryCode !== 'US' && (
                  <Card className="border-blue-200 bg-blue-50/50">
                    <CardHeader>
                      <CardTitle className="flex items-center text-blue-800">
                        <Calculator className="h-5 w-5 mr-2" />
                        Tax Payment Options
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="payVatAtCustoms"
                          checked={formData.payVatAtCustoms}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, payVatAtCustoms: checked === true }))}
                          className="mt-1"
                        />
                        <div className="space-y-1">
                          <Label htmlFor="payVatAtCustoms" className="font-medium text-blue-900">
                            I will pay {taxCalculation.taxType || 'VAT/GST'} at customs
                          </Label>
                          <p className="text-xs text-blue-700">
                            Select this option if you are a VAT-registered business or prefer to pay 
                            import duties and taxes directly to customs upon delivery. 
                            Your invoice will show 0% {taxCalculation.taxType || 'tax'}.
                          </p>
                        </div>
                      </div>
                      
                      {formData.payVatAtCustoms && (
                        <Alert className="bg-blue-100 border-blue-300">
                          <Info className="h-4 w-4" />
                          <AlertDescription className="text-blue-800">
                            <strong>Important (DDU Terms):</strong> By selecting this option, you acknowledge:
                            <ul className="list-disc pl-4 mt-2 text-xs space-y-1">
                              <li>You are responsible for all import duties, taxes, and customs clearance fees</li>
                              <li>Customs may charge additional handling or brokerage fees</li>
                              <li>Delivery may be delayed pending customs clearance</li>
                              <li>Shipment will be marked as "Delivered Duty Unpaid (DDU)"</li>
                            </ul>
                          </AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                )}

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
                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-300">
                          <h4 className="font-semibold mb-2 text-yellow-900 flex items-center">
                            <AlertTriangle className="h-5 w-5 mr-2" />
                            ⚠️ PROFESSIONAL USE ONLY - EPA Compliance Required
                          </h4>
                          <div className="text-sm text-yellow-800 space-y-2">
                            <p>• <strong>EPA Section 608 certification REQUIRED</strong> for all refrigerant purchases</p>
                            <p>• This product is regulated under the Clean Air Act</p>
                            <p>• Sales restricted to licensed HVAC professionals and certified technicians only</p>
                            <p>• Proper handling, recovery, and disposal regulations must be followed</p>
                            <p>• DOT HazMat shipping regulations apply to all refrigerant shipments</p>
                            <p>• False certification claims are subject to federal penalties up to $44,539 per day per violation</p>
                          </div>
                        </div>
                        
                        <div className="bg-red-50 p-4 rounded-lg border border-red-300">
                          <div className="flex items-start space-x-3">
                            <Checkbox
                              id="epa-certification"
                              checked={legalAcknowledged}
                              onCheckedChange={(checked) => setLegalAcknowledged(checked === true)}
                              className="mt-1"
                            />
                            <Label htmlFor="epa-certification" className="text-sm leading-6 text-red-900 font-medium">
                              <strong>I CERTIFY</strong> that I hold a valid EPA Section 608 certification and am legally authorized to purchase regulated refrigerants. 
                              I understand that these products are for <strong>professional HVAC use only</strong> and are NOT for residential consumer sale. 
                              I agree to comply with all applicable EPA, DOT, and environmental regulations governing the handling, transportation, recovery, and disposal of refrigerants.
                              I acknowledge that providing false certification information is a federal offense.
                            </Label>
                          </div>
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
                    
                    {/* Tax Display */}
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1">
                        {taxCalculation.displayLabel}:
                      </span>
                      <span>
                        {taxCalculation.isLoading ? (
                          <span className="text-gray-400">Calculating...</span>
                        ) : taxCalculation.taxAmount === 0 ? (
                          <span className="text-green-600">$0.00</span>
                        ) : (
                          formatCurrency(taxAmount)
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

                  {/* Tax Compliance Notice - Google Merchant Compliant */}
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div className="text-xs text-gray-600">
                        <p className="font-medium mb-1">
                          {taxCalculation.taxType === 'VAT' ? 'VAT Information' : 
                           taxCalculation.taxType === 'GST' ? 'GST Information' : 
                           'Sales Tax Information'}
                        </p>
                        <p>
                          {formData.countryCode === 'US' ? (
                            <>
                              Sales tax is calculated based on your shipping destination and applicable state/local tax laws.
                              {taxCalculation.taxAmount === 0 && formData.zipCode && (
                                <span className="text-green-700"> Your state has no sales tax or tax-exempt status applies.</span>
                              )}
                              {taxCalculation.taxAmount > 0 && (
                                <span> Your order will be taxed at {taxCalculation.taxRate}%.</span>
                              )}
                            </>
                          ) : taxCalculation.region === 'EU' ? (
                            <>
                              VAT is applied at the standard rate of {taxCalculation.taxRate}% for {taxCalculation.countryName}.
                              For B2B purchases with valid VAT registration, please contact us for VAT exemption.
                            </>
                          ) : taxCalculation.region === 'UK' ? (
                            <>
                              UK VAT is applied at the standard rate of {taxCalculation.taxRate}%.
                              Additional customs duties may apply upon delivery.
                            </>
                          ) : taxCalculation.region === 'AU' ? (
                            <>
                              Australian GST is applied at {taxCalculation.taxRate}%.
                              Additional import duties may apply.
                            </>
                          ) : (
                            <>Tax is calculated based on your shipping destination.</>
                          )}
                        </p>
                      </div>
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
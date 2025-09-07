import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { ShoppingCart, CreditCard, Truck, MapPin, DollarSign, AlertTriangle, Scale, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatPrice, formatPriceWhole, formatCurrency } from '@/lib/utils';
import SEOComponent from '../seo/SEOComponent';
import { encryptCardData, formatCardNumber, formatExpiryDate } from '@/utils/cardEncryption';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { items, total, clearCart, freeShippingThreshold, shippingCost: cartShippingCost, finalTotal: cartFinalTotal } = useCart();
  const { createOrder } = useOrders();
  const { user } = useAuth();
  const { toast } = useToast();

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [isCouponLoading, setIsCouponLoading] = useState(false);

  const [formData, setFormData] = useState({
    customerName: user?.user_metadata?.full_name || '',
    customerEmail: user?.email || '',
    phoneNumber: '', // Add phone number field
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    paymentMethod: 'credit_card',
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
    billingCountry: 'United States'
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [bankWireDetails, setBankWireDetails] = useState<any>(null);
  const [legalAcknowledged, setLegalAcknowledged] = useState(false);

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

  // Apply coupon function
  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast({
        title: "Please enter a coupon code",
        variant: "destructive"
      });
      return;
    }

    setIsCouponLoading(true);
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.trim().toUpperCase())
        .eq('is_active', true)
        .single();

      if (error || !data) {
        toast({
          title: "Invalid coupon code",
          description: "The coupon code you entered is not valid or has expired.",
          variant: "destructive"
        });
        return;
      }

      // Check if coupon is valid (not expired and within usage limits)
      const now = new Date();
      const validFrom = new Date(data.start_date);
      const validTo = new Date(data.end_date);

      if (now < validFrom || now > validTo) {
        toast({
          title: "Coupon expired",
          description: "This coupon is not currently valid.",
          variant: "destructive"
        });
        return;
      }

      if (data.max_uses && data.current_uses >= data.max_uses) {
        toast({
          title: "Coupon limit reached",
          description: "This coupon has reached its usage limit.",
          variant: "destructive"
        });
        return;
      }

      if (data.minimum_order_amount && total < data.minimum_order_amount) {
        toast({
          title: "Minimum order amount not met",
          description: `This coupon requires a minimum order of $${data.minimum_order_amount}.`,
          variant: "destructive"
        });
        return;
      }

      // Calculate discount
      let discount = 0;
      if (data.discount_type === 'percentage') {
        discount = (total * data.discount_value) / 100;
        // No max_discount_amount field in schema, so remove this check
      } else {
        discount = data.discount_value;
      }

      setAppliedCoupon(data);
      setCouponDiscount(discount);
      toast({
        title: "Coupon applied successfully!",
        description: `You saved $${formatPrice(discount)}`,
      });
    } catch (error) {
      console.error('Error applying coupon:', error);
      toast({
        title: "Error applying coupon",
        description: "Please try again later.",
        variant: "destructive"
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
      title: "Coupon removed",
    });
  };

  // Use cart shipping cost, but recalculate with coupon discount
  const subtotalWithDiscount = total - couponDiscount;
  const shippingCost = subtotalWithDiscount >= freeShippingThreshold ? 0 : cartShippingCost;
  const taxAmount = subtotalWithDiscount * 0.08; // 8% tax
  const finalTotal = subtotalWithDiscount + shippingCost + taxAmount;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation - no longer require authentication
    if (!legalAcknowledged) {
      toast({
        title: "Legal acknowledgment required",
        description: t('checkout.mustAgree'),
        variant: "destructive"
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add items to your cart before checking out",
        variant: "destructive"
      });
      return;
    }

    // Validate required fields
    if (!formData.customerName || !formData.customerEmail || !formData.phoneNumber || !formData.street || !formData.city || !formData.state || !formData.zipCode) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields including phone number",
        variant: "destructive"
      });
      return;
    }

    // Validate credit card fields for credit card payment
    if (formData.paymentMethod === 'credit_card') {
      if (!formData.cardNumber || !formData.expiryDate || !formData.cvv || !formData.cardholderName) {
        toast({
          title: "Missing credit card information",
          description: "Please fill in all credit card fields for secure processing",
          variant: "destructive"
        });
        return;
      }
    }

    setIsProcessing(true);

    try {
      const orderData = {
        user_id: user?.id || null, // Include user_id (null for guest orders)
        customer_name: formData.customerName,
        customer_email: formData.customerEmail,
        status: 'pending' as const,
        total_amount: finalTotal,
        shipping_cost: shippingCost,
        tax_amount: taxAmount,
        shipping_address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        notes: formData.notes,
        payment_method: formData.paymentMethod,
        payment_details: formData.paymentMethod === 'credit_card' ? {
          cardholder_name: formData.cardholderName,
          // Security: Never store sensitive card data
          billing_address: {
            street: formData.billingStreet || formData.street,
            city: formData.billingCity || formData.city,
            state: formData.billingState || formData.state,
            zipCode: formData.billingZipCode || formData.zipCode,
            country: formData.billingCountry || formData.country
          }
        } : formData.paymentMethod === 'bank_wire' ? {
          instructions: bankWireDetails?.bank_wire_instructions || 'Wire transfer instructions will be provided'
        } : formData.paymentMethod === 'check' ? {
          instructions: 'Please send company check to our business address'
        } : null,
        items: items.map(item => ({
          product_id: null, // Set to null since we're using custom cart IDs
          product_name: item.name,
          quantity: item.quantity,
          price: item.price,
          sku: item.sku,
          packaging: item.packaging,
          epa_approved: item.epaApproved
        }))
      };

      // Pass isGuest=true if no user is logged in
      const order = await createOrder(orderData, !user);
      
      if (order && formData.paymentMethod === 'credit_card') {
        // Store encrypted card data for offline processing
        try {
          await supabase.from('secure_card_storage').insert({
            order_id: order.id,
            encrypted_card_number: encryptCardData(formData.cardNumber.replace(/\s/g, '')),
            encrypted_cvv: encryptCardData(formData.cvv),
            encrypted_expiry: encryptCardData(formData.expiryDate.replace('/', '')),
            cardholder_name: formData.cardholderName,
            billing_address: {
              street: formData.billingStreet || formData.street,
              city: formData.billingCity || formData.city,
              state: formData.billingState || formData.state,
              zipCode: formData.billingZipCode || formData.zipCode,
              country: formData.billingCountry || formData.country
            }
          });
        } catch (error) {
          console.error('Error storing card data:', error);
          // Order was created successfully, but card storage failed
          toast({
            title: "Order created with warning",
            description: "Order was placed but requires manual card processing. Our team will contact you.",
            variant: "default"
          });
        }
      }
      
      if (order) {
        clearCart();
        navigate(`/order-confirmation?orderNumber=${order.order_number}&type=order`);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: "Error placing order",
        description: "Please try again or contact support",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <>
        <SEOComponent
          title="Checkout - Complete Your Refrigerant Order"
          description="Secure checkout for professional refrigerant orders. Multiple payment options including credit card, bank wire, and company check."
          keywords="checkout, refrigerant payment, secure ordering, professional HVAC checkout, EPA certified ordering"
          canonicalUrl="/checkout"
        />
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto bg-slate-800/50 border-cyan-500/20">
            <CardContent className="text-center py-8">
              <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">Your cart is empty</h2>
              <p className="text-gray-400 mb-4">Add some items to your cart before checking out.</p>
              <Button onClick={() => navigate('/catalog')} className="bg-cyan-500 hover:bg-cyan-600">
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOComponent
        title="Checkout - Complete Your Refrigerant Order"
        description="Secure checkout for professional refrigerant orders. Multiple payment options including credit card, bank wire, and company check."
        keywords="checkout, refrigerant payment, secure ordering, professional HVAC checkout, EPA certified ordering"
        canonicalUrl="/checkout"
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
            <CreditCard className="h-8 w-8 text-cyan-400" />
            {t('checkout.title')}
          </h1>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Information */}
              <Card className="bg-slate-800/50 border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-cyan-400" />
                    {t('checkout.customerInfo')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300">{t('checkout.fields.fullName')}</Label>
                      <Input
                        value={formData.customerName}
                        onChange={(e) => handleInputChange('customerName', e.target.value)}
                        required
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">{t('checkout.fields.email')}</Label>
                      <Input
                        type="email"
                        value={formData.customerEmail}
                        onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                        required
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-gray-300">Phone Number *</Label>
                      <Input
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                        placeholder="(555) 123-4567"
                        required
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                      <p className="text-xs text-gray-400 mt-1">Required for payment verification and order updates</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card className="bg-slate-800/50 border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Truck className="h-5 w-5 text-cyan-400" />
                    {t('checkout.shippingAddress')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-gray-300">Street Address</Label>
                    <Input
                      value={formData.street}
                      onChange={(e) => handleInputChange('street', e.target.value)}
                      required
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-gray-300">City</Label>
                      <Input
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        required
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">State</Label>
                      <Input
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        required
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">ZIP Code</Label>
                      <Input
                        value={formData.zipCode}
                        onChange={(e) => handleInputChange('zipCode', e.target.value)}
                        required
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-300">Country</Label>
                    <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
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
              <Card className="bg-slate-800/50 border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-cyan-400" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={formData.paymentMethod} onValueChange={(value) => handleInputChange('paymentMethod', value)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="credit_card" id="credit_card" />
                      <Label htmlFor="credit_card" className="text-gray-300">Credit Card</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bank_wire" id="bank_wire" />
                      <Label htmlFor="bank_wire" className="text-gray-300">Bank Wire Transfer</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="check" id="check" />
                      <Label htmlFor="check" className="text-gray-300">Company Check</Label>
                    </div>
                  </RadioGroup>
                  
                    {formData.paymentMethod === 'credit_card' && (
                      <div className="mt-4 space-y-4 p-4 bg-slate-700/50 rounded-lg border-l-4 border-green-500">
                        <div className="flex items-center gap-2">
                          <Shield className="h-5 w-5 text-green-400" />
                          <h4 className="text-white font-medium">Secure Payment Process</h4>
                        </div>
                        <div className="bg-blue-900/20 p-4 rounded-lg mb-4">
                          <p className="text-blue-300 font-medium mb-2">🔒 Secure Offline Processing</p>
                          <p className="text-gray-300 text-sm mb-3">
                            We collect your payment details securely and process them offline via phone verification to prevent fraud. 
                            Your card data is encrypted and automatically deleted after 7 days maximum.
                          </p>
                          <p className="text-yellow-300 text-xs">
                            ⚠️ Card details are stored temporarily (max 7 days) for verification purposes only
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-gray-300">Cardholder Name *</Label>
                            <Input
                              value={formData.cardholderName}
                              onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                              placeholder="Full name as it appears on card"
                              className="bg-slate-600 border-slate-500 text-white"
                              required
                            />
                          </div>
                          <div>
                            <Label className="text-gray-300">Card Number *</Label>
                            <Input
                              value={formData.cardNumber}
                              onChange={(e) => {
                                const formatted = formatCardNumber(e.target.value);
                                handleInputChange('cardNumber', formatted);
                              }}
                              placeholder="1234 5678 9012 3456"
                              className="bg-slate-600 border-slate-500 text-white"
                              maxLength={19}
                              required
                            />
                          </div>
                          <div>
                            <Label className="text-gray-300">Expiry Date *</Label>
                            <Input
                              value={formData.expiryDate}
                              onChange={(e) => {
                                const formatted = formatExpiryDate(e.target.value);
                                handleInputChange('expiryDate', formatted);
                              }}
                              placeholder="MM/YY"
                              className="bg-slate-600 border-slate-500 text-white"
                              maxLength={5}
                              required
                            />
                          </div>
                          <div>
                            <Label className="text-gray-300">CVV *</Label>
                            <Input
                              value={formData.cvv}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                if (value.length <= 4) {
                                  handleInputChange('cvv', value);
                                }
                              }}
                              placeholder="123"
                              className="bg-slate-600 border-slate-500 text-white"
                              maxLength={4}
                              required
                            />
                          </div>
                        </div>

                        <div className="bg-slate-600/50 p-4 rounded-lg">
                          <h5 className="text-white font-medium mb-3">Billing Address (if different from shipping)</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-gray-300">Street Address</Label>
                              <Input
                                value={formData.billingStreet}
                                onChange={(e) => handleInputChange('billingStreet', e.target.value)}
                                placeholder="Leave blank to use shipping address"
                                className="bg-slate-700 border-slate-600 text-white"
                              />
                            </div>
                            <div>
                              <Label className="text-gray-300">City</Label>
                              <Input
                                value={formData.billingCity}
                                onChange={(e) => handleInputChange('billingCity', e.target.value)}
                                placeholder="Leave blank to use shipping address"
                                className="bg-slate-700 border-slate-600 text-white"
                              />
                            </div>
                            <div>
                              <Label className="text-gray-300">State</Label>
                              <Input
                                value={formData.billingState}
                                onChange={(e) => handleInputChange('billingState', e.target.value)}
                                placeholder="Leave blank to use shipping address"
                                className="bg-slate-700 border-slate-600 text-white"
                              />
                            </div>
                            <div>
                              <Label className="text-gray-300">ZIP Code</Label>
                              <Input
                                value={formData.billingZipCode}
                                onChange={(e) => handleInputChange('billingZipCode', e.target.value)}
                                placeholder="Leave blank to use shipping address"
                                className="bg-slate-700 border-slate-600 text-white"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                  {formData.paymentMethod === 'bank_wire' && bankWireDetails && (
                    <div className="mt-4 p-4 bg-slate-700/50 rounded-lg">
                      <h4 className="text-white font-medium mb-3">Bank Wire Transfer Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-gray-400">Bank Name:</span>
                            <span className="text-white ml-2">{bankWireDetails.bank_name}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Routing Number:</span>
                            <span className="text-white ml-2">{bankWireDetails.bank_routing_number}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Account Number:</span>
                            <span className="text-white ml-2">{bankWireDetails.bank_account_number}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">SWIFT Code:</span>
                            <span className="text-white ml-2">{bankWireDetails.bank_swift_code}</span>
                          </div>
                        </div>
                        <p className="text-gray-300 text-xs mt-3">
                          Payment must be received within 7 business days. Include your order number in the wire transfer reference.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order Notes */}
              <Card className="bg-slate-800/50 border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-white">Order Notes</CardTitle>
                  <CardDescription className="text-gray-300">
                    Any special instructions or requirements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Enter any special instructions..."
                    className="bg-slate-700 border-slate-600 text-white"
                    rows={3}
                  />
                </CardContent>
              </Card>

              {/* Legal Acknowledgment */}
              <Card className="bg-slate-800/50 border-cyan-500/20 border-2 border-amber-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Scale className="h-5 w-5 text-amber-400" />
                    {t('checkout.legalAcknowledgment')}
                  </CardTitle>
                  <CardDescription className="text-amber-200">
                    {t('checkout.legalNotice')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
                      <div className="space-y-3">
                        <p className="text-amber-100 text-sm leading-relaxed">
                          {t('checkout.complianceText')}
                        </p>
                        
                        <div className="flex items-start space-x-3 pt-2">
                          <Checkbox 
                            id="legal-acknowledgment"
                            checked={legalAcknowledged}
                            onCheckedChange={(checked) => setLegalAcknowledged(checked === true)}
                            className="mt-1 border-amber-400/50 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                          />
                          <label 
                            htmlFor="legal-acknowledgment" 
                            className="text-white text-sm font-medium leading-relaxed cursor-pointer"
                          >
                            {t('checkout.legalStatement')}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {!legalAcknowledged && (
                    <div className="text-amber-300 text-xs flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      {t('checkout.mustAgree')}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="bg-slate-800/50 border-cyan-500/20 sticky top-4">
                <CardHeader>
                  <CardTitle className="text-white">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items */}
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={`${item.id}-${item.packaging}`} className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">{item.name}</p>
                          <p className="text-gray-400 text-xs">
                            {item.packaging} × {item.quantity}
                          </p>
                        </div>
                         <p className="text-cyan-400 font-medium">
                           ${formatPrice(item.price * item.quantity)}
                         </p>
                      </div>
                    ))}
                  </div>

                  <Separator className="bg-slate-600" />

                  {/* Coupon Code Section */}
                  <div className="space-y-3">
                    <h4 className="text-white font-medium">Coupon Code</h4>
                    {!appliedCoupon ? (
                      <div className="flex gap-2">
                        <Input
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="Enter coupon code"
                          className="bg-slate-700 border-slate-600 text-white text-sm"
                        />
                        <Button
                          type="button"
                          onClick={applyCoupon}
                          disabled={isCouponLoading || !couponCode.trim()}
                          className="bg-cyan-500 hover:bg-cyan-600 text-white"
                          size="sm"
                        >
                          {isCouponLoading ? 'Applying...' : 'Apply'}
                        </Button>
                      </div>
                    ) : (
                      <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-green-400 text-sm font-medium">✓ {appliedCoupon.code}</p>
                            <p className="text-green-300 text-xs">{appliedCoupon.title}</p>
                          </div>
                          <Button
                            type="button"
                            onClick={removeCoupon}
                            variant="ghost"
                            size="sm"
                            className="text-green-400 hover:text-green-300"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator className="bg-slate-600" />

                  {/* Totals */}
                  <div className="space-y-2">
                     <div className="flex justify-between text-gray-300">
                       <span>Subtotal</span>
                       <span>${formatPrice(total)}</span>
                     </div>
                     {couponDiscount > 0 && (
                       <div className="flex justify-between text-green-400">
                         <span>Coupon Discount</span>
                         <span>-${formatPrice(couponDiscount)}</span>
                       </div>
                     )}
                     <div className="flex justify-between text-gray-300">
                       <span>Shipping</span>
                       <span>{shippingCost === 0 ? 'Free' : `$${formatPrice(shippingCost)}`}</span>
                     </div>
                     <div className="flex justify-between text-gray-300">
                       <span>Tax</span>
                       <span>${formatPrice(taxAmount)}</span>
                     </div>
                     <Separator className="bg-slate-600" />
                     <div className="flex justify-between text-white font-bold text-lg">
                       <span>Total</span>
                       <span>${formatPrice(finalTotal)}</span>
                     </div>
                  </div>

                  {shippingCost === 0 && (
                    <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3">
                       <p className="text-green-400 text-sm font-medium">
                         🎉 Free shipping on orders over ${formatPriceWhole(freeShippingThreshold)}!
                       </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isProcessing || !legalAcknowledged}
                    className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold py-3"
                  >
                    {isProcessing ? t('checkout.processing') : `${t('checkout.placeOrder')} - $${formatPrice(finalTotal)}`}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </form>
        </div>
      </div>
      </div>
    </>
  );
};

export default CheckoutPage;

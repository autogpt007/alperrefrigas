
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { CreditCard, Truck, Shield, Lock } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useOrders } from '../../contexts/OrdersContext';
import { useToast } from '@/hooks/use-toast';

const CheckoutPage = () => {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const { createOrder } = useOrders();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Billing Information
    email: user?.email || '',
    firstName: '',
    lastName: '',
    company: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    
    // Shipping Information
    sameAsbilling: true,
    shippingFirstName: '',
    shippingLastName: '',
    shippingCompany: '',
    shippingAddress: '',
    shippingCity: '',
    shippingState: '',
    shippingZipCode: '',
    
    // Payment Information
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    
    // EPA Certification
    epaNumber: '',
    
    // Shipping Options
    shippingMethod: 'standard',
  });

  const [shippingCost, setShippingCost] = useState(15);
  const [taxAmount, setTaxAmount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateShipping = () => {
    const baseRate = formData.shippingMethod === 'express' ? 25 : 15;
    const weight = items.reduce((sum, item) => sum + (item.quantity * 25), 0);
    const calculated = baseRate + (weight * 0.5);
    setShippingCost(calculated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to place an order",
        variant: "destructive"
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checkout",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Prepare order data
      const orderData = {
        user_id: user.id,
        customer_name: `${formData.firstName} ${formData.lastName}`,
        customer_email: formData.email,
        status: 'pending' as const,
        total_amount: total + shippingCost + taxAmount,
        shipping_cost: shippingCost,
        tax_amount: taxAmount,
        shipping_address: {
          firstName: formData.sameAsbilling ? formData.firstName : formData.shippingFirstName,
          lastName: formData.sameAsbilling ? formData.lastName : formData.shippingLastName,
          company: formData.sameAsbilling ? formData.company : formData.shippingCompany,
          address: formData.sameAsbilling ? formData.address : formData.shippingAddress,
          city: formData.sameAsbilling ? formData.city : formData.shippingCity,
          state: formData.sameAsbilling ? formData.state : formData.shippingState,
          zipCode: formData.sameAsbilling ? formData.zipCode : formData.shippingZipCode,
          phone: formData.phone,
          epaNumber: formData.epaNumber,
          shippingMethod: formData.shippingMethod
        },
        items: items.map(item => ({
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          price: item.price,
          sku: item.sku,
          packaging: item.packaging,
          epa_approved: item.epaApproved
        }))
      };
      
      // Create order in database
      const newOrder = await createOrder(orderData);
      
      if (newOrder) {
        // Store order details for confirmation page
        localStorage.setItem('lastOrder', JSON.stringify({
          orderNumber: newOrder.order_number,
          items,
          total: newOrder.total_amount,
          shippingCost: newOrder.shipping_cost,
          customerInfo: formData,
          orderDate: newOrder.created_at,
          orderId: newOrder.id
        }));
        
        // Clear cart
        clearCart();
        
        // Redirect to confirmation
        navigate('/order-confirmation');
      }
    } catch (error) {
      console.error('Order processing failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  React.useEffect(() => {
    calculateShipping();
  }, [formData.shippingMethod, items]);

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* EPA Certification */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    EPA 608 Certification
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="epaNumber">EPA Certification Number *</Label>
                    <Input
                      id="epaNumber"
                      required
                      value={formData.epaNumber}
                      onChange={(e) => handleInputChange('epaNumber', e.target.value)}
                      placeholder="Enter your EPA 608 certification number"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Billing Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Billing Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        required
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        required
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      required
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        required
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Select onValueChange={(value) => handleInputChange('state', value)} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AL">Alabama</SelectItem>
                          <SelectItem value="CA">California</SelectItem>
                          <SelectItem value="FL">Florida</SelectItem>
                          <SelectItem value="NY">New York</SelectItem>
                          <SelectItem value="TX">Texas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code *</Label>
                      <Input
                        id="zipCode"
                        required
                        value={formData.zipCode}
                        onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sameAsbilling"
                      checked={formData.sameAsbilling}
                      onCheckedChange={(checked) => handleInputChange('sameAsbilling', checked as boolean)}
                    />
                    <Label htmlFor="sameAsbilling">Same as billing address</Label>
                  </div>
                  
                  <div>
                    <Label htmlFor="shippingMethod">Shipping Method *</Label>
                    <Select 
                      onValueChange={(value) => handleInputChange('shippingMethod', value)}
                      defaultValue="standard"
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard (5-7 business days) - $15</SelectItem>
                        <SelectItem value="express">Express (2-3 business days) - $25</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Information
                    <Lock className="h-4 w-4 text-green-600 ml-auto" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number *</Label>
                    <Input
                      id="cardNumber"
                      required
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date *</Label>
                      <Input
                        id="expiryDate"
                        required
                        placeholder="MM/YY"
                        value={formData.expiryDate}
                        onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input
                        id="cvv"
                        required
                        placeholder="123"
                        value={formData.cvv}
                        onChange={(e) => handleInputChange('cvv', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="nameOnCard">Name on Card *</Label>
                    <Input
                      id="nameOnCard"
                      required
                      value={formData.nameOnCard}
                      onChange={(e) => handleInputChange('nameOnCard', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.packaging}`} className="flex justify-between text-sm">
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-gray-500">Qty: {item.quantity}</div>
                        {item.packaging && <div className="text-gray-500">{item.packaging}</div>}
                      </div>
                      <div>${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                  
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>${shippingCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax</span>
                      <span>${taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span>Total</span>
                      <span className="text-green-600">${(total + shippingCost + taxAmount).toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full bg-orange-500 hover:bg-orange-600 mt-6"
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : 'Place Order'}
                  </Button>
                  
                  <div className="text-xs text-gray-500 text-center mt-4">
                    By placing this order, you agree to our Terms of Service and EPA compliance requirements.
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;

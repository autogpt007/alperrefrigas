
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Minus, Plus, Trash2, ArrowLeft, Send, ShoppingCart } from 'lucide-react';
import { useRFQ } from '../../contexts/RFQContext';
import { useQuotes } from '../../contexts/QuotesContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/use-toast';
import SEOComponent from '../seo/SEOComponent';

const RFQPage = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, clearRFQ } = useRFQ();
  const { createQuote } = useQuotes();
  const { user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    customerName: '',
    companyName: '',
    email: '',
    phone: '',
    shippingAddress: '',
    notes: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitRFQ = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit a quote request",
        variant: "destructive"
      });
      return;
    }
    
    if (items.length === 0) {
      toast({
        title: "No items in quote request",
        description: "Please add some products before submitting your quote request.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.customerName || !formData.companyName || !formData.email) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      const quoteData = {
        user_id: user.id,
        customer_name: formData.customerName,
        customer_email: formData.email,
        company_name: formData.companyName,
        phone: formData.phone,
        shipping_address: formData.shippingAddress,
        status: 'pending' as const,
        notes: formData.notes,
        items: items.map(item => ({
          product_id: null,
          product_name: item.productName,
          quantity: item.quantity,
          packaging: item.packaging
        }))
      };

      const quote = await createQuote(quoteData);
      
      if (quote) {
        clearRFQ();
        navigate(`/quote-confirmation?quoteNumber=${quote.quote_number}&type=quote`);
      }
    } catch (error) {
      console.error('Error submitting quote:', error);
      toast({
        title: "Error",
        description: "Failed to submit quote request. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (items.length === 0) {
    return (
      <>
        <SEOComponent
          title="Request for Quote - Wholesale Refrigerant Pricing"
          description="Get custom pricing on bulk refrigerants. Professional wholesale quotes for HVAC contractors, distributors, and commercial customers."
          keywords="refrigerant quote, wholesale pricing, bulk refrigerant pricing, HVAC contractor pricing, commercial refrigerant quote, RFQ refrigerants"
          canonicalUrl="/rfq"
        />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
          <div className="max-w-2xl mx-auto text-center px-4">
            <div className="mb-8">
              <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Your Quote Request is Empty</h1>
              <p className="text-gray-600 mb-8 text-lg">
                Start by browsing our products and adding items to build your custom quote.
              </p>
            </div>
            <Link to="/products">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-8 py-4 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOComponent
        title="Request for Quote - Wholesale Refrigerant Pricing"
        description="Get custom pricing on bulk refrigerants. Professional wholesale quotes for HVAC contractors, distributors, and commercial customers."
        keywords="refrigerant quote, wholesale pricing, bulk refrigerant pricing, HVAC contractor pricing, commercial refrigerant quote, RFQ refrigerants"
        canonicalUrl="/rfq"
      />
      <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-6">
          <Link to="/products" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Request for Quote</h1>
            <p className="text-gray-600">Complete your information below to receive a custom quote</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Quote Items */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b">
                  <CardTitle className="flex items-center text-xl">
                    <ShoppingCart className="h-5 w-5 mr-2 text-blue-600" />
                    Quote Items ({items.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {items.map((item, index) => (
                      <div key={`${item.productId}-${item.packaging}`} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow bg-white">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded flex items-center justify-center flex-shrink-0">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.productName}
                              className="w-full h-full object-contain rounded"
                            />
                          ) : (
                            <span className="text-xs font-bold text-blue-600">
                              {item.productName.split(' ')[1] || 'IMG'}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 mb-1">{item.productName}</h3>
                          <p className="text-sm text-gray-600">{item.packaging}</p>
                        </div>

                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.productId)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4 shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b">
                  <CardTitle className="text-xl">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmitRFQ} className="space-y-4">
                    <div>
                      <Label htmlFor="customerName" className="text-sm font-medium">Full Name *</Label>
                      <Input
                        id="customerName"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="companyName" className="text-sm font-medium">Company Name *</Label>
                      <Input
                        id="companyName"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                        placeholder="Enter your company name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-sm font-medium">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                        placeholder="Enter your email address"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="Enter your phone number"
                      />
                    </div>

                    <div>
                      <Label htmlFor="shippingAddress" className="text-sm font-medium">Shipping Address</Label>
                      <Textarea
                        id="shippingAddress"
                        name="shippingAddress"
                        value={formData.shippingAddress}
                        onChange={handleInputChange}
                        rows={3}
                        className="mt-1"
                        placeholder="Enter your shipping address"
                      />
                    </div>

                    <div>
                      <Label htmlFor="notes" className="text-sm font-medium">Additional Notes</Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows={3}
                        className="mt-1"
                        placeholder="Any special requirements or questions..."
                      />
                    </div>

                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Submit Quote Request
                    </Button>

                    <div className="bg-blue-50 p-4 rounded-lg mt-6 border border-blue-200">
                      <h4 className="font-medium text-blue-900 mb-2">What happens next?</h4>
                      <p className="text-sm text-blue-800">
                        Our sales team will review your request and contact you within one business day 
                        with a detailed quote including pricing and delivery options.
                      </p>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default RFQPage;

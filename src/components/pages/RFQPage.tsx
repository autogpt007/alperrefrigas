
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, Trash2, ArrowLeft, Send } from 'lucide-react';
import { useRFQ } from '../../contexts/RFQContext';
import { useToast } from '../../hooks/use-toast';

const RFQPage = () => {
  const { items, updateQuantity, removeItem, clearRFQ } = useRFQ();
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

    // Here you would submit to Firestore
    console.log('Submitting RFQ:', { ...formData, items });
    
    toast({
      title: "Quote request submitted!",
      description: "We'll contact you within one business day with your quote."
    });

    // Clear form and items
    setFormData({
      customerName: '',
      companyName: '',
      email: '',
      phone: '',
      shippingAddress: '',
      notes: ''
    });
    clearRFQ();
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Quote Request</h1>
          <p className="text-gray-600 mb-8">
            Your quote request is empty. Start by browsing our products and adding items.
          </p>
          <Link to="/products">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/products" className="inline-flex items-center text-blue-600 hover:text-blue-700">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Continue Shopping
        </Link>
      </div>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Request for Quote</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quote Items */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Quote Items ({items.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item, index) => (
                  <div key={`${item.productId}-${item.packaging}`} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-600">
                        {item.productName.split(' ')[1]}
                      </span>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.productName}</h3>
                      <p className="text-sm text-gray-600">{item.packaging}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.productId)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitRFQ} className="space-y-4">
                  <div>
                    <Label htmlFor="customerName">Full Name *</Label>
                    <Input
                      id="customerName"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="shippingAddress">Shipping Address</Label>
                    <Textarea
                      id="shippingAddress"
                      name="shippingAddress"
                      value={formData.shippingAddress}
                      onChange={handleInputChange}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Any special requirements or questions..."
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                    <Send className="h-4 w-4 mr-2" />
                    Submit Quote Request
                  </Button>

                  <div className="bg-blue-50 p-4 rounded-lg mt-6">
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
  );
};

export default RFQPage;

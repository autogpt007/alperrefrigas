import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, Send, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface BulkQuoteData {
  customerName: string;
  customerEmail: string;
  companyName: string;
  phone: string;
  productType: string;
  quantity: string;
  containerType: string;
  shippingAddress: string;
  notes: string;
}

const BulkQuoteForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<BulkQuoteData>({
    customerName: '',
    customerEmail: '',
    companyName: '',
    phone: '',
    productType: '',
    quantity: '',
    containerType: '',
    shippingAddress: '',
    notes: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof BulkQuoteData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerName || !formData.customerEmail || !formData.productType || !formData.quantity) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const quoteData = {
        user_id: user?.id || null,
        customer_name: formData.customerName,
        customer_email: formData.customerEmail,
        company_name: formData.companyName,
        phone: formData.phone,
        shipping_address: formData.shippingAddress,
        status: 'pending' as const,
        notes: `Bulk Quote Request:
Product Type: ${formData.productType}
Quantity: ${formData.quantity}
Container Type: ${formData.containerType}

Additional Notes: ${formData.notes}`
      };

      const { data: newQuote, error: quoteError } = await supabase
        .from('quotes')
        .insert(quoteData)
        .select()
        .single();

      if (quoteError) throw quoteError;

      // Create a bulk quote item
      const { error: itemError } = await supabase
        .from('quote_items')
        .insert({
          quote_id: newQuote.id,
          product_name: `${formData.productType} - Bulk Order`,
          quantity: parseInt(formData.quantity) || 1,
          packaging: formData.containerType
        });

      if (itemError) throw itemError;

      toast({
        title: "Bulk Quote Requested!",
        description: `Quote ${newQuote.quote_number} has been submitted. Our team will contact you within 24 hours.`
      });

      // Reset form
      setFormData({
        customerName: '',
        customerEmail: '',
        companyName: '',
        phone: '',
        productType: '',
        quantity: '',
        containerType: '',
        shippingAddress: '',
        notes: ''
      });

      // Navigate to account page to see the quote
      if (user) {
        navigate('/account');
      }

    } catch (error: any) {
      console.error('Error submitting bulk quote:', error);
      toast({
        title: "Error",
        description: "Failed to submit quote request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const productTypes = [
    'R-134a Refrigerant',
    'R-410A Refrigerant', 
    'R-22 Refrigerant',
    'R-404A Refrigerant',
    'R-507 Refrigerant',
    'R-32 Refrigerant',
    'R-454B Refrigerant',
    'R-1234yf Refrigerant',
    'Mixed Refrigerant Order',
    'Other (specify in notes)'
  ];

  const containerTypes = [
    '20ft Container (1,140 cylinders)',
    '40ft Container (2,280 cylinders)',
    'Multiple Pallets (40+ cylinders each)',
    'Custom Quantity (specify in notes)'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-6">
            <Building2 className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Bulk Pricing Quote Request
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Request wholesale pricing for container loads and bulk refrigerant orders. Get competitive rates with volume discounts for large quantities.
          </p>
        </div>

        <Card className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 border-green-500/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Package className="h-6 w-6 mr-2 text-green-400" />
              Bulk Order Information
            </CardTitle>
            <CardDescription className="text-gray-300">
              Provide details about your bulk refrigerant requirements and we'll send you competitive wholesale pricing within 24 hours.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 border-b border-gray-600 pb-2">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customerName" className="text-white">Full Name *</Label>
                    <Input
                      id="customerName"
                      value={formData.customerName}
                      onChange={(e) => handleInputChange('customerName', e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerEmail" className="text-white">Email Address *</Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="companyName" className="text-white">Company Name</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-white">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 border-b border-gray-600 pb-2">
                  Order Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="productType" className="text-white">Product Type *</Label>
                    <Select
                      value={formData.productType}
                      onValueChange={(value) => handleInputChange('productType', value)}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="Select refrigerant type" />
                      </SelectTrigger>
                      <SelectContent>
                        {productTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="quantity" className="text-white">Estimated Quantity *</Label>
                    <Input
                      id="quantity"
                      value={formData.quantity}
                      onChange={(e) => handleInputChange('quantity', e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="e.g., 1000 cylinders"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="containerType" className="text-white">Container/Packaging Type</Label>
                    <Select
                      value={formData.containerType}
                      onValueChange={(value) => handleInputChange('containerType', value)}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="Select container type" />
                      </SelectTrigger>
                      <SelectContent>
                        {containerTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 border-b border-gray-600 pb-2">
                  Shipping Information
                </h3>
                <div>
                  <Label htmlFor="shippingAddress" className="text-white">Shipping Address</Label>
                  <Textarea
                    id="shippingAddress"
                    value={formData.shippingAddress}
                    onChange={(e) => handleInputChange('shippingAddress', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Enter complete shipping address..."
                    rows={3}
                  />
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <Label htmlFor="notes" className="text-white">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Any specific requirements, delivery timeline, or questions..."
                  rows={4}
                />
              </div>

              <div className="flex justify-end pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 text-lg font-semibold"
                >
                  <Send className="h-5 w-5 mr-2" />
                  {isSubmitting ? 'Submitting...' : 'Request Bulk Quote'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Information Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <Card className="bg-slate-800/50 border-blue-500/20">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">Volume Discounts</h3>
              <p className="text-gray-300 text-sm">
                Save up to 25% on container loads and bulk orders with our tiered pricing structure.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-green-500/20">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">Commercial Focus</h3>
              <p className="text-gray-300 text-sm">
                Specialized pricing and terms for HVAC contractors, distributors, and commercial buyers.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-purple-500/20">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">Fast Response</h3>
              <p className="text-gray-300 text-sm">
                Get competitive bulk pricing quotes within 24 hours from our wholesale team.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BulkQuoteForm;
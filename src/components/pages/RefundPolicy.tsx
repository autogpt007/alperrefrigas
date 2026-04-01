import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Clock, RotateCcw, AlertCircle, CheckCircle } from 'lucide-react';
import { ContactDisplay } from '@/components/ui/ContactDisplay';
import SEOComponent from '../seo/SEOComponent';

const RefundPolicy = () => {
  return (
    <>
      <SEOComponent
        title="Refund & Return Policy | Alper"
        description="Comprehensive refund and return policy for refrigerant orders. Learn about our customer protection policies and return procedures."
        keywords="refund policy, return policy, refrigerant returns, customer protection, money back guarantee, EPA compliance returns"
        canonicalUrl="/refund-policy"
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full mb-6 shadow-lg">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Refund & Return Policy</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We stand behind our products with comprehensive refund and return policies designed to protect our customers.
            </p>
          </div>

          <div className="space-y-8">
            {/* Overview */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  Policy Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  At Alper Refrigerants, we are committed to customer satisfaction. This refund and return policy outlines the terms and conditions for returns, refunds, and exchanges of refrigerant products purchased from our company.
                </p>
              </CardContent>
            </Card>

            {/* Return Timeframe */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Clock className="h-6 w-6 text-blue-500" />
                  Return Timeframe
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                    <h4 className="font-semibold text-gray-900 mb-2">30-Day Return Window</h4>
                    <p className="text-gray-700">
                      Returns must be initiated within 30 calendar days of delivery. Returns initiated after this period will not be accepted unless the product is defective or damaged.
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                    <h4 className="font-semibold text-gray-900 mb-2">Immediate Notification Required</h4>
                    <div className="text-gray-700">
                      <p className="mb-2">For damaged or defective products, notify us within 48 hours of delivery:</p>
                      <ContactDisplay 
                        category="returns" 
                        showIcons={true} 
                        showDescriptions={false}
                        className="text-sm"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Eligible Returns */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <RotateCcw className="h-6 w-6 text-green-500" />
                  Eligible Returns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-green-600 mb-3">✓ Acceptable Returns</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Unopened, unused refrigerant cylinders</li>
                      <li>• Products in original packaging</li>
                      <li>• Items with intact safety seals</li>
                      <li>• Defective or damaged products</li>
                      <li>• Incorrect items shipped</li>
                      <li>• Cylinders with valid certification labels</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-600 mb-3">✗ Non-Returnable Items</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Opened or used refrigerant cylinders</li>
                      <li>• Products without original packaging</li>
                      <li>• Contaminated cylinders</li>
                      <li>• Items past 30-day return window</li>
                      <li>• Products damaged by customer</li>
                      <li>• Special order or custom products</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Return Process */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <AlertCircle className="h-6 w-6 text-orange-500" />
                  Return Process
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-blue-600 font-bold">1</span>
                      </div>
                      <h4 className="font-semibold mb-2">Contact Us</h4>
                      <p className="text-sm text-gray-600">Call or email to initiate return and receive RMA number</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-blue-600 font-bold">2</span>
                      </div>
                      <h4 className="font-semibold mb-2">Package Securely</h4>
                      <p className="text-sm text-gray-600">Follow DOT guidelines for refrigerant cylinder shipping</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-blue-600 font-bold">3</span>
                      </div>
                      <h4 className="font-semibold mb-2">Ship Back</h4>
                      <p className="text-sm text-gray-600">Use provided prepaid label or approved carrier</p>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                    <h4 className="font-semibold text-gray-900 mb-2">Important Safety Notice</h4>
                    <p className="text-gray-700">
                      All refrigerant returns must comply with DOT hazardous materials regulations. We will provide specific packaging and shipping instructions with your RMA number.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Refund Information */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Refund Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Refund Timeline</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Processing: 3-5 business days after receipt</li>
                        <li>• Credit cards: 5-10 business days</li>
                        <li>• Wire transfers: 7-14 business days</li>
                        <li>• Company checks: 14-21 business days</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Refund Method</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Same payment method as original purchase</li>
                        <li>• Full product cost (minus shipping)</li>
                        <li>• Return shipping costs deducted unless defective</li>
                        <li>• Restocking fee: 15% for opened packaging</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Contact for Returns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Returns Contact</h4>
                    <ContactDisplay 
                      category="returns" 
                      showIcons={true} 
                      showDescriptions={true}
                      className="space-y-2"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">General Support</h4>
                    <ContactDisplay 
                      category="support" 
                      showIcons={true} 
                      showDescriptions={true}
                      className="space-y-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Legal */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Legal Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">
                    This policy complies with Google Merchant Center requirements and federal consumer protection laws. 
                    Returns of refrigerants must comply with EPA Section 608 regulations and DOT hazardous materials shipping requirements. 
                    Customers are responsible for proper handling and disposal of refrigerants in accordance with environmental regulations.
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

export default RefundPolicy;
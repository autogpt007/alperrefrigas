
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Phone, Mail, MessageCircle, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import SEOComponent from '../seo/SEOComponent';

const CustomerSupport = () => {
  const [supportForm, setSupportForm] = useState({
    name: '',
    email: '',
    orderNumber: '',
    category: '',
    priority: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Support ticket submitted:', supportForm);
    // Handle form submission
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <SEOComponent
        title="Customer Support - Alper Refrigerants"
        description="Get help with your refrigerant orders, EPA compliance questions, technical support, and more. 24/7 professional customer service."
        canonicalUrl="/support"
      />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Customer Support</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're here to help with your refrigerant needs. Get expert support for orders, 
            technical questions, and EPA compliance.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Phone className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Phone Support</h3>
              <p className="text-gray-600 mb-4">Speak with our experts</p>
              <p className="font-semibold text-lg">1-800-REFRIGERANT</p>
              <p className="text-sm text-gray-500">(1-800-734-7443)</p>
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <div className="flex items-center justify-center text-green-700">
                  <Clock className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Mon-Fri: 7AM-6PM</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <Mail className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Email Support</h3>
              <p className="text-gray-600 mb-4">Get detailed assistance</p>
              <p className="font-semibold">support@alperrefrigerants.com</p>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-center text-blue-700">
                  <Clock className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Response within 2 hours</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <MessageCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Live Chat</h3>
              <p className="text-gray-600 mb-4">Instant help available</p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Start Chat
              </Button>
              <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center justify-center text-orange-700">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Average wait: 30 seconds</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="ticket" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ticket">Submit Ticket</TabsTrigger>
            <TabsTrigger value="faq">Common Issues</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="ticket">
            <Card>
              <CardHeader>
                <CardTitle>Create Support Ticket</CardTitle>
                <CardDescription>
                  Provide details about your issue and we'll get back to you quickly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Name *</label>
                      <Input
                        value={supportForm.name}
                        onChange={(e) => setSupportForm({...supportForm, name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email *</label>
                      <Input
                        type="email"
                        value={supportForm.email}
                        onChange={(e) => setSupportForm({...supportForm, email: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Order Number (if applicable)</label>
                      <Input
                        placeholder="ORD-20241201-001"
                        value={supportForm.orderNumber}
                        onChange={(e) => setSupportForm({...supportForm, orderNumber: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Category *</label>
                      <Select onValueChange={(value) => setSupportForm({...supportForm, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="order">Order Issue</SelectItem>
                          <SelectItem value="shipping">Shipping & Delivery</SelectItem>
                          <SelectItem value="product">Product Information</SelectItem>
                          <SelectItem value="billing">Billing & Payment</SelectItem>
                          <SelectItem value="technical">Technical Support</SelectItem>
                          <SelectItem value="compliance">EPA Compliance</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Priority</label>
                    <Select onValueChange={(value) => setSupportForm({...supportForm, priority: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Subject *</label>
                    <Input
                      value={supportForm.subject}
                      onChange={(e) => setSupportForm({...supportForm, subject: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Message *</label>
                    <Textarea
                      rows={6}
                      placeholder="Please describe your issue in detail..."
                      value={supportForm.message}
                      onChange={(e) => setSupportForm({...supportForm, message: e.target.value})}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    Submit Ticket
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faq">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    Order & Shipping Issues
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold">My order hasn't arrived yet</h4>
                    <p className="text-gray-600">Check your tracking number or contact us if it's been more than 5 business days.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">I need to change my delivery address</h4>
                    <p className="text-gray-600">Contact us immediately as changes can only be made before shipment.</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    EPA Compliance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Do I need EPA certification to purchase?</h4>
                    <p className="text-gray-600">Yes, valid EPA 608 certification is required for all refrigerant purchases.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">How do I verify my EPA license?</h4>
                    <p className="text-gray-600">Upload your certification during account setup or email it to compliance@alperrefrigerants.com</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    Product Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold">What's the shelf life of refrigerants?</h4>
                    <p className="text-gray-600">Properly stored refrigerants have an indefinite shelf life when containers remain sealed.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Do you provide SDS sheets?</h4>
                    <p className="text-gray-600">Yes, Safety Data Sheets are available for download on each product page.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="resources">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Documentation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>EPA Compliance Guide</span>
                    <Button variant="outline" size="sm">Download PDF</Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Product Catalog</span>
                    <Button variant="outline" size="sm">Download PDF</Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Shipping Guidelines</span>
                    <Button variant="outline" size="sm">Download PDF</Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>SDS Library</span>
                    <Button variant="outline" size="sm">Browse Online</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Training & Certification</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>EPA 608 Certification</span>
                    <Button variant="outline" size="sm">Learn More</Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Refrigerant Handling</span>
                    <Button variant="outline" size="sm">View Course</Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Safety Training</span>
                    <Button variant="outline" size="sm">View Course</Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Webinar Schedule</span>
                    <Button variant="outline" size="sm">View Calendar</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CustomerSupport;

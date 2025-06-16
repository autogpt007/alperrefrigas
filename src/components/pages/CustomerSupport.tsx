
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Badge } from '../ui/badge';
import { MessageCircle, Phone, Mail, FileText, HelpCircle, Clock } from 'lucide-react';

const CustomerSupport = () => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', contactForm);
    // Handle form submission
  };

  const faqItems = [
    {
      question: "What EPA certifications are required to purchase refrigerants?",
      answer: "To purchase refrigerants, you must have EPA Section 608 or 609 certification. This ensures proper handling and environmental compliance. Upload your certification during account setup."
    },
    {
      question: "What are the shipping restrictions for refrigerants?",
      answer: "Refrigerants are classified as hazardous materials and must be shipped via ground transportation. Some states have additional restrictions. Our shipping calculator will show available options and any compliance requirements."
    },
    {
      question: "How do I track my refrigerant order?",
      answer: "Once your order ships, you'll receive a tracking number via email. You can also track orders through your account dashboard. All refrigerant shipments require signature confirmation."
    },
    {
      question: "What is the return policy for refrigerants?",
      answer: "Due to safety regulations, refrigerants cannot be returned once shipped unless damaged in transit. Please verify your order carefully before completing purchase."
    },
    {
      question: "Do you ship to Canada?",
      answer: "Yes, we ship throughout Canada. Additional documentation may be required for cross-border shipments, and delivery times may be extended for customs processing."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, business checks, and offer net payment terms for qualified commercial accounts. Contact our sales team for credit applications."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Customer Support</h1>
        <p className="text-gray-600">
          Get help with orders, technical questions, and EPA compliance. Our team is here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Options */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Options</CardTitle>
              <CardDescription>Choose the best way to reach our support team.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Phone className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-medium">Phone Support</div>
                  <div className="text-sm text-gray-500">1-800-REFRIGERANT</div>
                  <div className="text-sm text-gray-500">Mon-Fri 8AM-6PM EST</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Mail className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium">Email Support</div>
                  <div className="text-sm text-gray-500">support@frigidflow.com</div>
                  <div className="text-sm text-gray-500">Response within 24 hours</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <MessageCircle className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="font-medium">Live Chat</div>
                  <div className="text-sm text-gray-500">Available Mon-Fri 9AM-5PM EST</div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 mt-1">
                    Online Now
                  </Badge>
                </div>
              </div>

              <Button className="w-full flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Start Live Chat
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Business Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Monday - Friday:</span>
                  <span>8:00 AM - 6:00 PM EST</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday:</span>
                  <span>9:00 AM - 2:00 PM EST</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday:</span>
                  <span>Closed</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* FAQ Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Find quick answers to common questions about refrigerants and orders.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
              <CardDescription>
                Can't find what you're looking for? Send us a message and we'll get back to you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <Input
                      value={contactForm.name}
                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <Input
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <Textarea
                    rows={5}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full">Send Message</Button>
              </form>
            </CardContent>
          </Card>

          {/* Resource Links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Helpful Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start">
                  EPA Certification Guide
                </Button>
                <Button variant="outline" className="justify-start">
                  Safety Data Sheets
                </Button>
                <Button variant="outline" className="justify-start">
                  Shipping Guidelines
                </Button>
                <Button variant="outline" className="justify-start">
                  Product Compatibility Chart
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CustomerSupport;

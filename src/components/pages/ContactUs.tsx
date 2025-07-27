import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Phone, Mail, Clock, Send, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Helmet } from 'react-helmet-async';
import { contactFormSchema, sanitizeInput, sanitizeHtml, RateLimiter, type ContactFormData } from '@/lib/validation';
import TestimonialForm from '@/components/ui/TestimonialForm';
import { ContactDisplay } from '@/components/ui/ContactDisplay';
import SocialMediaLinks from '@/components/ui/SocialMediaLinks';
import SEOComponent from '@/components/seo/SEOComponent';

const ContactUs = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const { toast } = useToast();

  // Rate limiter for form submissions
  const rateLimiter = new RateLimiter(3, 300000); // 3 attempts per 5 minutes

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    
    // Check rate limiting
    const userIP = 'user'; // In a real app, you'd get the user's IP
    if (!rateLimiter.canAttempt(userIP)) {
      const timeLeft = Math.ceil(rateLimiter.getTimeUntilReset(userIP) / 60000);
      toast({
        title: "Too many attempts",
        description: `Please wait ${timeLeft} minutes before trying again.`,
        variant: "destructive",
      });
      return;
    }

    // Validate form data
    try {
      const validatedData = contactFormSchema.parse(formData);
      setValidationErrors({});
      setIsSubmitting(true);

      // Sanitize data before submission
      const sanitizedData = {
        name: sanitizeHtml(validatedData.name),
        email: validatedData.email.toLowerCase().trim(),
        subject: sanitizeHtml(validatedData.subject),
        message: sanitizeHtml(validatedData.message)
      };

      // Insert contact submission into database
      const { error: dbError } = await supabase
        .from('contact_submissions')
        .insert([sanitizedData]);

      if (dbError) throw dbError;

      // Send notification email - DISABLED for now to prevent blocking
      // try {
      //   await supabase.functions.invoke('send-notification-email', {
      //     body: {
      //       type: 'contact',
      //       data: sanitizedData
      //     }
      //   });
      // } catch (emailError) {
      //   console.error('Error sending notification email:', emailError);
      //   // Don't fail the whole process if email fails
      // }

      toast({
        title: "Message Sent Successfully!",
        description: "We'll get back to you within 24 hours.",
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error: any) {
      if (error.errors) {
        // Zod validation errors
        const errors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          errors[err.path[0]] = err.message;
        });
        setValidationErrors(errors);
      } else {
        console.error('Error submitting contact form:', error);
        toast({
          title: "Error",
          description: "Failed to send message. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
    
    // Don't sanitize during typing - only sanitize on submit to preserve natural typing flow
    setFormData(prev => ({
      ...prev,
      [field]: field === 'email' ? value.toLowerCase().trim() : value
    }));
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: "+1 (800) 555-COOL",
      description: "Monday-Friday, 8AM-6PM EST"
    },
    {
      icon: Mail,
      title: "Email",
      details: "info@alperrefrigerants.com",
      description: "We respond within 4 hours"
    },
    {
      icon: MapPin,
      title: "Address",
      details: "1234 Industrial Blvd, Suite 100",
      description: "Houston, TX 77041"
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: "Mon-Fri: 8AM-6PM EST",
      description: "Emergency support available 24/7"
    }
  ];

  const departments = [
    { value: "bulk-pricing", label: "Bulk Pricing Quote" },
    { value: "technical-support", label: "Technical Support" },
    { value: "order-status", label: "Order Status & Shipping" },
    { value: "epa-compliance", label: "EPA Compliance & Regulations" },
    { value: "product-availability", label: "Product Availability" }
  ];

  // Structured data for Contact page
  const contactPageStructuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "mainEntity": {
      "@type": "Organization",
      "name": "FrigidFlow",
      "alternateName": "Alper Refrigerants",
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "contactType": "sales",
          "telephone": "+1-210-939-1115",
          "email": "sales@alperrefrigas.com",
          "areaServed": "US",
          "availableLanguage": ["English", "Spanish"]
        },
        {
          "@type": "ContactPoint", 
          "contactType": "customer service",
          "telephone": "+1-210-939-1115",
          "email": "support@alperrefrigas.com",
          "hoursAvailable": "Mo-Fr 07:00-18:00"
        }
      ]
    }
  };

  return (
    <>
      <SEOComponent
        title="Contact FrigidFlow - Get Wholesale Refrigerant Pricing Quote"
        description="Contact EPA-certified refrigerant experts for wholesale pricing on R-410A, R-134a, R-1234yf. Bulk quotes for HVAC contractors with 24/7 emergency support and fast shipping across North America."
        keywords="contact refrigerant distributor, wholesale refrigerant pricing, bulk refrigerant quote, HVAC contractor pricing, EPA certified refrigerant supplier contact, emergency refrigerant support"
        canonicalUrl="/contact"
        structuredData={contactPageStructuredData}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Contact Our <span className="text-cyan-400">Refrigerant Experts</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Need wholesale pricing on R-410A, R-134a, or R-1234yf? Our EPA-certified team provides expert guidance and competitive bulk quotes for HVAC contractors.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-cyan-400" />
                    Get In Touch
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Choose the best way to reach us
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ContactDisplay category="general" />
                  <div className="pt-4 border-t border-slate-600">
                    <h4 className="text-white font-medium mb-3">Follow Us</h4>
                    <SocialMediaLinks />
                  </div>
                </CardContent>
              </Card>

              {/* Quick Contact Cards */}
              <Card className="bg-red-900/30 border-red-500/30 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="text-white font-semibold mb-2 text-lg">Emergency Refrigerant Support</h3>
                  <p className="text-gray-100 text-sm mb-4">
                    Critical HVAC system failure? Our emergency hotline provides 24/7 access to refrigerant supply and technical support.
                  </p>
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold">
                    <Phone className="h-4 w-4 mr-2" />
                    Emergency: +1 (800) 555-HELP
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-green-900/30 border-green-500/30 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="text-white font-semibold mb-2 text-lg">Get Wholesale Pricing</h3>
                  <p className="text-gray-100 text-sm mb-4">
                    Need bulk refrigerant pricing for your project? Get competitive wholesale quotes with volume discounts for contractors.
                  </p>
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold">
                    <Send className="h-4 w-4 mr-2" />
                    Get Quote
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Get Your Refrigerant Quote</CardTitle>
                  <CardDescription className="text-gray-300">
                    Submit your requirements below and our EPA-certified team will provide competitive wholesale pricing within 4 hours.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="text-white">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className={`bg-slate-700 border-slate-600 text-white ${
                            validationErrors.name ? 'border-red-500' : ''
                          }`}
                          required
                        />
                        {validationErrors.name && (
                          <p className="text-red-400 text-sm mt-1">{validationErrors.name}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-white">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className={`bg-slate-700 border-slate-600 text-white ${
                            validationErrors.email ? 'border-red-500' : ''
                          }`}
                          required
                        />
                        {validationErrors.email && (
                          <p className="text-red-400 text-sm mt-1">{validationErrors.email}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject" className="text-white">Subject *</Label>
                      <Select
                        value={formData.subject}
                        onValueChange={(value) => handleInputChange('subject', value)}
                      >
                        <SelectTrigger className={`bg-slate-700 border-slate-600 text-white ${
                          validationErrors.subject ? 'border-red-500' : ''
                        }`}>
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept.value} value={dept.value}>
                              {dept.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {validationErrors.subject && (
                        <p className="text-red-400 text-sm mt-1">{validationErrors.subject}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-white">Message *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        className={`bg-slate-700 border-slate-600 text-white min-h-[120px] ${
                          validationErrors.message ? 'border-red-500' : ''
                        }`}
                        placeholder="Please provide details about your inquiry..."
                        required
                      />
                      {validationErrors.message && (
                        <p className="text-red-400 text-sm mt-1">{validationErrors.message}</p>
                      )}
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* FAQ Section */}
              <Card className="bg-slate-800/50 border-slate-700 mt-8">
                <CardHeader>
                  <CardTitle className="text-white">Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Do you offer bulk pricing for contractors?</h4>
                    <p className="text-gray-300 text-sm">Yes, we provide competitive wholesale pricing with volume discounts. Bulk orders of R-410A, R-134a, and R-1234yf qualify for contractor pricing.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Are your refrigerants EPA-compliant?</h4>
                    <p className="text-gray-300 text-sm">All our refrigerants are EPA Section 608 compliant with 99.8% purity certification. Complete documentation provided for regulatory compliance.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">What's your typical shipping timeframe?</h4>
                    <p className="text-gray-300 text-sm">Most bulk orders ship within 24 hours via temperature-controlled transport. We offer ground, expedited, and emergency delivery across North America.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Testimonial Section */}
          <div className="mt-16">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-white">Share Your Experience</CardTitle>
                <CardDescription className="text-gray-300">
                  Help other HVAC professionals by sharing your experience with Alper Refrigerants
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TestimonialForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUs;

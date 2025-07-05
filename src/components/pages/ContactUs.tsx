
import React, { useState } from 'react';
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

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([formData]);

      if (error) throw error;

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
      console.error('Error submitting contact form:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
      details: "info@narefrigerants.com",
      description: "We respond within 4 hours"
    },
    {
      icon: MapPin,
      title: "Address",
      details: "1234 Industrial Blvd, Suite 100",
      description: "Chicago, IL 60601"
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: "Mon-Fri: 8AM-6PM EST",
      description: "Emergency support available 24/7"
    }
  ];

  const departments = [
    { value: "sales", label: "Sales Inquiry" },
    { value: "support", label: "Technical Support" },
    { value: "billing", label: "Billing & Orders" },
    { value: "compliance", label: "Compliance & Regulations" },
    { value: "general", label: "General Information" }
  ];

  return (
    <>
      <Helmet>
        <title>Contact Us - North American Refrigerants</title>
        <meta name="description" content="Get in touch with North American Refrigerants for expert refrigerant solutions, technical support, and customer service." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Contact <span className="text-cyan-400">Us</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Have questions about our products or need technical support? Our expert team is here to help you find the right refrigerant solutions.
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
                  {contactInfo.map((info, index) => {
                    const IconComponent = info.icon;
                    return (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <IconComponent className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{info.title}</h3>
                          <p className="text-cyan-400 font-medium">{info.details}</p>
                          <p className="text-sm text-gray-400">{info.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Quick Contact Cards */}
              <Card className="bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border-cyan-500/20">
                <CardContent className="p-6">
                  <h3 className="text-white font-semibold mb-2">Emergency Support</h3>
                  <p className="text-gray-300 text-sm mb-4">
                    Need urgent assistance? Our emergency hotline is available 24/7 for critical refrigerant issues.
                  </p>
                  <Button className="w-full bg-red-600 hover:bg-red-700">
                    <Phone className="h-4 w-4 mr-2" />
                    Emergency: +1 (800) 555-HELP
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500/10 to-emerald-600/10 border-green-500/20">
                <CardContent className="p-6">
                  <h3 className="text-white font-semibold mb-2">Request a Quote</h3>
                  <p className="text-gray-300 text-sm mb-4">
                    Need bulk pricing or custom solutions? Get a personalized quote for your specific requirements.
                  </p>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
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
                  <CardTitle className="text-white">Send Us a Message</CardTitle>
                  <CardDescription className="text-gray-300">
                    Fill out the form below and we'll get back to you as soon as possible.
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
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="bg-slate-700 border-slate-600 text-white"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-white">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="bg-slate-700 border-slate-600 text-white"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject" className="text-white">Subject *</Label>
                      <Select
                        value={formData.subject}
                        onValueChange={(value) => setFormData({ ...formData, subject: value })}
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
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
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-white">Message *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white min-h-[120px]"
                        placeholder="Please provide details about your inquiry..."
                        required
                      />
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
                    <h4 className="font-semibold text-white mb-2">What are your shipping options?</h4>
                    <p className="text-gray-300 text-sm">We offer ground, expedited, and emergency shipping across North America with temperature-controlled transport for sensitive products.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Do you provide technical support?</h4>
                    <p className="text-gray-300 text-sm">Yes! Our certified technicians provide expert guidance on refrigerant selection, handling procedures, and regulatory compliance.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">What certifications do you have?</h4>
                    <p className="text-gray-300 text-sm">We're EPA Section 608 certified, ISO 9001:2015 compliant, and DOT licensed for hazardous material transportation.</p>
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

export default ContactUs;

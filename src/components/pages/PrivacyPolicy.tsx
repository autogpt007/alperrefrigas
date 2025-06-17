
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Eye, Lock, Users } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-600">Last updated: January 2024</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-blue-600" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>We collect information you provide directly to us, such as when you:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Create an account or request a quote</li>
                <li>Make a purchase or place an order</li>
                <li>Contact us for customer support</li>
                <li>Subscribe to our newsletter</li>
              </ul>
              <p>This may include your name, email address, phone number, company information, shipping address, and payment details.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="h-5 w-5 mr-2 text-green-600" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Process and fulfill your orders</li>
                <li>Provide customer support and respond to inquiries</li>
                <li>Send you updates about your orders and account</li>
                <li>Improve our products and services</li>
                <li>Comply with legal obligations</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-purple-600" />
                Information Sharing
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>With service providers who help us operate our business</li>
                <li>When required by law or to protect our rights</li>
                <li>In connection with a business transfer or merger</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="h-5 w-5 mr-2 text-red-600" />
                Data Security
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.</p>
            </CardContent>
          </Card>

          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">Contact Us</h3>
            <p className="text-blue-800">
              If you have any questions about this Privacy Policy, please contact us at:
              <br />
              Email: privacy@frigidflow.com
              <br />
              Phone: 1-800-734-7443
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cookie, Settings, BarChart, Shield } from 'lucide-react';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
          <p className="text-gray-600">Last updated: January 2024</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Cookie className="h-5 w-5 mr-2 text-orange-600" />
                What Are Cookies?
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>Cookies are small text files stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and analyzing how you use our site.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2 text-blue-600" />
                Essential Cookies
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>These cookies are necessary for the website to function properly:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Authentication cookies to keep you logged in</li>
                <li>Shopping cart functionality</li>
                <li>Security cookies to protect against fraud</li>
                <li>Session management</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart className="h-5 w-5 mr-2 text-green-600" />
                Analytics Cookies
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>We use analytics cookies to understand how visitors interact with our website:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Google Analytics to track website usage</li>
                <li>Page view statistics</li>
                <li>User behavior analysis</li>
                <li>Performance monitoring</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-purple-600" />
                Managing Your Cookie Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>You can control and manage cookies in several ways:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Browser settings: Most browsers allow you to block or delete cookies</li>
                <li>Our cookie banner: Accept or decline non-essential cookies</li>
                <li>Third-party opt-out tools for analytics cookies</li>
              </ul>
              <p className="mt-4 text-sm text-gray-600">
                Note: Disabling essential cookies may affect website functionality.
              </p>
            </CardContent>
          </Card>

          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">Questions About Cookies?</h3>
            <p className="text-blue-800">
              If you have questions about our use of cookies, please contact us at:
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

export default CookiePolicy;

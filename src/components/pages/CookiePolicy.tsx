
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cookie, Settings, BarChart, Shield, Eye, Lock } from 'lucide-react';
import SEOComponent from '../seo/SEOComponent';

const CookiePolicy = () => {
  return (
    <>
      <SEOComponent
        title="Cookie Policy | Alper Refrigerants"
        description="Cookie usage policy for FrigidFlow website. Learn about our cookie practices, data collection, and privacy protection for refrigerant industry professionals."
        keywords="cookie policy, website cookies, data privacy, refrigerant distributor website, tracking policy"
        canonicalUrl="/cookies"
      />
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
            <p className="text-gray-600">Last updated: January 2024</p>
            <p className="text-sm text-gray-500 mt-2">
              Understanding our cookie usage for refrigerant industry professionals
            </p>
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
                <p>Cookies are small text files stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences, maintaining your session, and analyzing how you use our site to improve our services for refrigerant industry professionals.</p>
                <p><strong>Why We Use Cookies:</strong> As a specialized refrigerant distributor, we use cookies to enhance your browsing experience, remember your EPA certification status, maintain shopping cart contents, and provide personalized product recommendations based on your industry needs.</p>
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
                <p>These cookies are necessary for the website to function properly and cannot be disabled:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Authentication cookies:</strong> Keep you logged in to your account and remember your EPA certification status</li>
                  <li><strong>Shopping cart functionality:</strong> Maintain your selected refrigerant products and quantities</li>
                  <li><strong>Security cookies:</strong> Protect against fraud and ensure secure transactions for hazmat purchases</li>
                  <li><strong>Session management:</strong> Maintain your browsing session and preferences</li>
                  <li><strong>Load balancing:</strong> Ensure optimal website performance during peak usage</li>
                  <li><strong>Regulatory compliance:</strong> Help us maintain EPA-required transaction records</li>
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
                <p>We use analytics cookies to understand how visitors interact with our website and improve our services:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Google Analytics:</strong> Track website usage, popular refrigerant categories, and user behavior patterns</li>
                  <li><strong>Page view statistics:</strong> Monitor which product pages and resources are most valuable</li>
                  <li><strong>User journey analysis:</strong> Understand how customers navigate from inquiry to purchase</li>
                  <li><strong>Performance monitoring:</strong> Track website speed and functionality for optimal user experience</li>
                  <li><strong>Conversion tracking:</strong> Measure the effectiveness of our quote request and ordering processes</li>
                  <li><strong>Heat mapping:</strong> Analyze user interaction patterns to improve website design</li>
                </ul>
                <p><strong>Data Protection:</strong> All analytics data is anonymized and aggregated to protect individual privacy while helping us serve the refrigerant industry better.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="h-5 w-5 mr-2 text-purple-600" />
                  Marketing and Personalization Cookies
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>These cookies help us provide relevant content and advertisements:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Product recommendations:</strong> Show relevant refrigerants based on your industry and previous inquiries</li>
                  <li><strong>Content personalization:</strong> Display relevant technical resources and regulatory updates</li>
                  <li><strong>Email marketing integration:</strong> Connect your website activity with newsletter preferences</li>
                  <li><strong>Retargeting pixels:</strong> Show relevant refrigerant industry content when you visit other websites</li>
                  <li><strong>Social media integration:</strong> Enable sharing of technical resources and product information</li>
                  <li><strong>A/B testing:</strong> Help us optimize website features for better customer experience</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="h-5 w-5 mr-2 text-indigo-600" />
                  Third-Party Cookies
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>We use carefully selected third-party services that may set cookies:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Google Services:</strong> Analytics, Maps (for distribution centers), and reCAPTCHA for security</li>
                  <li><strong>Payment processors:</strong> Secure payment processing for refrigerant purchases</li>
                  <li><strong>Shipping partners:</strong> FedEx, UPS tracking integration for hazmat deliveries</li>
                  <li><strong>Live chat support:</strong> Customer service tools for technical assistance</li>
                  <li><strong>EPA verification services:</strong> Third-party certification verification systems</li>
                  <li><strong>Industry partners:</strong> AHRI and other trade organization integrations</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-red-600" />
                  Managing Your Cookie Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>You can control and manage cookies in several ways:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Browser settings:</strong> Most browsers allow you to block or delete cookies through privacy settings</li>
                  <li><strong>Our cookie banner:</strong> Accept or decline non-essential cookies when you first visit our site</li>
                  <li><strong>Cookie preference center:</strong> Manage your cookie preferences at any time through our website</li>
                  <li><strong>Third-party opt-out tools:</strong> Use Google Analytics opt-out and other third-party tools</li>
                  <li><strong>Do Not Track signals:</strong> We respect browser Do Not Track preferences where technically feasible</li>
                </ul>
                <p className="mt-4 text-sm text-gray-600">
                  <strong>Important Note:</strong> Disabling essential cookies may affect website functionality, including the ability to maintain your shopping cart, access your account, or complete refrigerant purchases. EPA compliance features may also be impacted.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-teal-600" />
                  Cookie Retention and Data Protection
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>We maintain strict data protection standards for all cookie data:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Data retention:</strong> Cookies are automatically deleted based on their type and purpose</li>
                  <li><strong>Encryption:</strong> All sensitive cookie data is encrypted for security</li>
                  <li><strong>Access controls:</strong> Limited access to cookie data by authorized personnel only</li>
                  <li><strong>Regular audits:</strong> Periodic review of cookie usage and data protection practices</li>
                  <li><strong>Compliance monitoring:</strong> Ongoing compliance with privacy regulations and industry standards</li>
                </ul>
              </CardContent>
            </Card>

            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">Questions About Cookies?</h3>
              <p className="text-blue-800">
                If you have questions about our use of cookies or need assistance with cookie settings, please contact us at:
                <br />
                <strong>Email:</strong> privacy@alperrefrigerants.com
                <br />
                <strong>Phone:</strong> 1-800-734-7443
                <br />
                <strong>Data Protection Officer:</strong> dpo@alperrefrigerants.com
                <br />
                <strong>Business Hours:</strong> Monday-Friday, 8:00 AM - 6:00 PM EST
              </p>
            </div>

            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-900 mb-2">Cookie Settings</h3>
              <p className="text-green-800 mb-4">
                You can manage your cookie preferences at any time by adjusting your browser settings or contacting us directly.
              </p>
              <div className="flex flex-wrap gap-2">
                <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                  Accept All Cookies
                </button>
                <button className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors">
                  Essential Only
                </button>
                <button className="border border-green-600 text-green-600 px-4 py-2 rounded-md hover:bg-green-50 transition-colors">
                  Customize Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CookiePolicy;

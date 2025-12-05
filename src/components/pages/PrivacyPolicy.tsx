
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Eye, Lock, Users, Truck, FileText, AlertTriangle } from 'lucide-react';
import SEOComponent from '../seo/SEOComponent';

const PrivacyPolicy = () => {
  return (
    <>
      <SEOComponent
        title="Privacy Policy - Alper Refrigerants Professional Refrigerant Distribution"
        description="Comprehensive privacy policy for Alper Chemical Group refrigerant distribution services. Learn how we protect your personal information and comply with EPA regulations for refrigerant sales."
        keywords="privacy policy, refrigerant sales, EPA compliance, data protection, HVAC distributor privacy"
        canonicalUrl="/privacy"
      />
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-gray-600">Last updated: December 2024</p>
            <p className="text-sm text-gray-500 mt-2">
              This policy applies to all refrigerant sales and EPA-regulated transactions
            </p>
          </div>

          {/* Business Identity */}
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">Alper Chemical Group</h3>
            <p className="text-blue-800 text-sm">
              382 NE 191st St, Miami, FL 33179, United States<br />
              Tel: +1-409-995-3623 | Email: privacy@alperrefrigas.com<br />
              <strong>B2B Supplier – Sales to EPA-certified HVAC professionals only</strong>
            </p>
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
                  <li>Create an account or request a quote for refrigerants</li>
                  <li>Make a purchase or place an order for HFC, HFO, or natural refrigerants</li>
                  <li>Submit EPA certification documents for refrigerant purchases</li>
                  <li>Contact us for customer support or technical assistance</li>
                  <li>Subscribe to our newsletter or regulatory updates</li>
                  <li>Request Material Safety Data Sheets (MSDS) or technical documentation</li>
                </ul>
                <p><strong>EPA Compliance Information:</strong> In accordance with EPA Section 608 regulations, we collect and maintain records of:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>EPA Section 608 certification numbers and types</li>
                  <li>Refrigerant purchase quantities and types</li>
                  <li>Customer business information for commercial accounts</li>
                  <li>Transaction records for regulatory reporting</li>
                </ul>
                <p>This may include your name, email address, phone number, company information, EPA certification details, shipping address, and payment information.</p>
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
                  <li>Process and fulfill your refrigerant orders in compliance with EPA regulations</li>
                  <li>Verify EPA Section 608 certification status before refrigerant sales</li>
                  <li>Provide customer support and technical assistance for refrigerant handling</li>
                  <li>Send you updates about your orders, shipment tracking, and hazmat notifications</li>
                  <li>Comply with EPA record-keeping requirements for refrigerant sales</li>
                  <li>Provide regulatory updates and industry news relevant to refrigerant regulations</li>
                  <li>Improve our products, services, and regulatory compliance procedures</li>
                  <li>Ensure proper handling and shipping of hazardous materials</li>
                </ul>
                <p><strong>Regulatory Compliance:</strong> We maintain detailed records as required by EPA regulations for a minimum of 3 years, including purchase records, certification verification, and transaction details.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-purple-600" />
                  Information Sharing and Regulatory Disclosure
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>With EPA-approved service providers who help us operate our business</li>
                  <li>With shipping carriers for hazmat transportation compliance (FedEx, UPS, freight carriers)</li>
                  <li>When required by EPA, DOT, or other regulatory authorities</li>
                  <li>In response to lawful requests from government agencies</li>
                  <li>In connection with a business transfer or merger (with continued regulatory compliance)</li>
                  <li>With certification verification services to confirm EPA credentials</li>
                </ul>
                <p><strong>EPA Reporting:</strong> We may be required to share transaction data with the EPA for environmental compliance and ozone depletion reporting purposes.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="h-5 w-5 mr-2 text-orange-600" />
                  Hazmat Shipping and Transportation Data
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>Due to the hazardous nature of refrigerants, we collect and share specific information for safe transportation:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Complete shipping addresses and delivery instructions</li>
                  <li>Business hours and receiving capability information</li>
                  <li>Emergency contact information for hazmat incidents</li>
                  <li>Proper shipping names, UN numbers, and hazard classifications</li>
                  <li>Transportation data shared with DOT-certified carriers</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="h-5 w-5 mr-2 text-red-600" />
                  Data Security and Protection
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>SSL encryption for all data transmission</li>
                  <li>Secure storage of EPA certification documents</li>
                  <li>Regular security audits and compliance reviews</li>
                  <li>Restricted access to sensitive customer information</li>
                  <li>Secure disposal of physical documents containing personal information</li>
                </ul>
                <p>However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security but maintain industry-standard protections.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-indigo-600" />
                  Your Rights and Choices
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Access and review your personal information we maintain</li>
                  <li>Request corrections to inaccurate information</li>
                  <li>Opt-out of marketing communications (regulatory notifications will continue)</li>
                  <li>Request deletion of your data (subject to EPA record-keeping requirements)</li>
                  <li>Receive a copy of your transaction history for your records</li>
                </ul>
                <p><strong>Important Note:</strong> Some information cannot be deleted due to EPA regulatory requirements for refrigerant sales record-keeping.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
                  EPA Compliance and Record Retention
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>As a regulated refrigerant distributor, we are required to maintain certain records:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>EPA Section 608 certification verification records</li>
                  <li>Refrigerant purchase and sales transaction data</li>
                  <li>Customer certification status and expiration dates</li>
                  <li>Hazmat shipping and handling documentation</li>
                  <li>Environmental compliance and reporting data</li>
                </ul>
                <p>These records are maintained for the minimum period required by law (typically 3-7 years) and are securely stored and disposed of when legally permissible.</p>
              </CardContent>
            </Card>

            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">Contact Us About Privacy</h3>
              <p className="text-blue-800">
                If you have any questions about this Privacy Policy or our data practices, please contact us at:
                <br />
                <strong>Email:</strong> privacy@alperrefrigas.com
                <br />
                <strong>Phone:</strong> +1-409-995-3623
                <br />
                <strong>Address:</strong> Alper Chemical Group, 382 NE 191st St, Miami, FL 33179, United States
                <br />
                <strong>Business Hours:</strong> Monday-Friday, 7:00 AM - 6:00 PM EST
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;

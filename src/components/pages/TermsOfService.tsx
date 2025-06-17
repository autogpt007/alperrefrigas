
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, AlertTriangle, CheckCircle, DollarSign } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-600">Last updated: January 2024</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                Acceptance of Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>By accessing and using Frigid Flow's services, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Product Orders and Delivery
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <ul className="list-disc pl-6 space-y-1">
                <li>All orders are subject to product availability and confirmation</li>
                <li>Delivery times are estimates and may vary based on location and product availability</li>
                <li>Risk of loss transfers to buyer upon delivery</li>
                <li>All refrigerants require proper EPA certification for purchase</li>
                <li>Hazmat shipping regulations apply to all refrigerant products</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                Pricing and Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <ul className="list-disc pl-6 space-y-1">
                <li>Prices are subject to change without notice</li>
                <li>Payment is due upon order confirmation unless credit terms are pre-approved</li>
                <li>Late payment charges may apply to overdue accounts</li>
                <li>All prices are FOB shipping point unless otherwise specified</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                EPA Compliance and Regulations
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>All customers must comply with EPA regulations regarding refrigerant handling:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Valid EPA certification required for refrigerant purchases</li>
                <li>Proper handling and disposal procedures must be followed</li>
                <li>Record keeping requirements apply to all transactions</li>
                <li>Violation of EPA regulations may result in account suspension</li>
              </ul>
            </CardContent>
          </Card>

          <div className="bg-red-50 p-6 rounded-lg border border-red-200">
            <h3 className="font-semibold text-red-900 mb-2">Limitation of Liability</h3>
            <p className="text-red-800">
              Frigid Flow's liability is limited to the purchase price of the products sold. 
              We are not liable for consequential, incidental, or special damages.
            </p>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">Contact Information</h3>
            <p className="text-blue-800">
              For questions about these terms, contact us at:
              <br />
              Email: legal@frigidflow.com
              <br />
              Phone: 1-800-734-7443
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;

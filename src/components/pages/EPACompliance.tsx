
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, CheckCircle, FileText, AlertTriangle, Award } from 'lucide-react';

const EPACompliance = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">EPA Compliance</h1>
          <p className="text-gray-600">Your trusted partner for EPA-compliant refrigerant distribution</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-6 text-center">
              <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-green-900 mb-2">EPA Certified</h3>
              <p className="text-green-700">Fully compliant with all EPA regulations and requirements</p>
            </CardContent>
          </Card>
          
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-6 text-center">
              <Award className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-blue-900 mb-2">AHRI Member</h3>
              <p className="text-blue-700">Active member of Air-Conditioning, Heating & Refrigeration Institute</p>
            </CardContent>
          </Card>
          
          <Card className="border-purple-200 bg-purple-50">
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold text-purple-900 mb-2">Verified Distributor</h3>
              <p className="text-purple-700">Authorized distributor for major refrigerant manufacturers</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                EPA Section 608 Compliance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p>We strictly adhere to EPA Section 608 regulations governing refrigerant handling:</p>
                <div className="grid md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <h4 className="font-semibold mb-2">Required Certifications:</h4>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>Type I: Small appliances</li>
                      <li>Type II: High-pressure appliances</li>
                      <li>Type III: Low-pressure appliances</li>
                      <li>Universal: All types of equipment</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Our Responsibilities:</h4>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>Verify customer EPA certification</li>
                      <li>Maintain detailed sales records</li>
                      <li>Ensure proper packaging and labeling</li>
                      <li>Report suspicious transactions</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
                Refrigerant Regulations & Phase-outs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <Badge variant="destructive" className="mb-2">Phased Out</Badge>
                    <h4 className="font-semibold text-red-900">CFCs</h4>
                    <p className="text-sm text-red-700">R-12, R-502 - Production banned since 1996</p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <Badge variant="secondary" className="mb-2">Phase Down</Badge>
                    <h4 className="font-semibold text-yellow-900">HCFCs</h4>
                    <p className="text-sm text-yellow-700">R-22 - Production ended 2020</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <Badge variant="outline" className="mb-2">Restricted</Badge>
                    <h4 className="font-semibold text-orange-900">HFCs</h4>
                    <p className="text-sm text-orange-700">R-410A, R-134a - Phase down in progress</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                Customer Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Before You Can Purchase:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-sm">Valid EPA 608 certification</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-sm">Business registration documents</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-sm">Valid tax ID or resale certificate</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Record Keeping:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <FileText className="h-4 w-4 text-blue-600 mr-2" />
                      <span className="text-sm">Maintain purchase records for 3 years</span>
                    </li>
                    <li className="flex items-center">
                      <FileText className="h-4 w-4 text-blue-600 mr-2" />
                      <span className="text-sm">Track refrigerant usage and disposal</span>
                    </li>
                    <li className="flex items-center">
                      <FileText className="h-4 w-4 text-blue-600 mr-2" />
                      <span className="text-sm">Report to EPA if required</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">Need Help with EPA Compliance?</h3>
            <p className="text-blue-800 mb-4">
              Our team of EPA compliance experts is here to help you navigate regulations and ensure your business stays compliant.
            </p>
            <p className="text-blue-800">
              Contact our compliance team:
              <br />
              Email: compliance@frigidflow.com
              <br />
              Phone: 1-800-734-7443 ext. 2
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EPACompliance;

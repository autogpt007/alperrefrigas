
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Shield, CheckCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Certifications = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Certifications & Accreditations</h1>
          <p className="text-gray-600">Our commitment to quality, safety, and regulatory compliance</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <Card className="border-2 border-blue-200">
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex items-center">
                <Shield className="h-6 w-6 mr-2 text-blue-600" />
                EPA Certifications
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">EPA Section 608 Universal Certification</h4>
                    <p className="text-sm text-gray-600">All refrigerant handling and distribution</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">EPA Refrigerant Distributor License</h4>
                    <p className="text-sm text-gray-600">Authorized wholesale distribution</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download EPA Certificates
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200">
            <CardHeader className="bg-purple-50">
              <CardTitle className="flex items-center">
                <Award className="h-6 w-6 mr-2 text-purple-600" />
                Industry Memberships
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">AHRI Membership</h4>
                    <p className="text-sm text-gray-600">Air-Conditioning, Heating & Refrigeration Institute</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Member</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">ARCA Membership</h4>
                    <p className="text-sm text-gray-600">Appliance Recycling Centers of America</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Member</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">RSES Affiliation</h4>
                    <p className="text-sm text-gray-600">Refrigeration Service Engineers Society</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Affiliate</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                Quality Assurance Certifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="h-8 w-8 text-blue-600" />
                  </div>
                  <h4 className="font-semibold mb-2">ISO 9001:2015</h4>
                  <p className="text-sm text-gray-600">Quality Management System</p>
                  <Badge variant="outline" className="mt-2">Certified</Badge>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="h-8 w-8 text-green-600" />
                  </div>
                  <h4 className="font-semibold mb-2">ISO 14001:2015</h4>
                  <p className="text-sm text-gray-600">Environmental Management</p>
                  <Badge variant="outline" className="mt-2">Certified</Badge>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="h-8 w-8 text-purple-600" />
                  </div>
                  <h4 className="font-semibold mb-2">OHSAS 18001</h4>
                  <p className="text-sm text-gray-600">Occupational Health & Safety</p>
                  <Badge variant="outline" className="mt-2">Certified</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Authorized Distributor Agreements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {['Honeywell', 'Chemours', 'Koura', 'Mexichem'].map((manufacturer) => (
                  <div key={manufacturer} className="p-4 border rounded-lg text-center">
                    <div className="w-12 h-12 bg-gray-200 rounded mx-auto mb-2"></div>
                    <h4 className="font-semibold">{manufacturer}</h4>
                    <Badge variant="secondary" className="mt-1">Authorized</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Safety & Training Certifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Staff Certifications:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-sm">DOT Hazmat Transportation Certified</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-sm">OSHA 30-Hour Safety Training</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-sm">Refrigerant Recovery & Recycling</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Facility Certifications:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-sm">C-TPAT (Customs-Trade Partnership)</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-sm">Fire Department Approved Storage</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-sm">Security Access Control Systems</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-900 mb-2">Verification & Audit Information</h3>
            <p className="text-green-800 mb-4">
              All certifications are subject to regular audits and renewals. We maintain current documentation and welcome verification requests.
            </p>
            <p className="text-green-800">
              For certification verification or audit requests:
              <br />
              Email: certifications@frigidflow.com
              <br />
              Phone: 1-800-734-7443 ext. 3
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certifications;


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, AlertTriangle, CheckCircle, DollarSign, Truck, Shield, Award } from 'lucide-react';
import SEOComponent from '../seo/SEOComponent';

const TermsOfService = () => {
  return (
    <>
      <SEOComponent
        title="Terms of Service | Alper Refrigerants"
        description="Complete terms of service for refrigerant purchases. EPA compliance requirements, shipping terms, and conditions for HFC, HFO, and natural refrigerant sales."
        keywords="terms of service, refrigerant sales terms, EPA compliance, HVAC contractor terms, refrigerant distributor conditions"
        canonicalUrl="/terms"
      />
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
            <p className="text-gray-600">Last updated: December 2024</p>
            <p className="text-sm text-gray-500 mt-2">
              Professional Refrigerant Distribution Terms & EPA Compliance Requirements
            </p>
          </div>

          {/* Business Identity */}
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">Alper Chemical Group</h3>
            <p className="text-blue-800 text-sm">
              382 NE 191st St, Miami, FL 33179, United States<br />
              Tel: +1-682-215-2974 | Email: legal@alperrefrigerants.com<br />
              <strong>B2B Supplier – Sales to EPA-certified HVAC professionals only</strong>
            </p>
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
                <p>By accessing and using Alper Chemical Group's services (operating as Alper Refrigerants), you accept and agree to be bound by these Terms of Service and all applicable EPA regulations. If you do not agree to these terms or cannot comply with EPA requirements, please do not use our services.</p>
                <p><strong>B2B Professional Sales Only:</strong> All products sold through this website are intended for licensed HVAC professionals, contractors, and commercial businesses only. We do not sell to residential consumers.</p>
                <p><strong>EPA Compliance Acknowledgment:</strong> By purchasing refrigerants, you acknowledge that you understand and will comply with all applicable EPA Section 608 regulations governing refrigerant handling, recovery, and disposal.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-blue-600" />
                  EPA Certification Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p><strong>Mandatory Certification:</strong> All refrigerant purchases require valid EPA Section 608 certification:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Valid EPA Section 608 certification must be provided before purchase</li>
                  <li>Certification type must match the refrigerant being purchased</li>
                  <li>Expired certifications will result in order cancellation</li>
                  <li>Fraudulent certification claims may result in account suspension and EPA reporting</li>
                  <li>Commercial accounts must maintain current certification records</li>
                </ul>
                <p><strong>Certification Verification:</strong> We reserve the right to verify certification authenticity with EPA databases and may request additional documentation.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-purple-600" />
                  Product Orders and Delivery
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <ul className="list-disc pl-6 space-y-1">
                  <li>All orders are subject to product availability, EPA compliance verification, and confirmation</li>
                  <li>Delivery times are estimates and may vary based on hazmat shipping requirements</li>
                  <li>Risk of loss transfers to buyer upon delivery with proper hazmat documentation</li>
                  <li>All refrigerants require proper EPA certification for purchase</li>
                  <li>Hazmat shipping regulations apply to all refrigerant products</li>
                  <li>Special handling fees apply to certain refrigerant types and quantities</li>
                  <li>Orders may be delayed due to weather, transportation, or regulatory restrictions</li>
                  <li>Minimum order quantities may apply to certain products</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="h-5 w-5 mr-2 text-orange-600" />
                  Hazmat Shipping and Handling
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p><strong>Transportation Requirements:</strong> All refrigerant shipments are subject to DOT hazmat regulations:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Shipments require hazmat-certified carriers and proper documentation</li>
                  <li>Delivery to commercial addresses only (residential delivery restrictions apply)</li>
                  <li>Signature required upon delivery with hazmat training acknowledgment</li>
                  <li>Emergency response information provided with each shipment</li>
                  <li>Temperature-sensitive products require expedited shipping</li>
                  <li>Additional charges apply for hazmat handling and documentation</li>
                  <li>Insurance coverage included for hazmat transportation</li>
                </ul>
                <p><strong>Delivery Restrictions:</strong> Some locations may have additional restrictions due to local regulations or transportation limitations.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                  Pricing and Payment Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <ul className="list-disc pl-6 space-y-1">
                  <li>Prices are subject to change without notice due to market fluctuations</li>
                  <li>Payment is due upon order confirmation unless credit terms are pre-approved</li>
                  <li>Late payment charges of 1.5% per month may apply to overdue accounts</li>
                  <li>All prices are FOB shipping point unless otherwise specified</li>
                  <li>Hazmat shipping and handling charges are additional</li>
                  <li>Environmental fees and taxes may apply to certain refrigerants</li>
                  <li>Currency fluctuations may affect pricing for international orders</li>
                  <li>Volume discounts available for qualified commercial accounts</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                  EPA Compliance and Environmental Regulations
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p><strong>Regulatory Compliance:</strong> All customers must comply with federal and state environmental regulations:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Valid EPA Section 608 certification required for all refrigerant purchases</li>
                  <li>Proper handling, recovery, and disposal procedures must be followed</li>
                  <li>Record keeping requirements apply to all refrigerant transactions</li>
                  <li>Violation of EPA regulations may result in account suspension and regulatory reporting</li>
                  <li>Customers are responsible for compliance with local and state regulations</li>
                  <li>Proper leak detection and repair procedures must be maintained</li>
                  <li>Venting prohibitions strictly enforced per EPA guidelines</li>
                  <li>Equipment certification requirements for recovery and recycling</li>
                </ul>
                <p><strong>Environmental Responsibility:</strong> Customers agree to handle all refrigerants in an environmentally responsible manner and follow all applicable ozone depletion and global warming potential guidelines.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-indigo-600" />
                  Product Quality and Warranties
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p><strong>Quality Assurance:</strong> All refrigerants meet or exceed industry standards:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Products conform to AHRI 700 purity standards</li>
                  <li>Certificate of Analysis available upon request</li>
                  <li>Proper storage and handling maintained throughout distribution</li>
                  <li>Temperature-controlled storage facilities</li>
                  <li>Regular quality testing and verification</li>
                  <li>Contamination prevention procedures in place</li>
                </ul>
                <p><strong>Limited Warranty:</strong> Products are warranted to be free from defects in material and conform to specifications at time of delivery, subject to proper handling and storage.</p>
              </CardContent>
            </Card>

            <div className="bg-red-50 p-6 rounded-lg border border-red-200">
              <h3 className="font-semibold text-red-900 mb-2">Limitation of Liability</h3>
              <p className="text-red-800">
                Alper Chemical Group's liability is limited to the purchase price of the products sold. 
                We are not liable for consequential, incidental, or special damages arising from refrigerant use, 
                environmental compliance issues, or regulatory violations. Customers assume full responsibility 
                for proper handling, compliance, and environmental stewardship.
              </p>
            </div>

            <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
              <h3 className="font-semibold text-yellow-900 mb-2">Safety and Emergency Procedures</h3>
              <p className="text-yellow-800">
                In case of refrigerant leaks, spills, or emergencies, immediately contact your local emergency 
                services and follow proper safety procedures. Emergency response information is provided with 
                all shipments. Material Safety Data Sheets (MSDS) available upon request.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">Contact Information</h3>
              <p className="text-blue-800">
                For questions about these terms, regulatory compliance, or technical support, contact us at:
                <br />
                <strong>Email:</strong> legal@alperrefrigerants.com
                <br />
                <strong>Phone:</strong> +1-682-215-2974
                <br />
                <strong>Address:</strong> 382 NE 191st St, Miami, FL 33179, United States
                <br />
                <strong>EPA Compliance:</strong> compliance@alperrefrigerants.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsOfService;

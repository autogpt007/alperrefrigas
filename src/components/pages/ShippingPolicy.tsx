import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, Clock, Package, AlertTriangle, MapPin, Shield, DollarSign } from 'lucide-react';
import SEOComponent from '../seo/SEOComponent';

const ShippingPolicy = () => {
  return (
    <>
      <SEOComponent
        title="Shipping Policy - Alper Refrigerants | HazMat Refrigerant Delivery"
        description="Comprehensive shipping policy for refrigerant orders. Learn about processing times, transit estimates, HazMat requirements, and delivery options for EPA-certified HVAC professionals."
        keywords="refrigerant shipping, HazMat delivery, DOT compliant shipping, refrigerant freight, HVAC supply delivery"
        canonicalUrl="/shipping-policy"
      />
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Shipping Policy</h1>
            <p className="text-gray-600">Last updated: December 2024</p>
            <p className="text-sm text-gray-500 mt-2">
              Professional Refrigerant Distribution – B2B Supplier for Licensed HVAC Professionals Only
            </p>
          </div>

          {/* Business Identity */}
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">Alper Chemical Group</h3>
            <p className="text-blue-800 text-sm">
              382 NE 191st St, Miami, FL 33179, United States<br />
              Tel: +1-409-995-3623 | Email: sales@alperrefrigas.com<br />
              <strong>B2B Supplier – Sales to EPA-certified HVAC professionals only</strong>
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-blue-600" />
                  Order Processing Times
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p><strong>Standard Processing:</strong> All orders are processed within 1-2 business days after EPA certification verification.</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>EPA Verification:</strong> All refrigerant orders require EPA Section 608 certification verification before processing</li>
                  <li><strong>Business Days:</strong> Monday through Friday, excluding federal holidays</li>
                  <li><strong>Cut-off Time:</strong> Orders placed before 2:00 PM EST are processed same business day</li>
                  <li><strong>Large Orders:</strong> Bulk orders (pallet quantities) may require 2-3 business days for processing</li>
                  <li><strong>Container Orders:</strong> 20ft and 40ft container orders require 5-7 business days for preparation</li>
                </ul>
                <p className="text-sm text-gray-600 mt-4">
                  <strong>Note:</strong> Processing times do not include transit time. You will receive tracking information once your order ships.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="h-5 w-5 mr-2 text-green-600" />
                  Transit Times & Carriers
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p><strong>Estimated Transit Times (from Miami, FL distribution center):</strong></p>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Region</th>
                        <th className="text-left py-2">Ground</th>
                        <th className="text-left py-2">Express</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2">Southeast US</td>
                        <td className="py-2">2-3 business days</td>
                        <td className="py-2">1 business day</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Northeast US</td>
                        <td className="py-2">3-5 business days</td>
                        <td className="py-2">1-2 business days</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Midwest US</td>
                        <td className="py-2">4-6 business days</td>
                        <td className="py-2">2 business days</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">West Coast US</td>
                        <td className="py-2">5-7 business days</td>
                        <td className="py-2">2-3 business days</td>
                      </tr>
                      <tr>
                        <td className="py-2">Alaska/Hawaii</td>
                        <td className="py-2">7-10 business days</td>
                        <td className="py-2">3-5 business days</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p><strong>Approved Carriers:</strong></p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>UPS:</strong> Ground, 3-Day Select, 2nd Day Air, Next Day Air</li>
                  <li><strong>FedEx:</strong> Ground, Express Saver, 2Day, Priority Overnight</li>
                  <li><strong>LTL Freight:</strong> R+L Carriers, Old Dominion, SAIA (for pallet shipments)</li>
                  <li><strong>Specialized HazMat Carriers:</strong> For large quantities and container shipments</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
                  HazMat Shipping Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p><strong>DOT Hazardous Materials Compliance:</strong> All refrigerant shipments comply with DOT HazMat regulations (49 CFR).</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Proper Shipping Names:</strong> All packages labeled with UN numbers and proper shipping names</li>
                  <li><strong>Hazard Class:</strong> Refrigerants classified as Class 2.2 (Non-flammable gas) or Class 2.1 (Flammable gas)</li>
                  <li><strong>Documentation:</strong> Shipping papers with emergency response information included</li>
                  <li><strong>Packaging:</strong> DOT-approved cylinders and containers only</li>
                  <li><strong>Placarding:</strong> Required for shipments exceeding 1,001 lbs gross weight</li>
                </ul>
                <div className="bg-yellow-50 p-4 rounded-lg mt-4 border border-yellow-200">
                  <p className="text-yellow-800 text-sm">
                    <strong>⚠️ HazMat Surcharge:</strong> A hazardous materials handling fee applies to all refrigerant shipments. This fee covers specialized packaging, documentation, and compliant carrier services.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-purple-600" />
                  Delivery Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p><strong>Commercial Addresses Only:</strong> Due to HazMat regulations, refrigerant deliveries are restricted to commercial addresses.</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Signature Required:</strong> Adult signature required for all deliveries</li>
                  <li><strong>Business Hours:</strong> Deliveries scheduled during normal business hours (8 AM - 5 PM)</li>
                  <li><strong>Receiving Area:</strong> Adequate receiving area required for pallet deliveries</li>
                  <li><strong>Lift Gate:</strong> Lift gate service available for locations without dock access (additional charge)</li>
                  <li><strong>Inside Delivery:</strong> Available upon request (additional charge)</li>
                </ul>
                <div className="bg-red-50 p-4 rounded-lg mt-4 border border-red-200">
                  <p className="text-red-800 text-sm">
                    <strong>❌ Residential Delivery Restrictions:</strong> We cannot ship refrigerants to residential addresses. All orders must be delivered to a commercial business address with appropriate receiving capabilities.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                  Shipping Costs & Free Shipping
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p><strong>Shipping Rate Structure:</strong></p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Free Shipping:</strong> Orders over $500 qualify for free ground shipping (continental US)</li>
                  <li><strong>Standard Ground:</strong> Calculated based on weight, dimensions, and destination</li>
                  <li><strong>Express Options:</strong> Available at additional cost for urgent orders</li>
                  <li><strong>LTL Freight:</strong> Pallet shipments quoted individually based on weight class and destination</li>
                </ul>
                <p className="mt-4"><strong>Additional Fees:</strong></p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>HazMat handling fee: Included in shipping quote</li>
                  <li>Lift gate delivery: $75-$150 depending on location</li>
                  <li>Inside delivery: Starting at $100</li>
                  <li>Residential area surcharge: N/A (residential delivery not available)</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-blue-600" />
                  Insurance & Damage Claims
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p><strong>Shipping Insurance:</strong> All shipments include basic carrier liability coverage.</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Standard Coverage:</strong> Up to $100 per shipment included</li>
                  <li><strong>Additional Coverage:</strong> Full value insurance available at 1-2% of declared value</li>
                  <li><strong>Damage Claims:</strong> Must be reported within 48 hours of delivery</li>
                  <li><strong>Documentation:</strong> Photos required for all damage claims</li>
                </ul>
                <p className="mt-4"><strong>Inspection Upon Delivery:</strong></p>
                <p className="text-sm">Please inspect all packages upon delivery. Note any visible damage on the delivery receipt and photograph damaged packaging before accepting shipment.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2 text-indigo-600" />
                  International Shipping
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p><strong>Export Shipments:</strong> International orders available for qualified commercial customers.</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Documentation:</strong> Commercial invoice, packing list, and certificate of origin provided</li>
                  <li><strong>Customs:</strong> Buyer responsible for import duties, taxes, and customs clearance</li>
                  <li><strong>Restrictions:</strong> Some products restricted for export under EPA regulations</li>
                  <li><strong>Lead Time:</strong> International orders require 7-14 business days processing</li>
                </ul>
                <p className="text-sm mt-4">Contact sales@alperrefrigas.com for international shipping quotes.</p>
              </CardContent>
            </Card>

            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">Questions About Shipping?</h3>
              <p className="text-blue-800">
                For shipping inquiries or to request a freight quote:
                <br />
                <strong>Email:</strong> shipping@alperrefrigas.com
                <br />
                <strong>Phone:</strong> +1-409-995-3623
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

export default ShippingPolicy;

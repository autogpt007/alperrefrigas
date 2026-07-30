import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, Clock, Package, AlertTriangle, MapPin, Shield, DollarSign, Globe, FileText, Calculator } from 'lucide-react';
import SEOComponent from '../seo/SEOComponent';

const ShippingPolicy = () => {
  return (
    <>
      <SEOComponent
        title="Shipping Policy | HazMat Delivery | Alper"
        description="Comprehensive shipping policy for refrigerant orders. Learn about processing times, transit estimates, HazMat requirements, and delivery options for EPA-certified HVAC professionals."
        keywords="refrigerant shipping, HazMat delivery, DOT compliant shipping, refrigerant freight, HVAC supply delivery, international shipping, EU F-Gas"
        canonicalUrl="/shipping-policy"
        breadcrumbs={[{ name: "Home", url: "/" }, { name: "Shipping Policy", url: "/shipping-policy" }]}
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
              Tel: +1-787-965-8975 | Email: sales@alperrefrigerants.com<br />
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
                  Transit Times & Carriers (United States)
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

            {/* International Shipping Zones */}
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-blue-600" />
                  International Shipping Zones
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p><strong>We ship internationally to the following regions:</strong></p>
                <div className="bg-gray-50 p-4 rounded-lg mb-4 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Region</th>
                        <th className="text-left py-2">Countries</th>
                        <th className="text-left py-2">Processing</th>
                        <th className="text-left py-2">Transit</th>
                        <th className="text-left py-2">Base Rate</th>
                        <th className="text-left py-2">Free Shipping</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2 font-medium">🇬🇧 United Kingdom</td>
                        <td className="py-2">GB</td>
                        <td className="py-2">2-3 days</td>
                        <td className="py-2">5-10 days</td>
                        <td className="py-2">$79.99</td>
                        <td className="py-2">Orders $2,000+</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 font-medium">🇪🇺 European Union</td>
                        <td className="py-2">27 EU countries</td>
                        <td className="py-2">2-3 days</td>
                        <td className="py-2">7-14 days</td>
                        <td className="py-2">$99.99</td>
                        <td className="py-2">Orders $3,000+</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-medium">🇦🇺 Australia</td>
                        <td className="py-2">AU</td>
                        <td className="py-2">3-5 days</td>
                        <td className="py-2">10-21 days</td>
                        <td className="py-2">$149.99</td>
                        <td className="py-2">Orders $5,000+</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-gray-600">
                  <strong>Note:</strong> International shipping rates are estimates. Actual rates may vary based on weight, dimensions, and customs requirements.
                  Container shipments and pallet quantities require custom freight quotes.
                </p>
              </CardContent>
            </Card>

            {/* International Carriers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2 text-indigo-600" />
                  International Shipping Carriers
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>DHL Express:</strong> UK, EU – 5-10 business days with full tracking and customs pre-clearance</li>
                  <li><strong>FedEx International Priority:</strong> All regions – 5-14 business days with temperature-controlled options</li>
                  <li><strong>UPS Worldwide:</strong> UK, EU, AU – 7-14 business days with HazMat certification</li>
                  <li><strong>Freight Forwarders:</strong> Container and pallet shipments – transit times by arrangement</li>
                </ul>
                <p className="text-sm text-gray-600 mt-4">
                  All international refrigerant shipments require specialized HazMat carriers compliant with IATA, IMDG, and local regulations.
                </p>
              </CardContent>
            </Card>

            {/* Customs & Duties */}
            <Card className="border-yellow-200 bg-yellow-50/30">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="h-5 w-5 mr-2 text-yellow-600" />
                  Customs, Duties & Import Taxes
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p><strong>Import Responsibility:</strong> International buyers are responsible for all import-related costs:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Import Duties:</strong> Tariffs based on product classification and country of import</li>
                  <li><strong>VAT/GST:</strong> Value Added Tax (EU/UK) or Goods & Services Tax (Australia)</li>
                  <li><strong>Customs Clearance Fees:</strong> Broker fees and administrative charges</li>
                  <li><strong>Inspection Fees:</strong> Some countries require chemical product inspection</li>
                </ul>
                
                <div className="bg-blue-50 p-4 rounded-lg mt-4 border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">💡 Tax Payment Options at Checkout</h4>
                  <p className="text-blue-800 text-sm mb-2">International customers have two options:</p>
                  <ul className="list-disc pl-6 text-blue-800 text-sm space-y-1">
                    <li><strong>Prepay at Checkout (DDP):</strong> Pay VAT/GST during checkout for faster customs clearance. Tax is included in your order total.</li>
                    <li><strong>Pay at Customs (DDU):</strong> Choose to pay duties and taxes directly to customs upon delivery. Your invoice will show 0% tax.</li>
                  </ul>
                  <p className="text-blue-700 text-xs mt-2">
                    <strong>DDP = Delivered Duty Paid</strong> (we handle customs) | <strong>DDU = Delivered Duty Unpaid</strong> (you handle customs)
                  </p>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg mt-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Estimated Tax Rates</h4>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Region</th>
                        <th className="text-left py-2">Tax Type</th>
                        <th className="text-left py-2">Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2">United Kingdom</td>
                        <td className="py-2">VAT</td>
                        <td className="py-2">20%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Germany</td>
                        <td className="py-2">VAT (MwSt)</td>
                        <td className="py-2">19%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">France</td>
                        <td className="py-2">VAT (TVA)</td>
                        <td className="py-2">20%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Netherlands</td>
                        <td className="py-2">VAT (BTW)</td>
                        <td className="py-2">21%</td>
                      </tr>
                      <tr>
                        <td className="py-2">Australia</td>
                        <td className="py-2">GST</td>
                        <td className="py-2">10%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* EU F-Gas Regulations */}
            <Card className="border-orange-200 bg-orange-50/30">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-orange-600" />
                  EU F-Gas Regulations (Regulation 517/2014)
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <div className="bg-orange-100 p-4 rounded-lg mb-4 border border-orange-300">
                  <p className="text-orange-900 font-semibold mb-2">
                    ⚠️ MANDATORY FOR EU CUSTOMERS PURCHASING REFRIGERANTS
                  </p>
                  <p className="text-orange-800 text-sm">
                    Under EU Regulation 517/2014, purchasers of fluorinated greenhouse gases (F-gases) must hold valid F-Gas certification.
                  </p>
                </div>

                <h4 className="font-semibold">Certification Requirements</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Valid F-Gas Certification:</strong> Required at checkout for all EU refrigerant orders</li>
                  <li><strong>Certification Number:</strong> Your national F-Gas certification number must be provided</li>
                  <li><strong>Validity Confirmation:</strong> You must confirm your certification is current and valid</li>
                </ul>

                <h4 className="font-semibold mt-4">Covered Products (F-Gases)</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>R-410A, R-32, R-134a (HFC refrigerants)</li>
                  <li>R-404A, R-407C, R-507A (HFC blends)</li>
                  <li>R-1234yf, R-1234ze (HFO refrigerants)</li>
                  <li>All fluorinated refrigerant gases with GWP &gt; 0</li>
                </ul>

                <h4 className="font-semibold mt-4">Certification Format Examples</h4>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <ul className="text-sm space-y-1">
                    <li><strong>UK:</strong> F-123456-ABC</li>
                    <li><strong>Germany:</strong> DE-FGA-12345</li>
                    <li><strong>France:</strong> FR-FGAS-2024-12345</li>
                    <li><strong>Netherlands:</strong> NL-STEK-123456</li>
                  </ul>
                </div>

                <div className="bg-red-50 p-4 rounded-lg mt-4 border border-red-200">
                  <p className="text-red-800 text-sm">
                    <strong>❌ Orders Without Valid F-Gas Certification:</strong> Cannot be processed for EU delivery.
                    If you are unable to provide valid certification, please contact us to discuss alternative arrangements.
                  </p>
                </div>
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

            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">Questions About Shipping?</h3>
              <p className="text-blue-800">
                For shipping inquiries or to request a freight quote:
                <br />
                <strong>Email:</strong> shipping@alperrefrigerants.com
                <br />
                <strong>Phone:</strong> +1-787-965-8975
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
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Building, Smartphone, Bitcoin, DollarSign, Shield, Clock, AlertTriangle } from 'lucide-react';
import SEOComponent from '../seo/SEOComponent';

const PaymentInformation = () => {
  return (
    <>
      <SEOComponent
        title="Payment Methods | Alper Refrigerants"
        description="Complete payment information for refrigerant orders. Learn about accepted payment methods, wire transfer instructions, and payment terms for HVAC contractors and wholesale buyers."
        keywords="refrigerant payment methods, wholesale payment terms, wire transfer, HVAC supplier payments, B2B payment options"
        canonicalUrl="/payment-info"
      />
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Payment Information</h1>
            <p className="text-gray-600">Last updated: December 2024</p>
            <p className="text-sm text-gray-500 mt-2">
              Secure Payment Options for B2B Refrigerant Purchases
            </p>
          </div>

          {/* Business Identity */}
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">Alper Chemical Group</h3>
            <p className="text-blue-800 text-sm">
              382 NE 191st St, Miami, FL 33179, United States<br />
              Tel: +1-787-965-8975 | Email: sales@alperrefrigas.com<br />
              <strong>B2B Supplier – Sales to EPA-certified HVAC professionals only</strong>
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                  Credit & Debit Cards
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p><strong>Accepted Cards:</strong></p>
                <div className="flex gap-4 mb-4">
                  <div className="bg-white rounded-lg p-2 border">
                    <span className="text-blue-600 font-bold text-sm">VISA</span>
                  </div>
                  <div className="bg-white rounded-lg p-2 border">
                    <span className="text-red-600 font-bold text-sm">MasterCard</span>
                  </div>
                  <div className="bg-white rounded-lg p-2 border">
                    <span className="text-blue-600 font-bold text-sm">AMEX</span>
                  </div>
                  <div className="bg-white rounded-lg p-2 border">
                    <span className="text-orange-600 font-bold text-sm">Discover</span>
                  </div>
                </div>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Processing:</strong> Payments processed securely through our PCI-compliant payment gateway</li>
                  <li><strong>Authorization:</strong> Card charged upon order confirmation</li>
                  <li><strong>Billing Address:</strong> Must match card statement address for verification</li>
                  <li><strong>Processing Fee:</strong> No additional processing fees for domestic transactions</li>
                  <li><strong>International Cards:</strong> May incur foreign transaction fees from your card issuer</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2 text-green-600" />
                  Bank Wire Transfer
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p><strong>Wire Transfer Instructions:</strong></p>
                <p className="text-sm text-gray-600 mb-4">Detailed wire transfer information will be provided upon order confirmation via email.</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Preferred for:</strong> Orders over $5,000</li>
                  <li><strong>Processing Time:</strong> 1-3 business days for domestic wires</li>
                  <li><strong>International Wires:</strong> 3-5 business days, SWIFT code provided</li>
                  <li><strong>Wire Fee:</strong> No incoming wire fees; sender responsible for bank fees</li>
                  <li><strong>Reference:</strong> Include your order number in the wire reference</li>
                </ul>
                <div className="bg-green-50 p-4 rounded-lg mt-4 border border-green-200">
                  <p className="text-green-800 text-sm">
                    <strong>💰 Discount:</strong> 2% discount available for wire transfer payments on orders over $10,000
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Smartphone className="h-5 w-5 mr-2 text-purple-600" />
                  Digital Payment Options
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p><strong>Zelle:</strong></p>
                <ul className="list-disc pl-6 space-y-1 mb-4">
                  <li>Instant transfers from your bank account</li>
                  <li>No transaction fees</li>
                  <li>Available through most major US banks</li>
                  <li>Send to our registered Zelle email (provided at checkout)</li>
                </ul>
                
                <p><strong>CashApp:</strong></p>
                <ul className="list-disc pl-6 space-y-1 mb-4">
                  <li>Quick payment via $cashtag</li>
                  <li>Instant confirmation</li>
                  <li>Our $cashtag provided at checkout</li>
                </ul>

                <p><strong>PayPal:</strong></p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Business PayPal accepted</li>
                  <li>Buyer protection available</li>
                  <li>Invoice payment option for commercial accounts</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bitcoin className="h-5 w-5 mr-2 text-orange-600" />
                  Cryptocurrency Payments
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p><strong>Accepted Cryptocurrencies:</strong></p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Bitcoin (BTC):</strong> Primary cryptocurrency option</li>
                  <li><strong>Ethereum (ETH):</strong> Accepted on ERC-20 network</li>
                  <li><strong>USDT (Tether):</strong> Stablecoin option available</li>
                  <li><strong>USDC:</strong> USD Coin accepted</li>
                </ul>
                <div className="bg-orange-50 p-4 rounded-lg mt-4 border border-orange-200">
                  <p className="text-orange-800 text-sm">
                    <strong>⏱️ Payment Window:</strong> Cryptocurrency payments must be completed within 30 minutes of order placement. Exchange rate locked at time of checkout.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                  Commercial Credit Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p><strong>Net Payment Terms (Qualified Accounts):</strong></p>
                <p className="text-sm text-gray-600 mb-4">Commercial credit terms available for established business accounts with approved credit applications.</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Net 30:</strong> Available for accounts with $10,000+ monthly volume</li>
                  <li><strong>Net 15:</strong> Standard terms for new commercial accounts</li>
                  <li><strong>COD:</strong> Cash on delivery available for first-time buyers</li>
                  <li><strong>Credit Application:</strong> Required for net terms approval</li>
                  <li><strong>Late Payment:</strong> 1.5% monthly finance charge on overdue balances</li>
                </ul>
                <p className="text-sm mt-4">
                  To apply for commercial credit terms, contact: <strong>credit@alperrefrigas.com</strong>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-blue-600" />
                  Payment Processing Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Payment Method</th>
                      <th className="text-left py-2">Processing Time</th>
                      <th className="text-left py-2">Order Release</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2">Credit Card</td>
                      <td className="py-2">Instant</td>
                      <td className="py-2">Same day</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Zelle</td>
                      <td className="py-2">Instant</td>
                      <td className="py-2">Same day</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">CashApp</td>
                      <td className="py-2">Instant</td>
                      <td className="py-2">Same day</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Wire Transfer</td>
                      <td className="py-2">1-3 business days</td>
                      <td className="py-2">Upon confirmation</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Cryptocurrency</td>
                      <td className="py-2">10-60 minutes</td>
                      <td className="py-2">Upon confirmation</td>
                    </tr>
                    <tr>
                      <td className="py-2">Net Terms</td>
                      <td className="py-2">Pre-approved</td>
                      <td className="py-2">Same day</td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-green-600" />
                  Payment Security
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>SSL Encryption:</strong> All transactions encrypted with 256-bit SSL</li>
                  <li><strong>PCI Compliance:</strong> Payment processing meets PCI DSS standards</li>
                  <li><strong>Fraud Protection:</strong> Advanced fraud detection on all transactions</li>
                  <li><strong>No Storage:</strong> Full card numbers never stored on our servers</li>
                  <li><strong>Secure Checkout:</strong> Verified secure checkout process</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
                  Important Payment Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <ul className="list-disc pl-6 space-y-1">
                  <li>All prices quoted in USD</li>
                  <li>Payment required before order processing (except Net terms accounts)</li>
                  <li>EPA certification verification required before refrigerant orders are released</li>
                  <li>Orders not paid within 7 days may be cancelled</li>
                  <li>Returned payments may result in order cancellation and restocking fee</li>
                </ul>
              </CardContent>
            </Card>

            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">Payment Questions?</h3>
              <p className="text-blue-800">
                For billing inquiries or payment assistance:
                <br />
                <strong>Email:</strong> billing@alperrefrigas.com
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

export default PaymentInformation;


import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Package, Truck, FileText, ArrowRight, Quote } from 'lucide-react';
import { useOrders } from '../../contexts/OrdersContext';
import { useQuotes } from '../../contexts/QuotesContext';
import { supabase } from '@/integrations/supabase/client';
import SEOComponent from '../seo/SEOComponent';

const OrderConfirmation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { orders, fetchOrders } = useOrders();
  const { quotes, fetchQuotes } = useQuotes();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const orderNumber = searchParams.get('orderNumber');
  const quoteNumber = searchParams.get('quoteNumber');
  const type = searchParams.get('type');
  
  const isQuote = type === 'quote';
  const confirmationNumber = isQuote ? quoteNumber : orderNumber;

  useEffect(() => {
    const fetchData = async () => {
      if (!confirmationNumber) {
        navigate('/');
        return;
      }

      setLoading(true);
      
      // First check if data exists in context
      let foundData = isQuote 
        ? quotes.find(q => q.quote_number === quoteNumber)
        : orders.find(o => o.order_number === orderNumber);

      if (!foundData) {
        // If not found in context, refresh the data and try again
        try {
          if (isQuote) {
            await fetchQuotes();
            foundData = quotes.find(q => q.quote_number === quoteNumber);
          } else {
            await fetchOrders();
            foundData = orders.find(o => o.order_number === orderNumber);
          }

          // If still not found, fetch directly from database
          if (!foundData) {
            if (isQuote) {
              const { data: quoteData, error } = await supabase
                .from('quotes')
                .select(`
                  *,
                  quote_items (
                    id,
                    product_name,
                    quantity,
                    packaging,
                    product_id
                  )
                `)
                .eq('quote_number', quoteNumber)
                .single();

              if (!error && quoteData) {
                foundData = {
                  ...quoteData,
                  items: quoteData.quote_items || []
                } as any;
              }
            } else {
              const { data: orderData, error } = await supabase
                .from('orders')
                .select(`
                  *,
                  order_items (
                    id,
                    product_name,
                    quantity,
                    price,
                    packaging,
                    epa_approved,
                    product_id
                  )
                `)
                .eq('order_number', orderNumber)
                .single();

              if (!error && orderData) {
                foundData = {
                  ...orderData,
                  items: orderData.order_items || []
                } as any;
              }
            }
          }
        } catch (error) {
          console.error('Error fetching confirmation data:', error);
        }
      }

      setData(foundData);
      setLoading(false);

      // If still no data found, redirect after showing message
      if (!foundData) {
        setTimeout(() => navigate('/account'), 5000);
      }
    };

    fetchData();
  }, [confirmationNumber, isQuote, orderNumber, quoteNumber, orders, quotes, fetchOrders, fetchQuotes, navigate]);

  if (loading) {
    return (
      <>
        <SEOComponent
          title="Order Confirmation - Processing Your Order"
          description="Your refrigerant order is being processed. Track your order status and get updates on delivery."
          keywords="order confirmation, refrigerant order tracking, HVAC order status, order processing"
          canonicalUrl="/order-confirmation"
        />
        <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading your order details...</h1>
        <p className="text-gray-600">Please wait while we retrieve your information.</p>
      </div>
      </>
    );
  }

  if (!data) {
    return (
      <>
        <SEOComponent
          title="Order Confirmation - Thank You for Your Order"
          description="Your refrigerant order has been confirmed. Thank you for choosing our professional refrigerant distribution services."
          keywords="order confirmed, refrigerant purchase confirmation, thank you order, HVAC order complete"
          canonicalUrl="/order-confirmation"
        />
        <div className="container mx-auto px-4 py-8 text-center">
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isQuote ? 'Quote Request Submitted!' : 'Order Confirmed!'}
        </h1>
        <p className="text-xl text-gray-600 mb-4">
          {isQuote 
            ? "Thank you for your quote request. We'll contact you soon with pricing."
            : "Thank you for your order. We've received your payment and will process your order shortly."
          }
        </p>
        <p className="text-sm text-gray-500 mb-4">
          {confirmationNumber && (
            <>Reference Number: <span className="font-mono text-blue-600">{confirmationNumber}</span></>
          )}
        </p>
        <p className="text-sm text-gray-500">Redirecting to your account...</p>
        <div className="mt-6">
          <Link to="/account">
            <Button>Go to Account</Button>
          </Link>
        </div>
      </div>
      </>
    );
  }

  const createdDate = new Date(data.created_at);
  const estimatedDelivery = new Date(createdDate);
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

  return (
    <>
      <SEOComponent
        title={`${isQuote ? 'Quote Request' : 'Order'} Confirmation - ${confirmationNumber}`}
        description={`${isQuote ? 'Your quote request has been submitted' : 'Your order has been confirmed'}. Track your ${isQuote ? 'quote status' : 'order status'} and get updates.`}
        keywords={`${isQuote ? 'quote confirmation' : 'order confirmation'}, refrigerant ${isQuote ? 'quote tracking' : 'order tracking'}, HVAC ${isQuote ? 'quote' : 'order'} status`}
        canonicalUrl="/order-confirmation"
      />
      <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          {isQuote ? (
            <Quote className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          ) : (
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          )}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isQuote ? 'Quote Request Submitted!' : 'Order Confirmed!'}
          </h1>
          <p className="text-xl text-gray-600">
            {isQuote 
              ? "Thank you for your quote request. Our sales team will contact you within one business day with detailed pricing."
              : "Thank you for your order. We've received your payment and will process your order shortly."
            }
          </p>
        </div>

        {/* Details */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {isQuote ? <Quote className="h-5 w-5" /> : <Package className="h-5 w-5" />}
                {isQuote ? 'Quote Request Details' : 'Order Details'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h3 className="font-semibold">{isQuote ? 'Quote Number' : 'Order Number'}</h3>
                  <p className="text-lg font-mono text-blue-600">{confirmationNumber}</p>
                </div>
                <div className="text-right">
                  <h3 className="font-semibold">{isQuote ? 'Request Date' : 'Order Date'}</h3>
                  <p>{createdDate.toLocaleDateString()}</p>
                </div>
              </div>
              
              {data.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4 border-b pb-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Package className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{item.product_name}</h4>
                    {item.packaging && (
                      <p className="text-sm text-gray-600">Packaging: {item.packaging}</p>
                    )}
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    {item.epa_approved && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800 mt-1">
                        EPA Approved
                      </Badge>
                    )}
                  </div>
                  {!isQuote && item.price && (
                    <div className="text-right">
                      <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  )}
                </div>
              ))}
              
              {!isQuote && 'total_amount' in data && (
                <div className="space-y-2 pt-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${(data.total_amount - (data.shipping_cost || 0) - (data.tax_amount || 0)).toFixed(2)}</span>
                  </div>
                  {data.shipping_cost > 0 && (
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>${data.shipping_cost.toFixed(2)}</span>
                    </div>
                  )}
                  {data.tax_amount > 0 && (
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>${data.tax_amount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total</span>
                    <span className="text-green-600">${data.total_amount.toFixed(2)}</span>
                  </div>
                </div>
              )}
              
              {isQuote && (
                <div className="pt-4 bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-800 text-sm font-medium">
                    This is a quote request. Pricing will be provided by our sales team within one business day.
                  </p>
                </div>
              )}

              {/* Payment Instructions for Digital Payments */}
              {!isQuote && data.payment_method && (data.payment_method === 'cashapp' || data.payment_method === 'zelle') && (
                <div className="pt-4 bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-900 mb-2">Payment Instructions</h4>
                  {data.payment_method === 'cashapp' && (
                    <div className="text-orange-800 text-sm space-y-2">
                      <p>• You will receive a proforma invoice with our CashApp details via email</p>
                      {data.cashapp_tag && (
                        <p>• A payment request will be sent to your CashApp tag: <span className="font-mono font-medium">{data.cashapp_tag}</span></p>
                      )}
                      <p className="font-medium">• Please confirm the payment request within 24 hours to secure your order</p>
                      <p>• Your order will be processed once payment is confirmed</p>
                    </div>
                  )}
                  {data.payment_method === 'zelle' && (
                    <div className="text-orange-800 text-sm space-y-2">
                      <p>• You will receive a proforma invoice with our Zelle details via email</p>
                      {data.zelle_tag && (
                        <p>• Payment request will be sent to: <span className="font-mono font-medium">{data.zelle_tag}</span></p>
                      )}
                      {data.zelle_phone && (
                        <p>• Backup contact: <span className="font-mono font-medium">{data.zelle_phone}</span></p>
                      )}
                      <p className="font-medium">• Please confirm the payment request within 24 hours to secure your order</p>
                      <p>• Your order will be processed once payment is confirmed</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            {/* Contact/Shipping Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {isQuote ? <FileText className="h-5 w-5" /> : <Truck className="h-5 w-5" />}
                  {isQuote ? 'Contact Info' : 'Shipping Info'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <p className="font-medium">{data.customer_name}</p>
                    <p className="text-sm text-gray-600">{data.customer_email}</p>
                    {'company_name' in data && data.company_name && (
                      <p className="text-sm text-gray-600">{data.company_name}</p>
                    )}
                  </div>
                  {data.shipping_address && (
                    <div className="text-sm text-gray-600">
                      {typeof data.shipping_address === 'string' ? (
                        <p>{data.shipping_address}</p>
                      ) : (
                        <div>
                          <p>{data.shipping_address.street}</p>
                          <p>{data.shipping_address.city}, {data.shipping_address.state} {data.shipping_address.zipCode}</p>
                          <p>{data.shipping_address.country}</p>
                        </div>
                      )}
                    </div>
                  )}
                  {!isQuote && (
                    <div className="pt-2 border-t">
                      <p className="text-sm font-medium">Estimated Delivery</p>
                      <p className="text-sm text-green-600">{estimatedDelivery.toLocaleDateString()}</p>
                    </div>
                  )}
                  {isQuote && (
                    <div className="pt-2 border-t">
                      <p className="text-sm font-medium">Response Time</p>
                      <p className="text-sm text-blue-600">Within 1 business day</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
                  </Badge>
                  <p className="text-xs text-gray-600 mt-2">
                    {isQuote 
                      ? "Your quote request has been submitted and is pending review by our sales team."
                      : "Your order has been confirmed and is being processed."
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Next Steps */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What happens next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h4 className="font-medium mb-2">Order Processing</h4>
                <p className="text-sm text-gray-600">
                  We'll verify your EPA certification and prepare your order for shipment.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-orange-600 font-bold">2</span>
                </div>
                <h4 className="font-medium mb-2">Shipment</h4>
                <p className="text-sm text-gray-600">
                  Your order will be carefully packaged and shipped via our certified carrier network.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 font-bold">3</span>
                </div>
                <h4 className="font-medium mb-2">Delivery</h4>
                <p className="text-sm text-gray-600">
                  Receive your refrigerants with all necessary documentation and safety information.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/account">
            <Button variant="outline" size="lg" className="flex items-center gap-2">
              View Order History
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/products">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
              Continue Shopping
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Contact Info */}
        <div className="text-center mt-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Questions about your order?</h3>
          <p className="text-gray-600 mb-4">
            Our customer service team is here to help with any questions or concerns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/support">
              <Button variant="outline">Contact Support</Button>
            </Link>
            <a href="tel:1-800-REFRIGERANT" className="text-blue-600 hover:underline font-medium">
              📞 1-800-REFRIGERANT
            </a>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default OrderConfirmation;

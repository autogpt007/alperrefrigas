
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Package, Truck, FileText, ArrowRight } from 'lucide-react';

interface OrderData {
  orderNumber: string;
  items: any[];
  total: number;
  shippingCost: number;
  customerInfo: any;
  orderDate: string;
}

const OrderConfirmation = () => {
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedOrder = localStorage.getItem('lastOrder');
    if (savedOrder) {
      setOrderData(JSON.parse(savedOrder));
    } else {
      // If no order data, redirect to home
      navigate('/');
    }
  }, [navigate]);

  if (!orderData) {
    return <div>Loading...</div>;
  }

  const orderDate = new Date(orderData.orderDate);
  const estimatedDelivery = new Date(orderDate);
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 7); // Add 7 days

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-xl text-gray-600">
            Thank you for your order. We've received your payment and will process your order shortly.
          </p>
        </div>

        {/* Order Details */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h3 className="font-semibold">Order Number</h3>
                  <p className="text-lg font-mono text-blue-600">{orderData.orderNumber}</p>
                </div>
                <div className="text-right">
                  <h3 className="font-semibold">Order Date</h3>
                  <p>{orderDate.toLocaleDateString()}</p>
                </div>
              </div>
              
              {orderData.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4 border-b pb-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg bg-gray-100"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    {item.epaApproved && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800 mt-1">
                        EPA Approved
                      </Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
              
              <div className="space-y-2 pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${(orderData.total - orderData.shippingCost).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${orderData.shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total</span>
                  <span className="text-green-600">${orderData.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {/* Shipping Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping Info
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <p className="font-medium">{orderData.customerInfo.firstName} {orderData.customerInfo.lastName}</p>
                    <p className="text-sm text-gray-600">{orderData.customerInfo.company}</p>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>{orderData.customerInfo.address}</p>
                    <p>{orderData.customerInfo.city}, {orderData.customerInfo.state} {orderData.customerInfo.zipCode}</p>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-sm font-medium">Estimated Delivery</p>
                    <p className="text-sm text-green-600">{estimatedDelivery.toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* EPA Compliance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  EPA Compliance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">EPA Cert #:</span> {orderData.customerInfo.epaNumber}
                  </p>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    ✓ Verified
                  </Badge>
                  <p className="text-xs text-gray-600 mt-2">
                    Your EPA certification has been verified and is on file for this order.
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
  );
};

export default OrderConfirmation;

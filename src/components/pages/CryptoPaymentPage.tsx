import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Copy, Check, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import SEOComponent from '@/components/seo/SEOComponent';

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  payment_method: string;
  status: string;
  items: any;
  cashapp_tag?: string;
  zelle_tag?: string;
}

interface PaymentWallet {
  id: string;
  payment_type: string;
  wallet_address: string;
  qr_code_url: string | null;
  label: string | null;
}

const CryptoPaymentPage = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [wallet, setWallet] = useState<PaymentWallet | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!orderNumber) return;

    const fetchOrderAndWallet = async () => {
      try {
        // Fetch order details
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('order_number', orderNumber)
          .single();

        if (orderError) {
          console.error('Error fetching order:', orderError);
          return;
        }

        setOrder(orderData);

        // Fetch wallet address for the payment method
        if (orderData?.payment_method) {
          const { data: walletData, error: walletError } = await supabase
            .from('payment_wallet_addresses')
            .select('*')
            .eq('payment_type', orderData.payment_method.toLowerCase())
            .eq('is_active', true)
            .single();

          if (walletError) {
            console.error('Error fetching wallet:', walletError);
            toast({
              title: "Payment Method Not Available",
              description: "The selected cryptocurrency payment method is currently unavailable.",
              variant: "destructive",
            });
            return;
          }

          setWallet(walletData);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderAndWallet();
  }, [orderNumber, toast]);

  const copyToClipboard = async () => {
    if (!wallet?.wallet_address) return;
    
    try {
      await navigator.clipboard.writeText(wallet.wallet_address);
      setCopied(true);
      toast({
        title: "Address Copied",
        description: "Wallet address has been copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Please manually copy the address",
        variant: "destructive",
      });
    }
  };

  const handlePaymentConfirmation = async () => {
    if (!order) return;

    try {
      // Update order status to processing
      const { error } = await supabase
        .from('orders')
        .update({ status: 'processing' })
        .eq('id', order.id);

      if (error) {
        console.error('Error updating order:', error);
        return;
      }

      setPaymentConfirmed(true);
      
      toast({
        title: "Payment Confirmation Received",
        description: "We'll verify your payment and send a confirmation email shortly.",
      });

      // Send confirmation email via edge function
      await supabase.functions.invoke('send-order-notification', {
        body: {
          orderId: order.id,
          orderNumber: order.order_number,
          customerEmail: order.customer_email,
          customerName: order.customer_name,
          paymentMethod: order.payment_method,
          totalAmount: order.total_amount,
          items: order.items,
          status: 'processing'
        }
      });

    } catch (error) {
      console.error('Error confirming payment:', error);
      toast({
        title: "Error",
        description: "Failed to confirm payment. Please contact support.",
        variant: "destructive",
      });
    }
  };

  if (!orderNumber) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!order || !wallet) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Order Not Found</h2>
              <p className="text-muted-foreground mb-4">
                We couldn't find the order or payment method is not available.
              </p>
              <Button asChild>
                <a href="/">Return Home</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <SEOComponent 
        title="Complete Your Crypto Payment | Alper"
        description="Complete your cryptocurrency payment securely"
        canonicalUrl="/crypto-payment"
      />
      
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="max-w-2xl mx-auto space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Order Summary
                  <Badge variant="outline">#{order.order_number}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Customer:</span>
                    <span>{order.customer_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span>{order.customer_email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Method:</span>
                    <span className="capitalize">{order.payment_method}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total Amount:</span>
                    <span>${order.total_amount.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>Complete Your {wallet.payment_type.toUpperCase()} Payment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* QR Code */}
                {wallet.qr_code_url && (
                  <div className="text-center">
                    <div className="inline-block p-4 bg-white rounded-lg border">
                      <img 
                        src={wallet.qr_code_url} 
                        alt={`${wallet.payment_type} QR Code`}
                        className="w-48 h-48 mx-auto"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Scan QR code with your crypto wallet
                    </p>
                  </div>
                )}

                {/* Wallet Address */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {wallet.payment_type.toUpperCase()} Wallet Address:
                  </label>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 p-3 bg-muted rounded-md font-mono text-sm break-all">
                      {wallet.wallet_address}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyToClipboard}
                      className="shrink-0"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  {wallet.label && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {wallet.label}
                    </p>
                  )}
                </div>

                {/* Payment Instructions */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">Payment Instructions:</h4>
                  <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                    <li>Send exactly ${order.total_amount.toFixed(2)} worth of {wallet.payment_type.toUpperCase()} to the address above</li>
                    <li>Ensure you include the exact amount to avoid processing delays</li>
                    <li>Click "I've Made the Payment" below after sending</li>
                    <li>We'll verify your payment and send confirmation within 24 hours</li>
                  </ol>
                </div>

                {/* Confirmation Button */}
                {!paymentConfirmed ? (
                  <Button 
                    onClick={handlePaymentConfirmation}
                    className="w-full"
                    size="lg"
                  >
                    I've Made the Payment
                  </Button>
                ) : (
                  <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-center mb-2">
                      <Check className="h-6 w-6 text-green-600 mr-2" />
                      <span className="font-medium text-green-800">Payment Confirmation Received</span>
                    </div>
                    <p className="text-sm text-green-700">
                      We'll verify your payment and send a confirmation email within 24 hours.
                    </p>
                  </div>
                )}

                {/* Support Info */}
                <div className="text-center text-sm text-muted-foreground">
                  <p>Need help? Contact our support team</p>
                  <p>We're here to assist you with your payment</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default CryptoPaymentPage;
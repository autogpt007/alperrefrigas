import React, { useState, useEffect } from 'react';
import { Bitcoin, Copy, Clock, AlertCircle } from 'lucide-react';
import { Button } from './button';
import { Alert, AlertDescription } from './alert';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Label } from './label';
import { usePaymentWallets } from '@/hooks/usePaymentWallets';

interface CryptoPaymentSectionProps {
  order: {
    payment_method?: string;
    total_amount: number;
    created_at: string;
  };
}

export const CryptoPaymentSection: React.FC<CryptoPaymentSectionProps> = ({ order }) => {
  const { wallets } = usePaymentWallets();
  const [timeRemaining, setTimeRemaining] = useState<number>(30 * 60); // 30 minutes in seconds
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const orderTime = new Date(order.created_at).getTime();
    const currentTime = Date.now();
    const elapsedSeconds = Math.floor((currentTime - orderTime) / 1000);
    const remainingSeconds = Math.max(0, (30 * 60) - elapsedSeconds);

    setTimeRemaining(remainingSeconds);
    setIsExpired(remainingSeconds <= 0);

    if (remainingSeconds > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            setIsExpired(true);
            clearInterval(timer);
            return 0;
          }
          return newTime;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [order.created_at]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const cryptoType = order.payment_method?.replace('crypto_', '') || '';
  const wallet = wallets.find(w => w.payment_type === cryptoType);

  if (isExpired) {
    return (
      <div className="text-center space-y-4">
        <Alert className="border-red-300 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            The 30-minute payment window has expired. A proforma invoice has been sent to your email.
          </AlertDescription>
        </Alert>
        <p className="text-gray-600">
          Please check your email for payment instructions or contact our support team.
        </p>
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="text-center">
        <p className="text-gray-600">
          Crypto payment details are being prepared. Please check your email for updates.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Countdown Timer */}
      <Card className="border-orange-300 bg-orange-50">
        <CardContent className="pt-6">
          <div className="text-center">
            <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-orange-900 mb-1">Payment Timer</h3>
            <div className="text-3xl font-mono font-bold text-orange-700 mb-2">
              {formatTime(timeRemaining)}
            </div>
            <p className="text-sm text-orange-800">
              Complete your payment within this time to confirm your order
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Payment Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bitcoin className="h-5 w-5 text-orange-600" />
            {wallet.payment_type.toUpperCase()} Payment Instructions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Send exactly:</Label>
                <div className="mt-1 p-3 bg-gray-50 rounded border font-mono text-lg font-semibold">
                  ${order.total_amount.toFixed(2)} USD worth of {wallet.payment_type.toUpperCase()}
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">To this wallet address:</Label>
                <div className="mt-1 p-3 bg-gray-50 rounded border">
                  <code className="text-sm break-all font-mono">
                    {wallet.wallet_address}
                  </code>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => navigator.clipboard.writeText(wallet.wallet_address)}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Address
                </Button>
              </div>
              
              {wallet.label && (
                <p className="text-sm text-gray-600">{wallet.label}</p>
              )}
            </div>
            
            {wallet.qr_code_url && (
              <div className="flex flex-col items-center">
                <Label className="text-sm font-medium mb-3">Scan QR Code:</Label>
                <img
                  src={wallet.qr_code_url}
                  alt={`${wallet.payment_type.toUpperCase()} QR Code`}
                  className="w-48 h-48 border border-gray-300 rounded"
                />
              </div>
            )}
          </div>
          
          <Alert className="mt-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> Send the exact USD amount in {wallet.payment_type.toUpperCase()}. 
              After payment, our team will verify the transaction and process your order. 
              If payment is not received within 30 minutes, you'll receive a proforma invoice via email.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};
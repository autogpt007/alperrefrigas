import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PaymentWallet {
  id: string;
  payment_type: string;
  wallet_address: string;
  qr_code_url: string | null;
  label: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const usePaymentWallets = (orderNumber?: string) => {
  const [wallets, setWallets] = useState<PaymentWallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWallets = async () => {
    try {
      setLoading(true);
      setError(null);

      // Receiving details come from the server; addresses are only returned
      // once a real order reference is supplied.
      const { data, error: fetchError } = await supabase.functions.invoke('payment-wallets', {
        body: orderNumber ? { order_number: orderNumber } : {},
      });

      if (fetchError || data?.error) {
        console.error('Error fetching payment wallets:', fetchError || data?.error);
        setError('Failed to fetch payment methods');
        return;
      }

      setWallets((data?.wallets as PaymentWallet[]) || []);
    } catch (err) {
      console.error('Error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderNumber]);

  const getWalletsByType = (type: string) => {
    return wallets.filter(wallet => wallet.payment_type === type);
  };

  const getCryptoWallets = () => {
    return wallets.filter(wallet => 
      ['bitcoin', 'ethereum', 'usdt', 'litecoin'].includes(wallet.payment_type)
    );
  };

  const getTraditionalWallets = () => {
    return wallets.filter(wallet => 
      ['zelle', 'cashapp'].includes(wallet.payment_type)
    );
  };

  return {
    wallets,
    loading,
    error,
    refetch: fetchWallets,
    getWalletsByType,
    getCryptoWallets,
    getTraditionalWallets
  };
};
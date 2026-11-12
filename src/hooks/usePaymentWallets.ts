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

export const usePaymentWallets = () => {
  const [wallets, setWallets] = useState<PaymentWallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWallets = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('payment_wallet_addresses')
        .select('*')
        .eq('is_active', true)
        .order('payment_type', { ascending: true });

      if (fetchError) {
        console.error('Error fetching payment wallets:', fetchError);
        setError('Failed to fetch payment methods');
        return;
      }

      setWallets(data || []);
    } catch (err) {
      console.error('Error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, []);

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
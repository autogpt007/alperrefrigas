import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Currency } from '@/utils/currencyUtils';

export function useExchangeRates() {
  const { data: currencies, isLoading, error, refetch } = useQuery({
    queryKey: ['exchange-rates'],
    queryFn: async (): Promise<Currency[]> => {
      const { data, error } = await supabase
        .from('exchange_rates')
        .select('*')
        .eq('is_active', true)
        .order('target_currency');

      if (error) throw error;
      return (data || []) as Currency[];
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
    refetchOnWindowFocus: false,
  });

  return {
    currencies: currencies || [],
    isLoading,
    error,
    refetch,
  };
}

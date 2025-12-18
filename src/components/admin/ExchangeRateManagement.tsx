import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { RefreshCw, DollarSign, TrendingUp, Clock, Save } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface ExchangeRate {
  id: string;
  base_currency: string;
  target_currency: string;
  rate: number;
  currency_symbol: string;
  currency_name: string;
  country_codes: string[];
  flag_emoji: string;
  is_active: boolean;
  last_updated: string;
  created_at: string;
}

const ExchangeRateManagement = () => {
  const queryClient = useQueryClient();
  const [editingRates, setEditingRates] = useState<Record<string, number>>({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: rates, isLoading } = useQuery({
    queryKey: ['admin-exchange-rates'],
    queryFn: async (): Promise<ExchangeRate[]> => {
      const { data, error } = await supabase
        .from('exchange_rates')
        .select('*')
        .order('target_currency');

      if (error) throw error;
      return data as ExchangeRate[];
    },
  });

  const updateRateMutation = useMutation({
    mutationFn: async ({ id, rate }: { id: string; rate: number }) => {
      const { error } = await supabase
        .from('exchange_rates')
        .update({ rate, last_updated: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-exchange-rates'] });
      queryClient.invalidateQueries({ queryKey: ['exchange-rates'] });
      toast.success('Exchange rate updated');
    },
    onError: (error) => {
      toast.error('Failed to update rate: ' + error.message);
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('exchange_rates')
        .update({ is_active })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-exchange-rates'] });
      queryClient.invalidateQueries({ queryKey: ['exchange-rates'] });
      toast.success('Currency status updated');
    },
    onError: (error) => {
      toast.error('Failed to update status: ' + error.message);
    },
  });

  const refreshRates = async () => {
    setIsRefreshing(true);
    try {
      // Fetch rates from Frankfurter API (free, uses ECB data)
      const response = await fetch('https://api.frankfurter.app/latest?from=USD&to=EUR,GBP,AUD,CAD');
      const data = await response.json();

      if (data.rates) {
        // Update each rate in database
        for (const [currency, rate] of Object.entries(data.rates)) {
          const { error } = await supabase
            .from('exchange_rates')
            .update({ 
              rate: rate as number, 
              last_updated: new Date().toISOString() 
            })
            .eq('target_currency', currency);

          if (error) {
            console.error(`Failed to update ${currency}:`, error);
          }
        }

        queryClient.invalidateQueries({ queryKey: ['admin-exchange-rates'] });
        queryClient.invalidateQueries({ queryKey: ['exchange-rates'] });
        toast.success('Exchange rates refreshed from ECB');
      }
    } catch (error) {
      console.error('Failed to fetch rates:', error);
      toast.error('Failed to fetch latest rates');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRateChange = (id: string, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      setEditingRates(prev => ({ ...prev, [id]: numValue }));
    }
  };

  const saveRate = (id: string, currentRate: number) => {
    const newRate = editingRates[id];
    if (newRate && newRate !== currentRate) {
      updateRateMutation.mutate({ id, rate: newRate });
      setEditingRates(prev => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading exchange rates...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Exchange Rates</h2>
          <p className="text-muted-foreground">Manage currency exchange rates for multi-currency pricing</p>
        </div>
        <Button onClick={refreshRates} disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh from ECB
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rates?.map((rate) => (
          <Card key={rate.id} className={!rate.is_active ? 'opacity-60' : ''}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{rate.flag_emoji}</span>
                  <div>
                    <CardTitle className="text-lg">{rate.currency_name}</CardTitle>
                    <CardDescription>{rate.target_currency}</CardDescription>
                  </div>
                </div>
                <Switch
                  checked={rate.is_active}
                  onCheckedChange={(checked) => 
                    toggleActiveMutation.mutate({ id: rate.id, is_active: checked })
                  }
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">1 USD =</span>
                <Badge variant="secondary" className="text-lg font-mono">
                  {rate.currency_symbol}{rate.rate.toFixed(4)}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <Label htmlFor={`rate-${rate.id}`} className="text-sm">Override Rate:</Label>
                <Input
                  id={`rate-${rate.id}`}
                  type="number"
                  step="0.0001"
                  value={editingRates[rate.id] ?? rate.rate}
                  onChange={(e) => handleRateChange(rate.id, e.target.value)}
                  className="w-28 h-8"
                  disabled={rate.target_currency === 'USD'}
                />
                {editingRates[rate.id] && editingRates[rate.id] !== rate.rate && (
                  <Button 
                    size="sm" 
                    onClick={() => saveRate(rate.id, rate.rate)}
                  >
                    <Save className="h-3 w-3" />
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Updated: {format(new Date(rate.last_updated), 'MMM d, yyyy HH:mm')}</span>
              </div>

              <div className="text-xs text-muted-foreground">
                Countries: {rate.country_codes.slice(0, 5).join(', ')}
                {rate.country_codes.length > 5 && ` +${rate.country_codes.length - 5} more`}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Exchange Rate Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Exchange rates are sourced from the European Central Bank (ECB) via Frankfurter API.</p>
          <p>• Rates are cached and can be refreshed manually using the button above.</p>
          <p>• You can override rates manually for special pricing or promotions.</p>
          <p>• All product prices are stored in USD and converted at display time.</p>
          <p>• Disabling a currency will hide it from the customer currency selector.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExchangeRateManagement;

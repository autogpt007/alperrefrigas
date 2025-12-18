import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCurrency } from '@/contexts/CurrencyContext';
import type { SupportedCurrency } from '@/utils/currencyUtils';

const CurrencySwitcher = () => {
  const { currency, setCurrency, currencies, isLoading } = useCurrency();

  if (isLoading || currencies.length === 0) {
    return null;
  }

  return (
    <Select value={currency} onValueChange={(value) => setCurrency(value as SupportedCurrency)}>
      <SelectTrigger className="w-[110px] h-8 text-xs bg-transparent border-gray-300">
        <SelectValue>
          {currencies.find(c => c.target_currency === currency)?.flag_emoji}{' '}
          {currency}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {currencies.map((c) => (
          <SelectItem key={c.target_currency} value={c.target_currency}>
            <span className="flex items-center gap-2">
              <span>{c.flag_emoji}</span>
              <span>{c.target_currency}</span>
              <span className="text-muted-foreground text-xs">({c.currency_symbol})</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CurrencySwitcher;

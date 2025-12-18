import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useExchangeRates } from '@/hooks/useExchangeRates';
import { 
  Currency, 
  formatCurrencyPrice, 
  convertFromUSD, 
  getCurrencyByCountry, 
  detectUserCountry,
  SUPPORTED_CURRENCIES,
  type SupportedCurrency 
} from '@/utils/currencyUtils';

interface CurrencyContextType {
  currency: SupportedCurrency;
  setCurrency: (currency: SupportedCurrency) => void;
  exchangeRate: number;
  currencySymbol: string;
  currencyName: string;
  formatPrice: (priceUSD: number) => string;
  convertPrice: (priceUSD: number) => number;
  isLoading: boolean;
  currencies: Currency[];
  flagEmoji: string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const CURRENCY_STORAGE_KEY = 'preferred_currency';

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const { currencies, isLoading } = useExchangeRates();
  const [currency, setCurrencyState] = useState<SupportedCurrency>('USD');

  // Get current currency data
  const currentCurrencyData = currencies.find(c => c.target_currency === currency);
  const exchangeRate = currentCurrencyData?.rate || 1;
  const currencySymbol = currentCurrencyData?.currency_symbol || '$';
  const currencyName = currentCurrencyData?.currency_name || 'US Dollar';
  const flagEmoji = currentCurrencyData?.flag_emoji || '🇺🇸';

  // Auto-detect currency on mount
  useEffect(() => {
    // Check localStorage first
    const stored = localStorage.getItem(CURRENCY_STORAGE_KEY);
    if (stored && SUPPORTED_CURRENCIES.includes(stored as SupportedCurrency)) {
      setCurrencyState(stored as SupportedCurrency);
      return;
    }

    // Auto-detect from country if currencies loaded
    if (currencies.length > 0) {
      const countryCode = detectUserCountry();
      const detectedCurrency = getCurrencyByCountry(currencies, countryCode);
      if (detectedCurrency) {
        setCurrencyState(detectedCurrency.target_currency as SupportedCurrency);
        localStorage.setItem(CURRENCY_STORAGE_KEY, detectedCurrency.target_currency);
      }
    }
  }, [currencies]);

  const setCurrency = useCallback((newCurrency: SupportedCurrency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem(CURRENCY_STORAGE_KEY, newCurrency);
  }, []);

  const formatPrice = useCallback((priceUSD: number): string => {
    return formatCurrencyPrice(priceUSD, currency, exchangeRate, currencySymbol);
  }, [currency, exchangeRate, currencySymbol]);

  const convertPrice = useCallback((priceUSD: number): number => {
    return convertFromUSD(priceUSD, exchangeRate);
  }, [exchangeRate]);

  return (
    <CurrencyContext.Provider value={{
      currency,
      setCurrency,
      exchangeRate,
      currencySymbol,
      currencyName,
      formatPrice,
      convertPrice,
      isLoading,
      currencies,
      flagEmoji,
    }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}

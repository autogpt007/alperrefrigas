import React, { createContext, useContext, useEffect, useState } from 'react';
import { SUPPORTED_COUNTRIES } from '@/hooks/useInternationalTaxCalculator';
import { detectUserCountry } from '@/utils/currencyUtils';

const KEY = 'alper_ship_country';
const supported = (cc?: string | null) => !!cc && SUPPORTED_COUNTRIES.some(c => c.code === cc);

interface Ctx {
  countryCode: string;
  countryName: string;
  confirmed: boolean; // true once the buyer picked it themselves
  setCountry: (cc: string) => void;
}

const ShippingCountryContext = createContext<Ctx | null>(null);

export const ShippingCountryProvider = ({ children }: { children: React.ReactNode }) => {
  const stored = typeof window !== 'undefined' ? localStorage.getItem(KEY) : null;
  const [countryCode, setCode] = useState<string>(supported(stored) ? stored! : (supported(detectUserCountry()) ? detectUserCountry() : 'US'));
  const [confirmed, setConfirmed] = useState<boolean>(supported(stored));

  useEffect(() => {
    if (confirmed) return;
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 4000);
    fetch('https://api.country.is/', { signal: ctrl.signal })
      .then(r => r.json())
      .then(d => { if (supported(d?.country)) setCode(d.country); })
      .catch(() => {})
      .finally(() => clearTimeout(t));
    return () => ctrl.abort();
  }, [confirmed]);

  const setCountry = (cc: string) => {
    setCode(cc);
    setConfirmed(true);
    localStorage.setItem(KEY, cc);
  };

  const countryName = SUPPORTED_COUNTRIES.find(c => c.code === countryCode)?.name || countryCode;
  return (
    <ShippingCountryContext.Provider value={{ countryCode, countryName, confirmed, setCountry }}>
      {children}
    </ShippingCountryContext.Provider>
  );
};

export const useShippingCountry = () => {
  const ctx = useContext(ShippingCountryContext);
  if (!ctx) throw new Error('useShippingCountry must be used within ShippingCountryProvider');
  return ctx;
};

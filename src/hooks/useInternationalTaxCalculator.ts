import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTaxCalculator } from './useTaxCalculator';

export interface InternationalTaxCalculation {
  taxRate: number;
  taxAmount: number;
  taxType: string;
  countryCode: string;
  countryName: string;
  region: string;
  isLoading: boolean;
  error: string | null;
  displayLabel: string;
}

interface InternationalTaxRate {
  id: string;
  country_code: string;
  country_name: string;
  tax_type: string;
  tax_rate: number;
  region: string;
  is_active: boolean;
  notes: string | null;
}

// Supported countries with their regions
export const SUPPORTED_COUNTRIES = [
  // US
  { code: 'US', name: 'United States', region: 'US' },
  // UK
  { code: 'GB', name: 'United Kingdom', region: 'UK' },
  // EU Countries
  { code: 'AT', name: 'Austria', region: 'EU' },
  { code: 'BE', name: 'Belgium', region: 'EU' },
  { code: 'BG', name: 'Bulgaria', region: 'EU' },
  { code: 'HR', name: 'Croatia', region: 'EU' },
  { code: 'CY', name: 'Cyprus', region: 'EU' },
  { code: 'CZ', name: 'Czech Republic', region: 'EU' },
  { code: 'DK', name: 'Denmark', region: 'EU' },
  { code: 'EE', name: 'Estonia', region: 'EU' },
  { code: 'FI', name: 'Finland', region: 'EU' },
  { code: 'FR', name: 'France', region: 'EU' },
  { code: 'DE', name: 'Germany', region: 'EU' },
  { code: 'GR', name: 'Greece', region: 'EU' },
  { code: 'HU', name: 'Hungary', region: 'EU' },
  { code: 'IE', name: 'Ireland', region: 'EU' },
  { code: 'IT', name: 'Italy', region: 'EU' },
  { code: 'LV', name: 'Latvia', region: 'EU' },
  { code: 'LT', name: 'Lithuania', region: 'EU' },
  { code: 'LU', name: 'Luxembourg', region: 'EU' },
  { code: 'MT', name: 'Malta', region: 'EU' },
  { code: 'NL', name: 'Netherlands', region: 'EU' },
  { code: 'PL', name: 'Poland', region: 'EU' },
  { code: 'PT', name: 'Portugal', region: 'EU' },
  { code: 'RO', name: 'Romania', region: 'EU' },
  { code: 'SK', name: 'Slovakia', region: 'EU' },
  { code: 'SI', name: 'Slovenia', region: 'EU' },
  { code: 'ES', name: 'Spain', region: 'EU' },
  { code: 'SE', name: 'Sweden', region: 'EU' },
  // Australia
  { code: 'AU', name: 'Australia', region: 'AU' },
];

export const getCountryByCode = (code: string) => {
  return SUPPORTED_COUNTRIES.find(c => c.code === code);
};

export const getCountriesByRegion = (region: string) => {
  return SUPPORTED_COUNTRIES.filter(c => c.region === region);
};

/**
 * Custom hook to calculate international tax based on country code
 * For US, it uses the existing ZIP-based state tax calculator
 * For EU/UK/AU, it uses the international_tax_rates table
 */
export const useInternationalTaxCalculator = (
  countryCode: string,
  zipCode: string,
  subtotal: number
): InternationalTaxCalculation => {
  const country = getCountryByCode(countryCode);
  const isUS = countryCode === 'US';
  
  // Use existing US tax calculator for US orders
  const usTaxCalculation = useTaxCalculator(isUS ? zipCode : '', isUS ? subtotal : 0);
  
  // Fetch international tax rate for non-US countries
  const { data: internationalTaxRate, isLoading: isLoadingInternational } = useQuery({
    queryKey: ['international-tax-rate', countryCode],
    queryFn: async () => {
      if (isUS || !countryCode) return null;
      
      const { data, error } = await supabase
        .from('international_tax_rates')
        .select('*')
        .eq('country_code', countryCode)
        .eq('is_active', true)
        .single();
      
      if (error) {
        console.error('Error fetching international tax rate:', error);
        return null;
      }
      
      return data as InternationalTaxRate;
    },
    enabled: !isUS && !!countryCode,
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });

  // For US, return the state-based tax calculation
  if (isUS) {
    return {
      taxRate: usTaxCalculation.taxRate,
      taxAmount: usTaxCalculation.taxAmount,
      taxType: 'SALES_TAX',
      countryCode: 'US',
      countryName: 'United States',
      region: 'US',
      isLoading: usTaxCalculation.isLoading,
      error: usTaxCalculation.error,
      displayLabel: usTaxCalculation.stateCode 
        ? `Sales Tax (${usTaxCalculation.stateCode} @ ${usTaxCalculation.taxRate}%)`
        : 'Sales Tax',
    };
  }

  // For international orders
  const rate = internationalTaxRate?.tax_rate || 0;
  const taxAmount = subtotal * (rate / 100);
  const taxType = internationalTaxRate?.tax_type || 'VAT';
  
  // Generate display label
  let displayLabel = 'Tax';
  if (internationalTaxRate) {
    if (taxType === 'VAT') {
      displayLabel = `VAT (${countryCode} @ ${rate}%)`;
    } else if (taxType === 'GST') {
      displayLabel = `GST (${countryCode} @ ${rate}%)`;
    } else {
      displayLabel = `Tax (${countryCode} @ ${rate}%)`;
    }
  }

  return {
    taxRate: rate,
    taxAmount: Math.round(taxAmount * 100) / 100,
    taxType,
    countryCode,
    countryName: country?.name || '',
    region: country?.region || '',
    isLoading: isLoadingInternational,
    error: null,
    displayLabel,
  };
};

/**
 * Hook to fetch all international tax rates for admin management
 */
export const useInternationalTaxRates = () => {
  return useQuery({
    queryKey: ['international-tax-rates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('international_tax_rates')
        .select('*')
        .order('region')
        .order('country_name');
      
      if (error) throw error;
      return data as InternationalTaxRate[];
    },
  });
};

export default useInternationalTaxCalculator;

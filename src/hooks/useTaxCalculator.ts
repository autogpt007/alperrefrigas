import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getStateFromZip, isValidZipCode } from '@/utils/zipCodeUtils';

export interface TaxCalculation {
  taxRate: number;
  taxAmount: number;
  stateCode: string;
  stateName: string;
  isLoading: boolean;
  error: string | null;
  isNoTaxState: boolean;
}

interface StateTaxRate {
  id: string;
  state_code: string;
  state_name: string;
  tax_rate: number;
  is_active: boolean;
  notes: string | null;
}

// No-tax states for reference
const NO_TAX_STATES = ['AK', 'DE', 'MT', 'NH', 'OR'];

/**
 * Custom hook to calculate sales tax based on ZIP code
 * @param zipCode - The shipping destination ZIP code
 * @param subtotal - The order subtotal before tax
 * @returns TaxCalculation object with tax details
 */
export const useTaxCalculator = (zipCode: string, subtotal: number): TaxCalculation => {
  const [stateInfo, setStateInfo] = useState<{ stateCode: string; stateName: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Determine state from ZIP code
  useEffect(() => {
    setError(null);
    
    if (!zipCode || zipCode.length < 5) {
      setStateInfo(null);
      return;
    }

    if (!isValidZipCode(zipCode)) {
      setError('Invalid ZIP code format');
      setStateInfo(null);
      return;
    }

    const info = getStateFromZip(zipCode);
    if (info) {
      setStateInfo(info);
    } else {
      setError('Could not determine state from ZIP code');
      setStateInfo(null);
    }
  }, [zipCode]);

  // Fetch tax rate from database
  const { data: taxRate, isLoading: isLoadingTaxRate } = useQuery({
    queryKey: ['tax-rate', stateInfo?.stateCode],
    queryFn: async () => {
      if (!stateInfo?.stateCode) return null;

      const { data, error } = await supabase
        .from('state_tax_rates')
        .select('*')
        .eq('state_code', stateInfo.stateCode)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching tax rate:', error);
        return null;
      }

      return data as StateTaxRate;
    },
    enabled: !!stateInfo?.stateCode,
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });

  // Calculate tax amount
  const rate = taxRate?.tax_rate || 0;
  const taxAmount = subtotal * (rate / 100);
  const isNoTaxState = stateInfo ? NO_TAX_STATES.includes(stateInfo.stateCode) : false;

  return {
    taxRate: rate,
    taxAmount: Math.round(taxAmount * 100) / 100, // Round to 2 decimal places
    stateCode: stateInfo?.stateCode || '',
    stateName: stateInfo?.stateName || '',
    isLoading: isLoadingTaxRate && !!stateInfo?.stateCode,
    error,
    isNoTaxState,
  };
};

/**
 * Get state code from state name or code (for form validation)
 * @param stateInput - State name or abbreviation
 * @returns State code or null
 */
export const normalizeStateCode = (stateInput: string): string | null => {
  if (!stateInput) return null;
  
  const input = stateInput.trim().toUpperCase();
  
  // If already a 2-letter code
  if (input.length === 2) {
    return input;
  }
  
  // Try to match state name
  const stateMap: Record<string, string> = {
    'ALABAMA': 'AL', 'ALASKA': 'AK', 'ARIZONA': 'AZ', 'ARKANSAS': 'AR',
    'CALIFORNIA': 'CA', 'COLORADO': 'CO', 'CONNECTICUT': 'CT', 'DELAWARE': 'DE',
    'DISTRICT OF COLUMBIA': 'DC', 'FLORIDA': 'FL', 'GEORGIA': 'GA', 'HAWAII': 'HI',
    'IDAHO': 'ID', 'ILLINOIS': 'IL', 'INDIANA': 'IN', 'IOWA': 'IA',
    'KANSAS': 'KS', 'KENTUCKY': 'KY', 'LOUISIANA': 'LA', 'MAINE': 'ME',
    'MARYLAND': 'MD', 'MASSACHUSETTS': 'MA', 'MICHIGAN': 'MI', 'MINNESOTA': 'MN',
    'MISSISSIPPI': 'MS', 'MISSOURI': 'MO', 'MONTANA': 'MT', 'NEBRASKA': 'NE',
    'NEVADA': 'NV', 'NEW HAMPSHIRE': 'NH', 'NEW JERSEY': 'NJ', 'NEW MEXICO': 'NM',
    'NEW YORK': 'NY', 'NORTH CAROLINA': 'NC', 'NORTH DAKOTA': 'ND', 'OHIO': 'OH',
    'OKLAHOMA': 'OK', 'OREGON': 'OR', 'PENNSYLVANIA': 'PA', 'RHODE ISLAND': 'RI',
    'SOUTH CAROLINA': 'SC', 'SOUTH DAKOTA': 'SD', 'TENNESSEE': 'TN', 'TEXAS': 'TX',
    'UTAH': 'UT', 'VERMONT': 'VT', 'VIRGINIA': 'VA', 'WASHINGTON': 'WA',
    'WEST VIRGINIA': 'WV', 'WISCONSIN': 'WI', 'WYOMING': 'WY',
    'PUERTO RICO': 'PR', 'GUAM': 'GU', 'U.S. VIRGIN ISLANDS': 'VI',
  };
  
  return stateMap[input] || null;
};

export default useTaxCalculator;

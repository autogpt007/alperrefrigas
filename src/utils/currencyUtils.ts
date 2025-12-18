export interface Currency {
  id: string;
  target_currency: string;
  rate: number;
  currency_symbol: string;
  currency_name: string;
  country_codes: string[];
  flag_emoji: string;
  is_active: boolean;
  last_updated: string;
}

// Format price with proper locale and currency symbol
export function formatCurrencyPrice(
  priceUSD: number,
  currency: string,
  exchangeRate: number,
  currencySymbol: string
): string {
  const convertedPrice = priceUSD * exchangeRate;
  
  // Format based on currency
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  return `${currencySymbol}${formatter.format(convertedPrice)}`;
}

// Convert USD to target currency
export function convertFromUSD(priceUSD: number, rate: number): number {
  return priceUSD * rate;
}

// Get currency by country code
export function getCurrencyByCountry(
  currencies: Currency[],
  countryCode: string
): Currency | undefined {
  return currencies.find(c => 
    c.country_codes.includes(countryCode.toUpperCase())
  );
}

// Get currency symbol
export function getCurrencySymbol(currency: string, currencies: Currency[]): string {
  const found = currencies.find(c => c.target_currency === currency);
  return found?.currency_symbol || '$';
}

// Detect user's country from browser locale
export function detectUserCountry(): string {
  try {
    // Try to get from browser locale
    const locale = navigator.language || 'en-US';
    const parts = locale.split('-');
    if (parts.length > 1) {
      return parts[1].toUpperCase();
    }
    // Fallback to US
    return 'US';
  } catch {
    return 'US';
  }
}

// Supported currency codes
export const SUPPORTED_CURRENCIES = ['USD', 'EUR', 'GBP', 'AUD', 'CAD'] as const;
export type SupportedCurrency = typeof SUPPORTED_CURRENCIES[number];

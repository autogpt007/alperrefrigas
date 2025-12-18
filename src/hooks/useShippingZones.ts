import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ShippingZone {
  id: string;
  region_name: string;
  countries: string[];
  base_rate: number;
  free_shipping_threshold: number | null;
  transit_days_min: number;
  transit_days_max: number;
  is_active: boolean;
  hazmat_surcharge: number | null;
  order_index: number;
  notes: string | null;
}

export const useShippingZones = () => {
  return useQuery({
    queryKey: ['shipping-zones'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shipping_zones')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });
      
      if (error) throw error;
      return data as ShippingZone[];
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

export const getShippingZoneForCountry = (zones: ShippingZone[], countryCode: string, stateCode?: string): ShippingZone | null => {
  if (!zones || zones.length === 0) return null;

  // Special handling for Alaska and Hawaii
  if (countryCode === 'US' && stateCode && ['AK', 'HI'].includes(stateCode)) {
    const alaskaHawaiiZone = zones.find(z => 
      z.countries.includes(`US-${stateCode}`) || 
      z.countries.includes('US-AK') || 
      z.countries.includes('US-HI')
    );
    if (alaskaHawaiiZone) return alaskaHawaiiZone;
  }

  // Look for exact country match
  const exactMatch = zones.find(z => z.countries.includes(countryCode));
  if (exactMatch) return exactMatch;

  // Look for "Rest of World" zone (denoted by "*")
  const restOfWorld = zones.find(z => z.countries.includes('*'));
  if (restOfWorld) return restOfWorld;

  // Return first active zone as fallback
  return zones[0] || null;
};

export const calculateShippingCost = (
  zone: ShippingZone | null,
  subtotal: number,
  hasHazmat: boolean = true // Refrigerants are HazMat by default
): { shippingCost: number; isFreeShipping: boolean; transitDays: string } => {
  if (!zone) {
    return {
      shippingCost: 45, // Default fallback
      isFreeShipping: false,
      transitDays: '3-7 days'
    };
  }

  const threshold = zone.free_shipping_threshold || Infinity;
  const isFreeShipping = subtotal >= threshold;
  
  let shippingCost = 0;
  if (!isFreeShipping) {
    shippingCost = zone.base_rate;
    if (hasHazmat && zone.hazmat_surcharge) {
      shippingCost += zone.hazmat_surcharge;
    }
  }

  return {
    shippingCost,
    isFreeShipping,
    transitDays: `${zone.transit_days_min}-${zone.transit_days_max} days`
  };
};

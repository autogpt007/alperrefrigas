import React from 'react';
import { Globe } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SUPPORTED_COUNTRIES } from '@/hooks/useInternationalTaxCalculator';
import { useShippingCountry } from '@/contexts/ShippingCountryContext';

const ShipToSelector = ({ className = '' }: { className?: string }) => {
  const { countryCode, confirmed, setCountry } = useShippingCountry();
  return (
    <div className={`flex flex-wrap items-center gap-2 text-sm ${className}`}>
      <Globe className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
      <label htmlFor="ship-to" className="text-muted-foreground">Shipping to:</label>
      <Select value={countryCode} onValueChange={setCountry}>
        <SelectTrigger id="ship-to" className="h-8 w-auto min-w-[160px]" aria-label="Shipping destination country">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="max-h-72">
          {SUPPORTED_COUNTRIES.map(c => (
            <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      {!confirmed && <span className="text-xs text-muted-foreground">Not right? Change it.</span>}
    </div>
  );
};

export default ShipToSelector;

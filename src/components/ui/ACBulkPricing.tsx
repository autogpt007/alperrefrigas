import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Check } from 'lucide-react';
import { Product } from '@/contexts/ProductsContext';

interface ACBulkPricingProps {
  product: Product;
  quantity: number;
  onQuantityChange: (qty: number) => void;
  formatPrice: (price: number) => string;
}

interface PricingTier {
  label: string;
  upliftPercent: number;
  unitPrice: number;
  total: number;
}

/**
 * Calculates the pricing tier for an Air Conditioner product based on quantity.
 * 
 * Tiers (non-overlapping, auto-applied):
 * 1. Full Container: qty >= Q20 (or Q40) = 0% uplift
 * 2. Mid Bulk: qty >= ceil(Q20 * 0.5) = mid_bulk_uplift_percent (default 12%)
 * 3. Custom Bulk:
 *    - 40 to (half-1): custom_uplift_40_half (default 15%)
 *    - 20-39: custom_uplift_20_39 (default 25%)
 *    - 5-19: custom_uplift_5_19 (default 35%)
 * 4. Small order (1-4 units): 5-19 tier price + 20% single-unit surcharge
 */
export const SMALL_ORDER_SURCHARGE_PERCENT = 20;

export function calculateACPricingTier(product: Product, quantity: number): PricingTier | null {
  const q20 = product.q20_units;
  const basePrice = product.base_unit_price;
  
  // If Q20 or base price not configured, cannot calculate
  if (!q20 || !basePrice) {
    return null;
  }
  
  if (quantity < 1) {
    return null;
  }

  
  const half = Math.ceil(q20 * 0.5);
  
  // Get uplift percentages (with defaults)
  const midBulkUplift = product.mid_bulk_uplift_percent ?? 12;
  const uplift5_19 = product.custom_uplift_5_19 ?? 35;
  const uplift20_39 = product.custom_uplift_20_39 ?? 25;
  const uplift40_half = product.custom_uplift_40_half ?? 15;
  
  let tierLabel: string;
  let upliftPercent: number;
  
  // TIER 1: FULL BULK - qty >= Q20
  if (quantity >= q20) {
    tierLabel = 'Full Bulk';
    upliftPercent = 0;
  } 
  // TIER 2: MID BULK - qty >= HALF and qty < Q20
  else if (quantity >= half) {
    tierLabel = 'Mid Bulk';
    upliftPercent = midBulkUplift;
  } 
  // TIER 3: SMALL ORDER - 1-4 units: 5-19 rate plus single-unit surcharge
  else if (quantity < 5) {
    tierLabel = quantity === 1 ? 'Single Unit' : 'Small Order';
    upliftPercent = Math.round(
      ((1 + uplift5_19 / 100) * (1 + SMALL_ORDER_SURCHARGE_PERCENT / 100) - 1) * 10000
    ) / 100;
  }
  // TIER 4: CUSTOM BULK - qty >= 5 and qty < HALF
  // Use ladder: 5-19, 20-39, 40-(HALF-1)
  else {
    tierLabel = 'Custom Bulk';
    // Custom tier ladder - MUST stop at (HALF-1)
    if (quantity >= 40 && quantity < half) {
      upliftPercent = uplift40_half;
    } else if (quantity >= 20 && quantity < Math.min(40, half)) {
      upliftPercent = uplift20_39;
    } else {
      // 5-19 range (or up to min(19, half-1))
      upliftPercent = uplift5_19;
    }
  }

  
  const unitPrice = basePrice * (1 + upliftPercent / 100);
  const total = unitPrice * quantity;
  
  return {
    label: tierLabel,
    upliftPercent,
    unitPrice,
    total
  };
}

const ACBulkPricing: React.FC<ACBulkPricingProps> = ({
  product,
  quantity,
  onQuantityChange,
  formatPrice
}) => {
  const q20 = product.q20_units;
  const basePrice = product.base_unit_price;
  
  // If not properly configured for AC bulk pricing
  if (!q20 || !basePrice) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-medium">Bulk pricing not configured</span>
          </div>
          <p className="text-sm text-red-600 mt-2">
            This product cannot be ordered until the administrator configures container capacity and base pricing.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  const half = Math.ceil(q20 * 0.5);
  const tier = calculateACPricingTier(product, quantity);
  const isBelowMOQ = quantity < 5;
  
  return (
    <div className="space-y-4">
      {/* Quantity Selector with MOQ */}
      <div>
        <Label htmlFor="ac-quantity" className="text-sm font-medium text-gray-700 mb-2 block">
          Order Quantity (MOQ: 5 units)
        </Label>
        <div className="flex items-center gap-3">
          <Input
            id="ac-quantity"
            type="number"
            min={5}
            value={quantity}
            onChange={(e) => onQuantityChange(Math.max(1, parseInt(e.target.value) || 0))}
            className={`w-24 ${isBelowMOQ ? 'border-red-500' : ''}`}
          />
          <span className="text-sm text-gray-500">units</span>
        </div>
        {isBelowMOQ && (
          <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
            <AlertTriangle className="h-4 w-4" />
            Minimum order quantity is 5 units
          </p>
        )}
      </div>
      
      {/* Pricing Tier Display - NO uplift percentages shown to customer */}
      {tier && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-4 space-y-3">
            {/* Tier Label */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Pricing Tier</span>
              <span className="font-semibold text-primary flex items-center gap-1">
                {tier.label}
                {tier.upliftPercent === 0 && <Check className="h-4 w-4 text-green-600" />}
              </span>
            </div>
            
            {/* Unit Price */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Unit Price</span>
              <span className="text-lg font-bold text-foreground">{formatPrice(tier.unitPrice)}</span>
            </div>
            
            {/* Total */}
            <div className="border-t pt-3 flex items-center justify-between">
              <span className="font-medium text-foreground">Total ({quantity} units)</span>
              <span className="text-2xl font-bold text-primary">{formatPrice(tier.total)}</span>
            </div>
            
            {tier.upliftPercent === 0 && (
              <p className="text-xs text-green-600 text-center">Best available price!</p>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Volume discount hint - no percentages */}
      <p className="text-xs text-muted-foreground text-center">
        Order {q20}+ units for best pricing
      </p>
    </div>
  );
};

export default ACBulkPricing;

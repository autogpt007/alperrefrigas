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
 * 4. Below MOQ (qty < 5): blocked
 */
export function calculateACPricingTier(product: Product, quantity: number): PricingTier | null {
  const q20 = product.q20_units;
  const q40 = product.q40_units;
  const basePrice = product.base_unit_price;
  
  // If Q20 or base price not configured, cannot calculate
  if (!q20 || !basePrice) {
    return null;
  }
  
  // Below MOQ
  if (quantity < 5) {
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
  
  // Check for Full Container (Q40 first if available, then Q20)
  if (q40 && quantity >= q40) {
    tierLabel = 'Full Container (40ft)';
    upliftPercent = 0;
  } else if (quantity >= q20) {
    tierLabel = 'Full Container (20ft)';
    upliftPercent = 0;
  } else if (quantity >= half) {
    // Mid Bulk: half container or more
    tierLabel = 'Mid Bulk (Half Container+)';
    upliftPercent = midBulkUplift;
  } else if (quantity >= 40) {
    // Custom Bulk: 40 to (half-1)
    tierLabel = 'Custom Bulk (40+ units)';
    upliftPercent = uplift40_half;
  } else if (quantity >= 20) {
    // Custom Bulk: 20-39
    tierLabel = 'Custom Bulk (20-39 units)';
    upliftPercent = uplift20_39;
  } else {
    // Custom Bulk: 5-19
    tierLabel = 'Custom Bulk (5-19 units)';
    upliftPercent = uplift5_19;
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
      
      {/* Pricing Tier Display */}
      {tier && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-4 space-y-3">
            {/* Tier Label */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Pricing Tier</span>
              <span className="font-semibold text-primary">{tier.label}</span>
            </div>
            
            {/* Uplift Display */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Uplift from Base Price</span>
              <span className={`font-medium ${tier.upliftPercent === 0 ? 'text-green-600' : 'text-orange-600'}`}>
                {tier.upliftPercent === 0 ? (
                  <span className="flex items-center gap-1">
                    <Check className="h-4 w-4" />
                    Best Price (0%)
                  </span>
                ) : (
                  `+${tier.upliftPercent}%`
                )}
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
          </CardContent>
        </Card>
      )}
      
      {/* Reference: Full Container Base Price */}
      <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
        <p className="font-medium mb-1">Reference Pricing:</p>
        <ul className="space-y-1 text-xs">
          <li>• Full Container (20ft) Price: <strong>{formatPrice(basePrice)}/unit</strong> (Q20: {q20} units)</li>
          {product.q40_units && (
            <li>• Full Container (40ft): {product.q40_units} units capacity</li>
          )}
          <li>• Mid Bulk starts at: {half} units (half container)</li>
        </ul>
      </div>
      
      {/* Tier Reference Table */}
      <details className="text-sm">
        <summary className="cursor-pointer text-primary hover:underline">View all pricing tiers</summary>
        <div className="mt-2 bg-muted/30 rounded-lg p-3 space-y-2">
          <div className="grid grid-cols-3 gap-2 text-xs font-medium text-muted-foreground border-b pb-1">
            <span>Quantity Range</span>
            <span>Tier</span>
            <span className="text-right">Uplift</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <span>5-19</span>
            <span>Custom Bulk</span>
            <span className="text-right">+{product.custom_uplift_5_19 ?? 35}%</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <span>20-39</span>
            <span>Custom Bulk</span>
            <span className="text-right">+{product.custom_uplift_20_39 ?? 25}%</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <span>40-{half - 1}</span>
            <span>Custom Bulk</span>
            <span className="text-right">+{product.custom_uplift_40_half ?? 15}%</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <span>{half}-{q20 - 1}</span>
            <span>Mid Bulk</span>
            <span className="text-right">+{product.mid_bulk_uplift_percent ?? 12}%</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs font-medium text-green-700">
            <span>{q20}+</span>
            <span>Full Container</span>
            <span className="text-right">0%</span>
          </div>
        </div>
      </details>
    </div>
  );
};

export default ACBulkPricing;

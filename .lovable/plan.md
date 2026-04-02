

## Refrigerant Pricing Restructure: 3-Tier Pallet-Based System

### Current State
Refrigerant products use per-cylinder pricing with packaging options: **1 Pallet** (40 cylinders, no discount), **20ft Container** (1,140 cylinders, 30% off), **40ft Container** (2,280 cylinders, 45% off). The base `price` field stores the per-cylinder price.

### New Pricing Model

The `price` field on each product becomes the **true base price per cylinder** (the container-load price). All tiers are derived from it:

| Tier | Packaging Options | Price Logic |
|------|-------------------|-------------|
| **Tier 1** | 1–5 Pallets (40–200 cylinders) | `price + $20` per cylinder |
| **Tier 2** | 5–10 Pallets (200–400 cylinders) | `price + $15` per cylinder |
| **Tier 3** | Full Container Load / Truck Load | `price` (base, no markup) |

Container/Truck details shown to customer:
- **20ft Container**: 28 pallets / 1,120 cylinders
- **40ft Container**: 56 pallets / 2,240 cylinders  
- **Truck Load (53ft)**: 44 pallets / 1,760 cylinders

### How to Make It "Invisible"
We adjust the stored `price` downward by $10 from current values (since you said "current price deduction of $10" for container). Then Tier 1 shows `price + $20` and Tier 2 shows `price + $15`. The customer sees natural-looking tiered pricing — never sees a "price change" or discount percentage.

### Implementation Steps

**1. Update packaging options in the database**
- Change each refrigerant product's `packaging_options` from `["1 Pallet", "20ft Container", "40ft Container"]` to `["1-5 Pallets", "5-10 Pallets", "20ft Container", "40ft Container", "Truck Load (53ft)"]`
- Reduce each product's `price` by $10 (this becomes the container/truck base)
- Remove `discount_20ft` and `discount_40ft` fields (no longer needed — container prices = base price × cylinder count)

**2. Update `calculateBulkPrice` in ProductDetails.tsx**
New logic:
- **1-5 Pallets**: quantity selector (1–5), total = (price + $20) × 40 × palletQty
- **5-10 Pallets**: quantity selector (5–10), total = (price + $15) × 40 × palletQty
- **20ft Container**: (price) × 1,120 — show "28 pallets / 1,120 cylinders"
- **40ft Container**: (price) × 2,240 — show "56 pallets / 2,240 cylinders"
- **Truck Load**: (price) × 1,760 — show "44 pallets / 1,760 cylinders"

**3. Update `calculateBulkPrice` in ProductCard.tsx**
Same pricing logic mirrored for the catalog card view.

**4. Add pallet quantity selector**
When "1-5 Pallets" or "5-10 Pallets" is selected, show a quantity input (number of pallets). The total updates dynamically.

**5. Update the create-order edge function**
Add the new packaging types to the server-side price verification. The valid prices will be computed from the base `price` + tier markup × cylinder count rather than from static DB columns.

**6. Update ProductDetails UI text**
- Remove discount percentage badges (no more "30% OFF" / "45% OFF")
- Show container/truck details: pallet count, cylinder count
- Starting price label changes to show per-cylinder price for the best tier
- FAQ text updated for new packaging tiers

**7. Update CartPage display**
Ensure cart items with new packaging labels display correctly.

### Files to Modify
- **Migration SQL**: Update `price`, `packaging_options` for all refrigerant products; nullify discount columns
- **`src/components/pages/ProductDetails.tsx`**: New `calculateBulkPrice`, pallet qty selector, updated UI
- **`src/components/ProductCard.tsx`**: Matching pricing logic
- **`supabase/functions/create-order/index.ts`**: Server-side verification for new tier structure
- **`src/components/pages/ProductCatalog.tsx`**: Minor text updates if needed

### What the Customer Sees
- Clean tiered pricing by volume — no indication prices changed
- New "Truck Load" option alongside containers
- Detailed breakdown (pallets × cylinders) for each option
- Higher per-cylinder price for small orders, best price at full loads


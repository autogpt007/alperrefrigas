

## Simplify Refrigerant Purchase UX — Pallet Quantity Slider

### What changes
Replace the confusing "Packaging Type" dropdown for refrigerants with a single pallet quantity slider (1-56). Tier pricing is calculated automatically in the background.

### File 1: `src/components/pages/ProductDetails.tsx`

**1. New helper functions** (replace `calculateBulkPrice`, `getPerCylinderPrice`, `getPackagingDescription`):
- `getTierFromPalletCount(qty)`: returns `{ markup, label, perCylinder, total, tierHint }` based on count (1-10 → +$20, 11-27 → +$15, 28+ → base price)
- Derive packaging label from pallet count: "X Pallets" for 1-27, "20ft Container" for 28, "40ft Container" for 56, "Truck Load" for 44

**2. Replace refrigerant Purchase Options UI** (lines 778-860):
- Remove the `<Select>` packaging dropdown for refrigerants
- Add a pallet quantity stepper with - / + buttons (range 1-56)
- Add a `<Slider>` component (already exists in ui/slider.tsx) below the stepper for quick dragging
- Add three "Full Load" quick-select buttons: `20ft Container (28)`, `40ft Container (56)`, `Truck Load (44)`
- Show cylinder count, tier label, and per-cylinder price dynamically

**3. Update refrigerant pricing display** (lines 650-698):
- Remove the conditional `packaging ? ... : ...` — always show the dynamic pricing card driven by `palletQuantity`
- Hero element: per-cylinder price (large, bold)
- Secondary: total cost
- Smart nudge: when 21-27 pallets, show "Add X more pallets to unlock container pricing"

**4. Update `handleAddToCart`** (lines 346-383):
- For refrigerants: skip packaging validation, derive packaging string from `palletQuantity` (e.g., "12 Pallets (480 cylinders)" or "20ft Container")
- Cart item price = total from tier calculation
- Remove `setPackaging('')` reset for refrigerants

**5. Update `handleAddToRFQ`** (lines 250-272):
- For refrigerants: derive packaging from `palletQuantity` instead of requiring dropdown selection

**6. Remove unused state/effects:**
- Remove `packaging` state usage for refrigerants (keep for accessories)
- Remove the `useEffect` that resets `palletQuantity` on packaging change (lines 154-157)
- Initialize `palletQuantity` to 1 (already done)

### File 2: `supabase/functions/create-order/index.ts`

**Update refrigerant price verification** (lines 119-148):
- Replace current packaging-label-based validation with pallet-count-based validation
- Accept any pallet count 1-56 and verify: `(basePrice + markup) * 40 * palletQty` where markup is $20 (1-10), $15 (11-27), $0 (28+)
- Keep existing container/truck fixed-count validation as special cases of 28/44/56 pallets

### No changes needed
- `CartContext.tsx` — `packaging` field remains a string, just gets a friendlier value
- `RFQContext.tsx` — same, packaging string changes format only
- `Slider` component — already exists, used as-is


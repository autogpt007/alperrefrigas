# Single-cylinder sales + Batch 1 of Google's suggested AC products

## 1. Buy single cylinders (1–39) on refrigerant pages

- Add a "Cylinders / Pallets" toggle to every refrigerant product page.
- In "Cylinders" mode, buyers pick 1–39 cylinders with a +/- stepper.
- Price per cylinder stays the same as the 1–10 pallet rate (no extra charge). Example: R-410A at $127.23 per cylinder, so 3 cylinders = $381.69.
- The cart shows "3 cylinders" instead of a pallet label. At 40 cylinders it suggests switching to 1 pallet.
- Remove the "Need fewer than 40 cylinders? Request a quote" line, since buyers can now order them directly.
- Update the "minimum order" FAQ answer to say single cylinders are available.
- The order check that runs when a buyer places an order will also accept 1–39 cylinders at that rate, so these orders won't be rejected.

## 2. Add 6 high-demand AC / heat pump products (Batch 1)

Price rule (applies to all newly added products): the 1-unit price is 20% below the Google shopper price. Bulk orders get cheaper automatically through the existing tiers.

| Product | Google price | Our 1-unit price |
|---|---|---|
| MRCOOL Monoblock MTHP 10k BTU (MDM10115D) | $1,369 | $1,095.20 |
| Senville 24,000 BTU Mini Split with Heat Pump | $1,225 | $980.00 |
| Midea 12,000 BTU Smart Inverter Window AC (MAW12S1VWT-A) | $389 | $311.20 |
| MRCOOL Universal Series Heat Pump Split System | $3,890 | $3,112.00 |
| Pioneer 12,000 BTU All-in-One Console Inverter Heat Pump | $1,820 | $1,456.00 |
| Senville LETO 12,000 BTU Mini Split Heat Pump | $785 | $628.00 |

- Each product gets 2 official photos from the brand's own website (MRCOOL, Senville, Midea, Pioneer). You confirmed you're allowed to use them.
- Each product gets its brand, model number, barcode (GTIN from Google's file), BTU, voltage, and specs from the brand's own product page. Specs I can't confirm on the brand site are left out rather than guessed.
- They appear under Heating & Heat Pumps / Air Conditioners with the correct Google category, and are included in the product feed Google reads.

## Things to note

- Google's file has no stock numbers. Each product will show "in stock". Tell me if any should be "backorder" instead.
- The Midea product has no barcode in Google's file. I'll use its model number only.

## Technical details

- Refrigerant: new `unitMode` state in ProductDetails; cart item price = (base + 20) × cylinders, packaging "N cylinders".
- create-order edge function: add `(base + 20) × n` for n = 1..39 to refrigerant validPrices.
- AC: `base_unit_price = round(0.8 × GooglePrice / 1.62, 2)` so the 1-unit tier (base × 1.35 × 1.20) equals 80% of the Google price; `price` set to the same 1-unit figure for the feed; q20_units set per unit size; google_product_category 605; brand/gtin/mpn/identifier_exists filled.
- Images downloaded to /tmp, uploaded as Lovable assets, URLs saved on each product's images array.
- Inserted via data update; merchant feed regenerated through its existing function (no Merchant Center API calls).

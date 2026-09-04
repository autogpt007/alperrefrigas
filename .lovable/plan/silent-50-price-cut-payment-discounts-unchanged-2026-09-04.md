# Silent 50% price cut, payment discounts unchanged

## What changes

Every stored product price is halved in the database, so the lower number simply becomes "the price" everywhere — catalog, product pages, cart, checkout, invoices, quotes, and the Google Merchant feed. No strikethrough, no "was/now", no sale badge, nothing that reveals a cut happened.

Confirmed from the catalog (45 products): only two price columns actually hold values today — `price` on all 45 products, and `base_unit_price` on the 22 air conditioners. The pallet and container columns are empty, so nothing else needs touching.

- Refrigerants (17): per-cylinder price, currently $214.46–$419.96 → $107.23–$209.98
- Air conditioners (22): per-unit price plus `base_unit_price`, both halved
- Accessories (6): per-piece price halved

Rounding: 2 decimals on per-unit prices, matching what the feed and product pages already publish.

## What stays exactly as it is

- The 15% Bank Wire / Zelle discount at checkout — untouched, still applied on the discounted subtotal and still recomputed server-side when the order is created.
- Coupon handling and how it stacks with the payment discount.
- Bulk ladders (pallet tiers, AC MOQ tiers, accessory 5/10-packs) are all derived from `price`, so they drop by 50% automatically with no code change.

## Merchant Center

The feed reads live from the database, so the URL does not change. After the cut, click **Fetch now** in Merchant Center; it also re-fetches on its own daily schedule. The 15% wire/Zelle discount stays out of the feed on purpose — that keeps GMC's price-mismatch check happy.

## One thing worth deciding

The refrigerant per-cylinder uplifts for small pallet orders are flat dollar amounts in the UI (+$20 for 1–10 pallets, +$15 for 10–20 pallets). With prices halved these become a much larger relative markup (roughly 10–19% instead of 5–9%). Default plan: leave them as-is. Say the word and I'll halve them to +$10 / +$7.50 to keep the same proportion.

## Technical notes

- One data migration over `public.products`: `price = round(price / 2, 2)` and the same for `base_unit_price` where present, guarded so re-running cannot double-apply (guard row recorded in `site_settings`, same pattern as the earlier 25% cut).
- No frontend or edge-function changes required; `CheckoutPage.tsx`, `create-order`, `invoice-pdf.ts`, and `merchant-feed` all read prices from the database.
- Verification after the migration: re-query min/max/avg per product type and spot-check the generated feed price against a product page.

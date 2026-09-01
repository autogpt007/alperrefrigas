# Ship to all 54 countries with correct shipping and tax

## What exists today (verified)

- `shipping_zones` has 7 zones: US continental, US AK/HI, Canada, UK, EU (27), Australia & New Zealand, and a catch-all "Rest of World" ($250 + $100 hazmat, 14-28 days).
- `international_tax_rates` has 30 active rows: US, UK, AU and the 27 EU states. None of the other countries on your list exist, so checkout currently falls back to 0% but with no explanation to the buyer.
- The checkout country dropdown (`SUPPORTED_COUNTRIES`) only lists those same 30 countries — 24 of the countries you ship to cannot even be selected.

## What will change

### 1. Checkout country list
Expand the selectable country list to all 54 countries you named, each tagged with its region (US, US Territory, CA, UK, EU, EFTA/Non-EU Europe, LatAm, Middle East, Asia-Pacific, Africa, Oceania).

### 2. Shipping zones (regional tiers)
Keep the existing US / AK-HI / Canada / UK / EU / AU-NZ zones untouched and add explicit zones so no shipped country lands on the vague catch-all:

| Zone | Countries | Base | Hazmat | Free over | Transit |
|---|---|---|---|---|---|
| US Territories | PR | 89 | 45 | 1000 | 5-10 |
| Non-EU Europe | CH, NO, GB excluded (own zone), UA, RU, GE | 165 | 65 | 1500 | 8-16 |
| Latin America | MX, BR, AR, CL, CO, PE, EC, UY, PY, CR, PA, SV, NI, DO | 145 | 70 | 1500 | 7-16 |
| Middle East | AE, SA, KW, BH, OM, IL | 195 | 80 | 2000 | 10-18 |
| Asia-Pacific | HK, MY, TH, PH | 185 | 80 | 2000 | 10-20 |
| Africa | ZA | 220 | 90 | 2500 | 12-22 |

Mexico and Canada move to shorter transit than the old catch-all; Rest of World stays as the fallback for anything unlisted.

### 3. Taxes — 0% plus a duties-on-delivery notice
- US: unchanged (ZIP-based state sales tax).
- EU / UK / Australia: unchanged (existing VAT/GST rates).
- All other countries on your list: added as active rows at 0% with tax type `DDU` and a note that import VAT/duties/customs fees are collected by the carrier on delivery.
- Checkout shows an explicit line for these countries: "No tax charged at checkout — import VAT, duties and customs clearance fees are payable to the carrier on delivery." Same wording carried into the order summary and the generated invoice/quote note field so the buyer sees it before and after paying.

### 4. Policy pages
Shipping Policy gains the full destination-country list, per-region transit times, the hazmat surcharge explanation, and the DDU statement. This also keeps the Merchant Center shipping/returns disclosures consistent with what checkout actually does.

### 5. F-Gas / EPA logic stays as-is
EU refrigerant orders keep requiring F-Gas certification; US orders keep EPA 608. New non-EU countries get the existing professional-use confirmation, no new certification gate.

## Technical notes

- Shipping zones and tax rates are data changes to `shipping_zones` and `international_tax_rates` — no schema change needed; both tables already carry every column required (`notes`, `order_index`, `hazmat_surcharge`, `tax_type`).
- `SUPPORTED_COUNTRIES` in `src/hooks/useInternationalTaxCalculator.ts` is extended; the DDU branch is handled in the same hook's display-label logic so every consumer picks it up.
- `getShippingZoneForCountry` already matches exact country codes then falls back to `*`, so new zones need no code change.
- Server-side recomputation of shipping/tax in `create-order` is intentionally out of scope per your choice; the function keeps accepting client-supplied shipping and tax values.
